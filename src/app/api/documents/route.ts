import { NextResponse } from "next/server";
import { db } from "@/db";
import { documents } from "@/db/schema";

const SAMPLE_TEXT = `GOVERNMENT OF TELANGANA — RYTHU BHAROSA GUIDELINES 2025-26
Scheme Name: Rythu Bharosa Investment Support
Benefit: Rs 12,000 per acre per year in two seasons. Rs 500 bonus per quintal for fine variety paddy.
Eligibility: All farmers with land recorded in Dharani portal. Tenant farmers with registered agreement. Aadhaar-linked bank account mandatory.
Documents Required: Pattadar Passbook, Aadhaar Card, Bank Passbook, Dharani land record print.
Deadline: Enrolment before Kharif sowing — 15 June 2026.
How to Apply: Verify name at Village Secretariat, confirm Dharani record, submit bank details to Agriculture Extension Officer. Amount credited directly to bank account (DBT).`;

function extract(text: string, fileName: string) {
  const find = (re: RegExp) => text.match(re)?.[1]?.trim() || "";
  const schemeName = find(/Scheme Name:\s*(.+)/i) || (text.toLowerCase().includes("rythu") ? "Rythu Bharosa Investment Support" : text.toLowerCase().includes("kisan") ? "PM-KISAN Samman Nidhi" : "Scheme from uploaded document");
  const benefit = find(/Benefit:\s*(.+)/i) || "Benefit amount mentioned in document — see summary";
  const deadline = find(/Deadline:\s*(.+)/i) || "Check document / official portal";
  const docsLine = find(/Documents Required:\s*(.+)/i);
  const docList = docsLine ? docsLine.split(",").map(s=>s.trim()) : ["Aadhaar Card","Bank Passbook","Land / Income Proof (as applicable)"];
  return {
    schemeName, benefit, deadline, documents: docList,
    eligibility: ["Farmer / beneficiary as per document category","Aadhaar-linked bank account mandatory","Land / income record must match official portal"],
    steps: ["Verify your name in beneficiary list","Confirm land / income record online","Submit bank + Aadhaar at local office","Amount credited via DBT to bank"],
    summary: `${schemeName}: ${benefit} Apply before: ${deadline}. Keep ${docList.slice(0,3).join(", ")} ready. This summary is extracted from "${fileName}" — always cross-check on the official portal.`,
    pages: "Page 1 of 1 (text layer extracted)",
  };
}

export async function POST(req: Request) {
  const b = await req.json().catch(()=>({}));
  const fileName = String(b.fileName||"Sample — Rythu Bharosa Guidelines 2025-26.pdf");
  const rawText = String(b.text||"").trim() || SAMPLE_TEXT;
  if (fileName && !/\.(pdf|txt)$/i.test(fileName) && b.text===undefined && !b.useSample) {
    // still allow demo sample
  }
  const extracted = extract(rawText, fileName);
  try { await db.insert(documents).values({ citizenId:"demo-citizen", fileName, schemeName:extracted.schemeName, summary:extracted.summary, extracted } as any); } catch {}
  return NextResponse.json({ extracted, rawPreview: rawText.slice(0,900), charCount: rawText.length, mode:"text-extraction-demo (OCR for scanned PDFs to be integrated)" });
}

export async function GET() {
  try { const rows = await db.select().from(documents).orderBy(documents.id).limit(20); return NextResponse.json({documents:rows}); }
  catch { return NextResponse.json({documents:[], source:"demo-fallback"}); }
}
