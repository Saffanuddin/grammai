import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { users, citizens, accounts } from "@/db/schema";
import { createSessionToken, buildSessionCookieOptions, type AuthUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || url.origin;
  const redirectUri = `${appUrl}/api/auth/callback/google`;

  if (error || !code) {
    const loginUrl = new URL("/login", appUrl);
    loginUrl.searchParams.set("error", error || "authorization_failed");
    loginUrl.searchParams.set("message", "Google sign-in was cancelled or denied.");
    return NextResponse.redirect(loginUrl);
  }

  // Verify CSRF state
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/gramai_oauth_state=([^;]+)/);
  const storedState = match ? match[1] : null;

  if (!storedState || storedState !== state) {
    const loginUrl = new URL("/login", appUrl);
    loginUrl.searchParams.set("error", "invalid_state");
    loginUrl.searchParams.set("message", "Session verification failed. Please try logging in again.");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID || "";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

    // 1. Exchange code for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text().catch(() => "");
      console.error("[Google OAuth] Token exchange failed:", errText);
      const loginUrl = new URL("/login", appUrl);
      loginUrl.searchParams.set("error", "token_exchange_failed");
      loginUrl.searchParams.set("message", "Failed to retrieve access token from Google.");
      return NextResponse.redirect(loginUrl);
    }

    const tokens = await tokenRes.json();
    const accessToken = tokens.access_token;

    // 2. Fetch Google profile
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      const loginUrl = new URL("/login", appUrl);
      loginUrl.searchParams.set("error", "profile_fetch_failed");
      return NextResponse.redirect(loginUrl);
    }

    const googleUser = await profileRes.json();
    const googleId = String(googleUser.id);
    const email = String(googleUser.email).trim().toLowerCase();
    const name = String(googleUser.name || "Citizen").trim();
    const picture = googleUser.picture ? String(googleUser.picture) : undefined;

    if (!email) {
      const loginUrl = new URL("/login", appUrl);
      loginUrl.searchParams.set("error", "missing_email");
      loginUrl.searchParams.set("message", "Google did not provide an email address.");
      return NextResponse.redirect(loginUrl);
    }

    if (!isDbConfigured || !db) {
      const loginUrl = new URL("/login", appUrl);
      loginUrl.searchParams.set("error", "db_unavailable");
      return NextResponse.redirect(loginUrl);
    }

    // 3. Find or create user
    // First, look up by existing linked Google account
    const existingAccounts = await db
      .select()
      .from(accounts)
      .where(
        and(
          eq(accounts.provider, "google"),
          eq(accounts.providerAccountId, googleId)
        )
      )
      .limit(1);

    let activeUser: AuthUser;
    let userIdToLink: string;

    if (existingAccounts.length > 0) {
      // User found via linked Google account
      userIdToLink = existingAccounts[0].userId;
      const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.id, userIdToLink))
        .limit(1);

      if (!existing) {
        // Fallback if user record was orphaned
        const [recreated] = await db
          .insert(users)
          .values({
            id: userIdToLink,
            name,
            email,
            image: picture,
            role: "citizen",
            provider: "google",
          })
          .returning();
        activeUser = {
          id: recreated.id,
          email: recreated.email,
          name: recreated.name,
          role: "citizen",
          image: recreated.image || undefined,
          provider: "google",
        };
      } else {
        activeUser = {
          id: existing.id,
          email: existing.email,
          name: existing.name,
          role: (existing.role as "citizen" | "admin" | "officer") || "citizen",
          phone: existing.phone || "",
          image: existing.image || picture,
          provider: (existing.provider as "credentials" | "google") || "google",
        };
      }

      // Update access token
      await db
        .update(accounts)
        .set({
          accessToken,
          refreshToken: tokens.refresh_token || existingAccounts[0].refreshToken,
          expiresAt: tokens.expires_in ? Math.floor(Date.now() / 1000) + Number(tokens.expires_in) : undefined,
        })
        .where(eq(accounts.id, existingAccounts[0].id));
    } else {
      // Second, look up by email to link with existing credentials account
      const existingUsers = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUsers.length > 0) {
        const existing = existingUsers[0];
        userIdToLink = existing.id;
        activeUser = {
          id: existing.id,
          email: existing.email,
          name: existing.name,
          role: (existing.role as "citizen" | "admin" | "officer") || "citizen",
          phone: existing.phone || "",
          image: existing.image || picture,
          provider: (existing.provider as "credentials" | "google") || "google",
        };

        // Link Google account to existing user
        await db.insert(accounts).values({
          userId: existing.id,
          provider: "google",
          providerAccountId: googleId,
          accessToken,
          refreshToken: tokens.refresh_token || undefined,
          expiresAt: tokens.expires_in ? Math.floor(Date.now() / 1000) + Number(tokens.expires_in) : undefined,
        });

        // Update image if missing
        if (!existing.image && picture) {
          await db.update(users).set({ image: picture }).where(eq(users.id, existing.id));
        }
      } else {
        // Brand new user signup via Google
        const newUserId = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        userIdToLink = newUserId;
        const userRole: "citizen" = "citizen"; // Strictly citizen for all public signups

        const [created] = await db
          .insert(users)
          .values({
            id: newUserId,
            name,
            email,
            image: picture,
            role: userRole,
            provider: "google",
          })
          .returning();

        activeUser = {
          id: created.id,
          email: created.email,
          name: created.name,
          role: created.role as "citizen",
          image: created.image || undefined,
          provider: "google",
        };

        // Link account
        await db.insert(accounts).values({
          userId: newUserId,
          provider: "google",
          providerAccountId: googleId,
          accessToken,
          refreshToken: tokens.refresh_token || undefined,
          expiresAt: tokens.expires_in ? Math.floor(Date.now() / 1000) + Number(tokens.expires_in) : undefined,
        });
      }
    }

    // 4. Ensure linked citizen profile exists in Neon DB
    await db
      .insert(citizens)
      .values({
        id: userIdToLink,
        name: activeUser.name,
        phone: activeUser.phone || "",
        role: activeUser.role,
        state: "Telangana",
        district: "Warangal",
        village: "Rampur",
        occupation: "Farmer",
        age: 35,
        gender: "Male",
        income: 95000,
        category: "OBC",
        landAcres: "2.0",
        isDemo: false,
      })
      .onConflictDoNothing();

    // 5. Create session token
    const sessionToken = await createSessionToken(activeUser);
    const cookieOpts = buildSessionCookieOptions();

    const destUrl = new URL("/?auth=success", appUrl);
    const response = NextResponse.redirect(destUrl);
    response.cookies.set(cookieOpts.name, sessionToken, cookieOpts);
    response.cookies.delete("gramai_oauth_state");

    return response;
  } catch (err: any) {
    console.error("[Google Callback Error]:", err?.message);
    const loginUrl = new URL("/login", appUrl);
    loginUrl.searchParams.set("error", "server_error");
    loginUrl.searchParams.set("message", "An unexpected error occurred during Google sign in.");
    return NextResponse.redirect(loginUrl);
  }
}
