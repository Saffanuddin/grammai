import { config } from "./config";
import { SCHEMES, checkEligibility, type CitizenProfile, type Scheme } from "./data";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface SchemeAiResponse {
  reply: string;
  matchedSchemes: Array<{
    id: string;
    name: string;
    category: string;
    benefit: string;
    matchScore: number;
    verified: boolean;
    source: string;
    documents: string[];
  }>;
  suggestedQuestions: string[];
  mode: "openrouter-live" | "grounded-rule-engine";
  modelUsed?: string;
  error?: string;
}

function buildSystemPrompt(profile?: CitizenProfile, lang: string = "en"): string {
  const p = profile || {
    name: "Citizen",
    phone: "",
    state: "Telangana",
    district: "Warangal",
    village: "Rampur",
    occupation: "Farmer",
    age: 42,
    gender: "Male",
    income: 85000,
    category: "OBC",
    land: "2.5 acres",
    role: "citizen",
  };

  const schemeKnowledge = SCHEMES.map((s) => {
    return `- ID: ${s.id}
  Name: ${s.name} (Telugu: ${s.nameTe}, Hindi: ${s.nameHi})
  Category: ${s.category} | Level: ${s.level} | State: ${s.state}
  Benefit: ${s.benefit} (Amount: ₹${s.benefitAmount})
  Description: ${s.description}
  Deadline: ${s.deadline}
  Verified Source: ${s.source} (${s.verified ? "Official portal verified" : "Unverified guideline"})
  Target Occupations: ${s.occupations.join(", ")}
  Age Range: ${s.minAge}-${s.maxAge} years | Max Income: ₹${s.maxIncome}
  Required Documents: ${s.documents.join(", ")}
  Key Eligibility Rules: ${s.eligibilityText.join("; ")}
  Application Steps: ${s.steps.join(" -> ")}`;
  }).join("\n\n");

  return `You are "GramAI Connect" — an intelligent, empathetic, and highly accurate digital Gram Panchayat assistant for rural and semi-urban Indian citizens.

CURRENT CITIZEN PROFILE:
- Name: ${p.name}
- State: ${p.state}, District: ${p.district}, Village: ${p.village}
- Occupation: ${p.occupation}
- Age: ${p.age} years | Gender: ${p.gender}
- Annual Family Income: ₹${Number(p.income).toLocaleString("en-IN")}
- Social Category: ${p.category} | Land Holding: ${p.land}

CURRENT ACTIVE LANGUAGE: ${lang === "te" ? "Telugu (తెలుగు)" : lang === "hi" ? "Hindi (हिन्दी)" : "English"}

VERIFIED GOVERNMENT SCHEME DATABASE:
${schemeKnowledge}

STRICT CORE INSTRUCTIONS:
1. LANGUAGE SENSITIVITY:
   - If the user writes or speaks in Telugu (or if the active language is "te"), answer thoroughly and natively in Telugu script (తెలుగు).
   - If the user writes or speaks in Hindi (or if the active language is "hi"), answer thoroughly and natively in Hindi Devanagari script (हिन्दी).
   - If the user asks in conversational Hinglish or romanized Telugu, provide your explanation clearly in the natural script or clean bilingual text with appropriate respectful tone ("నమస్కారం ... గారు 🙏" or "नमस्ते ... जी 🙏").
   - If the user asks in English, reply in clear, plain English.
2. ABSOLUTE TRUTHFULNESS & GROUNDING:
   - Base all scheme rules, amounts, benefits, and required documents ONLY on the verified database provided above.
   - Never invent benefits, eligibility criteria, application deadlines, or government guarantees.
   - If a citizen asks about a scheme not in the database or uncertain, explicitly state that and advise them to consult their local Gram Panchayat Secretary, MeeSeva, or CSC centre.
3. CONVERSATIONAL & ACTIONABLE:
   - Clearly explain WHY they are eligible or what criteria they need to verify (e.g. land records on Dharani portal, Aadhaar-bank account linking).
   - List the exact documents they need to carry to MeeSeva / CSC.
   - Always include an honest disclaimer that GramAI assists in discovery and preparation; final eligibility is verified and approved by the government.
4. FORMATTING:
   - Use clean Markdown with bullet points and bold headers. Keep sentences easy to read for citizens.`;
}

export async function askOpenRouter(
  message: string,
  history: ChatMessage[] = [],
  profile?: CitizenProfile,
  lang: string = "en"
): Promise<SchemeAiResponse> {
  const p = profile || {
    name: "Citizen",
    phone: "",
    state: "Telangana",
    district: "Warangal",
    village: "Rampur",
    occupation: "Farmer",
    age: 42,
    gender: "Male",
    income: 85000,
    category: "OBC",
    land: "2.5 acres",
    role: "citizen",
  };

  // Find matching schemes from database for structured payload
  const queryLower = message.toLowerCase();
  const matched = SCHEMES.filter((s) => {
    const hay = `${s.name} ${s.nameTe} ${s.nameHi} ${s.category} ${s.tags.join(" ")} ${s.description}`.toLowerCase();
    const words = queryLower.split(/\s+/).filter((w) => w.length > 2);
    const matchesKeyword = words.some((w) => hay.includes(w));
    const matchesOcc = s.occupations.some((o) => queryLower.includes(o.toLowerCase()));
    return matchesKeyword || matchesOcc;
  });

  const matchedList = (matched.length > 0 ? matched : SCHEMES).slice(0, 4).map((s) => {
    const e = checkEligibility(s, p);
    return {
      id: s.id,
      name: s.name,
      category: s.category,
      benefit: s.benefit,
      matchScore: e.score,
      verified: s.verified,
      source: s.source,
      documents: s.documents,
    };
  });

  // Check if OpenRouter is configured
  if (config.openrouter.isConfigured) {
    try {
      const systemPrompt = buildSystemPrompt(p, lang);
      const messages: ChatMessage[] = [
        { role: "system", content: systemPrompt },
        ...history.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: message },
      ];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 28000);

      const res = await fetch(`${config.openrouter.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.openrouter.apiKey}`,
          "HTTP-Referer": "https://gramai-ksy5.vercel.app",
          "X-Title": "GramAI Connect",
        },
        body: JSON.stringify({
          model: config.openrouter.model,
          messages,
          temperature: 0.3,
          max_tokens: 1024,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const replyText = data?.choices?.[0]?.message?.content?.trim();
        if (replyText) {
          return {
            reply: replyText,
            matchedSchemes: matchedList,
            suggestedQuestions: getSuggestedQuestions(lang, p.occupation),
            mode: "openrouter-live",
            modelUsed: config.openrouter.model,
          };
        }
      } else {
        const errText = await res.text().catch(() => "");
        console.warn(`[OpenRouter] API returned status ${res.status}:`, errText);
      }
    } catch (err: any) {
      console.warn("[OpenRouter] Request failed or timed out:", err?.message);
    }
  }

  // Graceful, highly-grounded fallback rule engine
  return {
    reply: generateGroundedFallback(message, p, lang, matchedList),
    matchedSchemes: matchedList,
    suggestedQuestions: getSuggestedQuestions(lang, p.occupation),
    mode: "grounded-rule-engine",
    modelUsed: "gramai-grounded-engine (OpenRouter unconfigured or offline)",
  };
}

function generateGroundedFallback(
  q: string,
  p: CitizenProfile,
  lang: string,
  matched: Array<{ name: string; category: string; benefit: string; matchScore: number; documents: string[]; source: string }>
): string {
  const schemeBlocks = matched
    .map(
      (s) =>
        `• **${s.name}** (${s.category})\n  - **Benefit**: ${s.benefit}\n  - **Profile Match**: ${s.matchScore}%\n  - **Required Documents**: ${s.documents.slice(0, 3).join(", ")}\n  - **Official Portal**: ${s.source}`
    )
    .join("\n\n");

  if (lang === "te") {
    return `నమస్కారం ${p.name} గారు 🙏

మీ ప్రొఫైల్ ఆధారంగా (${p.occupation}, ${p.state}, వయస్సు ${p.age} సం., వార్షిక ఆదాయం ₹${Number(p.income).toLocaleString("en-IN")}) పరిశీలించిన అర్హత పథకాలు:

${schemeBlocks}

📌 **తదుపరి అడుగులు:**
1. పైన పేర్కొన్న పథకాలలో దేనికైనా దరఖాస్తు చేసుకోవడానికి ఆధార్ కార్డు, బ్యాంక్ పాస్‌బుక్, మరియు అవసరమైన ఆదాయ/భూమి ధృవీకరణ పత్రాలు సిద్ధం చేసుకోండి.
2. మీ గ్రామ పంచాయతీ కార్యాలయం లేదా మీసేవ (MeeSeva) కేంద్రాన్ని సందర్శించండి.
3. ⚠️ **గమనిక**: ఇది అధికారిక మార్గదర్శకాల ఆధారంగా రూపొందించిన సమాచారం మాత్రమే. తుది దరఖాస్తును ప్రభుత్వం ధృవీకరించిన తర్వాతే మంజూరు చేస్తుంది.

మీరు ఏ పథకం గురించి మరింత వివరంగా తెలుసుకోవాలనుకుంటున్నారు?`;
  }

  if (lang === "hi") {
    return `नमस्ते ${p.name} जी 🙏

आपकी प्रोफ़ाइल (${p.occupation}, ${p.state}, आयु ${p.age} वर्ष, वार्षिक आय ₹${Number(p.income).toLocaleString("en-IN")}) के आधार पर पहचानी गई मुख्य सरकारी योजनाएँ:

${schemeBlocks}

📌 **अगले कदम:**
1. आवेदन करने के लिए आधार कार्ड, बैंक पासबुक एवं आय/भूमि दस्तावेज़ तैयार रखें।
2. अपने नजदीकी ग्राम पंचायत कार्यालय या CSC / MeeSeva केंद्र पर जाएं।
3. ⚠️ **महत्वपूर्ण सूचना**: यह जानकारी सरकारी नियमों के आधार पर मार्गदर्शन हेतु है। अंतिम पात्रता सत्यापन संबंधित विभाग द्वारा किया जाता है।

क्या आप किसी विशिष्ट योजना के दस्तावेज़ या आवेदन प्रक्रिया के बारे में पूछना चाहते हैं?`;
  }

  return `Namaste ${p.name} 🙏

Based on your profile (${p.occupation}, ${p.state}, age ${p.age}, annual income ₹${Number(p.income).toLocaleString("en-IN")}), here are the most relevant government schemes:

${schemeBlocks}

📌 **Recommended Next Steps:**
1. Review the required documents for your chosen scheme (Aadhaar, Bank Passbook, Land records/Income Certificate).
2. Visit your local Gram Panchayat office, MeeSeva, or CSC centre to submit the verified application.
3. ⚠️ **Official Disclaimer**: GramAI provides guidance based on verified guidelines. Final eligibility and approvals are made by the respective Government authorities after physical/e-KYC verification.

Which scheme would you like to explore in detail?`;
}

function getSuggestedQuestions(lang: string, occupation: string): string[] {
  if (lang === "te") {
    return [
      "రైతు భరోసా పథకానికి ఏ పత్రాలు కావాలి?",
      "పీఎం కిసాన్ ఈ-కేవైసీ ఎలా చేసుకోవాలి?",
      "ఆయుష్మాన్ భారత్ కార్డ్ ఎక్కడ పొందాలి?",
      "నా దరఖాస్తు పత్రాల చెక్‌లిస్ట్ చూపించండి",
    ];
  }
  if (lang === "hi") {
    return [
      "पीएम किसान के लिए क्या दस्तावेज़ चाहिए?",
      "आयुष्मान भारत कार्ड कैसे बनवाएं?",
      "पेंशन योजना की पात्रता क्या है?",
      "मेरे लिए ज़रूरी दस्तावेज़ों की सूची बताएं",
    ];
  }
  return [
    `Which schemes are best for a ${occupation}?`,
    "What documents do I need for PM-KISAN?",
    "How to get Ayushman Bharat health card?",
    "Help me prepare application checklist",
  ];
}
