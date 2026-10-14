import { db, isDbConfigured } from "@/db";
import { getProviderStatus } from "@/lib/config";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const providers = getProviderStatus();
  let dbOk = false;

  if (isDbConfigured && db) {
    try {
      await db.execute(sql`select 1`);
      dbOk = true;
    } catch (err: any) {
      console.warn("[HealthCheck] DB query failed:", err?.message);
    }
  }

  return Response.json({
    ok: true,
    timestamp: new Date().toISOString(),
    service: "GramAI Connect",
    database: {
      configured: isDbConfigured,
      connected: dbOk,
    },
    integrations: providers,
  });
}
