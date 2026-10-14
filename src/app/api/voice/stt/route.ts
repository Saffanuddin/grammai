import { NextResponse } from "next/server";
import { speechToTextWithSarvam } from "@/lib/sarvam";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const language = (formData.get("language") as string) || "unknown";

    if (!file) {
      return NextResponse.json({ error: "Audio file is required" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await speechToTextWithSarvam(
      buffer,
      file.name || "input.webm",
      file.type || "audio/webm",
      language
    );

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[Voice STT Route] Error:", err?.message);
    return NextResponse.json(
      { error: err?.message || "Internal server error during speech recognition" },
      { status: 500 }
    );
  }
}
