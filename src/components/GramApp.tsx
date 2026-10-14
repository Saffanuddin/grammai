"use client";
/* eslint-disable react-hooks/set-state-in-effect, @next/next/no-img-element, react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  SCHEMES,
  SERVICES,
  DEMO_PROFILE,
  DEMO_PROFILES,
  checkEligibility,
  getSchemeName,
  type Scheme,
  type CitizenProfile,
} from "@/lib/data";
import {
  getTranslation,
  translateCategory,
  translateStatus,
  translateStage,
  type SupportedLang,
} from "@/lib/translations";
import {
  Sprout,
  MessageCircle,
  FileText,
  Map,
  Wrench,
  LayoutDashboard,
  ShieldCheck,
  Search,
  Heart,
  CheckCircle2,
  Circle,
  ArrowRight,
  Upload,
  Send,
  User,
  Home,
  ListChecks,
  Landmark,
  Phone,
  IndianRupee,
  Sparkles,
  Play,
  RotateCcw,
  Printer,
  X,
  ChevronRight,
  BadgeCheck,
  AlertTriangle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  TrendingUp,
  FileCheck,
  Building2,
  GraduationCap,
  Briefcase,
  HeartPulse,
  House,
  PiggyBank,
  Baby,
  Wallet,
  Check,
  FileSignature,
  LogIn,
  LogOut,
  UserPlus,
  Menu,
} from "lucide-react";

type View =
  | "home"
  | "schemes"
  | "ask"
  | "documents"
  | "journey"
  | "services"
  | "complaints"
  | "dashboard"
  | "admin"
  | "profile";

const HERO =
  "https://images.pexels.com/photos/20527524/pexels-photo-20527524.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";
const IMG2 =
  "https://images.pexels.com/photos/20527519/pexels-photo-20527519.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";
const IMG3 =
  "https://images.pexels.com/photos/17504886/pexels-photo-17504886.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";

const CAT_ICON: Record<string, any> = {
  Agriculture: Sprout,
  Education: GraduationCap,
  Employment: Briefcase,
  "Women & Child": Baby,
  Healthcare: HeartPulse,
  Housing: House,
  Pensions: Wallet,
  "Financial Assistance": PiggyBank,
};

const STATUS_COLOR: Record<string, string> = {
  Submitted: "bg-amber-100 text-amber-800",
  "Under Review": "bg-blue-100 text-blue-800",
  "In Progress": "bg-teal-100 text-teal-800",
  Resolved: "bg-emerald-100 text-emerald-800",
};

export default function GramApp() {
  const [view, setView] = useState<View>("home");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [lang, setLang] = useState<SupportedLang>("en");
  const [profile, setProfile] = useState<CitizenProfile>(DEMO_PROFILE);
  const [isDemo, setIsDemo] = useState(false);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [level, setLevel] = useState("All");
  const [selected, setSelected] = useState<Scheme>(SCHEMES[0]);
  const [saved, setSaved] = useState<string[]>(["pm-kisan", "rythu-bharosa"]);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, string[]>>({
    "pm-kisan": ["Aadhaar Card", "Bank Account Passbook"],
    "rythu-bharosa": ["Aadhaar Card"],
  });
  const [complaints, setComplaints] = useState<any[]>([]);
  const [trackRef, setTrackRef] = useState("");
  const [toast, setToast] = useState("");
  const [guideStep, setGuideStep] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const [role, setRole] = useState<"citizen" | "admin">("citizen");
  const [authUser, setAuthUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: "citizen" | "admin" | "officer";
    phone?: string;
  } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Chat & AI
  const [chat, setChat] = useState<{ role: string; text: string; mode?: string }[]>([
    {
      role: "ai",
      text: "Namaste 🙏 I am GramAI — your digital Gram Panchayat assistant. You can speak to me with the microphone or type in English, తెలుగు, or हिन्दी. I will answer in your selected language based on verified government scheme rules.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [aiMode, setAiMode] = useState<string>("openrouter-live");

  // Voice recording & playback state (Sarvam AI)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recognizedTranscript, setRecognizedTranscript] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Document Intelligence & OCR
  const [docResult, setDocResult] = useState<any>(null);
  const [docLoading, setDocLoading] = useState(false);
  const [docFileName, setDocFileName] = useState("");

  // Complaint form
  const [cForm, setCForm] = useState({
    category: "Water Supply",
    description: "",
    village: DEMO_PROFILE.village,
  });
  const [lastRef, setLastRef] = useState("");

  // Admin
  const [adminTab, setAdminTab] = useState("complaints");
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>(
    Object.fromEntries(SCHEMES.map((s) => [s.id, s.verified]))
  );

  // Form preparation workflow modal
  const [formPrepScheme, setFormPrepScheme] = useState<Scheme | null>(null);
  const [formFields, setFormFields] = useState({
    fullName: DEMO_PROFILE.name,
    mobile: DEMO_PROFILE.phone,
    aadhaarLast4: "4829",
    bankAccount: "10982348123",
    bankIfsc: "SBIN0001234",
    landSurvey: "142/A",
    confirmed: false,
  });
  const [formSavedStatus, setFormSavedStatus] = useState(false);

  // Translation helper
  const t = (key: string) => getTranslation(key, lang);
  const cats = ["All", ...Array.from(new Set(SCHEMES.map((s) => s.category)))];

  // Local storage synchronization
  useEffect(() => {
    try {
      const p = localStorage.getItem("gram-profile");
      if (p) setProfile(JSON.parse(p));
      const s = localStorage.getItem("gram-saved");
      if (s) setSaved(JSON.parse(s));
      const c = localStorage.getItem("gram-checks");
      if (c) setCheckedDocs(JSON.parse(c));
      const l = localStorage.getItem("gram-lang");
      if (l && (l === "en" || l === "te" || l === "hi")) setLang(l as SupportedLang);
    } catch {}

    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("auth") === "success") {
        setToast("Signed in successfully with Google!");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    checkAuth();
    loadComplaints();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("gram-profile", JSON.stringify(profile));
      localStorage.setItem("gram-saved", JSON.stringify(saved));
      localStorage.setItem("gram-checks", JSON.stringify(checkedDocs));
      localStorage.setItem("gram-lang", lang);
    } catch {}
  }, [profile, saved, checkedDocs, lang]);

  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(""), 3500);
      return () => clearTimeout(id);
    }
  }, [toast]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileNavOpen(false);
    }
    if (mobileNavOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  // Adjust default initial chat greeting on language change
  useEffect(() => {
    if (chat.length === 1 && chat[0].role === "ai") {
      if (lang === "te") {
        setChat([
          {
            role: "ai",
            text: "నమస్కారం 🙏 నేను గ్రామ్AI — మీ గ్రామ పంచాయతీ సహాయకుడిని. మైక్రోఫోన్ ద్వారా మాట్లాడండి లేదా తెలుగులో టైప్ చేయండి. మీరు ఏ పథకం గురించి తెలుసుకోవాలనుకుంటున్నారు?",
          },
        ]);
      } else if (lang === "hi") {
        setChat([
          {
            role: "ai",
            text: "नमस्ते 🙏 मैं GramAI हूँ — आपका डिजिटल ग्राम पंचायत सहायक। आप माइक से बोल सकते हैं या हिन्दी में लिख सकते हैं। आप किस योजना के बारे में पूछना चाहते हैं?",
          },
        ]);
      } else {
        setChat([
          {
            role: "ai",
            text: "Namaste 🙏 I am GramAI — your digital Gram Panchayat assistant. Speak with the microphone or type in English, తెలుగు, or हिन्दी. How may I assist you today?",
          },
        ]);
      }
    }
  }, [lang]);

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setAuthUser(data.user);
          if (data.citizen) {
            setProfile((p) => ({
              ...p,
              name: data.citizen.fullName || data.user.name,
              phone: data.citizen.phone || data.user.phone || p.phone,
              village: data.citizen.village || p.village,
              state: data.citizen.state || p.state,
              occupation: data.citizen.occupation || p.occupation,
            }));
          } else if (data.user.name) {
            setProfile((p) => ({ ...p, name: data.user.name }));
          }
          if (data.user.role === "admin" || data.user.role === "officer") {
            setRole("admin");
          }
        } else {
          setAuthUser(null);
        }
      }
    } catch {
      setAuthUser(null);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setAuthUser(null);
      setRole("citizen");
      setToast(t("navLogout") + " successful");
    } catch {
      setToast("Failed to log out");
    }
  }

  async function loadComplaints() {
    try {
      const r = await fetch("/api/complaints");
      const d = await r.json();
      if (d.complaints) setComplaints(d.complaints);
    } catch {
      setComplaints([]);
    }
  }

  const filtered = useMemo(() => {
    return SCHEMES.filter((s) => {
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        (s.name + " " + s.nameTe + " " + s.nameHi + " " + s.category + " " + s.tags.join(" ") + " " + s.description)
          .toLowerCase()
          .includes(q);
      return matchQ && (cat === "All" || s.category === cat) && (level === "All" || s.level === level);
    });
  }, [query, cat, level]);

  const recommendations = useMemo(
    () => SCHEMES.map((s) => ({ s, e: checkEligibility(s, profile) })).sort((a, b) => b.e.score - a.e.score),
    [profile]
  );
  const topRecs = recommendations.filter((r) => r.e.score >= 50).slice(0, 6);

  const journeyItems = useMemo(
    () =>
      saved
        .map((id) => {
          const s = SCHEMES.find((x) => x.id === id)!;
          if (!s) return null;
          const e = checkEligibility(s, profile);
          const docs = s.documents;
          const done = (checkedDocs[id] || []).length;
          const stage =
            done >= docs.length
              ? "Ready for Official Application"
              : e.score >= 60 && done > 0
              ? "Documents Pending"
              : e.score > 0
              ? "Eligibility Checked"
              : "Discovered";
          return { s, e, done, total: docs.length, stage };
        })
        .filter(Boolean) as any[],
    [saved, profile, checkedDocs]
  );

  const overallDocs = useMemo(() => {
    let d = 0;
    let t2 = 0;
    saved.forEach((id) => {
      const s = SCHEMES.find((x) => x.id === id);
      if (s) {
        t2 += s.documents.length;
        d += (checkedDocs[id] || []).length;
      }
    });
    return { d, t: t2, pct: t2 ? Math.round((d / t2) * 100) : 0 };
  }, [saved, checkedDocs]);

  const myComplaints = complaints.slice(0, 8);
  const tracked = complaints.find((c) => c.ref.toLowerCase() === trackRef.trim().toLowerCase());

  function tryDemo(custom?: CitizenProfile) {
    const p = custom || DEMO_PROFILE;
    setProfile(p);
    setIsDemo(true);
    setSaved(["pm-kisan", "rythu-bharosa", "pmfby"]);
    setView("dashboard");
    setToast(`${t("demoPersonasTitle")}: ${p.name} (${p.occupation}, ${p.state})`);
    setGuideStep(2);
  }

  function toggleSave(id: string) {
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setToast(saved.includes(id) ? "Removed from saved schemes" : "Saved! Find it in My Journey & Dashboard.");
  }

  function toggleDoc(schemeId: string, doc: string) {
    setCheckedDocs((prev) => {
      const cur = prev[schemeId] || [];
      return {
        ...prev,
        [schemeId]: cur.includes(doc) ? cur.filter((d) => d !== doc) : [...cur, doc],
      };
    });
  }

  function openScheme(s: Scheme) {
    setSelected(s);
    setView("schemes");
    setTimeout(() => {
      document.getElementById("scheme-detail")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  // Live Chat with OpenRouter
  async function sendChat(msg?: string) {
    const text = (msg || chatInput).trim();
    if (!text) return;

    setChat((c) => [...c, { role: "user", text }]);
    setChatInput("");
    setRecognizedTranscript("");
    setChatLoading(true);

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: chat.slice(-4),
          profile,
          lang,
        }),
      });
      const d = await r.json();
      const replyText = d.reply || "Could not generate response. Please try again.";
      setAiMode(d.mode || "openrouter-live");
      setChat((c) => [...c, { role: "ai", text: replyText, mode: d.mode }]);

      // Automatically speak the reply if voice was used
      if (isRecording || recognizedTranscript) {
        speakResponse(replyText);
      }
    } catch {
      setChat((c) => [
        ...c,
        {
          role: "ai",
          text:
            lang === "te"
              ? "సర్వర్ అందుబాటులో లేదు, కానీ ధృవీకరించిన పథకాల సమాచారం ప్రకారం: పీఎం కిసాన్ (రైతులకు ₹6,000), ఆయుష్మాన్ భారత్ (₹5లక్షల ఉచిత చికిత్స) మరియు ఉపాధి హామీ పథకాలు ప్రధానమైనవి."
              : lang === "hi"
              ? "सर्वर से संपर्क नहीं हो सका, लेकिन योजना नियमों के अनुसार: पीएम किसान (₹6,000/वर्ष), आयुष्मान भारत (₹5 लाख स्वास्थ्य बीमा) और मनरेगा अधिकांश परिवारों के लिए उपयोगी हैं।"
              : "I could not reach the server right now. Key schemes for your profile: PM-KISAN (₹6,000/yr for farmers), Ayushman Bharat (₹5L health cover) and MGNREGA work guarantee.",
        },
      ]);
    }
    setChatLoading(false);
  }

  // Sarvam Voice STT Recording
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setIsRecording(false);
        clearInterval(recordingTimerRef.current);
        stream.getTracks().forEach((track) => track.stop());

        // Send to Sarvam STT API
        setIsTranscribing(true);
        try {
          const formData = new FormData();
          formData.append("file", audioBlob, "voice-input.webm");
          formData.append("language", lang);

          const res = await fetch("/api/voice/stt", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.transcript) {
            setRecognizedTranscript(data.transcript);
            setChatInput(data.transcript);
            setToast(`Speech recognized (${data.provider || "Sarvam AI"}): "${data.transcript}"`);
          } else if (data.error) {
            setToast(`Speech notice: ${data.error}`);
          }
        } catch (err: any) {
          setToast("Failed to transcribe audio. Please type your question.");
        }
        setIsTranscribing(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch (err) {
      setToast("Microphone access denied. Please allow microphone permission in your browser.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  }

  // Sarvam AI Text-to-Speech Playback
  async function speakResponse(text: string, msgIndex?: number) {
    if (isPlayingAudio !== null) {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(null);
      return;
    }

    if (msgIndex !== undefined) setIsPlayingAudio(msgIndex);

    try {
      const res = await fetch("/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: lang }),
      });
      const data = await res.json();

      if (data.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
        audioElementRef.current = audio;
        audio.onended = () => setIsPlayingAudio(null);
        audio.onerror = () => setIsPlayingAudio(null);
        await audio.play();
      } else {
        // Fallback to Web Speech API
        playWebSpeechFallback(text);
      }
    } catch {
      playWebSpeechFallback(text);
    }
  }

  function playWebSpeechFallback(text: string) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*#•`_]/g, "").slice(0, 300);
      const utter = new SpeechSynthesisUtterance(clean);
      utter.lang = lang === "te" ? "te-IN" : lang === "hi" ? "hi-IN" : "en-IN";
      utter.rate = 0.95;
      utter.onend = () => setIsPlayingAudio(null);
      utter.onerror = () => setIsPlayingAudio(null);
      window.speechSynthesis.speak(utter);
    } else {
      setIsPlayingAudio(null);
    }
  }

  // Document Intelligence OCR upload
  async function processDoc(useSample = false, file?: File) {
    setDocLoading(true);
    let fname = useSample ? "Sample — Rythu Bharosa Guidelines 2025-26.pdf" : file?.name || docFileName || "guideline.pdf";

    try {
      let r: Response;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("lang", lang);
        formData.append("profile", JSON.stringify(profile));
        r = await fetch("/api/documents", { method: "POST", body: formData });
      } else {
        r = await fetch("/api/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: fname, useSample, profile, lang }),
        });
      }

      const d = await r.json();
      setDocResult(d);
      setToast(
        lang === "te"
          ? "పత్రం విశ్లేషించబడింది! అర్హతలు, ప్రయోజనాలు & చెక్‌లిస్ట్ కింద చూడండి."
          : lang === "hi"
          ? "दस्तावेज़ का विश्लेषण पूरा हुआ! सारांश और चेकलिस्ट नीचे देखें।"
          : "Document extracted! Summary, eligibility & checklist generated below."
      );
    } catch {
      setDocResult(null);
      setToast("Failed to analyze document.");
    }
    setDocLoading(false);
  }

  // Submit complaint
  async function submitComplaint(e: any) {
    e.preventDefault();
    if (!cForm.description.trim()) {
      setToast("Please describe the issue.");
      return;
    }
    try {
      const r = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizenName: authUser ? authUser.name : profile.name,
          phone: authUser?.phone || profile.phone,
          isDemo: !authUser && isDemo,
          citizenId: authUser ? authUser.id : undefined,
          ...cForm,
        }),
      });
      const d = await r.json();
      setLastRef(d.ref);
      setTrackRef(d.ref);
      await loadComplaints();
      setCForm({ ...cForm, description: "" });
      setToast(`Complaint registered. Reference: ${d.ref}`);
    } catch {
      const ref = `GRC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setLastRef(ref);
      setComplaints((c) => [
        {
          id: Date.now(),
          ref,
          citizenName: authUser ? authUser.name : profile.name,
          category: cForm.category,
          description: cForm.description,
          village: cForm.village,
          status: "Submitted",
          response: "",
          createdAt: new Date().toISOString(),
        },
        ...c,
      ]);
    }
  }

  async function adminUpdate(ref: string, status: string, response: string) {
    await fetch("/api/complaints", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref, status, response }),
    }).catch(() => {});
    setComplaints((cs) => cs.map((c) => (c.ref === ref ? { ...c, status, response } : c)));
    setToast(`Updated ${ref} → ${translateStatus(status, lang)}`);
  }

  // Form preparation workflow save
  async function savePreparedApplication() {
    if (!formFields.confirmed) {
      setToast("Please confirm the verification checkbox before saving.");
      return;
    }
    if (!formPrepScheme) return;

    try {
      await fetch("/api/journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizenId: profile.name.toLowerCase().replace(/\s+/g, "-"),
          schemeId: formPrepScheme.id,
          stage: "Ready for Official Application",
          eligibility: "eligible",
          score: 100,
        }),
      });

      if (!saved.includes(formPrepScheme.id)) {
        setSaved((prev) => [...prev, formPrepScheme.id]);
      }
      setFormSavedStatus(true);
      setToast("Prepared Application Package saved to My Journey!");
    } catch {
      setFormSavedStatus(true);
    }
  }

  const eligSelected = checkEligibility(selected, profile);

  const navBtn = (v: View, label: string, Icon: any) => (
    <button
      key={v}
      onClick={() => setView(v)}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition ${
        view === v ? "bg-emerald-700 text-white shadow" : "text-emerald-950 hover:bg-emerald-50"
      }`}
    >
      <Icon size={15} />
      {label}
    </button>
  );

  const GuideSteps = [
    t("demoBtn"),
    t("navDashboard"),
    t("navSchemes"),
    t("checkEligibilityBtn"),
    t("myProfile"),
    t("navDocs"),
    t("documentChecklist"),
    t("navAsk"),
    t("navComplaints"),
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f2] text-slate-900 font-sans">
      {/* Top strip */}
      <div className="bg-emerald-950 text-emerald-50 text-[11px] sm:text-[12px]">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap gap-2 items-center justify-between">
          <span className="flex items-center gap-1.5 sm:gap-2 truncate">
            <Landmark size={13} className="shrink-0" />
            <span className="truncate">{t("topStripNotice")}</span>
          </span>
          <span className="hidden md:flex items-center gap-3">
            <span>{t("helpline")}</span>
            <span>{t("meesevaCsc")}</span>
            {authUser ? (
              <span className="bg-white/15 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 text-xs">
                {authUser.role === "admin" || authUser.role === "officer" ? (
                  <>👩‍💼 {t("officerRole")}: <span className="text-emerald-300 font-black">{authUser.name}</span></>
                ) : (
                  <>👤 {t("citizenRole")}: <span className="text-emerald-300 font-black">{authUser.name}</span></>
                )}
              </span>
            ) : (
              <button
                onClick={() => {
                  setRole(role === "admin" ? "citizen" : "admin");
                  setView(role === "admin" ? "dashboard" : "admin");
                }}
                className="bg-white/15 hover:bg-white/25 px-2.5 py-0.5 rounded-full font-bold"
              >
                {role === "admin" ? `👩‍💼 ${t("adminModeOn")}` : `🔐 ${t("adminLogin")}`}
              </button>
            )}
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <button onClick={() => setView("home")} className="flex items-center gap-2.5 text-left min-w-0">
            <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-600 grid place-items-center text-white shadow-lg shrink-0">
              <Sprout size={22} />
            </span>
            <span className="min-w-0">
              <span className="block font-black text-lg sm:text-xl leading-none text-emerald-950 truncate">
                GramAI <span className="text-teal-600">Connect</span>
              </span>
              <span className="hidden sm:block text-[11px] text-slate-500 font-semibold mt-0.5 truncate">{t("tagline")}</span>
            </span>
          </button>

          {/* Desktop Right Controls (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Multilingual Selector: English, Telugu, Hindi */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1 border">
              {[
                ["en", "English"],
                ["te", "తెలుగు"],
                ["hi", "हिन्दी"],
              ].map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setLang(k as SupportedLang)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    lang === k ? "bg-emerald-700 text-white shadow" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Desktop User Authentication state */}
            {authUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView("profile")}
                  className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition shadow-sm"
                  title={authUser.email}
                >
                  <span className="w-7 h-7 rounded-full bg-emerald-700 text-white grid place-items-center text-xs font-black">
                    {authUser.name
                      .split(" ")
                      .map((x) => x[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  <span className="text-left leading-none hidden lg:block">
                    <span className="block text-xs font-black text-emerald-950">{authUser.name}</span>
                    <span className="block text-[10px] text-emerald-700 font-semibold mt-0.5">
                      {authUser.role === "admin" || authUser.role === "officer" ? t("officerRole") : t("citizenRole")}
                    </span>
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-sm"
                  title="Log out"
                >
                  <LogOut size={14} />
                  <span>{t("navLogout")}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => tryDemo()}
                  className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-3.5 py-2 rounded-full shadow-sm flex items-center gap-1.5 text-xs transition"
                >
                  <Play size={14} /> <span>{t("demoBtn")}</span>
                </button>
                <a
                  href="/login"
                  className="flex items-center gap-1.5 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-bold px-3.5 py-2 rounded-full text-xs transition shadow-sm"
                >
                  <LogIn size={14} />
                  <span>{t("navLogin")}</span>
                </a>
                <a
                  href="/signup"
                  className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black px-4 py-2 rounded-full text-xs shadow transition"
                >
                  <UserPlus size={14} />
                  <span>{t("navSignup")}</span>
                </a>
              </div>
            )}
          </div>

          {/* Mobile Right Controls (< md) */}
          <div className="flex md:hidden items-center gap-1.5">
            {/* Quick Language Toggle */}
            <div className="flex items-center bg-slate-100 rounded-full p-0.5 border">
              {[
                ["en", "EN"],
                ["te", "తె"],
                ["hi", "हि"],
              ].map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setLang(k as SupportedLang)}
                  className={`px-2 py-1 rounded-full text-[11px] font-bold transition min-w-[28px] ${
                    lang === k ? "bg-emerald-700 text-white shadow-xs" : "text-slate-600"
                  }`}
                  aria-label={`Switch language to ${k}`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* User Profile or Login Quick Pill */}
            {authUser ? (
              <button
                onClick={() => setView("profile")}
                className="w-9 h-9 rounded-full bg-emerald-700 text-white grid place-items-center text-xs font-black shadow-sm"
                title={authUser.name}
                aria-label="Open profile"
              >
                {authUser.name.slice(0, 1).toUpperCase()}
              </button>
            ) : (
              <a
                href="/login"
                className="w-9 h-9 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 grid place-items-center text-xs font-bold shadow-xs"
                title="Log in"
                aria-label="Log in"
              >
                <LogIn size={15} />
              </a>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileNavOpen}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition min-h-[40px] min-w-[40px] flex items-center justify-center border border-slate-200"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Desktop Navigation Bar (hidden on mobile) */}
        <nav className="hidden md:flex max-w-7xl mx-auto px-4 pb-3 gap-1 overflow-x-auto">
          {navBtn("home", t("navHome"), Home)}
          {navBtn("schemes", t("navSchemes"), Search)}
          {navBtn("ask", t("navAsk"), MessageCircle)}
          {navBtn("documents", t("navDocs"), FileText)}
          {navBtn("journey", t("navJourney"), Map)}
          {navBtn("services", t("navServices"), Building2)}
          {navBtn("complaints", t("navComplaints"), Wrench)}
          {navBtn("dashboard", t("navDashboard"), LayoutDashboard)}
          {(role === "admin" || authUser?.role === "admin" || authUser?.role === "officer") && navBtn("admin", t("navAdmin"), ShieldCheck)}
          {navBtn("profile", t("navProfile"), User)}
        </nav>
      </header>

      {/* Mobile Slide-Over Navigation Drawer (< md) */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
          {/* Backdrop */}
          <div
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-[85%] max-w-xs bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b flex items-center justify-between bg-emerald-950 text-white">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 grid place-items-center text-emerald-950 font-black">
                  <Sprout size={20} />
                </span>
                <div>
                  <p className="font-black text-base leading-none">GramAI Connect</p>
                  <p className="text-[10px] text-emerald-300 font-semibold mt-0.5">{t("tagline")}</p>
                </div>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white min-w-[44px] min-h-[44px] grid place-items-center"
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* User Account / Auth Card */}
              {authUser ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-emerald-700 text-white font-black grid place-items-center text-sm shrink-0">
                    {authUser.name
                      .split(" ")
                      .map((x) => x[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-emerald-950 truncate">{authUser.name}</p>
                    <p className="text-[11px] text-emerald-700 font-bold truncate">
                      {authUser.role === "admin" || authUser.role === "officer" ? t("officerRole") : t("citizenRole")}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{authUser.email}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="/login"
                      onClick={() => setMobileNavOpen(false)}
                      className="flex items-center justify-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-3 rounded-xl text-xs min-h-[44px]"
                    >
                      <LogIn size={15} />
                      <span>{t("navLogin")}</span>
                    </a>
                    <a
                      href="/signup"
                      onClick={() => setMobileNavOpen(false)}
                      className="flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black py-2.5 px-3 rounded-xl text-xs min-h-[44px] shadow-sm"
                    >
                      <UserPlus size={15} />
                      <span>{t("navSignup")}</span>
                    </a>
                  </div>
                  <button
                    onClick={() => {
                      tryDemo();
                      setMobileNavOpen(false);
                    }}
                    className="w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 min-h-[44px] shadow-xs"
                  >
                    <Play size={14} /> {t("demoBtn")}
                  </button>
                </div>
              )}

              {/* Multilingual Selector */}
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">Language / భాష / भाषा</p>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-2xl border">
                  {[
                    ["en", "English"],
                    ["te", "తెలుగు"],
                    ["hi", "हिन्दी"],
                  ].map(([k, l]) => (
                    <button
                      key={k}
                      onClick={() => setLang(k as SupportedLang)}
                      className={`py-2 rounded-xl text-xs font-bold transition text-center min-h-[40px] ${
                        lang === k ? "bg-emerald-700 text-white shadow-sm" : "text-slate-700 hover:bg-white"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Links */}
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">Navigation</p>
                <div className="space-y-1">
                  {[
                    { id: "home", label: t("navHome"), icon: Home },
                    { id: "schemes", label: t("navSchemes"), icon: Search },
                    { id: "ask", label: t("navAsk"), icon: MessageCircle },
                    { id: "documents", label: t("navDocs"), icon: FileText },
                    { id: "journey", label: t("navJourney"), icon: Map },
                    { id: "services", label: t("navServices"), icon: Building2 },
                    { id: "complaints", label: t("navComplaints"), icon: Wrench },
                    { id: "dashboard", label: t("navDashboard"), icon: LayoutDashboard },
                    ...((role === "admin" || authUser?.role === "admin" || authUser?.role === "officer")
                      ? [{ id: "admin", label: t("navAdmin"), icon: ShieldCheck }]
                      : []),
                    { id: "profile", label: t("navProfile"), icon: User },
                  ].map(({ id, label, icon: Icon }) => {
                    const active = view === id;
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          setView(id as View);
                          setMobileNavOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-bold transition text-left min-h-[44px] ${
                          active
                            ? "bg-emerald-700 text-white shadow-sm"
                            : "text-slate-800 hover:bg-emerald-50 hover:text-emerald-950"
                        }`}
                      >
                        <Icon size={18} className={active ? "text-white" : "text-emerald-700"} />
                        <span className="flex-1">{label}</span>
                        {active && <span className="w-2 h-2 rounded-full bg-emerald-300" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Officer / Citizen Mode Toggle */}
              <div className="pt-2 border-t">
                <button
                  onClick={() => {
                    const nextRole = role === "admin" ? "citizen" : "admin";
                    setRole(nextRole);
                    setView(nextRole === "admin" ? "admin" : "dashboard");
                    setMobileNavOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-bold bg-slate-50 hover:bg-slate-100 min-h-[44px]"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-700" />
                    <span>{role === "admin" ? t("officerRole") : "Switch to Officer View"}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${role === "admin" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200"}`}>
                    {role === "admin" ? "Active" : "Switch"}
                  </span>
                </button>
              </div>
            </div>

            {/* Drawer Footer with Logout if logged in */}
            {authUser && (
              <div className="p-4 border-t bg-slate-50">
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileNavOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-rose-600 hover:bg-rose-50 border border-rose-200 py-2.5 rounded-xl text-xs font-bold transition min-h-[44px]"
                >
                  <LogOut size={16} />
                  <span>{t("navLogout")}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Notification Toast */}
      {toast && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto sm:max-w-sm z-50 bg-emerald-950 text-white px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="shrink-0 text-emerald-300" size={18} />
          <span className="flex-1 min-w-0">{toast}</span>
        </div>
      )}

      {/* Guided Walkthrough Banner */}
      {showGuide && view === "home" && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white rounded-3xl p-4 md:p-5 shadow-xl">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-amber-300 font-black text-xs tracking-widest">
                  🎯 GUIDED TOUR • LIVE AI & VOICE
                </p>
                <h3 className="font-black text-lg mt-1">
                  Explore full features in English, తెలుగు & हिन्दी with OpenRouter and Sarvam AI
                </h3>
              </div>
              <button onClick={() => setShowGuide(false)} className="bg-white/15 p-1.5 rounded-full">
                <X size={16} />
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto mt-4 pb-1">
              {GuideSteps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setGuideStep(i);
                    if (i === 0) tryDemo();
                    if (i === 1) setView("dashboard");
                    if (i === 2 || i === 3) setView("schemes");
                    if (i === 4) setView("profile");
                    if (i === 5 || i === 6) setView("documents");
                    if (i === 7) setView("ask");
                    if (i === 8) setView("complaints");
                  }}
                  className={`shrink-0 px-3 py-2 rounded-full text-xs font-bold border transition ${
                    guideStep === i
                      ? "bg-amber-400 text-emerald-950 border-amber-300"
                      : "bg-white/10 border-white/20 hover:bg-white/20"
                  }`}
                >
                  {i + 1}. {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW: HOME
      ======================================================== */}
      {view === "home" && (
        <main>
          <section className="max-w-7xl mx-auto px-4 pt-4 sm:pt-6 grid lg:grid-cols-5 gap-4 sm:gap-6">
            <div className="lg:col-span-3 bg-white rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-xl border">
              <div className="relative min-h-[260px] sm:h-72 md:h-80">
                <img src={HERO} alt="Rural India citizens" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-950/40 to-transparent" />
                <div className="absolute bottom-0 p-4 sm:p-6 text-white">
                  <span className="bg-amber-400 text-emerald-950 text-[11px] font-black px-2.5 py-1 rounded-full">
                    {t("heroBadge")}
                  </span>
                  <h1 className="text-2xl sm:text-3xl md:text-5xl font-black leading-tight mt-2.5">{t("heroTitle")}</h1>
                  <p className="text-emerald-50/90 mt-1.5 max-w-xl text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-none">{t("heroSub")}</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3">
                <div className="flex-1 min-w-0 w-full sm:w-auto flex bg-slate-100 rounded-full p-1.5 border">
                  <Search className="ml-2 text-slate-400 self-center shrink-0" size={18} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className="flex-1 min-w-0 bg-transparent outline-none px-2 text-base sm:text-sm"
                  />
                  <button
                    onClick={() => setView("schemes")}
                    className="bg-emerald-700 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold hover:bg-emerald-800 transition shrink-0 min-h-[40px]"
                  >
                    {t("searchBtn")}
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => tryDemo()}
                    className="flex-1 sm:flex-initial bg-emerald-700 hover:bg-emerald-800 text-white font-black px-4 sm:px-5 py-3 rounded-full flex items-center justify-center gap-2 shadow text-xs sm:text-sm min-h-[44px]"
                  >
                    <Play size={17} /> {t("tryDemoCta")}
                  </button>
                  <button
                    onClick={() => setView("ask")}
                    className="flex-1 sm:flex-initial bg-white border-2 border-emerald-700 text-emerald-800 font-black px-4 sm:px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-emerald-50 text-xs sm:text-sm min-h-[44px]"
                  >
                    <MessageCircle size={17} /> {t("askGramAiCta")}
                  </button>
                </div>
              </div>

              <div className="px-4 sm:px-5 pb-4 sm:pb-5 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
                {[
                  [SCHEMES.length + "+", t("statSchemesDb")],
                  [topRecs.length, `${t("statMatchedFor")} ${profile.name.split(" ")[0]}`],
                  ["3", t("statLanguages")],
                  [complaints.length || 3, t("statComplaints")],
                ].map(([n, l]) => (
                  <div key={l as string} className="bg-emerald-50 rounded-2xl p-2.5 sm:p-3 text-center border border-emerald-100">
                    <p className="font-black text-xl sm:text-2xl text-emerald-800">{n}</p>
                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-600 leading-tight mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Personalized Profile Card */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-emerald-950 text-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 shadow-xl">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <p className="text-emerald-300 text-xs font-black tracking-widest truncate">
                      {t("forYou")} • {profile.occupation.toUpperCase()}
                    </p>
                    <h3 className="font-black text-lg sm:text-xl mt-1 truncate">
                      {t("namaste")}, {profile.name} 🙏
                    </h3>
                    <p className="text-emerald-100/80 text-xs mt-1">
                      {profile.village}, {profile.district}, {profile.state} • {t("ageLabel")} {profile.age} • ₹
                      {Number(profile.income).toLocaleString("en-IN")}/yr • {profile.land}
                    </p>
                  </div>
                  <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-2 py-1 rounded-full shrink-0">
                    {isDemo ? "DEMO PROFILE" : "PROFILE"}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {topRecs.slice(0, 3).map(({ s, e }) => (
                    <button
                      key={s.id}
                      onClick={() => openScheme(s)}
                      className="w-full text-left bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-3 flex gap-2.5 sm:gap-3 items-center transition min-h-[44px]"
                    >
                      <span className="w-9 h-9 rounded-xl bg-emerald-400/20 grid place-items-center shrink-0">
                        {(() => {
                          const I = CAT_ICON[s.category] || Sparkles;
                          return <I size={18} className="text-emerald-300" />;
                        })()}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-bold text-sm truncate">{getSchemeName(s, lang)}</span>
                        <span className="block text-emerald-100/70 text-xs truncate">{s.benefit}</span>
                      </span>
                      <span
                        className={`text-[11px] font-black px-2 py-1 rounded-full shrink-0 ${
                          e.score >= 80
                            ? "bg-emerald-400 text-emerald-950"
                            : e.score >= 50
                            ? "bg-amber-400 text-emerald-950"
                            : "bg-white/20"
                        }`}
                      >
                        {e.score}%
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setView("dashboard")}
                  className="mt-4 w-full bg-white text-emerald-950 font-black py-3 rounded-full flex items-center justify-center gap-2 hover:bg-slate-100 transition shadow min-h-[44px]"
                >
                  {t("openDashboard")} <ArrowRight size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <img src={IMG2} className="rounded-[20px] sm:rounded-[24px] h-28 sm:h-32 w-full object-cover shadow" alt="Rural farming" />
                <img src={IMG3} className="rounded-[20px] sm:rounded-[24px] h-28 sm:h-32 w-full object-cover shadow" alt="Rural life" />
              </div>

              <div className="bg-white rounded-[20px] sm:rounded-[24px] p-4 shadow border flex gap-3 items-start">
                <span className="w-10 h-10 rounded-2xl bg-teal-100 grid place-items-center shrink-0">
                  <FileText className="text-teal-700" size={20} />
                </span>
                <div className="min-w-0">
                  <p className="font-black text-sm">{t("docIntelTitle")}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t("docIntelSub")}</p>
                  <button
                    onClick={() => setView("documents")}
                    className="text-teal-700 font-black text-xs mt-1.5 flex items-center gap-1 min-h-[32px]"
                  >
                    {t("trySampleGuideline")} <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Browse Categories */}
          <section className="max-w-7xl mx-auto px-4 mt-6 sm:mt-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-emerald-700 font-black text-xs tracking-widest">{t("browseByNeed")}</p>
                <h2 className="font-black text-xl sm:text-2xl mt-1">{t("whatHelpTitle")}</h2>
              </div>
              <button
                onClick={() => setView("schemes")}
                className="hidden md:flex text-emerald-700 font-black text-sm items-center gap-1 hover:underline"
              >
                {t("allSchemes")} <ArrowRight size={15} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3 mt-4">
              {cats
                .filter((c) => c !== "All")
                .map((c) => {
                  const I = CAT_ICON[c] || Sparkles;
                  const n = SCHEMES.filter((s) => s.category === c).length;
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        setCat(c);
                        setView("schemes");
                      }}
                      className="bg-white hover:shadow-lg border rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 text-left transition group min-h-[44px]"
                    >
                      <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-100 group-hover:bg-emerald-700 grid place-items-center transition">
                        <I size={20} className="text-emerald-700 group-hover:text-white" />
                      </span>
                      <p className="font-black mt-2.5 text-sm sm:text-base truncate">{translateCategory(c, lang)}</p>
                      <p className="text-xs text-slate-500">
                        {n} {t("schemesLabel")}
                      </p>
                    </button>
                  );
                })}
            </div>
          </section>

          {/* Top Recommendations */}
          <section className="max-w-7xl mx-auto px-4 mt-6 sm:mt-8 pb-4">
            <h2 className="font-black text-xl sm:text-2xl">
              {t("recommendedFor")} {profile.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">{t("rankingSub")}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {topRecs.map(({ s, e }) => (
                <SchemeCard
                  key={s.id}
                  s={s}
                  score={e.score}
                  saved={saved.includes(s.id)}
                  lang={lang}
                  onOpen={() => openScheme(s)}
                  onSave={() => toggleSave(s.id)}
                  onPrepareForm={() => {
                    setFormPrepScheme(s);
                    setFormSavedStatus(false);
                  }}
                />
              ))}
            </div>
          </section>

          {/* Persona Presets */}
          <section className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
            <div className="bg-white rounded-[24px] sm:rounded-[28px] border shadow p-4 sm:p-5">
              <p className="font-black text-base sm:text-lg">👥 {t("demoPersonasTitle")}</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">{t("demoPersonasSub")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {DEMO_PROFILES.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => tryDemo(p)}
                    className="text-left border-2 hover:border-emerald-600 rounded-2xl p-3 bg-emerald-50/50 transition min-h-[44px]"
                  >
                    <p className="font-black text-sm">{p.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
                    <p className="text-emerald-700 font-black text-xs mt-2">{t("loadThisProfile")}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================
          VIEW: FIND SCHEMES
      ======================================================== */}
      {view === "schemes" && (
        <main className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <p className="text-emerald-700 font-black text-xs tracking-widest">{t("schemeDiscoveryBadge")}</p>
          <h1 className="font-black text-2xl sm:text-3xl mt-1">{t("schemeDiscoveryTitle")}</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">{t("schemeDiscoverySub")}</p>

          <div className="bg-white rounded-2xl sm:rounded-3xl border shadow p-3 sm:p-4 mt-4 flex flex-col md:flex-row gap-2.5 sm:gap-3">
            <div className="flex-1 flex bg-slate-100 rounded-full px-3 items-center border min-h-[44px]">
              <Search size={17} className="text-slate-400 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="flex-1 min-w-0 bg-transparent outline-none p-2.5 text-base sm:text-sm"
              />
            </div>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="border rounded-full px-3 py-2.5 text-base sm:text-sm font-semibold bg-white w-full md:w-auto min-h-[44px]"
            >
              {cats.map((c) => (
                <option key={c} value={c}>
                  {translateCategory(c, lang)}
                </option>
              ))}
            </select>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="border rounded-full px-3 py-2.5 text-base sm:text-sm font-semibold bg-white w-full md:w-auto min-h-[44px]"
            >
              <option value="All">{t("filterAllLevel")}</option>
              <option value="Central">{t("filterCentral")}</option>
              <option value="State">{t("filterState")}</option>
            </select>
            <select
              value={profile.occupation}
              onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
              className="border rounded-full px-3 py-2.5 text-base sm:text-sm font-semibold bg-emerald-50 w-full md:w-auto min-h-[44px]"
            >
              <option>Farmer</option>
              <option>Student</option>
              <option>Daily Wage Worker</option>
              <option>Self-Employed</option>
              <option>Unemployed</option>
              <option>Retired / Pensioner</option>
            </select>
          </div>

          <p className="text-xs sm:text-sm font-bold mt-4">
            {filtered.length} {t("foundCountText")} {profile.occupation} {t("inState")} {profile.state}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            {filtered.map((s) => {
              const e = checkEligibility(s, profile);
              return (
                <SchemeCard
                  key={s.id}
                  s={s}
                  score={e.score}
                  saved={saved.includes(s.id)}
                  lang={lang}
                  onOpen={() => openScheme(s)}
                  onSave={() => toggleSave(s.id)}
                  onPrepareForm={() => {
                    setFormPrepScheme(s);
                    setFormSavedStatus(false);
                  }}
                />
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white rounded-3xl p-8 sm:p-10 text-center border mt-4">
              <p className="font-black text-lg">{t("noSchemesMatch")}</p>
              <button
                onClick={() => {
                  setQuery("");
                  setCat("All");
                }}
                className="mt-3 bg-emerald-700 text-white px-5 py-2.5 rounded-full font-bold text-sm min-h-[44px]"
              >
                {t("clearFilters")}
              </button>
            </div>
          )}

          {/* Scheme Detailed View */}
          <div id="scheme-detail" className="bg-white rounded-[24px] sm:rounded-[28px] border shadow-xl mt-6 sm:mt-8 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-900 to-teal-700 text-white p-4 sm:p-6">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="bg-white/20 px-2.5 py-1 rounded-full text-[11px] font-black">
                  {translateCategory(selected.category, lang).toUpperCase()}
                </span>
                <span className="bg-white/20 px-2.5 py-1 rounded-full text-[11px] font-black">
                  {selected.level} • {selected.state}
                </span>
                {selected.verified ? (
                  <span className="bg-emerald-400 text-emerald-950 px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1">
                    <BadgeCheck size={12} /> {t("verifiedBadge")}
                  </span>
                ) : (
                  <span className="bg-amber-400 text-emerald-950 px-2.5 py-1 rounded-full text-[11px] font-black">
                    {t("unverifiedBadge")}
                  </span>
                )}
                <span className="ml-auto text-xs font-bold bg-white/15 px-2.5 py-1 rounded-full">
                  ⏰ {selected.deadline}
                </span>
              </div>

              <h2 className="font-black text-xl sm:text-2xl md:text-3xl mt-3">{getSchemeName(selected, lang)}</h2>
              <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
                {selected.name} • {selected.ministry}
              </p>
              <p className="mt-3 bg-white/10 border border-white/15 rounded-2xl p-3 font-bold flex items-center gap-2 text-xs sm:text-sm">
                <IndianRupee className="text-amber-300 shrink-0" size={18} />
                <span>{selected.benefit}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              <div className="lg:col-span-3 p-4 sm:p-6 space-y-5 sm:space-y-6">
                <div>
                  <h3 className="font-black text-base">{t("aboutScheme")}</h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{selected.description}</p>
                </div>
                <div>
                  <h3 className="font-black text-base">{t("whoCanApply")}</h3>
                  <ul className="mt-2 space-y-1.5">
                    {selected.eligibilityText.map((x) => (
                      <li key={x} className="flex gap-2 text-sm text-slate-600">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-black text-base">{t("howToApply")}</h3>
                  <ol className="mt-2 space-y-2">
                    {selected.steps.map((x, i) => (
                      <li key={x} className="flex gap-3 text-sm">
                        <span className="w-6 h-6 rounded-full bg-emerald-700 text-white grid place-items-center text-xs font-black shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-slate-600 pt-0.5">{x}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <a
                    href={selected.source}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial text-center bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow min-h-[44px] flex items-center justify-center"
                  >
                    {t("officialPortalBtn")}
                  </a>
                  <button
                    onClick={() => {
                      setFormPrepScheme(selected);
                      setFormSavedStatus(false);
                    }}
                    className="flex-1 sm:flex-initial bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-4 py-2.5 rounded-full text-xs sm:text-sm shadow flex items-center justify-center gap-1.5 min-h-[44px]"
                  >
                    <FileSignature size={16} /> {t("formPrepTitle")}
                  </button>
                  <button
                    onClick={() => toggleSave(selected.id)}
                    className="border-2 border-emerald-700 text-emerald-800 px-4 py-2.5 rounded-full font-bold text-xs sm:text-sm hover:bg-emerald-50 min-h-[44px]"
                  >
                    {saved.includes(selected.id) ? `♥ ${t("savedSchemeBtn")}` : `♡ ${t("saveSchemeBtn")}`}
                  </button>
                  <button
                    onClick={() => setView("ask")}
                    className="border px-4 py-2.5 rounded-full font-bold text-xs sm:text-sm hover:bg-slate-50 min-h-[44px]"
                  >
                    {t("askAboutSchemeBtn")}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 flex gap-1">
                  <AlertTriangle size={13} className="shrink-0 mt-0.5" /> <span>{t("disclaimerScheme")} Source: {selected.source}</span>
                </p>
              </div>

              {/* Eligibility & Live Checklist */}
              <div className="lg:col-span-2 bg-emerald-50/70 p-4 sm:p-6 border-t lg:border-t-0 lg:border-l">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm">{t("smartEligibility")}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${
                      eligSelected.status === "eligible"
                        ? "bg-emerald-600 text-white"
                        : eligSelected.status === "partial"
                        ? "bg-amber-400 text-emerald-950"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {eligSelected.score}% •{" "}
                    {eligSelected.status === "eligible"
                      ? "Eligible"
                      : eligSelected.status === "partial"
                      ? "More Info"
                      : "Not Matched"}
                  </span>
                </div>
                <div className="h-3 bg-white rounded-full mt-3 overflow-hidden border">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all"
                    style={{ width: eligSelected.score + "%" }}
                  />
                </div>
                <div className="space-y-2 mt-4">
                  {eligSelected.reasons.map((r, i) => (
                    <div
                      key={i}
                      className={`flex gap-2 text-[13px] p-2.5 rounded-xl border ${
                        r.ok ? "bg-white border-emerald-100" : "bg-red-50 border-red-100"
                      }`}
                    >
                      {r.ok ? (
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      ) : (
                        <X size={16} className="text-red-500 shrink-0" />
                      )}
                      <span>{r.text}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl border p-3 mt-4">
                  <p className="font-black text-xs text-emerald-800">➡️ {t("nextAction")}</p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">{eligSelected.next}</p>
                </div>

                {/* Instant profile tweak */}
                <div className="bg-white rounded-2xl border p-3.5 sm:p-4 mt-4">
                  <p className="font-black text-sm">{t("tweakProfileNotice")}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs font-bold">
                    <label>
                      {t("ageLabel")}
                      <input
                        type="number"
                        value={profile.age}
                        onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                        className="w-full border rounded-xl p-2.5 mt-1 text-base sm:text-sm min-h-[42px]"
                      />
                    </label>
                    <label>
                      {t("incomeLabel")}
                      <input
                        type="number"
                        value={profile.income}
                        onChange={(e) => setProfile({ ...profile, income: Number(e.target.value) })}
                        className="w-full border rounded-xl p-2.5 mt-1 text-base sm:text-sm min-h-[42px]"
                      />
                    </label>
                    <label>
                      {t("occupationLabel")}
                      <select
                        value={profile.occupation}
                        onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                        className="w-full border rounded-xl p-2.5 mt-1 bg-white text-base sm:text-sm min-h-[42px]"
                      >
                        <option>Farmer</option>
                        <option>Student</option>
                        <option>Daily Wage Worker</option>
                        <option>Self-Employed</option>
                        <option>Unemployed</option>
                        <option>Retired / Pensioner</option>
                      </select>
                    </label>
                    <label>
                      {t("genderLabel")}
                      <select
                        value={profile.gender}
                        onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                        className="w-full border rounded-xl p-2.5 mt-1 bg-white text-base sm:text-sm min-h-[42px]"
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </label>
                  </div>
                </div>

                {/* Document Checklist */}
                <div className="mt-5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black flex items-center gap-2 text-sm sm:text-base">
                      <ListChecks size={18} /> {t("documentChecklist")}
                    </h3>
                    <span className="text-xs font-black bg-emerald-700 text-white px-2 py-1 rounded-full">
                      {(checkedDocs[selected.id] || []).length}/{selected.documents.length}
                    </span>
                  </div>
                  <div className="space-y-2 mt-3">
                    {selected.documents.map((d) => {
                      const has = (checkedDocs[selected.id] || []).includes(d);
                      return (
                        <button
                          key={d}
                          onClick={() => toggleDoc(selected.id, d)}
                          className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition min-h-[44px] ${
                            has ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" : "bg-white hover:border-emerald-400"
                          }`}
                        >
                          {has ? <CheckCircle2 size={18} className="shrink-0" /> : <Circle size={18} className="text-slate-300 shrink-0" />}
                          <span className="flex-1">{d}</span>
                          <span className="text-[10px] font-black shrink-0">{has ? t("haveIt") : t("missing")}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => {
                      if (!saved.includes(selected.id)) toggleSave(selected.id);
                      setView("journey");
                    }}
                    className="w-full mt-3 bg-emerald-950 hover:bg-emerald-900 text-white font-black py-3 rounded-full transition shadow min-h-[44px]"
                  >
                    {t("saveTrackJourneyBtn")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          VIEW: ASK GRAMAI (OPENROUTER AI + SARVAM VOICE)
      ======================================================== */}
      {view === "ask" && (
        <main className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
          <p className="text-emerald-700 font-black text-xs tracking-widest">{t("askHeaderBadge")}</p>
          <h1 className="font-black text-2xl sm:text-3xl mt-1">{t("askHeaderTitle")}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t("askHeaderSub")}</p>

          {/* Preset Questions in Active Language */}
          <div className="flex flex-wrap gap-2 mt-4">
            {(lang === "te"
              ? [
                  "రైతు భరోసా పథకానికి ఏ పత్రాలు కావాలి?",
                  "పీఎం కిసాన్ ఈ-కేవైసీ ఎలా చేసుకోవాలి?",
                  "ఆయుష్మాన్ భారత్ హెల్త్ కార్డు ఎలా పొందాలి?",
                  "నా వయస్సు 60 సం. నాకు ఏ పెన్షన్ వస్తుంది?",
                  "మహిళా స్వయం సహాయక సంఘాల రుణాల పథకాలు ఏమిటి?",
                ]
              : lang === "hi"
              ? [
                  "पीएम किसान सम्मान निधि के लिए क्या पात्रता है?",
                  "आयुष्मान भारत 5 लाख का इलाज कार्ड कैसे बनेगा?",
                  "वृद्धावस्था पेंशन के लिए आवेदन कैसे करें?",
                  "बेटियों के लिए सुकन्या समृद्धि योजना के नियम क्या हैं?",
                  "पीएम आवास योजना ग्रामीण में पक्का मकान कैसे मिलेगा?",
                ]
              : [
                  "I am a farmer in Telangana. Which schemes should I explore?",
                  "What documents do I need for PM-KISAN?",
                  "Am I eligible for Ayushman Bharat 5 lakh hospital cover?",
                  "How to get Rythu Bharosa investment support?",
                  "List housing schemes for low income families.",
                ]
            ).map((q) => (
              <button
                key={q}
                onClick={() => sendChat(q)}
                className="bg-white border hover:border-emerald-500 rounded-full px-3.5 py-2 text-xs font-bold shadow-sm transition min-h-[36px] text-left"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Main Chat Box */}
          <div className="bg-white rounded-[24px] sm:rounded-[28px] border shadow-xl mt-4 overflow-hidden">
            {/* Header */}
            <div className="bg-emerald-950 text-white px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 grid place-items-center text-emerald-950 shrink-0">
                  <Sparkles size={18} />
                </span>
                <div className="min-w-0">
                  <p className="font-black text-sm truncate">GramAI Conversational Agent</p>
                  <p className="text-[10px] sm:text-[11px] text-emerald-300 truncate">
                    ● {aiMode === "openrouter-live" ? "Live OpenRouter Brain" : "Grounded Engine"} • {profile.name} (
                    {profile.occupation}, {profile.state}) •{" "}
                    {lang === "te" ? "తెలుగు" : lang === "hi" ? "हिन्दी" : "English"}
                  </p>
                </div>
              </div>

              {/* Voice recording button */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2 rounded-full transition flex items-center gap-1.5 text-xs font-bold px-3 shrink-0 min-h-[40px] ${
                  isRecording ? "bg-red-500 text-white animate-pulse" : "bg-white/15 hover:bg-white/25 text-white"
                }`}
                title={isRecording ? t("recordingStopBtn") : t("recordingMicBtn")}
                aria-label={isRecording ? "Stop voice recording" : "Start voice recording with Sarvam AI"}
              >
                {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                <span className="hidden sm:inline">{isRecording ? `${recordingSeconds}s • Stop` : "Sarvam Mic"}</span>
                <span className="sm:hidden">{isRecording ? `${recordingSeconds}s` : "Mic"}</span>
              </button>
            </div>

            {/* Transcription Progress Indicator */}
            {isTranscribing && (
              <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 text-xs font-bold text-amber-900 flex items-center gap-2 animate-pulse">
                <Sparkles size={14} className="text-amber-700 shrink-0" />
                <span>Transcribing Indian speech via Sarvam AI API ({lang.toUpperCase()})…</span>
              </div>
            )}

            {/* Recognized Transcript Confirmation Banner */}
            {recognizedTranscript && (
              <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-emerald-900 font-medium">
                  <b>{t("transcriptNotice")}</b> &ldquo;{recognizedTranscript}&rdquo;
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => sendChat(recognizedTranscript)}
                    className="bg-emerald-700 text-white font-bold px-3 py-1 rounded-full text-xs shadow min-h-[32px]"
                  >
                    {t("confirmSendAudio")}
                  </button>
                  <button
                    onClick={() => setRecognizedTranscript("")}
                    className="text-slate-500 hover:text-slate-800 p-1 min-h-[32px] min-w-[32px] grid place-items-center"
                    aria-label="Clear transcript"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Message Thread */}
            <div className="h-[360px] sm:h-[430px] overflow-y-auto p-3 sm:p-4 space-y-3.5 bg-[#f7faf5]">
              {chat.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[90%] sm:max-w-[85%] p-3.5 sm:p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-emerald-700 text-white rounded-br-md shadow"
                        : "bg-white border shadow-sm rounded-bl-md text-slate-800"
                    }`}
                  >
                    {m.text}
                    {m.role === "ai" && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {m.mode === "openrouter-live" ? "OpenRouter AI" : "Verified Rules"}
                        </span>
                        <button
                          onClick={() => speakResponse(m.text, i)}
                          className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-full transition min-h-[36px]"
                          title="Listen with Sarvam TTS"
                        >
                          {isPlayingAudio === i ? (
                            <>
                              <VolumeX size={13} className="text-red-500" />
                              <span className="text-red-600">Stop Voice</span>
                            </>
                          ) : (
                            <>
                              <Volume2 size={13} className="text-emerald-700" />
                              <span>Listen (Sarvam TTS)</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="bg-white border rounded-3xl rounded-bl-md p-3.5 sm:p-4 text-xs sm:text-sm w-fit animate-pulse text-slate-700 shadow-sm flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-600 animate-spin" />
                  <span>GramAI is analyzing verified government guidelines…</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-2 sm:p-3 border-t flex gap-2 bg-white">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder={t("chatPlaceholder")}
                className="flex-1 min-w-0 bg-slate-100 rounded-full px-4 outline-none text-base sm:text-sm border focus:border-emerald-600 min-h-[44px]"
              />
              <button
                onClick={() => sendChat()}
                aria-label="Send message"
                className="bg-emerald-700 hover:bg-emerald-800 text-white w-11 h-11 min-w-[44px] min-h-[44px] rounded-full grid place-items-center shrink-0 shadow transition"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

          {/* Reference Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            {SCHEMES.slice(0, 3).map((s) => (
              <div key={s.id} className="bg-white border rounded-2xl p-3 text-xs shadow-sm">
                <p className="font-black flex items-center gap-1 text-emerald-800">
                  <BadgeCheck size={13} className="text-emerald-600" /> {t("sourceReference")}
                </p>
                <p className="font-bold mt-1 text-slate-900">{getSchemeName(s, lang)}</p>
                <a href={s.source} target="_blank" rel="noreferrer" className="text-teal-700 break-all hover:underline block mt-1">
                  {s.source}
                </a>
                <p className="text-slate-400 mt-1">
                  {s.verified ? "Verified government portal" : "Guideline reference"}
                </p>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ========================================================
          VIEW: DOCUMENT INTELLIGENCE & OCR
      ======================================================== */}
      {view === "documents" && (
        <main className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
          <p className="text-emerald-700 font-black text-xs tracking-widest">{t("docIntelBadge")}</p>
          <h1 className="font-black text-2xl sm:text-3xl mt-1">{t("docIntelHeaderTitle")}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t("docIntelHeaderSub")}</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mt-5">
            <div className="space-y-4">
              <div className="bg-white rounded-[24px] sm:rounded-[28px] border-2 border-dashed border-emerald-300 p-4 sm:p-6 text-center shadow">
                <Upload size={38} className="mx-auto text-emerald-600" />
                <p className="font-black mt-2 text-base">{t("dropzoneTitle")}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t("dropzoneSub")}</p>
                <label className="inline-flex items-center justify-center mt-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black px-6 py-3 rounded-full cursor-pointer text-sm shadow transition w-full sm:w-auto min-h-[44px]">
                  {t("chooseFileBtn")}
                  <input
                    type="file"
                    accept=".pdf,.txt,.png,.jpg,.jpeg,.webp"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setDocFileName(f.name);
                        processDoc(false, f);
                      }
                    }}
                  />
                </label>
                {docFileName && <p className="text-xs font-bold mt-2 text-emerald-800">📄 {docFileName}</p>}

                <div className="mt-5 border-t pt-4">
                  <p className="text-xs font-black text-slate-500">QUICK DEMO</p>
                  <button
                    onClick={() => processDoc(true)}
                    disabled={docLoading}
                    className="mt-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-5 py-3 rounded-full text-sm w-full shadow min-h-[44px]"
                  >
                    {docLoading ? t("extractingText") : `📄 ${t("useSampleBtn")}`}
                  </button>
                </div>
              </div>

              <div className="bg-emerald-950 text-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 shadow">
                <p className="font-black text-base">OCR & Intelligence Workflow</p>
                <ol className="text-xs sm:text-sm text-emerald-100/85 space-y-2 mt-3">
                  {[
                    "Reads PDFs, scanned documents or images using OCR & multimodal vision",
                    "Extracts scheme name, financial benefits, eligibility criteria & deadlines",
                    "Translates intelligence into simple language & generates document checklist",
                    `Compares requirements with ${profile.name}'s profile (${profile.occupation}, ${profile.state})`,
                  ].map((x, i) => (
                    <li key={x} className="flex gap-2 items-start">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 grid place-items-center text-[11px] font-black shrink-0 text-emerald-950 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{x}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div>
              {!docResult && !docLoading && (
                <div className="bg-white rounded-[24px] sm:rounded-[28px] border shadow p-6 sm:p-8 text-center h-full grid place-items-center min-h-[220px]">
                  <div>
                    <FileText size={42} className="mx-auto text-slate-300" />
                    <p className="font-black mt-3">Extracted summary will appear here</p>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                      Upload an official guideline or click &ldquo;Use Sample&rdquo; to test OCR extraction.
                    </p>
                  </div>
                </div>
              )}

              {docLoading && (
                <div className="bg-white rounded-[24px] sm:rounded-[28px] border shadow p-8 sm:p-10 text-center animate-pulse font-black text-emerald-900">
                  <Sparkles size={28} className="mx-auto text-emerald-600 animate-spin mb-3" />
                  {t("extractingText")}
                </div>
              )}

              {docResult && (
                <div className="space-y-4">
                  <div className="bg-white rounded-[24px] sm:rounded-[28px] border shadow p-4 sm:p-5">
                    <div className="flex gap-2 flex-wrap">
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-1 rounded-full">
                        ✓ {t("extractionDoneBadge")} • {docResult.charCount} chars
                      </span>
                      <span className="bg-slate-100 text-[11px] font-black px-2.5 py-1 rounded-full">
                        {docResult.engine}
                      </span>
                    </div>

                    <h3 className="font-black text-lg sm:text-xl mt-3 text-slate-900">{docResult.extracted.schemeName}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 bg-emerald-50 border border-emerald-100 rounded-2xl p-3">
                      {docResult.extracted.summary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm">
                      <div className="bg-slate-50 rounded-2xl p-3 border">
                        <p className="text-[11px] font-black text-slate-400">{t("benefitLabel")}</p>
                        <p className="font-bold mt-1 text-slate-900 text-xs sm:text-sm">{docResult.extracted.benefit}</p>
                      </div>
                      <div className="bg-amber-50 rounded-2xl p-3 border border-amber-100">
                        <p className="text-[11px] font-black text-amber-700">{t("deadlineLabel")}</p>
                        <p className="font-bold mt-1 text-slate-900 text-xs sm:text-sm">{docResult.extracted.deadline}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="font-black text-sm">{t("eligibilityFound")}</p>
                      <ul className="mt-2 space-y-1">
                        {docResult.extracted.eligibility.map((x: string) => (
                          <li key={x} className="flex gap-2 text-xs sm:text-sm text-slate-600">
                            <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span>{x}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 bg-teal-50 border border-teal-100 rounded-2xl p-3">
                      <p className="font-black text-xs sm:text-sm text-teal-900">
                        👤 {t("comparedWithProfile")} ({profile.name})
                      </p>
                      <p className="text-xs sm:text-sm text-teal-800 mt-1">
                        {docResult.extracted.profileComparison?.remarks ||
                          `You appear to match the criteria as a ${profile.occupation} in ${profile.state}.`}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-[24px] sm:rounded-[28px] border shadow p-4 sm:p-5">
                    <p className="font-black flex items-center gap-2 text-sm sm:text-base">
                      <ListChecks size={18} /> {t("actionableChecklistTitle")}
                    </p>
                    <div className="space-y-2 mt-3">
                      {docResult.extracted.documents.map((d: string) => {
                        const key = "rythu-bharosa";
                        const has = (checkedDocs[key] || []).includes(d);
                        return (
                          <button
                            key={d}
                            onClick={() => toggleDoc(key, d)}
                            className={`w-full flex gap-3 items-center p-3 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition min-h-[44px] ${
                              has ? "bg-emerald-600 text-white" : "bg-white hover:border-emerald-400"
                            }`}
                          >
                            {has ? <CheckCircle2 size={17} className="shrink-0" /> : <Circle size={17} className="text-slate-300 shrink-0" />}
                            <span className="flex-1">{d}</span>
                            <span className="text-[10px] font-black shrink-0">{has ? t("haveIt") : t("missing")}</span>
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setView("journey")}
                      className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-black py-3 rounded-full mt-4 transition shadow min-h-[44px]"
                    >
                      {t("trackInJourneyBtn")}
                    </button>
                  </div>

                  <details className="bg-white rounded-3xl border p-4 text-xs text-slate-500">
                    <summary className="font-black cursor-pointer text-slate-700">{t("viewRawText")}</summary>
                    <p className="mt-2 whitespace-pre-wrap font-mono text-[11px] bg-slate-50 p-3 rounded-xl border overflow-x-auto">
                      {docResult.rawPreview}
                    </p>
                  </details>
                </div>
              )}
            </div>
          </div>
        </main>
      )}


      {/* ========================================================
          VIEW: MY JOURNEY (APPLICATION READINESS)
      ======================================================== */}
      {view === "journey" && (
        <main className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
          <p className="text-emerald-700 font-black text-xs tracking-widest">{t("journeyBadge")}</p>
          <h1 className="font-black text-2xl sm:text-3xl mt-1">{t("journeyTitle")}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t("journeySub")}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mt-5">
            {[
              [translateStage("Discovered", lang), saved.length, "Saved in database"],
              [
                translateStage("Eligibility Checked", lang),
                journeyItems.filter((j) => j.e.score > 0).length,
                "Assessments complete",
              ],
              [
                translateStage("Documents Pending", lang),
                `${overallDocs.d}/${overallDocs.t}`,
                `${overallDocs.pct}% complete`,
              ],
              [
                translateStage("Ready for Official Application", lang),
                journeyItems.filter((j) => j.stage.includes("Ready")).length,
                "Ready for MeeSeva / CSC",
              ],
            ].map(([a, b, c]) => (
              <div key={a as string} className="bg-white rounded-2xl sm:rounded-3xl border shadow p-3.5 sm:p-4 text-center">
                <p className="font-black text-xl sm:text-2xl text-emerald-700">{b}</p>
                <p className="font-black text-xs sm:text-sm mt-1">{a}</p>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{c}</p>
              </div>
            ))}
          </div>

          <div className="h-3 bg-white border rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all"
              style={{ width: overallDocs.pct + "%" }}
            />
          </div>
          <p className="text-xs font-bold mt-1.5">
            {t("overallReadiness")} {overallDocs.pct}%
          </p>

          <div className="space-y-4 mt-6">
            {journeyItems.length === 0 && (
              <div className="bg-white rounded-3xl border p-6 sm:p-8 text-center shadow-sm">
                <p className="font-black text-base">{t("noSchemesSaved")}</p>
                <button
                  onClick={() => setView("schemes")}
                  className="mt-3 bg-emerald-700 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow min-h-[44px]"
                >
                  {t("findSchemesBtn")}
                </button>
              </div>
            )}

            {journeyItems.map(({ s, e, done, total, stage }) => {
              const stages = [
                "Discovered",
                "Eligibility Checked",
                "Documents Pending",
                "Ready for Official Application",
              ];
              const idx = stages.indexOf(stage);

              return (
                <div key={s.id} className="bg-white rounded-[24px] sm:rounded-[28px] border shadow p-4 sm:p-5">
                  <div className="flex flex-wrap gap-2.5 sm:gap-3 items-start">
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-black text-base leading-tight">{getSchemeName(s, lang)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{s.benefit}</p>
                      <p className="text-xs mt-1">
                        <span className="font-black text-emerald-700">
                          {e.score}% {t("matchLabel")}
                        </span>{" "}
                        • {done}/{total} documents ready
                      </p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-black px-3 py-1.5 rounded-full shrink-0">
                      {translateStage(stage, lang)}
                    </span>
                    <button
                      onClick={() => {
                        setFormPrepScheme(s);
                        setFormSavedStatus(false);
                      }}
                      className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs px-3.5 py-2 rounded-full shadow min-h-[38px]"
                    >
                      {t("formPrepTitle")}
                    </button>
                    <button
                      onClick={() => openScheme(s)}
                      className="border font-bold text-xs px-3.5 py-2 rounded-full hover:bg-slate-50 min-h-[38px]"
                    >
                      {t("continueBtn")}
                    </button>
                  </div>

                  {/* Stage Progress Tracker - scrollable containment on small mobile */}
                  <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none mt-4">
                    <div className="flex items-center min-w-[310px]">
                      {stages.map((st, i) => (
                        <div key={st} className="flex items-center flex-1 last:flex-none">
                          <div className="flex flex-col items-center">
                            <span
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full grid place-items-center text-xs font-black transition ${
                                i <= idx ? "bg-emerald-700 text-white" : "bg-slate-200 text-slate-500"
                              }`}
                            >
                              {i <= idx ? "✓" : i + 1}
                            </span>
                            <span className="text-[9px] font-bold mt-1 text-center w-14 sm:w-16 leading-tight">
                              {translateStage(st, lang)}
                            </span>
                          </div>
                          {i < 3 && (
                            <div
                              className={`h-1 flex-1 mx-1 rounded ${i < idx ? "bg-emerald-600" : "bg-slate-200"}`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs bg-amber-50 border border-amber-100 rounded-xl p-2.5 mt-3">
                    ➡️ <b>{t("nextAction")}:</b>{" "}
                    {done < total
                      ? `Arrange missing documents: ${s.documents
                          .filter((d: string) => !(checkedDocs[s.id] || []).includes(d))
                          .join(", ")}`
                      : `All documents verified! Carry your application package to MeeSeva / CSC or visit ${s.source}`}
                  </p>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* ========================================================
          VIEW: PANCHAYAT SERVICES
      ======================================================== */}
      {view === "services" && (
        <main className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
          <p className="text-emerald-700 font-black text-xs tracking-widest">{t("servicesBadge")}</p>
          <h1 className="font-black text-2xl sm:text-3xl mt-1">{t("servicesTitle")}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t("servicesSub")}</p>

          <div className="flex bg-white border shadow rounded-full px-4 py-1 mt-4 items-center max-w-xl min-h-[44px]">
            <Search size={17} className="text-slate-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchServicesPlaceholder")}
              className="flex-1 outline-none p-2.5 text-base sm:text-sm bg-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {SERVICES.filter((s) => (s.name + s.dept + s.steps).toLowerCase().includes(query.toLowerCase())).map(
              (s) => (
                <div key={s.id} className="bg-white rounded-[24px] border shadow p-4 sm:p-5">
                  <div className="flex gap-3">
                    <span className="text-3xl shrink-0">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex gap-2 flex-wrap items-center">
                        <p className="font-black text-base">{s.name}</p>
                        {s.verified ? (
                          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                            {t("verifiedBadge")}
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                            {t("unverifiedBadge")}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {s.dept} • ⏱ {s.time} • Fee: {s.fee}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-3 bg-slate-50 rounded-2xl p-3">{s.steps}</p>
                  <p className="text-xs font-bold mt-3 flex items-center gap-1 text-slate-700">
                    <Phone size={12} className="shrink-0" /> <span>{s.contact}</span>
                  </p>
                </div>
              )
            )}
          </div>

          <div className="bg-emerald-950 text-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-xl">
            <div>
              <p className="font-black text-base sm:text-lg">Gram Panchayat Office — {profile.village}</p>
              <p className="text-emerald-200 text-xs sm:text-sm mt-0.5">
                Panchayat Secretary • Mon–Sat 10AM–5PM • Main Road, {profile.village}, {profile.district}
              </p>
            </div>
            <button
              onClick={() => setView("complaints")}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-5 py-3 rounded-full shadow text-sm w-full sm:w-auto min-h-[44px]"
            >
              {t("fileComplaintBtn")}
            </button>
          </div>
        </main>
      )}

      {/* ========================================================
          VIEW: COMPLAINTS (PERSISTED IN NEON DB)
      ======================================================== */}
      {view === "complaints" && (
        <main className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
          <p className="text-emerald-700 font-black text-xs tracking-widest">{t("complaintsBadge")}</p>
          <h1 className="font-black text-2xl sm:text-3xl mt-1">{t("complaintsTitle")}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t("complaintsSub")}</p>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5 mt-5">
            <form onSubmit={submitComplaint} className="lg:col-span-2 bg-white rounded-[24px] sm:rounded-[28px] border shadow p-4 sm:p-5 h-fit">
              <p className="font-black text-base">📝 {t("newComplaintHeader")}</p>
              <label className="block text-xs font-black mt-4">
                {t("fullName").toUpperCase()}
                <input value={profile.name} readOnly className="w-full border rounded-xl p-2.5 mt-1 bg-slate-50 text-base sm:text-sm min-h-[44px]" />
              </label>

              <label className="block text-xs font-black mt-3">
                {t("complaintCategory")}
                <select
                  value={cForm.category}
                  onChange={(e) => setCForm({ ...cForm, category: e.target.value })}
                  className="w-full border rounded-xl p-2.5 mt-1 bg-white text-base sm:text-sm min-h-[44px]"
                >
                  <option value="Water Supply">Water Supply (తాగునీరు / जल आपूर्ति)</option>
                  <option value="Street Lights">Street Lights (వీధి దీపాలు / स्ट्रीट लाइट)</option>
                  <option value="Road & Drainage">Road & Drainage (రహదారులు / सड़क एवं नाली)</option>
                  <option value="Sanitation & Garbage">Sanitation & Garbage (పారిశుధ్యం / स्वच्छता)</option>
                  <option value="Electricity">Electricity (విద్యుత్ / बिजली)</option>
                  <option value="Other">Other (ఇతర / अन्य)</option>
                </select>
              </label>

              <label className="block text-xs font-black mt-3">
                {t("villageLabel")}
                <input
                  value={cForm.village}
                  onChange={(e) => setCForm({ ...cForm, village: e.target.value })}
                  className="w-full border rounded-xl p-2.5 mt-1 text-base sm:text-sm min-h-[44px]"
                />
              </label>

              <label className="block text-xs font-black mt-3">
                {t("describeIssue")}
                <textarea
                  required
                  value={cForm.description}
                  onChange={(e) => setCForm({ ...cForm, description: e.target.value })}
                  rows={4}
                  placeholder={t("describeIssuePlaceholder")}
                  className="w-full border rounded-xl p-2.5 mt-1 text-base sm:text-sm"
                />
              </label>

              <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-full mt-4 shadow transition min-h-[44px] text-sm">
                {t("submitComplaintBtn")}
              </button>

              {lastRef && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 mt-3 text-center">
                  <p className="text-xs font-black text-emerald-700">✓ REGISTERED IN DATABASE</p>
                  <p className="font-black text-xl tracking-wider text-emerald-950 mt-0.5">{lastRef}</p>
                </div>
              )}

              <div className="border-t mt-5 pt-4">
                <p className="font-black text-sm">🔍 {t("trackByRef")}</p>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <input
                    value={trackRef}
                    onChange={(e) => setTrackRef(e.target.value)}
                    placeholder={t("trackRefPlaceholder")}
                    className="flex-1 border rounded-full px-3 text-base sm:text-sm uppercase min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setToast(
                        tracked
                          ? `Found: ${tracked.ref} — ${translateStatus(tracked.status, lang)}`
                          : "No complaint found with that reference."
                      )
                    }
                    className="bg-emerald-950 hover:bg-emerald-900 text-white px-5 rounded-full font-bold text-sm min-h-[44px]"
                  >
                    {t("trackBtn")}
                  </button>
                </div>

                {tracked && (
                  <div className="mt-3 bg-slate-50 rounded-2xl p-3 text-sm border">
                    <div className="flex justify-between items-center">
                      <span className="font-black">{tracked.ref}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                          STATUS_COLOR[tracked.status] || "bg-slate-200"
                        }`}
                      >
                        {translateStatus(tracked.status, lang)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-700">{tracked.description}</p>
                    {tracked.response && (
                      <p className="mt-2 bg-white border rounded-xl p-2 text-xs">
                        💬 <b>{t("panchayatResponse")}</b> {tracked.response}
                      </p>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 mt-3">
                      {["Submitted", "Under Review", "In Progress", "Resolved"].map((st, i) => {
                        const order = ["Submitted", "Under Review", "In Progress", "Resolved"];
                        const active = order.indexOf(tracked.status) >= i;
                        return (
                          <span
                            key={st}
                            className={`text-center text-[9px] font-black py-1.5 rounded-full truncate px-1 ${
                              active ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
                            }`}
                          >
                            {translateStatus(st, lang)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </form>

            {/* Complaints Feed */}
            <div className="lg:col-span-3 space-y-3">
              <p className="font-black text-base">{t("complaintHistory")}</p>
              {complaints.length === 0 && (
                <div className="bg-white rounded-3xl border p-6 text-center text-sm">
                  Loading complaints from database…
                </div>
              )}
              {complaints.map((c) => (
                <div key={c.id || c.ref} className="bg-white rounded-[20px] sm:rounded-[24px] border shadow p-3.5 sm:p-4">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="font-black text-sm">{c.ref}</span>
                    <span className="bg-slate-100 text-[11px] font-black px-2 py-0.5 rounded-full">
                      {c.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                        STATUS_COLOR[c.status] || "bg-slate-100"
                      }`}
                    >
                      {translateStatus(c.status, lang)}
                    </span>
                    <span className="ml-auto text-[11px] text-slate-400">
                      {c.village} • {c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN") : "Today"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm mt-2 text-slate-800 leading-relaxed">{c.description}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Submitted by {c.citizenName} {c.isDemo ? "(Sample citizen)" : ""}
                  </p>
                  {c.response && (
                    <p className="text-xs bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 mt-2">
                      💬 <b>{t("panchayatResponse")}</b> {c.response}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          VIEW: DASHBOARD
      ======================================================== */}
      {view === "dashboard" && (
        <main className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end justify-between">
            <div>
              <p className="text-emerald-700 font-black text-xs tracking-widest">{t("dashboardBadge")}</p>
              <h1 className="font-black text-2xl sm:text-3xl mt-1">
                {t("namaste")}, {profile.name} 🙏
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {profile.occupation} • {profile.village}, {profile.district}, {profile.state} • {t("ageLabel")}{" "}
                {profile.age} • ₹{Number(profile.income).toLocaleString("en-IN")}/yr • {profile.category} •{" "}
                {profile.land}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={() => setView("profile")}
                className="flex-1 sm:flex-initial text-center border bg-white font-bold px-4 py-2 rounded-full text-xs sm:text-sm hover:bg-slate-50 shadow-sm min-h-[40px]"
              >
                {t("editProfileBtn")}
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 sm:flex-initial justify-center bg-white border font-bold px-4 py-2 rounded-full text-xs sm:text-sm flex gap-1.5 items-center hover:bg-slate-50 shadow-sm min-h-[40px]"
              >
                <Printer size={14} /> {t("printSummaryBtn")}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mt-5">
            {[
              [`${topRecs.length} ${t("schemesLabel")}`, t("recommendedFor"), TrendingUp],
              [`${saved.length} saved`, t("journeyTitle"), Heart],
              [`${overallDocs.pct}%`, t("overallReadiness"), FileCheck],
              [`${complaints.length}`, t("statComplaints"), Wrench],
            ].map(([a, b, I]: any) => (
              <div key={b} className="bg-white rounded-2xl sm:rounded-3xl border shadow p-3.5 sm:p-4">
                <I className="text-emerald-600" size={22} />
                <p className="font-black text-lg sm:text-xl mt-2">{a}</p>
                <p className="text-[10px] sm:text-xs text-slate-500 font-bold">{b}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mt-5">
            <div className="lg:col-span-2 space-y-4 sm:space-y-5">
              <div className="bg-white rounded-[24px] sm:rounded-[28px] border shadow p-4 sm:p-5">
                <div className="flex justify-between items-center">
                  <p className="font-black text-base">⭐ {t("personalizedRecs")}</p>
                  <button
                    onClick={() => setView("schemes")}
                    className="text-emerald-700 font-black text-xs hover:underline"
                  >
                    {t("viewAllSchemes")}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  {topRecs.slice(0, 4).map(({ s, e }) => (
                    <SchemeCard
                      key={s.id}
                      s={s}
                      score={e.score}
                      saved={saved.includes(s.id)}
                      lang={lang}
                      onOpen={() => openScheme(s)}
                      onSave={() => toggleSave(s.id)}
                      onPrepareForm={() => {
                        setFormPrepScheme(s);
                        setFormSavedStatus(false);
                      }}
                      compact
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[24px] sm:rounded-[28px] border shadow p-4 sm:p-5">
                <p className="font-black text-base">🧭 {t("appPrepStatus")}</p>
                {journeyItems.length === 0 ? (
                  <p className="text-sm text-slate-500 mt-2">Save a scheme to start tracking your journey.</p>
                ) : (
                  journeyItems.map(({ s, e, done, total, stage }) => (
                    <div key={s.id} className="flex flex-col sm:flex-row gap-3 sm:items-center border rounded-2xl p-3 mt-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{getSchemeName(s, lang)}</p>
                        <p className="text-xs text-slate-500">
                          {translateStage(stage, lang)} • {done}/{total} docs • {e.score}% match
                        </p>
                        <div className="h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 transition-all"
                            style={{ width: (total ? (done / total) * 100 : 0) + "%" }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => openScheme(s)}
                        className="bg-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-full shrink-0 shadow min-h-[38px] text-center"
                      >
                        {t("continueBtn")}
                      </button>
                    </div>
                  ))
                )}
                <button
                  onClick={() => setView("journey")}
                  className="text-emerald-700 font-black text-xs sm:text-sm mt-3 hover:underline block"
                >
                  Open full Journey Tracker →
                </button>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div className="bg-emerald-950 text-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 shadow">
                <p className="font-black text-base">🤖 {t("navAsk")}</p>
                <p className="text-emerald-200 text-xs sm:text-sm mt-1">
                  &ldquo;What documents do I need for {getSchemeName(selected, lang)}?&rdquo;
                </p>
                <button
                  onClick={() => setView("ask")}
                  className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black w-full py-3 rounded-full mt-4 text-xs sm:text-sm shadow min-h-[44px]"
                >
                  Ask GramAI in EN / తెలుగు / हिन्दी
                </button>
                <button
                  onClick={() => setView("documents")}
                  className="bg-white/15 hover:bg-white/25 font-black w-full py-3 rounded-full mt-2 text-xs sm:text-sm transition min-h-[44px]"
                >
                  📄 Analyze Guideline with OCR
                </button>
              </div>

              <div className="bg-white rounded-[24px] sm:rounded-[28px] border shadow p-4 sm:p-5">
                <p className="font-black text-base">📋 {t("recentComplaints")}</p>
                {complaints.slice(0, 3).map((c) => (
                  <div key={c.ref} className="border rounded-2xl p-3 mt-3">
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-black">{c.ref}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-black text-[10px] sm:text-xs ${
                          STATUS_COLOR[c.status] || "bg-slate-200"
                        }`}
                      >
                        {translateStatus(c.status, lang)}
                      </span>
                    </div>
                    <p className="text-xs mt-1.5 line-clamp-2 text-slate-700">{c.description}</p>
                  </div>
                ))}
                <button
                  onClick={() => setView("complaints")}
                  className="text-emerald-700 font-black text-xs sm:text-sm mt-3 hover:underline block"
                >
                  Track / File complaint →
                </button>
              </div>

              <div className="bg-white rounded-[24px] sm:rounded-[28px] border shadow p-4 sm:p-5">
                <p className="font-black text-base">✅ {t("eligibilitySnapshot")}</p>
                {recommendations.slice(0, 4).map(({ s, e }) => (
                  <div key={s.id} className="flex justify-between text-xs sm:text-sm mt-2.5">
                    <span className="truncate mr-2 font-medium">{getSchemeName(s, lang)}</span>
                    <span
                      className={`font-black shrink-0 ${
                        e.score >= 80 ? "text-emerald-600" : e.score >= 50 ? "text-amber-600" : "text-red-500"
                      }`}
                    >
                      {e.score}%
                    </span>
                  </div>
                ))}
                <p className="text-[11px] text-slate-400 mt-3">{t("rankingSub")}</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          VIEW: ADMIN (PANCHAYAT OFFICER)
      ======================================================== */}
      {view === "admin" && (
        <main className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          {role !== "admin" ? (
            <div className="bg-white rounded-[24px] sm:rounded-[28px] border shadow p-6 sm:p-10 text-center max-w-lg mx-auto">
              <ShieldCheck size={40} className="mx-auto text-emerald-600" />
              <p className="font-black text-xl mt-3">{t("adminBadge")}</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter as Gram Panchayat Officer to manage verified schemes and village complaints.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-5">
                <a
                  href="/login"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-6 py-3 rounded-full shadow text-sm transition min-h-[44px] flex items-center justify-center"
                >
                  🔐 Log in as Officer
                </a>
                <button
                  onClick={() => setRole("admin")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-full text-sm transition min-h-[44px]"
                >
                  Enter Demo Mode
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-emerald-700 font-black text-xs tracking-widest">{t("adminBadge")}</p>
              <h1 className="font-black text-2xl sm:text-3xl mt-1">{t("adminTitle")}</h1>
              <p className="text-xs sm:text-sm text-slate-500">{t("adminSub")}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mt-5">
                {[
                  [SCHEMES.length, t("schemesManaged")],
                  [complaints.length, t("totalComplaints")],
                  [complaints.filter((c) => c.status !== "Resolved").length, t("openPending")],
                  [complaints.filter((c) => c.status === "Resolved").length, t("resolvedComplaints")],
                ].map(([a, b]) => (
                  <div key={b} className="bg-white rounded-2xl sm:rounded-3xl border shadow p-3.5 sm:p-4 text-center">
                    <p className="font-black text-2xl sm:text-3xl text-emerald-700">{a}</p>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-500 mt-1">{b}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                {[
                  ["complaints", t("tabComplaints")],
                  ["schemes", t("tabSchemes")],
                  ["stats", t("tabStats")],
                ].map(([k, l]) => (
                  <button
                    key={k}
                    onClick={() => setAdminTab(k)}
                    className={`px-4 py-2 rounded-full font-black text-xs sm:text-sm transition min-h-[40px] ${
                      adminTab === k ? "bg-emerald-700 text-white" : "bg-white border hover:bg-slate-50"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {adminTab === "complaints" && (
                <div className="space-y-3 mt-4">
                  {complaints.map((c) => (
                    <AdminComplaint key={c.ref} c={c} lang={lang} onUpdate={adminUpdate} />
                  ))}
                </div>
              )}

              {adminTab === "schemes" && (
                <div className="bg-white rounded-[24px] sm:rounded-[28px] border shadow overflow-x-auto mt-4">
                  <table className="w-full text-sm min-w-[640px]">
                    <thead>
                      <tr className="text-left bg-emerald-50 text-xs">
                        <th className="p-3">Scheme</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Level</th>
                        <th className="p-3">Source</th>
                        <th className="p-3">Verification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SCHEMES.map((s) => (
                        <tr key={s.id} className="border-t">
                          <td className="p-3 font-bold">{getSchemeName(s, lang)}</td>
                          <td className="p-3">{translateCategory(s.category, lang)}</td>
                          <td className="p-3">{s.level}</td>
                          <td className="p-3 text-teal-700 text-xs break-all max-w-[180px]">{s.source}</td>
                          <td className="p-3">
                            <button
                              onClick={() => setVerifiedMap((m) => ({ ...m, [s.id]: !m[s.id] }))}
                              className={`px-3 py-1.5 rounded-full text-xs font-black min-h-[32px] ${
                                verifiedMap[s.id] ? "bg-emerald-600 text-white" : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {verifiedMap[s.id] ? `✓ ${t("verifiedBadge")}` : t("unverifiedBadge")}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {adminTab === "stats" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {[
                    ["Scheme Discovery", "Most viewed: PM-KISAN, Rythu Bharosa, PMAY-G Housing", "Neon Postgres sync active"],
                    [
                      "Eligibility Matches",
                      `${recommendations.filter((r) => r.e.score >= 80).length} citizens with 80%+ match rate`,
                      "Calculated from citizen profile parameters",
                    ],
                    [
                      "Grievance Redressal",
                      `${
                        complaints.length
                          ? Math.round((complaints.filter((c) => c.status === "Resolved").length / complaints.length) * 100)
                          : 0
                      }% resolved across registered complaints`,
                      "Gram Panchayat tracking active",
                    ],
                  ].map(([a, b, c]) => (
                    <div key={a} className="bg-white rounded-3xl border shadow p-4 sm:p-5">
                      <p className="font-black text-base">{a}</p>
                      <p className="text-sm text-slate-600 mt-2">{b}</p>
                      <p className="text-xs text-emerald-700 font-bold mt-2">{c}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      )}

      {/* ========================================================
          VIEW: PROFILE
      ======================================================== */}
      {view === "profile" && (
        <main className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <p className="text-emerald-700 font-black text-xs tracking-widest">{t("profileBadge")}</p>
          <h1 className="font-black text-2xl sm:text-3xl mt-1">{t("profileTitle")}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t("profileSub")}</p>

          <div className="bg-white rounded-[24px] sm:rounded-[28px] border shadow p-4 sm:p-6 mt-5">
            <div className="flex gap-2 flex-wrap mb-4 sm:mb-5">
              {DEMO_PROFILES.map((p) => (
                <button
                  key={p.label}
                  onClick={() => tryDemo(p)}
                  className="bg-emerald-50 border hover:border-emerald-500 rounded-full px-3 py-2 text-xs font-black transition min-h-[36px]"
                >
                  {p.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setProfile(DEMO_PROFILE);
                  setIsDemo(false);
                }}
                className="bg-slate-100 hover:bg-slate-200 rounded-full px-3 py-2 text-xs font-black flex gap-1 items-center transition min-h-[36px]"
              >
                <RotateCcw size={12} /> {t("resetProfileBtn")}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm font-bold">
              <label>
                {t("fullName")}
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full border rounded-2xl p-3 mt-1 font-normal text-base sm:text-sm min-h-[44px]"
                />
              </label>
              <label>
                {t("mobilePhone")}
                <input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full border rounded-2xl p-3 mt-1 font-normal text-base sm:text-sm min-h-[44px]"
                />
              </label>
              <label>
                {t("stateField")}
                <select
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="w-full border rounded-2xl p-3 mt-1 bg-white font-normal text-base sm:text-sm min-h-[44px]"
                >
                  <option>Telangana</option>
                  <option>Andhra Pradesh</option>
                  <option>Karnataka</option>
                  <option>Maharashtra</option>
                  <option>Uttar Pradesh</option>
                </select>
              </label>
              <label>
                {t("districtField")}
                <input
                  value={profile.district}
                  onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                  className="w-full border rounded-2xl p-3 mt-1 font-normal text-base sm:text-sm min-h-[44px]"
                />
              </label>
              <label>
                {t("villageField")}
                <input
                  value={profile.village}
                  onChange={(e) => setProfile({ ...profile, village: e.target.value })}
                  className="w-full border rounded-2xl p-3 mt-1 font-normal text-base sm:text-sm min-h-[44px]"
                />
              </label>
              <label>
                {t("occupationField")}
                <select
                  value={profile.occupation}
                  onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                  className="w-full border rounded-2xl p-3 mt-1 bg-white font-normal text-base sm:text-sm min-h-[44px]"
                >
                  <option>Farmer</option>
                  <option>Student</option>
                  <option>Daily Wage Worker</option>
                  <option>Self-Employed</option>
                  <option>Unemployed</option>
                  <option>Retired / Pensioner</option>
                </select>
              </label>
              <label>
                {t("ageField")}
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                  className="w-full border rounded-2xl p-3 mt-1 font-normal text-base sm:text-sm min-h-[44px]"
                />
              </label>
              <label>
                {t("genderField")}
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full border rounded-2xl p-3 mt-1 bg-white font-normal text-base sm:text-sm min-h-[44px]"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </label>
              <label>
                {t("incomeField")}
                <input
                  type="number"
                  value={profile.income}
                  onChange={(e) => setProfile({ ...profile, income: Number(e.target.value) })}
                  className="w-full border rounded-2xl p-3 mt-1 font-normal text-base sm:text-sm min-h-[44px]"
                />
              </label>
              <label>
                {t("categoryField")}
                <select
                  value={profile.category}
                  onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                  className="w-full border rounded-2xl p-3 mt-1 bg-white font-normal text-base sm:text-sm min-h-[44px]"
                >
                  <option>General</option>
                  <option>OBC</option>
                  <option>BC</option>
                  <option>SC</option>
                  <option>ST</option>
                  <option>EWS</option>
                </select>
              </label>
              <label className="md:col-span-2">
                {t("landField")}
                <input
                  value={profile.land}
                  onChange={(e) => setProfile({ ...profile, land: e.target.value })}
                  className="w-full border rounded-2xl p-3 mt-1 font-normal text-base sm:text-sm min-h-[44px]"
                />
              </label>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-6">
              <button
                onClick={() => {
                  setView("schemes");
                  setToast("Profile saved! Eligibility recalculated for all schemes.");
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-6 py-3 rounded-full shadow transition min-h-[44px] text-center"
              >
                {t("saveProfileBtn")}
              </button>
              <button
                onClick={() => setView("dashboard")}
                className="border font-black px-6 py-3 rounded-full hover:bg-slate-50 transition min-h-[44px] text-center"
              >
                {t("navDashboard")}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-4">{t("privacyNotice")}</p>
          </div>

          <div className="bg-white rounded-[24px] sm:rounded-[28px] border shadow p-4 sm:p-5 mt-5">
            <p className="font-black text-base">{t("eligibilitySnapshot")}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
              {recommendations.slice(0, 6).map(({ s, e }) => (
                <button
                  key={s.id}
                  onClick={() => openScheme(s)}
                  className="flex justify-between items-center border rounded-2xl p-3 text-sm text-left hover:border-emerald-500 transition min-h-[44px]"
                >
                  <span className="font-semibold truncate mr-2">{getSchemeName(s, lang)}</span>
                  <span
                    className={`font-black shrink-0 ${
                      e.score >= 80 ? "text-emerald-600" : e.score >= 50 ? "text-amber-600" : "text-red-500"
                    }`}
                  >
                    {e.score}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          MODAL: CONVERSATIONAL FORM PREPARATION WORKFLOW
      ======================================================== */}
      {formPrepScheme && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setFormPrepScheme(null);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-[24px] sm:rounded-[32px] max-w-2xl w-full p-4 sm:p-6 shadow-2xl border my-4 sm:my-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start border-b pb-3 sm:pb-4 gap-2">
              <div className="min-w-0">
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                  {t("formPrepTitle")}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1.5 truncate">
                  {getSchemeName(formPrepScheme, lang)}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{t("formPrepSub")}</p>
              </div>
              <button
                onClick={() => setFormPrepScheme(null)}
                className="bg-slate-100 hover:bg-slate-200 p-2 rounded-full text-slate-600 min-h-[40px] min-w-[40px] grid place-items-center shrink-0"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Stepper info */}
            <div className="py-4 space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-900 flex gap-2 items-start leading-relaxed">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  GramAI has pre-filled known details from your profile and extracted guidelines. Please review each
                  field carefully before saving.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-bold">
                <label>
                  {t("applicantName")}
                  <input
                    value={formFields.fullName}
                    onChange={(e) => setFormFields({ ...formFields, fullName: e.target.value })}
                    className="w-full border rounded-xl p-2.5 mt-1 font-normal text-base sm:text-sm min-h-[42px]"
                  />
                </label>
                <label>
                  {t("applicantPhone")}
                  <input
                    value={formFields.mobile}
                    onChange={(e) => setFormFields({ ...formFields, mobile: e.target.value })}
                    className="w-full border rounded-xl p-2.5 mt-1 font-normal text-base sm:text-sm min-h-[42px]"
                  />
                </label>
                <label>
                  {t("aadhaarLast4")}
                  <input
                    maxLength={4}
                    value={formFields.aadhaarLast4}
                    onChange={(e) => setFormFields({ ...formFields, aadhaarLast4: e.target.value })}
                    className="w-full border rounded-xl p-2.5 mt-1 font-normal text-base sm:text-sm min-h-[42px]"
                    placeholder="XXXX"
                  />
                </label>
                <label>
                  {t("bankAccountNo")}
                  <input
                    value={formFields.bankAccount}
                    onChange={(e) => setFormFields({ ...formFields, bankAccount: e.target.value })}
                    className="w-full border rounded-xl p-2.5 mt-1 font-normal text-base sm:text-sm min-h-[42px]"
                  />
                </label>
                <label>
                  {t("bankIfsc")}
                  <input
                    value={formFields.bankIfsc}
                    onChange={(e) => setFormFields({ ...formFields, bankIfsc: e.target.value })}
                    className="w-full border rounded-xl p-2.5 mt-1 font-normal text-base sm:text-sm min-h-[42px]"
                  />
                </label>
                <label>
                  {t("landSurveyNo")}
                  <input
                    value={formFields.landSurvey}
                    onChange={(e) => setFormFields({ ...formFields, landSurvey: e.target.value })}
                    className="w-full border rounded-xl p-2.5 mt-1 font-normal text-base sm:text-sm min-h-[42px]"
                  />
                </label>
              </div>

              {/* Document verification checklist */}
              <div className="border-t pt-4">
                <p className="font-black text-xs text-slate-800 uppercase tracking-wide">
                  {t("documentChecklist")}
                </p>
                <div className="space-y-1.5 mt-2">
                  {formPrepScheme.documents.map((d) => {
                    const has = (checkedDocs[formPrepScheme.id] || []).includes(d);
                    return (
                      <div
                        key={d}
                        onClick={() => toggleDoc(formPrepScheme.id, d)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer min-h-[42px] ${
                          has ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {has ? <Check size={14} className="text-emerald-700" /> : <Circle size={14} />}
                          <span>{d}</span>
                        </span>
                        <span className="font-bold text-[10px]">{has ? t("haveIt") : t("missing")}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explicit Confirmation Checkbox */}
              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={formFields.confirmed}
                  onChange={(e) => setFormFields({ ...formFields, confirmed: e.target.checked })}
                  className="mt-0.5 rounded text-emerald-700 w-4 h-4"
                />
                <span className="font-medium leading-relaxed">{t("confirmAccuracy")}</span>
              </label>

              {formSavedStatus && (
                <div className="bg-emerald-100 border border-emerald-300 rounded-2xl p-3 text-xs text-emerald-900 font-semibold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-800 shrink-0" />
                  <span>{t("applicationPreparedNotice")}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-3 border-t">
              <button
                onClick={savePreparedApplication}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-full text-sm shadow transition min-h-[44px]"
              >
                {t("saveApplicationDraft")}
              </button>
              <button
                onClick={() => window.print()}
                className="border font-black px-5 py-3 rounded-full text-sm hover:bg-slate-50 transition flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Printer size={15} /> {t("printSummaryBtn")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 mt-6 border-t">
        <div className="flex flex-col md:flex-row gap-4 justify-between text-sm">
          <div>
            <p className="font-black text-emerald-950 flex items-center gap-2">
              <Sprout className="text-emerald-700" /> {t("footerAboutTitle")}
            </p>
            <p className="text-slate-500 text-xs mt-1 max-w-md">{t("footerAboutText")}</p>
          </div>
          <div className="text-xs text-slate-500 space-y-1">
            <p className="font-black text-slate-700">Setup & Integrations</p>
            <p>{t("footerTechNotice")}</p>
            <p className="text-slate-400">
              API Keys: OPENROUTER_API_KEY (AI reasoning), SARVAM_API_KEY (STT/TTS), DATABASE_URL (Neon Postgres)
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Ask button on non-ask views */}
      {view !== "ask" && (
        <button
          onClick={() => setView("ask")}
          className="fixed bottom-5 right-5 z-40 bg-emerald-700 hover:bg-emerald-800 text-white font-black pl-4 pr-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2 transition hover:scale-105 min-h-[44px]"
          aria-label="Open GramAI Chatbot"
        >
          <MessageCircle size={20} /> {t("navAsk")}
        </button>
      )}
    </div>
  );
}

// Subcomponent: SchemeCard
function SchemeCard({
  s,
  score,
  saved,
  lang,
  onOpen,
  onSave,
  onPrepareForm,
  compact,
}: {
  s: Scheme;
  score: number;
  saved: boolean;
  lang: SupportedLang;
  onOpen: () => void;
  onSave: () => void;
  onPrepareForm?: () => void;
  compact?: boolean;
}) {
  const I = CAT_ICON[s.category] || Sparkles;
  const t = (k: string) => getTranslation(k, lang);

  return (
    <div className="bg-white rounded-[24px] border shadow hover:shadow-xl transition p-4 flex flex-col">
      <div className="flex items-start gap-3">
        <span className="w-11 h-11 rounded-2xl bg-emerald-100 grid place-items-center shrink-0">
          <I size={21} className="text-emerald-700" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex gap-1.5 flex-wrap">
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full">
              {translateCategory(s.category, lang)}
            </span>
            <span className="bg-slate-100 text-[10px] font-black px-2 py-0.5 rounded-full">{s.level}</span>
            {s.verified ? (
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                ✓ {t("verifiedBadge")}
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                {t("unverifiedBadge")}
              </span>
            )}
          </div>
          <p className="font-black leading-tight mt-1.5 text-slate-900 text-sm sm:text-base">{getSchemeName(s, lang)}</p>
        </div>
        <button
          onClick={onSave}
          className={`text-xl leading-none transition p-1 min-w-[36px] min-h-[36px] grid place-items-center shrink-0 ${saved ? "text-red-500 scale-110" : "text-slate-300 hover:text-red-400"}`}
          title="Save scheme"
          aria-label={saved ? "Unsave scheme" : "Save scheme"}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>

      {!compact && <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{s.description}</p>}

      <p className="text-xs sm:text-[13px] font-bold text-emerald-800 bg-emerald-50 rounded-xl px-2.5 py-2 mt-3 flex gap-1.5 items-center">
        <IndianRupee size={15} className="shrink-0" />
        <span className="truncate">{s.benefit}</span>
      </p>

      <div className="flex items-center gap-2 mt-3">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all"
            style={{ width: score + "%" }}
          />
        </div>
        <span
          className={`text-xs font-black ${
            score >= 80 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-slate-500"
          }`}
        >
          {score}% {t("matchLabel")}
        </span>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap gap-2 mt-3">
        <button
          onClick={onOpen}
          className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black py-2.5 px-3 rounded-full text-xs transition shadow min-h-[40px] text-center"
        >
          {t("checkEligibilityBtn")}
        </button>
        {onPrepareForm && (
          <button
            onClick={onPrepareForm}
            className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3.5 py-2.5 rounded-full text-xs transition min-h-[40px]"
            title="Prepare Application Form"
          >
            Form
          </button>
        )}
        <button
          onClick={onSave}
          className="border font-black px-3.5 py-2.5 rounded-full text-xs hover:bg-slate-50 transition min-h-[40px]"
        >
          {saved ? t("savedSchemeBtn") : t("saveSchemeBtn")}
        </button>
      </div>
      <p className="text-[10px] text-slate-400 mt-2 truncate">
        ⏰ {s.deadline} • {s.documents.length} documents needed
      </p>
    </div>
  );
}

// Subcomponent: AdminComplaint
function AdminComplaint({
  c,
  lang,
  onUpdate,
}: {
  c: any;
  lang: SupportedLang;
  onUpdate: (ref: string, status: string, response: string) => void;
}) {
  const [status, setStatus] = useState(c.status);
  const [resp, setResp] = useState(c.response || "");

  useEffect(() => {
    setStatus(c.status);
    setResp(c.response || "");
  }, [c.status, c.response]);

  return (
    <div className="bg-white rounded-[20px] sm:rounded-[24px] border shadow p-3.5 sm:p-4">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="font-black text-sm">{c.ref}</span>
        <span className="bg-slate-100 text-[11px] font-black px-2 py-0.5 rounded-full">{c.category}</span>
        <span className="text-xs text-slate-500">
          {c.citizenName} • {c.village}
        </span>
        <span className="ml-auto bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
          DATABASE RECORD
        </span>
      </div>
      <p className="text-xs sm:text-sm mt-2 text-slate-800 leading-relaxed">{c.description}</p>
      <div className="flex flex-col md:flex-row gap-2 mt-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-full px-3 py-2 text-base sm:text-sm font-bold bg-white min-h-[40px]"
        >
          <option value="Submitted">Submitted ({translateStatus("Submitted", lang)})</option>
          <option value="Under Review">Under Review ({translateStatus("Under Review", lang)})</option>
          <option value="In Progress">In Progress ({translateStatus("In Progress", lang)})</option>
          <option value="Resolved">Resolved ({translateStatus("Resolved", lang)})</option>
        </select>
        <input
          value={resp}
          onChange={(e) => setResp(e.target.value)}
          placeholder="Official Panchayat resolution response…"
          className="flex-1 border rounded-full px-3 text-base sm:text-sm min-h-[40px]"
        />
        <button
          onClick={() => onUpdate(c.ref, status, resp)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-5 py-2 rounded-full text-xs sm:text-sm shadow transition min-h-[40px]"
        >
          Update Status
        </button>
      </div>
    </div>
  );
}
