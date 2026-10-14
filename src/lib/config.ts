export const config = {
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || "",
    model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct",
    baseUrl: "https://openrouter.ai/api/v1",
    get isConfigured() {
      return Boolean(this.apiKey && this.apiKey.trim().length > 5);
    },
  },
  sarvam: {
    apiKey: process.env.SARVAM_API_KEY || "",
    baseUrl: "https://api.sarvam.ai",
    sttModel: process.env.SARVAM_STT_MODEL || "saaras:v4",
    ttsModel: process.env.SARVAM_TTS_MODEL || "bulbul:v3",
    get isConfigured() {
      return Boolean(this.apiKey && this.apiKey.trim().length > 5);
    },
  },
  database: {
    url: process.env.DATABASE_URL || "",
    get isConfigured() {
      return Boolean(this.url && this.url.trim().length > 5);
    },
  },
};

export function getProviderStatus() {
  return {
    openrouter: {
      configured: config.openrouter.isConfigured,
      model: config.openrouter.model,
      status: config.openrouter.isConfigured ? "ready" : "unconfigured",
      portalUrl: "https://openrouter.ai/keys",
    },
    sarvam: {
      configured: config.sarvam.isConfigured,
      sttModel: config.sarvam.sttModel,
      ttsModel: config.sarvam.ttsModel,
      status: config.sarvam.isConfigured ? "ready" : "unconfigured",
      portalUrl: "https://dashboard.sarvam.ai/",
    },
    database: {
      configured: config.database.isConfigured,
      status: config.database.isConfigured ? "connected" : "unconfigured",
    },
  };
}
