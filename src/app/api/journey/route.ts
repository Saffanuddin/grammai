import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { journey } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user = await getCurrentUser();
  const citizenId = (user ? user.id : null) || searchParams.get("citizenId") || "demo-citizen";

  if (isDbConfigured && db) {
    try {
      const records = await db
        .select()
        .from(journey)
        .where(eq(journey.citizenId, citizenId))
        .orderBy(desc(journey.updatedAt));
      return NextResponse.json({ journey: records, source: "database" });
    } catch (err: any) {
      console.warn("[Journey GET] DB query failed:", err?.message);
    }
  }

  return NextResponse.json({ journey: [], source: "fallback" });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const user = await getCurrentUser();
    const citizenId = (user ? user.id : null) || String(body.citizenId || "demo-citizen");
    const schemeId = String(body.schemeId || "");
    const stage = String(body.stage || "Discovered");
    const eligibility = String(body.eligibility || "eligible");
    const score = Number(body.score || 100);

    if (!schemeId) {
      return NextResponse.json({ error: "schemeId is required" }, { status: 400 });
    }

    if (isDbConfigured && db) {
      try {
        const existing = await db
          .select()
          .from(journey)
          .where(eq(journey.citizenId, citizenId));
        const current = existing.find((r: any) => r.schemeId === schemeId);

        let result;
        if (current) {
          [result] = await db
            .update(journey)
            .set({ stage, eligibility, score, updatedAt: new Date() })
            .where(eq(journey.id, current.id))
            .returning();
        } else {
          [result] = await db
            .insert(journey)
            .values({ citizenId, schemeId, stage, eligibility, score })
            .returning();
        }

        return NextResponse.json({ record: result, source: "database" });
      } catch (err: any) {
        console.warn("[Journey POST] DB insert failed:", err?.message);
      }
    }

    return NextResponse.json({
      record: { id: Date.now(), citizenId, schemeId, stage, eligibility, score },
      source: "fallback",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to save journey record" }, { status: 500 });
  }
}

