import { NextResponse } from "next/server";
import { SCHEMES, checkEligibility } from "@/lib/data";

function answer(q: string, profile: any, lang: string) {
  const low = q.toLowerCase();
  const p = profile || { name:"Citizen", state:"Telangana", occupation:"Farmer", age:42, gender:"Male", income:85000, category:"OBC" };
  const matched = SCHEMES.filter(s => {
    const hay = (s.name+" "+s.category+" "+s.tags.join(" ")+" "+s.description).toLowerCase();
    return low.split(/\s+/).some(w => w.length>3 && hay.includes(w)) || (low.includes("farmer") && s.occupations.includes("Farmer")) || (low.includes("student") && s.occupations.includes("Student")) || (low.includes("women")||low.includes("woman")||low.includes("mahila") ? s.category==="Women & Child" : false) || (low.includes("pension")||low.includes("old") ? s.category==="Pensions" : false) || (low.includes("house")||low.includes("housing") ? s.category==="Housing" : false) || (low.includes("health")||low.includes("hospital") ? s.category==="Healthcare" : false);
  }).slice(0,4);
  const list = (matched.length?matched:SCHEMES.slice(0,3));
  const blocks = list.map(s => {
    const e = checkEligibility(s, p);
    return `• **${s.name}** (${s.category}) — ${s.benefit}. Eligibility match for you: ${e.score}% (${e.status==="eligible"?"Potentially eligible":e.status==="partial"?"More info needed":"Criteria not matched"}). Documents: ${s.documents.slice(0,3).join(", ")}. Source: ${s.source}`;
  }).join("\n");

  if (lang==="te") return `నమస్కారం ${p.name} గారు 🙏\nమీ ప్రొఫైల్ (${p.occupation}, ${p.state}, వయస్సు ${p.age}) ఆధారంగా ఈ పథకాలు మీకు ఉపయోగపడవచ్చు:\n\n${blocks}\n\n⚠️ ఇది ప్రాథమిక అంచనా మాత్రమే — తుది అర్హత ప్రభుత్వ ధృవీకరణ తర్వాతే నిర్ధారణ అవుతుంది. మీ ఆధార్, భూమి పత్రాలు సిద్ధంగా ఉంచండి. మరింత వివరంగా ఏ పథకం గురించి తెలుసుకోవాలనుకుంటున్నారు?`;
  if (lang==="hi") return `नमस्ते ${p.name} जी 🙏\nआपकी प्रोफ़ाइल (${p.occupation}, ${p.state}, आयु ${p.age}) के आधार पर ये योजनाएँ आपके लिए उपयोगी हो सकती हैं:\n\n${blocks}\n\n⚠️ यह केवल प्रारंभिक अनुमान है — अंतिम पात्रता सरकारी सत्यापन के बाद ही तय होगी। क्या आप किसी एक योजना के दस्तावेज़ या आवेदन प्रक्रिया जानना चाहते हैं?`;
  // follow-ups
  let intro = `Namaste ${p.name} 🙏 Based on your profile (${p.occupation}, ${p.state}, age ${p.age}, income ₹${Number(p.income).toLocaleString("en-IN")}), here is what I found:`;
  if (low.includes("document")) intro = `Here are the documents usually needed. Keep originals + photocopies ready:`;
  if (low.includes("how to apply")||low.includes("apply")) intro = `Applying is simpler than it looks — follow these steps. You can apply at MeeSeva / CSC or the official portal:`;
  if (low.includes("hello")||low.includes("hi ")||low==="hi") intro = `Namaste ${p.name} 🙏 I am GramAI, your Gram Panchayat assistant. I can find schemes, check eligibility and list documents for you.`;
  return `${intro}\n\n${blocks}\n\n**Next step:** Open a scheme → check the document checklist → visit MeeSeva/CSC with documents. ⚠️ This is guidance based on available rules, not a guarantee of approval. Final eligibility is decided by the government after verification.\n\nWant me to check for a different person? Try: "I am a student" or "schemes for women".`;
}

export async function POST(req: Request) {
  const b = await req.json().catch(()=>({}));
  const message = String(b.message||"").trim();
  if (!message) return NextResponse.json({error:"Message required"}, {status:400});
  // If OPENAI_API_KEY etc present in future, call LLM here server-side. Graceful fallback = grounded rule engine below.
  const reply = answer(message, b.profile, b.lang||"en");
  const sources = SCHEMES.slice(0,3).map(s=>({name:s.name, url:s.source, verified:s.verified}));
  return NextResponse.json({ reply, sources, mode: process.env.OPENAI_API_KEY ? "llm-configured" : "grounded-demo-engine", disclaimer:"Based on GramAI scheme database. Verify on official portal before applying." });
}
