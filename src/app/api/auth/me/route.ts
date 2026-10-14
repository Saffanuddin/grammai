import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, isDbConfigured } from "@/db";
import { citizens } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        citizenProfile: null,
      });
    }

    let citizenProfile = null;
    if (isDbConfigured && db) {
      const rows = await db
        .select()
        .from(citizens)
        .where(eq(citizens.id, user.id))
        .limit(1);

      if (rows.length > 0) {
        citizenProfile = rows[0];
      }
    }

    return NextResponse.json({
      authenticated: true,
      user,
      citizen: citizenProfile,
      citizenProfile,
    });
  } catch (err: any) {
    console.error("[Auth Me Route] Error:", err?.message);
    return NextResponse.json(
      { authenticated: false, user: null, citizenProfile: null },
      { status: 500 }
    );
  }
}
