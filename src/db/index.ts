import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __gramAiPostgresPool?: Pool;
};

let poolInstance: Pool | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

if (databaseUrl) {
  try {
    poolInstance =
      globalForDb.__gramAiPostgresPool ??
      new Pool({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 20000,
      });

    if (process.env.NODE_ENV !== "production") {
      globalForDb.__gramAiPostgresPool = poolInstance;
    }

    dbInstance = drizzle(poolInstance, { schema });
  } catch (err) {
    console.warn("[Database] Connection pool initialization failed:", err);
  }
}

export const pool = poolInstance;
export const db = dbInstance as any;
export const isDbConfigured = Boolean(databaseUrl && dbInstance);
