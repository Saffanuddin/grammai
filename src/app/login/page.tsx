"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sprout,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Landmark,
} from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f7f2] flex items-center justify-center font-bold">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/";
  const urlError = searchParams.get("error");
  const urlMessage = searchParams.get("message");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(urlMessage || (urlError ? `Sign in error: ${urlError}` : ""));
  const [success, setSuccess] = useState("");
  const [lang, setLang] = useState<"en" | "te" | "hi">("en");

  const texts = {
    en: {
      title: "Welcome Back to GramAI",
      subtitle: "Sign in to access your saved schemes, track applications, and manage complaints.",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      show: "Show",
      hide: "Hide",
      signInBtn: "Sign In to Your Account",
      orContinueWith: "or continue with",
      googleBtn: "Sign in with Google",
      noAccount: "Don't have an account yet?",
      signUpLink: "Create a Citizen Account",
      backToHome: "← Back to GramAI Connect",
      signingIn: "Signing in…",
    },
    te: {
      title: "గ్రామ్AI కి స్వాగతం",
      subtitle: "మీ పథకాలు, దరఖాస్తులు మరియు ఫిర్యాదులను పరిశీలించడానికి లాగిన్ చేయండి.",
      emailLabel: "ఈమెయిల్ చిరునామా",
      passwordLabel: "పాస్‌వర్డ్",
      show: "చూపించు",
      hide: "దాచు",
      signInBtn: "ఖాతాలోకి లాగిన్ అవ్వండి",
      orContinueWith: "లేదా దీనితో లాగిన్ అవ్వండి",
      googleBtn: "గూగుల్ తో సైన్ ఇన్",
      noAccount: "ఇంకా ఖాతా లేదా?",
      signUpLink: "నూతన ఖాతాను సృష్టించండి",
      backToHome: "← హోమ్ పేజీకి వెళ్లండి",
      signingIn: "లాగిన్ అవుతున్నారు…",
    },
    hi: {
      title: "GramAI में आपका स्वागत है",
      subtitle: "अपनी योजनाओं, आवेदनों और शिकायतों को ट्रैक करने के लिए लॉगिन करें।",
      emailLabel: "ईमेल पता",
      passwordLabel: "पासवर्ड",
      show: "दिखाएं",
      hide: "छिपाएं",
      signInBtn: "खाते में लॉगिन करें",
      orContinueWith: "या इसके साथ जारी रखें",
      googleBtn: "Google के साथ साइन इन करें",
      noAccount: "क्या आपका खाता नहीं है?",
      signUpLink: "नागरिक खाता बनाएं",
      backToHome: "← होम पेज पर वापस जाएं",
      signingIn: "लॉगिन हो रहा है…",
    },
  }[lang];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to sign in. Please verify your credentials.");
      } else {
        setSuccess("Signed in successfully! Redirecting…");
        setTimeout(() => {
          router.push(redirectTarget);
          router.refresh();
        }, 600);
      }
    } catch {
      setError("Network error. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f7f2] flex flex-col justify-between text-slate-900 font-sans">
      {/* Top Bar */}
      <header className="border-b bg-white/95 backdrop-blur px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-600 grid place-items-center text-white shadow-md">
              <Sprout size={20} className="sm:w-[22px] sm:h-[22px]" />
            </span>
            <span className="font-black text-lg sm:text-xl text-emerald-950">
              GramAI <span className="text-teal-600">Connect</span>
            </span>
          </Link>

          {/* Language selector */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-100 rounded-full p-1 border text-[11px] sm:text-xs font-bold shrink-0">
            {[
              ["en", "EN"],
              ["te", "తెలుగు"],
              ["hi", "हिन्दी"],
            ].map(([k, l]) => (
              <button
                key={k}
                type="button"
                onClick={() => setLang(k as any)}
                className={`px-2.5 sm:px-3 py-1 rounded-full transition min-h-[32px] flex items-center justify-center ${
                  lang === k ? "bg-emerald-700 text-white shadow" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-4 my-4 sm:my-8 w-full">
        <div className="bg-white rounded-[24px] sm:rounded-[32px] border shadow-2xl p-5 sm:p-8 max-w-md w-full">
          <div className="text-center mb-5 sm:mb-6">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[10px] sm:text-[11px] font-black px-3 py-1 rounded-full border border-emerald-100">
              <Landmark size={13} /> CITIZEN PORTAL LOGIN
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-emerald-950 mt-2">{texts.title}</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">{texts.subtitle}</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl p-3 sm:p-3.5 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <span className="flex-1 leading-snug">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-3 sm:p-3.5 text-xs font-semibold flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span className="flex-1 leading-snug">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                {texts.emailLabel}
              </label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl border text-base sm:text-sm outline-none focus:border-emerald-600 transition bg-slate-50 focus:bg-white min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black text-slate-700">
                  {texts.passwordLabel}
                </label>
              </div>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-2xl border text-base sm:text-sm outline-none focus:border-emerald-600 transition bg-slate-50 focus:bg-white min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title={showPassword ? texts.hide : texts.show}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 sm:py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm mt-2 disabled:opacity-60 min-h-[44px]"
            >
              {loading ? texts.signingIn : texts.signInBtn}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5 sm:my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {texts.orContinueWith}
            </span>
          </div>

          {/* Google OAuth Button */}
          <a
            href="/api/auth/google"
            className="w-full border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold py-3 rounded-2xl shadow-sm transition flex items-center justify-center gap-3 text-sm min-h-[44px]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.97 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{texts.googleBtn}</span>
          </a>

          <div className="mt-6 text-center text-xs text-slate-500">
            <span>{texts.noAccount} </span>
            <Link
              href="/signup"
              className="font-black text-emerald-700 hover:text-emerald-800 underline ml-1"
            >
              {texts.signUpLink}
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
            >
              {texts.backToHome}
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-slate-400 border-t bg-white">
        GramAI Connect • Digital Gram Panchayat Services • Secure Authentication
      </footer>
    </div>
  );
}
