import { NextResponse } from "next/server";
import { textToSpeechWithSarvam } from "@/lib/sarvam";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = String(body.text || "").trim();
    const language = String(body.language || "en").trim();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const result = await textToSpeechWithSarvam(text, language);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[Voice TTS Route] Error:", err?.message);
    return NextResponse.json(
      { error: err?.message || "Internal server error during speech synthesis" },
      { status: 500 }
    );
  }
}
