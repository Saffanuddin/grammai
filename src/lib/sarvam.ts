import { config } from "./config";

export interface SttResult {
  transcript: string;
  languageCode?: string;
  provider: "sarvam-live" | "simulated-fallback";
  error?: string;
}

export interface TtsResult {
  audioBase64?: string;
  audioContentType?: string;
  provider: "sarvam-live" | "web-speech-fallback";
  error?: string;
}

export async function speechToTextWithSarvam(
  audioBuffer: Buffer,
  filename: string = "recording.wav",
  mimeType: string = "audio/wav",
  languageCode: string = "unknown"
): Promise<SttResult> {
  if (!config.sarvam.isConfigured) {
    return {
      transcript: "",
      provider: "simulated-fallback",
      error: "Sarvam AI API key is not configured. Please add SARVAM_API_KEY in .env.local.",
    };
  }

  try {
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(audioBuffer)], { type: mimeType });
    formData.append("file", blob, filename);
    formData.append("model", config.sarvam.sttModel);
    formData.append("mode", "transcribe");

    // Map language code to Sarvam BCP-47
    let targetLang = "unknown";
    if (languageCode === "te" || languageCode === "te-IN") targetLang = "te-IN";
    else if (languageCode === "hi" || languageCode === "hi-IN") targetLang = "hi-IN";
    else if (languageCode === "en" || languageCode === "en-IN") targetLang = "en-IN";

    if (targetLang !== "unknown") {
      formData.append("language_code", targetLang);
    }

    const res = await fetch(`${config.sarvam.baseUrl}/speech-to-text`, {
      method: "POST",
      headers: {
        "api-subscription-key": config.sarvam.apiKey,
      },
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`[Sarvam STT] Error status ${res.status}:`, errText);
      return {
        transcript: "",
        provider: "simulated-fallback",
        error: `Sarvam STT failed with status ${res.status}: ${errText.slice(0, 100)}`,
      };
    }

    const data = await res.json();
    return {
      transcript: data?.transcript || "",
      languageCode: data?.language_code || targetLang,
      provider: "sarvam-live",
    };
  } catch (err: any) {
    console.error("[Sarvam STT] Network exception:", err?.message);
    return {
      transcript: "",
      provider: "simulated-fallback",
      error: err?.message || "Failed to reach Sarvam STT service",
    };
  }
}

export async function textToSpeechWithSarvam(
  text: string,
  languageCode: string = "en"
): Promise<TtsResult> {
  if (!config.sarvam.isConfigured) {
    return {
      provider: "web-speech-fallback",
      error: "Sarvam AI API key is not configured. Falling back to browser speech synthesis.",
    };
  }

  try {
    // Clean text (remove heavy markdown stars, headers)
    const cleanText = text
      .replace(/[#*`_~]/g, "")
      .replace(/•/g, "")
      .slice(0, 1500)
      .trim();

    let targetCode = "en-IN";
    let speaker = "meera";

    if (languageCode === "te" || languageCode === "te-IN") {
      targetCode = "te-IN";
      speaker = "arvind";
    } else if (languageCode === "hi" || languageCode === "hi-IN") {
      targetCode = "hi-IN";
      speaker = "shubh";
    }

    const payload = {
      inputs: [cleanText],
      target_language_code: targetCode,
      speaker: speaker,
      model: config.sarvam.ttsModel,
      pace: 1.0,
      enable_preprocessing: true,
    };

    const res = await fetch(`${config.sarvam.baseUrl}/text-to-speech`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": config.sarvam.apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`[Sarvam TTS] Error status ${res.status}:`, errText);
      return {
        provider: "web-speech-fallback",
        error: `Sarvam TTS failed with status ${res.status}: ${errText.slice(0, 100)}`,
      };
    }

    const data = await res.json();
    const audioBase64 = data?.audios?.[0];

    if (!audioBase64) {
      return {
        provider: "web-speech-fallback",
        error: "No audio returned from Sarvam TTS",
      };
    }

    return {
      audioBase64,
      audioContentType: "audio/wav",
      provider: "sarvam-live",
    };
  } catch (err: any) {
    console.error("[Sarvam TTS] Network exception:", err?.message);
    return {
      provider: "web-speech-fallback",
      error: err?.message || "Failed to reach Sarvam TTS service",
    };
  }
}
