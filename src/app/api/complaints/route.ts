import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { complaints } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

const SEED = [
  {
    ref: "GRC-2026-1042",
    citizenName: "Ramesh Yadav",
    category: "Water Supply",
    description: "Drinking water pipeline leakage near SC Colony, water wastage for 4 days.",
    village: "Rampur",
    status: "In Progress",
    response: "Plumber assigned by Panchayat. Repair scheduled tomorrow 10 AM.",
    isDemo: true,
  },
  {
    ref: "GRC-2026-1038",
    citizenName: "Lakshmi Devi",
    category: "Street Lights",
    description: "3 street lights not working on Main Road near Anganwadi centre.",
    village: "Rampur",
    status: "Resolved",
    response: "Lights replaced on 8 May. Verified by Ward Member.",
    isDemo: true,
  },
  {
    ref: "GRC-2026-1051",
    citizenName: "Arjun Kumar",
    category: "Road & Drainage",
    description: "Drainage overflow near Govt High School entrance during rain.",
    village: "Husnabad",
    status: "Under Review",
    response: "",
    isDemo: true,
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const myOnly = searchParams.get("myOnly") === "true";
  const user = await getCurrentUser();

  if (isDbConfigured && db) {
    try {
      let rows;
      if (myOnly && user) {
        rows = await db
          .select()
          .from(complaints)
          .where(eq(complaints.citizenId, user.id))
          .orderBy(desc(complaints.createdAt))
          .limit(100);
      } else {
        rows = await db.select().from(complaints).orderBy(desc(complaints.createdAt)).limit(100);
        if (rows.length === 0) {
          for (const s of SEED) {
            await db.insert(complaints).values(s as any);
          }
          rows = await db.select().from(complaints).orderBy(desc(complaints.createdAt)).limit(100);
        }
      }
      return NextResponse.json({ complaints: rows, source: "database" });
    } catch (err: any) {
      console.warn("[Complaints GET] DB fallback:", err?.message);
    }
  }

  return NextResponse.json({
    complaints: SEED.map((s, i) => ({ id: i + 1, ...s, createdAt: new Date().toISOString() })),
    source: "demo-fallback",
  });
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const user = await getCurrentUser();

  const citizenName = b.citizenName || (user ? user.name : "");
  if (!citizenName || !b.category || !b.description || !b.village) {
    return NextResponse.json(
      { error: "Name, category, description and village are required" },
      { status: 400 }
    );
  }

  const ref = `GRC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const isDemo = user ? Boolean(b.isDemo) : (b.isDemo !== undefined ? Boolean(b.isDemo) : false);
  const citizenId = user ? user.id : String(b.citizenId || "citizen-" + Date.now());

  const row = {
    ref,
    citizenName: String(citizenName).slice(0, 80),
    phone: String(b.phone || "").slice(0, 20),
    category: String(b.category).slice(0, 60),
    description: String(b.description).slice(0, 1000),
    village: String(b.village).slice(0, 60),
    status: "Submitted",
    response: "",
    isDemo,
    citizenId,
  };

  if (isDbConfigured && db) {
    try {
      const [inserted] = await db.insert(complaints).values(row as any).returning();
      return NextResponse.json({ complaint: inserted, ref, source: "database" });
    } catch (err: any) {
      console.warn("[Complaints POST] DB insert error:", err?.message);
    }
  }

  return NextResponse.json({
    complaint: { id: Date.now(), ...row, createdAt: new Date().toISOString() },
    ref,
    source: "fallback",
  });
}

export async function PATCH(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (!b.ref) return NextResponse.json({ error: "ref required" }, { status: 400 });

  const user = await getCurrentUser();
  const isOfficerOrAdmin = user && (user.role === "admin" || user.role === "officer");

  if (isDbConfigured && db) {
    try {
      // Find the complaint first to verify access permissions
      const [existing] = await db.select().from(complaints).where(eq(complaints.ref, b.ref));
      if (!existing) {
        return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
      }

      // If not an officer/admin and it's not a demo complaint, forbid modification
      if (!isOfficerOrAdmin && !existing.isDemo) {
        return NextResponse.json(
          { error: "Access denied. Officer or Administrator credentials required." },
          { status: 403 }
        );
      }

      const [updated] = await db
        .update(complaints)
        .set({ status: b.status, response: b.response || "", updatedAt: new Date() } as any)
        .where(eq(complaints.ref, b.ref))
        .returning();
      return NextResponse.json({ complaint: updated, source: "database" });
    } catch (err: any) {
      console.warn("[Complaints PATCH] DB update error:", err?.message);
    }
  }

  // Fallback demo behavior
  return NextResponse.json({
    ok: true,
    source: "fallback",
    ref: b.ref,
    status: b.status,
    response: b.response,
  });
}

