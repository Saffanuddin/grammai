import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { documents } from "@/db/schema";
import { processDocumentIntelligence } from "@/lib/ocr";
import { desc } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let fileName = "Guideline.pdf";
    let mimeType = "application/pdf";
    let fileBuffer: Buffer | null = null;
    let textPayload = "";
    let profile: any = null;
    let lang = "en";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (file) {
        fileName = file.name;
        mimeType = file.type || "application/pdf";
        const ab = await file.arrayBuffer();
        fileBuffer = Buffer.from(ab);
      }
      const profJson = formData.get("profile") as string | null;
      if (profJson) {
        try { profile = JSON.parse(profJson); } catch {}
      }
      lang = (formData.get("lang") as string) || "en";
    } else {
      const body = await req.json().catch(() => ({}));
      fileName = String(body.fileName || (body.useSample ? "Sample — Rythu Bharosa Guidelines 2025-26.pdf" : "Guideline.pdf"));
      textPayload = String(body.text || "").trim();
      profile = body.profile;
      lang = String(body.lang || "en");
    }

    const result = await processDocumentIntelligence(
      fileBuffer,
      fileName,
      mimeType,
      textPayload,
      profile,
      lang
    );

    // Persist to Neon Postgres DB if available
    let savedId: number | null = null;
    if (isDbConfigured && db) {
      try {
        const [inserted] = await db
          .insert(documents)
          .values({
            citizenId: profile?.name ? String(profile.name).toLowerCase().replace(/\s+/g, "-") : "demo-citizen",
            fileName: fileName.slice(0, 120),
            schemeName: result.extracted.schemeName.slice(0, 150),
            summary: result.extracted.summary.slice(0, 1000),
            extracted: result.extracted as any,
          })
          .returning();
        if (inserted?.id) savedId = inserted.id;
      } catch (err: any) {
        console.warn("[Documents DB] Insert failed:", err?.message);
      }
    }

    return NextResponse.json({
      ...result,
      documentId: savedId,
      persisted: Boolean(savedId),
    });
  } catch (err: any) {
    console.error("[Documents API Route] Error:", err?.message);
    return NextResponse.json(
      { error: err?.message || "Failed to process document" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (isDbConfigured && db) {
      const rows = await db
        .select()
        .from(documents)
        .orderBy(desc(documents.createdAt))
        .limit(20);
      return NextResponse.json({ documents: rows, source: "database" });
    }
  } catch (err: any) {
    console.warn("[Documents GET] DB query failed:", err?.message);
  }

  return NextResponse.json({ documents: [], source: "empty-fallback" });
}
