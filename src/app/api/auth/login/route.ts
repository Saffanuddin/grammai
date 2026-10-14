import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { users } from "@/db/schema";
import { verifyPassword, createSessionToken, buildSessionCookieOptions, type AuthUser } from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // Rate limiting by IP and Email
    const rateLimitKey = `login:${ip}:${email}`;
    const rateLimit = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please try again in ${rateLimit.resetInSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    if (!isDbConfigured || !db) {
      return NextResponse.json(
        { error: "Database is not available. Please verify server configuration." },
        { status: 503 }
      );
    }

    const matchedUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (matchedUsers.length === 0) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const user = matchedUsers[0];

    if (!user.passwordHash) {
      return NextResponse.json(
        {
          error: "This account was created with Google Sign-In. Please click 'Sign in with Google' below.",
        },
        { status: 400 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Login successful: reset rate limit counter
    resetRateLimit(rateLimitKey);

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: (user.role as "citizen" | "admin" | "officer") || "citizen",
      phone: user.phone || "",
      image: user.image || undefined,
      provider: (user.provider as "credentials" | "google") || "credentials",
    };

    const sessionToken = await createSessionToken(authUser);
    const cookieOpts = buildSessionCookieOptions();

    const response = NextResponse.json({
      ok: true,
      message: "Signed in successfully.",
      user: authUser,
    });

    response.cookies.set(cookieOpts.name, sessionToken, cookieOpts);
    return response;
  } catch (err: any) {
    console.error("[Login API Route] Error:", err?.message);
    return NextResponse.json(
      { error: "An unexpected error occurred during login. Please try again." },
      { status: 500 }
    );
  }
}
