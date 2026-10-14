import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db, isDbConfigured } from "@/db";
import { users, citizens } from "@/db/schema";
import { eq } from "drizzle-orm";

export const SESSION_COOKIE_NAME = "gramai_session";
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "citizen" | "admin" | "officer";
  phone?: string;
  image?: string;
  provider: "credentials" | "google";
}

function getSecretKey(): Uint8Array {
  const secret =
    process.env.AUTH_SECRET ||
    process.env.JWT_SECRET ||
    "gramai-connect-secure-production-secret-min-32-chars-2026";
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(user: AuthUser): Promise<string> {
  const secretKey = getSecretKey();
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone || "",
    image: user.image || "",
    provider: user.provider,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secretKey);

  return token;
}

export async function verifySessionToken(token: string): Promise<AuthUser | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    if (!payload || !payload.id || !payload.email) return null;

    return {
      id: String(payload.id),
      email: String(payload.email),
      name: String(payload.name || "Citizen"),
      role: (payload.role as "citizen" | "admin" | "officer") || "citizen",
      phone: String(payload.phone || ""),
      image: payload.image ? String(payload.image) : undefined,
      provider: (payload.provider as "credentials" | "google") || "credentials",
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) return null;

    const user = await verifySessionToken(sessionCookie.value);
    if (!user) return null;

    // Optional fresh DB validation
    if (isDbConfigured && db) {
      const dbUser = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          role: users.role,
          phone: users.phone,
          image: users.image,
          provider: users.provider,
        })
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);

      if (dbUser.length > 0) {
        return {
          id: dbUser[0].id,
          email: dbUser[0].email,
          name: dbUser[0].name,
          role: (dbUser[0].role as "citizen" | "admin" | "officer") || "citizen",
          phone: dbUser[0].phone || "",
          image: dbUser[0].image || undefined,
          provider: (dbUser[0].provider as "credentials" | "google") || "credentials",
        };
      }
    }

    return user;
  } catch {
    return null;
  }
}

export function buildSessionCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  };
}
