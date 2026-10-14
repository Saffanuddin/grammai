import { NextResponse } from "next/server";
import { db } from "@/db";
import { complaints } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

const SEED = [
  { ref:"GRC-2026-1042", citizenName:"Ramesh Yadav", category:"Water Supply", description:"Drinking water pipeline leakage near SC Colony, water wastage for 4 days.", village:"Rampur", status:"In Progress", response:"Plumber assigned by Panchayat. Repair scheduled tomorrow 10 AM.", isDemo:true },
  { ref:"GRC-2026-1038", citizenName:"Lakshmi Devi", category:"Street Lights", description:"3 street lights not working on Main Road near Anganwadi centre.", village:"Rampur", status:"Resolved", response:"Lights replaced on 8 May. Verified by Ward Member.", isDemo:true },
  { ref:"GRC-2026-1051", citizenName:"Arjun Kumar", category:"Road & Drainage", description:"Drainage overflow near Govt High School entrance during rain.", village:"Husnabad", status:"Under Review", response:"", isDemo:true },
];

export async function GET() {
  try {
    let rows = await db.select().from(complaints).orderBy(desc(complaints.createdAt)).limit(100);
    if (rows.length===0) {
      for (const s of SEED) await db.insert(complaints).values(s as any);
      rows = await db.select().from(complaints).orderBy(desc(complaints.createdAt)).limit(100);
    }
    return NextResponse.json({ complaints: rows, source:"database" });
  } catch {
    return NextResponse.json({ complaints: SEED.map((s,i)=>({id:i+1,...s,createdAt:new Date().toISOString()})), source:"demo-fallback" });
  }
}

export async function POST(req: Request) {
  const b = await req.json().catch(()=>({}));
  if (!b.citizenName || !b.category || !b.description || !b.village) return NextResponse.json({error:"Name, category, description and village are required"}, {status:400});
  const ref = `GRC-2026-${Math.floor(1000+Math.random()*9000)}`;
  const row = { ref, citizenName:String(b.citizenName).slice(0,80), phone:String(b.phone||"").slice(0,20), category:String(b.category).slice(0,60), description:String(b.description).slice(0,1000), village:String(b.village).slice(0,60), status:"Submitted", response:"", isDemo:true, citizenId:String(b.citizenId||"demo-citizen") };
  try {
    const [inserted] = await db.insert(complaints).values(row as any).returning();
    return NextResponse.json({ complaint: inserted, ref });
  } catch {
    return NextResponse.json({ complaint: { id: Date.now(), ...row, createdAt:new Date().toISOString() }, ref, source:"demo-fallback" });
  }
}

export async function PATCH(req: Request) {
  const b = await req.json().catch(()=>({}));
  if (!b.ref) return NextResponse.json({error:"ref required"}, {status:400});
  try {
    const [updated] = await db.update(complaints).set({ status: b.status, response: b.response||"", updatedAt: new Date() } as any).where(eq(complaints.ref, b.ref)).returning();
    return NextResponse.json({ complaint: updated });
  } catch {
    return NextResponse.json({ ok:true, source:"demo-fallback", ref:b.ref, status:b.status, response:b.response });
  }
}
