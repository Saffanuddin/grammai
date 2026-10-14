import { NextResponse } from "next/server";
import { askOpenRouter } from "@/lib/openrouter";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = String(body.message || "").trim();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const history = Array.isArray(body.history) ? body.history : [];
    const profile = body.profile;
    const lang = String(body.lang || "en").toLowerCase();

    const response = await askOpenRouter(message, history, profile, lang);

    return NextResponse.json({
      reply: response.reply,
      matchedSchemes: response.matchedSchemes,
      suggestedQuestions: response.suggestedQuestions,
      mode: response.mode,
      modelUsed: response.modelUsed,
      disclaimer:
        lang === "te"
          ? "గ్రామ్AI అందించే సమాచారం అధికారిక మార్గదర్శకాల ఆధారంగా ఉంది. దరఖాస్తుకు ముందు మీసేవ లేదా అధికారిక పోర్టల్ లో ధృవీకరించుకోండి."
          : lang === "hi"
          ? "ग्रामAI द्वारा दी गई जानकारी आधिकारिक नियमों पर आधारित है। कृपया आवेदन से पहले आधिकारिक पोर्टल या MeeSeva पर पुष्टि करें।"
          : "Based on GramAI verified scheme database. Verify with local Panchayat or official portal before applying.",
    });
  } catch (err: any) {
    console.error("[Chat API Route] Error:", err?.message);
    return NextResponse.json(
      { error: "Internal server error while processing your request" },
      { status: 500 }
    );
  }
}
