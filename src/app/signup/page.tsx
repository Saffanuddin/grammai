"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sprout,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Landmark,
  ShieldCheck,
} from "lucide-react";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f7f2] flex items-center justify-center font-bold">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [lang, setLang] = useState<"en" | "te" | "hi">("en");

  const texts = {
    en: {
      title: "Create Your Citizen Account",
      subtitle: "Register with GramAI to save scheme checklists, file complaints, and receive personalized panchayat updates.",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      phoneLabel: "Mobile Number (Optional)",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm Password",
      passwordHint: "Must be at least 8 characters with at least one letter and one number.",
      signUpBtn: "Create Citizen Account",
      orContinueWith: "or register with",
      googleBtn: "Continue with Google",
      alreadyAccount: "Already registered?",
      loginLink: "Sign In Here",
      backToHome: "← Back to GramAI Connect",
      creatingAccount: "Creating account…",
    },
    te: {
      title: "పౌరుడి ఖాతాను సృష్టించండి",
      subtitle: "పథకాల అర్హత, దరఖాస్తులు మరియు గ్రామ పంచాయతీ సేవల కోసం నమోదు చేసుకోండి.",
      nameLabel: "పూర్తి పేరు",
      emailLabel: "ఈమెయిల్ చిరునామా",
      phoneLabel: "మొబైల్ నంబర్ (ఐచ్ఛికం)",
      passwordLabel: "పాస్‌వర్డ్",
      confirmPasswordLabel: "పాస్‌వర్డ్‌ను నిర్ధారించండి",
      passwordHint: "కనీసం 8 అక్షరాలు, కనీసం ఒక అక్షరం మరియు ఒక సంఖ్య ఉండాలి.",
      signUpBtn: "పౌరుడి ఖాతాను నమోదు చేయండి",
      orContinueWith: "లేదా దీనితో నమోదు చేసుకోండి",
      googleBtn: "గూగుల్ తో నమోదు చేసుకోండి",
      alreadyAccount: "ఇప్పటికే ఖాతా ఉందా?",
      loginLink: "ఇక్కడ లాగిన్ అవ్వండి",
      backToHome: "← హోమ్ పేజీకి వెళ్లండి",
      creatingAccount: "ఖాతా సృష్టించబడుతోంది…",
    },
    hi: {
      title: "नागरिक खाता बनाएं",
      subtitle: "योजना चेकलिस्ट, शिकायत दर्ज करने और पंचायत अपडेट के लिए पंजीकरण करें।",
      nameLabel: "पूरा नाम",
      emailLabel: "ईमेल पता",
      phoneLabel: "मोबाइल नंबर (वैकल्पिक)",
      passwordLabel: "पासवर्ड",
      confirmPasswordLabel: "पासवर्ड की पुष्टि करें",
      passwordHint: "कम से कम 8 अक्षर, जिसमें कम से कम एक अक्षर और एक संख्या होनी चाहिए।",
      signUpBtn: "नागरिक खाता पंजीकृत करें",
      orContinueWith: "या इसके साथ पंजीकरण करें",
      googleBtn: "Google के साथ जारी रखें",
      alreadyAccount: "क्या आपका पहले से खाता है?",
      loginLink: "यहाँ लॉगिन करें",
      backToHome: "← होम पेज पर वापस जाएं",
      creatingAccount: "खाता बनाया जा रहा है…",
    },
  }[lang];

  // Client-side strength calculation
  const hasMinLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || name.trim().length < 2) {
      setError("Please enter your full name (at least 2 characters).");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!hasMinLength || !hasLetter || !hasNumber) {
      setError("Password must meet all complexity requirements.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create account. Please try again.");
      } else {
        setSuccess("Account created successfully! Redirecting to login…");
        setTimeout(() => {
          router.push("/login");
        }, 1200);
      }
    } catch {
      setError("Network error. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f7f2] flex flex-col justify-between text-slate-900 font-sans">
      {/* Top Header */}
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

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-4 my-4 sm:my-8 w-full">
        <div className="bg-white rounded-[24px] sm:rounded-[32px] border shadow-2xl p-5 sm:p-8 max-w-md w-full">
          <div className="text-center mb-5 sm:mb-6">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[10px] sm:text-[11px] font-black px-3 py-1 rounded-full border border-emerald-100">
              <ShieldCheck size={13} /> CITIZEN REGISTRATION
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

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                {texts.nameLabel} <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Yadav"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border text-base sm:text-sm outline-none focus:border-emerald-600 transition bg-slate-50 focus:bg-white min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                {texts.emailLabel} <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border text-base sm:text-sm outline-none focus:border-emerald-600 transition bg-slate-50 focus:bg-white min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                {texts.phoneLabel}
              </label>
              <div className="relative flex items-center">
                <Phone size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 XXXXX"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border text-base sm:text-sm outline-none focus:border-emerald-600 transition bg-slate-50 focus:bg-white min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                {texts.passwordLabel} <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2.5 rounded-2xl border text-base sm:text-sm outline-none focus:border-emerald-600 transition bg-slate-50 focus:bg-white min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength checklist */}
              {password.length > 0 && (
                <div className="mt-1.5 flex gap-2 flex-wrap text-[10px] text-slate-500 font-semibold">
                  <span className={hasMinLength ? "text-emerald-700 font-bold" : "text-slate-400"}>
                    {hasMinLength ? "✓" : "○"} 8+ chars
                  </span>
                  <span className={hasLetter ? "text-emerald-700 font-bold" : "text-slate-400"}>
                    {hasLetter ? "✓" : "○"} Letters
                  </span>
                  <span className={hasNumber ? "text-emerald-700 font-bold" : "text-slate-400"}>
                    {hasNumber ? "✓" : "○"} Numbers
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                {texts.confirmPasswordLabel} <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-2.5 rounded-2xl border text-base sm:text-sm outline-none transition bg-slate-50 focus:bg-white min-h-[44px] ${
                    confirmPassword && !passwordsMatch ? "border-red-400" : "focus:border-emerald-600"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-[11px] text-red-600 font-semibold mt-1">Passwords do not match.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 sm:py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm mt-3 disabled:opacity-60 min-h-[44px]"
            >
              {loading ? texts.creatingAccount : texts.signUpBtn}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5 text-center">
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

          <div className="mt-5 text-center text-xs text-slate-500">
            <span>{texts.alreadyAccount} </span>
            <Link
              href="/login"
              className="font-black text-emerald-700 hover:text-emerald-800 underline ml-1"
            >
              {texts.loginLink}
            </Link>
          </div>

          <div className="mt-3 text-center">
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
        GramAI Connect • Digital Gram Panchayat Services • All signups create verified citizen accounts
      </footer>
    </div>
  );
}
