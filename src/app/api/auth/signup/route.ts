import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { users, citizens } from "@/db/schema";
import { hashPassword, createSessionToken, buildSessionCookieOptions, type AuthUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { eq } from "drizzle-orm";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password: string): boolean {
  // Min 8 chars, at least one letter and one number
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const rateLimit = checkRateLimit(`signup:${ip}`, 5, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many signup attempts. Please wait ${rateLimit.resetInSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const name = String(body.name || body.fullName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const confirmPassword = String(body.confirmPassword !== undefined ? body.confirmPassword : body.password || "");
    const phone = String(body.phone || "").trim();

    // 1. Input validations
    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Please enter your full name (minimum 2 characters)." }, { status: 400 });
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!password || !isValidPassword(password)) {
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters long and contain at least one letter and one number.",
        },
        { status: 400 }
      );
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    if (!isDbConfigured || !db) {
      return NextResponse.json(
        { error: "Database is not connected. Please verify DATABASE_URL configuration." },
        { status: 503 }
      );
    }

    // 2. Check duplicate email
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in instead." },
        { status: 409 }
      );
    }

    // 3. Hash password
    const passwordHash = await hashPassword(password);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // 4. Enforce citizen role strictly on public signup
    const userRole: "citizen" = "citizen";

    const [newUser] = await db
      .insert(users)
      .values({
        id: userId,
        name,
        email,
        passwordHash,
        phone,
        role: userRole,
        provider: "credentials",
      })
      .returning();

    // 5. Ensure linked citizen profile exists in Neon DB
    let citizenRecord = null;
    try {
      const [inserted] = await db
        .insert(citizens)
        .values({
          id: userId,
          name,
          phone,
          role: userRole,
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
        .onConflictDoNothing()
        .returning();
      citizenRecord = inserted || { id: userId, name, phone, role: userRole };
    } catch (err: any) {
      console.warn("[Signup] Citizen profile initialization notice:", err?.message);
    }

    // 6. Create session JWT
    const authUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role as "citizen",
      phone: newUser.phone || "",
      provider: "credentials",
    };

    const sessionToken = await createSessionToken(authUser);
    const cookieOpts = buildSessionCookieOptions();

    const response = NextResponse.json(
      {
        ok: true,
        message: "Account created successfully.",
        user: authUser,
        citizen: citizenRecord,
      },
      { status: 201 }
    );

    response.cookies.set(cookieOpts.name, sessionToken, cookieOpts);
    return response;
  } catch (err: any) {
    console.error("[Signup API Route] Error:", err?.message);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}
