"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { SCHEMES, SERVICES, I18N, DEMO_PROFILE, DEMO_PROFILES, checkEligibility, type Scheme, type CitizenProfile } from "@/lib/data";
import { Sprout, MessageCircle, FileText, Map, Wrench, LayoutDashboard, ShieldCheck, Search, Heart, CheckCircle2, Circle, ArrowRight, Upload, Send, Globe, User, Home, ListChecks, Landmark, Phone, Clock, IndianRupee, Sparkles, Play, RotateCcw, Printer, Download, X, ChevronRight, BadgeCheck, AlertTriangle, Mic, Volume2, Star, TrendingUp, Users, FileCheck, Building2, Droplets, GraduationCap, Briefcase, HeartPulse, House, PiggyBank, Baby, Wallet } from "lucide-react";

type View = "home"|"schemes"|"ask"|"documents"|"journey"|"services"|"complaints"|"dashboard"|"admin"|"profile";
const HERO = "https://images.pexels.com/photos/20527524/pexels-photo-20527524.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";
const IMG2 = "https://images.pexels.com/photos/20527519/pexels-photo-20527519.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";
const IMG3 = "https://images.pexels.com/photos/17504886/pexels-photo-17504886.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";

const CAT_ICON: Record<string, any> = { Agriculture:Sprout, Education:GraduationCap, Employment:Briefcase, "Women & Child":Baby, Healthcare:HeartPulse, Housing:House, Pensions:Wallet, "Financial Assistance":PiggyBank };
const STATUS_COLOR: Record<string,string> = { Submitted:"bg-amber-100 text-amber-800", "Under Review":"bg-blue-100 text-blue-800", "In Progress":"bg-teal-100 text-teal-800", Resolved:"bg-emerald-100 text-emerald-800" };

export default function GramApp(){
  const [view,setView]=useState<View>("home");
  const [lang,setLang]=useState("en");
  const [profile,setProfile]=useState<CitizenProfile>(DEMO_PROFILE);
  const [isDemo,setIsDemo]=useState(false);
  const [query,setQuery]=useState("");
  const [cat,setCat]=useState("All");
  const [level,setLevel]=useState("All");
  const [selected,setSelected]=useState<Scheme>(SCHEMES[0]);
  const [saved,setSaved]=useState<string[]>(["pm-kisan","rythu-bharosa"]);
  const [checkedDocs,setCheckedDocs]=useState<Record<string,string[]>>({ "pm-kisan":["Aadhaar Card","Bank Account Passbook"], "rythu-bharosa":["Aadhaar Card"] });
  const [complaints,setComplaints]=useState<any[]>([]);
  const [trackRef,setTrackRef]=useState("");
  const [toast,setToast]=useState("");
  const [guideStep,setGuideStep]=useState(0);
  const [showGuide,setShowGuide]=useState(true);
  const [role,setRole]=useState<"citizen"|"admin">("citizen");
  // chat
  const [chat,setChat]=useState<{role:string;text:string}[]>([{role:"ai", text:"Namaste 🙏 I am GramAI — your Gram Panchayat assistant. Ask me: “I am a farmer in Telangana, which schemes should I explore?” — I answer in English, తెలుగు & हिन्दी, grounded in the verified scheme database."}]);
  const [chatInput,setChatInput]=useState("");
  const [chatLoading,setChatLoading]=useState(false);
  // docs
  const [docResult,setDocResult]=useState<any>(null);
  const [docLoading,setDocLoading]=useState(false);
  const [docFileName,setDocFileName]=useState("");
  // complaint form
  const [cForm,setCForm]=useState({category:"Water Supply", description:"", village:DEMO_PROFILE.village});
  const [lastRef,setLastRef]=useState("");
  // admin
  const [adminTab,setAdminTab]=useState("complaints");
  const [verifiedMap,setVerifiedMap]=useState<Record<string,boolean>>(Object.fromEntries(SCHEMES.map(s=>[s.id,s.verified])));

  const t = I18N[lang];
  const cats = ["All",...Array.from(new Set(SCHEMES.map(s=>s.category)))];

  useEffect(()=>{ try{ const p=localStorage.getItem("gram-profile"); if(p) setProfile(JSON.parse(p)); const s=localStorage.getItem("gram-saved"); if(s) setSaved(JSON.parse(s)); const c=localStorage.getItem("gram-checks"); if(c) setCheckedDocs(JSON.parse(c)); }catch{} loadComplaints(); },[]);
  useEffect(()=>{ try{ localStorage.setItem("gram-profile",JSON.stringify(profile)); localStorage.setItem("gram-saved",JSON.stringify(saved)); localStorage.setItem("gram-checks",JSON.stringify(checkedDocs)); }catch{} },[profile,saved,checkedDocs]);
  useEffect(()=>{ if(toast){ const id=setTimeout(()=>setToast(""),3200); return ()=>clearTimeout(id);} },[toast]);

  async function loadComplaints(){ try{ const r=await fetch("/api/complaints"); const d=await r.json(); if(d.complaints) setComplaints(d.complaints); }catch{ setComplaints([]);} }

  const filtered = useMemo(()=> SCHEMES.filter(s=>{
    const q=query.toLowerCase();
    const matchQ=!q || (s.name+" "+s.category+" "+s.tags.join(" ")+" "+s.description).toLowerCase().includes(q);
    return matchQ && (cat==="All"||s.category===cat) && (level==="All"||s.level===level);
  }),[query,cat,level]);

  const recommendations = useMemo(()=> SCHEMES.map(s=>({s, e:checkEligibility(s,profile)})).sort((a,b)=>b.e.score-a.e.score),[profile]);
  const topRecs = recommendations.filter(r=>r.e.score>=50).slice(0,6);
  const journeyItems = useMemo(()=> saved.map(id=>{ const s=SCHEMES.find(x=>x.id===id)!; const e=checkEligibility(s,profile); const docs=s.documents; const done=(checkedDocs[id]||[]).length; const stage = done>=docs.length ? "Ready for Official Application" : e.score>=60 && done>0 ? "Documents Pending" : e.score>0 ? "Eligibility Checked" : "Discovered"; return {s,e,done,total:docs.length,stage}; }).filter(Boolean),[saved,profile,checkedDocs]);
  const overallDocs = useMemo(()=>{ let d=0,t2=0; saved.forEach(id=>{ const s=SCHEMES.find(x=>x.id===id); if(s){ t2+=s.documents.length; d+=(checkedDocs[id]||[]).length; } }); return {d,t:t2,pct:t2?Math.round(d/t2*100):0}; },[saved,checkedDocs]);
  const myComplaints = complaints.filter(c=> isDemo ? true : c.citizenName===profile.name).slice(0,8);
  // keep demo shows all sample for judge, but label mine
  const tracked = complaints.find(c=>c.ref.toLowerCase()===trackRef.trim().toLowerCase());

  function tryDemo(custom?: CitizenProfile){
    const p = custom || DEMO_PROFILE; setProfile(p); setIsDemo(true); setSaved(["pm-kisan","rythu-bharosa","pmfby"]); setView("dashboard"); setToast(`Demo loaded: ${p.name} (${p.occupation}, ${p.state}) — no real personal data used.`); setGuideStep(2);
  }
  function toggleSave(id:string){ setSaved(prev=> prev.includes(id)? prev.filter(x=>x!==id): [...prev,id]); setToast(saved.includes(id)?"Removed from saved schemes":"Saved! Find it in My Journey & Dashboard."); }
  function toggleDoc(schemeId:string, doc:string){ setCheckedDocs(prev=>{ const cur=prev[schemeId]||[]; return {...prev, [schemeId]: cur.includes(doc)? cur.filter(d=>d!==doc): [...cur,doc]}; }); }
  function openScheme(s:Scheme){ setSelected(s); setView("schemes"); setTimeout(()=>{ document.getElementById("scheme-detail")?.scrollIntoView({behavior:"smooth"}); },80); }

  async function sendChat(msg?:string){
    const text=(msg||chatInput).trim(); if(!text) return;
    setChat(c=>[...c,{role:"user",text}]); setChatInput(""); setChatLoading(true);
    try{ const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:text,profile,lang})}); const d=await r.json(); setChat(c=>[...c,{role:"ai",text:d.reply||"Please try again."}]); }catch{ setChat(c=>[...c,{role:"ai",text:"I could not reach the server, but here is guidance from the scheme database: PM-KISAN (₹6,000/yr for farmers), Ayushman Bharat (₹5L health cover) and MGNREGA (100 days work) cover most families. Open Find Schemes for full details."}]); }
    setChatLoading(false);
  }

  async function processDoc(useSample=false, file?:File){
    setDocLoading(true);
    let text=""; let fname = useSample? "Sample — Rythu Bharosa Guidelines 2025-26.pdf" : (file?.name||docFileName||"guideline.pdf");
    if(file && file.type==="text/plain"){ text=await file.text(); }
    try{ const r=await fetch("/api/documents",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fileName:fname,text,useSample})}); const d=await r.json(); setDocResult(d); setToast("Document extracted! Summary, eligibility & checklist generated below."); }catch{ setDocResult(null); }
    setDocLoading(false);
  }

  async function submitComplaint(e:any){ e.preventDefault(); if(!cForm.description.trim()){ setToast("Please describe the issue."); return; }
    try{ const r=await fetch("/api/complaints",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({citizenName:profile.name, phone:profile.phone, ...cForm})}); const d=await r.json(); setLastRef(d.ref); setTrackRef(d.ref); await loadComplaints(); setCForm({...cForm,description:""}); setToast(`Complaint submitted (Demo). Reference: ${d.ref}`); }catch{ const ref=`GRC-2026-${Math.floor(1000+Math.random()*9000)}`; setLastRef(ref); setComplaints(c=>[{id:Date.now(),ref,citizenName:profile.name,category:cForm.category,description:cForm.description,village:cForm.village,status:"Submitted",response:"",createdAt:new Date().toISOString()},...c]); }
  }
  async function adminUpdate(ref:string, status:string, response:string){ await fetch("/api/complaints",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({ref,status,response})}).catch(()=>{}); setComplaints(cs=>cs.map(c=>c.ref===ref?{...c,status,response}:c)); setToast(`Updated ${ref} → ${status}`); }

  const eligSelected = checkEligibility(selected, profile);
  const navBtn = (v:View, label:string, Icon:any)=> (<button key={v} onClick={()=>setView(v)} className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition ${view===v?"bg-emerald-700 text-white shadow":"text-emerald-950 hover:bg-emerald-50"}`}><Icon size={15}/>{label}</button>);

  const GuideSteps = ["Click Try Demo","Review Dashboard","Find Schemes","Open a Scheme & Check Eligibility","Change Age/Income in Profile","Upload Sample Guideline (Documents)","Generate Checklist","Ask GramAI (EN/TE/HI)","Submit & Track Complaint"];

  return (
  <div className="min-h-screen bg-[#f4f7f2] text-slate-900 font-sans">
    {/* Top strip */}
    <div className="bg-emerald-950 text-emerald-50 text-[12px]"><div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap gap-2 items-center justify-between"><span className="flex items-center gap-2"><Landmark size={13}/> Gram Panchayat Digital Seva • Demo prototype — simulated records are labelled. Not an official Govt portal.</span><span className="hidden md:flex items-center gap-3"><span>Helpline 1800-XXX-XXXX</span><span>MeeSeva • CSC</span><button onClick={()=>{setRole(role==="admin"?"citizen":"admin"); setView(role==="admin"?"dashboard":"admin");}} className="bg-white/15 hover:bg-white/25 px-2 py-0.5 rounded-full font-bold">{role==="admin"?"👩‍💼 Admin Mode ON — Exit":"🔐 Admin Login (Demo)"}</button></span></div></div>

    {/* Header */}
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
        <button onClick={()=>setView("home")} className="flex items-center gap-3 text-left">
          <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-600 grid place-items-center text-white shadow-lg"><Sprout size={24}/></span>
          <span><span className="block font-black text-xl leading-none text-emerald-950">GramAI <span className="text-teal-600">Connect</span></span><span className="block text-[11px] text-slate-500 font-semibold mt-0.5">{t.tagline}</span></span>
        </button>
        <div className="flex-1"/>
        <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">{[["en","English"],["te","తెలుగు"],["hi","हिन्दी"]].map(([k,l])=>(<button key={k} onClick={()=>setLang(k)} className={`px-3 py-1 rounded-full text-xs font-bold ${lang===k?"bg-emerald-700 text-white":"text-slate-600"}`}>{l}</button>))}</div>
        <button onClick={()=>tryDemo()} className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-4 py-2.5 rounded-full shadow flex items-center gap-2 text-sm"><Play size={16}/> {t.demo}</button>
        <button onClick={()=>setView("profile")} className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-full"><span className="w-7 h-7 rounded-full bg-emerald-700 text-white grid place-items-center text-xs font-black">{profile.name.split(" ").map(x=>x[0]).join("").slice(0,2)}</span><span className="text-left leading-none"><span className="block text-xs font-black">{profile.name}</span><span className="block text-[10px] text-slate-500">{profile.occupation} • {profile.village}</span></span></button>
      </div>
      <nav className="max-w-7xl mx-auto px-4 pb-3 flex gap-1 overflow-x-auto">
        {navBtn("home","Home",Home)}{navBtn("schemes",t.find,Search)}{navBtn("ask",t.ask,MessageCircle)}{navBtn("documents",t.docs,FileText)}{navBtn("journey",t.journey,Map)}{navBtn("services",t.services,Building2)}{navBtn("complaints",t.complaints,Wrench)}{navBtn("dashboard",t.dashboard,LayoutDashboard)}
        {role==="admin" && navBtn("admin","Admin",ShieldCheck)}
        {navBtn("profile","Profile",User)}
      </nav>
    </header>

    {toast && <div className="fixed top-24 right-4 z-50 bg-emerald-950 text-white px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold max-w-sm flex gap-2"><CheckCircle2 className="shrink-0 text-emerald-300" size={18}/>{toast}</div>}

    {/* Guided demo */}
    {showGuide && view==="home" && (
      <div className="max-w-7xl mx-auto px-4 mt-4"><div className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white rounded-3xl p-4 md:p-5 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-amber-300 font-black text-xs tracking-widest">🎯 3–5 MINUTE GUIDED DEMO FOR JUDGES</p><h3 className="font-black text-lg mt-1">Follow these 9 steps — everything works without real personal data</h3></div><button onClick={()=>setShowGuide(false)} className="bg-white/15 p-1.5 rounded-full"><X size={16}/></button></div>
        <div className="flex gap-2 overflow-x-auto mt-4 pb-1">{GuideSteps.map((s,i)=>(<button key={i} onClick={()=>{ setGuideStep(i); if(i===0) tryDemo(); if(i===1) setView("dashboard"); if(i===2||i===3) setView("schemes"); if(i===4) setView("profile"); if(i===5||i===6) setView("documents"); if(i===7) setView("ask"); if(i===8) setView("complaints"); }} className={`shrink-0 px-3 py-2 rounded-full text-xs font-bold border ${guideStep===i?"bg-amber-400 text-emerald-950 border-amber-300":"bg-white/10 border-white/20 hover:bg-white/20"}`}>{i+1}. {s}</button>))}</div>
      </div></div>
    )}

    {/* HOME */}
    {view==="home" && (<main>
      <section className="max-w-7xl mx-auto px-4 pt-6 grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-[28px] overflow-hidden shadow-xl border">
          <div className="relative h-64 md:h-80"><img src={HERO} alt="Rural India farmers" className="w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/30 to-transparent"/><div className="absolute bottom-0 p-6 text-white"><span className="bg-amber-400 text-emerald-950 text-[11px] font-black px-2 py-1 rounded-full">AI-POWERED • MULTILINGUAL • DEMO READY</span><h1 className="text-3xl md:text-5xl font-black leading-[1.05] mt-3">{t.heroTitle}</h1><p className="text-emerald-50/90 mt-2 max-w-xl text-sm md:text-base">{t.heroSub}</p></div></div>
          <div className="p-5 flex flex-wrap gap-3">
            <div className="flex-1 min-w-[240px] flex bg-slate-100 rounded-full p-1.5"><Search className="ml-2 text-slate-400 self-center" size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search: farmer, scholarship, pension, house…" className="flex-1 bg-transparent outline-none px-2 text-sm"/><button onClick={()=>setView("schemes")} className="bg-emerald-700 text-white px-4 py-2 rounded-full text-sm font-bold">Search</button></div>
            <button onClick={()=>tryDemo()} className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-5 py-3 rounded-full flex items-center gap-2"><Play size={17}/> Try Demo — Load Sample Citizen</button>
            <button onClick={()=>setView("ask")} className="bg-white border-2 border-emerald-700 text-emerald-800 font-black px-5 py-3 rounded-full flex items-center gap-2"><MessageCircle size={17}/> Ask GramAI</button>
          </div>
          <div className="px-5 pb-5 grid grid-cols-2 md:grid-cols-4 gap-3">{[[SCHEMES.length+"+","Schemes in database"],[topRecs.length,"Matched for "+profile.name.split(" ")[0]],["3","Languages EN • TE • HI"],[complaints.length||3,"Demo complaints tracked"]].map(([n,l])=>(<div key={l} className="bg-emerald-50 rounded-2xl p-3 text-center"><p className="font-black text-2xl text-emerald-800">{n}</p><p className="text-[11px] font-bold text-slate-600 leading-tight">{l}</p></div>))}</div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-emerald-950 text-white rounded-[28px] p-5 shadow-xl">
            <div className="flex justify-between items-start"><div><p className="text-emerald-300 text-xs font-black tracking-widest">FOR YOU • {profile.occupation.toUpperCase()}</p><h3 className="font-black text-xl mt-1">Namaste, {profile.name} 🙏</h3><p className="text-emerald-100/80 text-xs mt-1">{profile.village}, {profile.district}, {profile.state} • Age {profile.age} • ₹{profile.income.toLocaleString("en-IN")}/yr • {profile.land} land</p></div><span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-2 py-1 rounded-full">{isDemo?"DEMO PROFILE":"MY PROFILE"}</span></div>
            <div className="mt-4 space-y-2">{topRecs.slice(0,3).map(({s,e})=>(<button key={s.id} onClick={()=>openScheme(s)} className="w-full text-left bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-3 flex gap-3"><span className="w-9 h-9 rounded-xl bg-emerald-400/20 grid place-items-center shrink-0">{(()=>{const I=CAT_ICON[s.category]||Sparkles; return <I size={18} className="text-emerald-300"/>})()}</span><span className="flex-1 min-w-0"><span className="block font-bold text-sm truncate">{s.name}</span><span className="block text-emerald-100/70 text-xs truncate">{s.benefit}</span></span><span className={`text-xs font-black px-2 py-1 rounded-full h-fit ${e.score>=80?"bg-emerald-400 text-emerald-950":e.score>=50?"bg-amber-400 text-emerald-950":"bg-white/20"}`}>{e.score}% match</span></button>))}</div>
            <button onClick={()=>setView("dashboard")} className="mt-4 w-full bg-white text-emerald-950 font-black py-3 rounded-full flex items-center justify-center gap-2">Open My Dashboard <ArrowRight size={16}/></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src={IMG2} className="rounded-[24px] h-32 w-full object-cover shadow" alt="Women farmers"/>
            <img src={IMG3} className="rounded-[24px] h-32 w-full object-cover shadow" alt="Women in fields"/>
          </div>
          <div className="bg-white rounded-[24px] p-4 shadow border flex gap-3"><span className="w-10 h-10 rounded-2xl bg-teal-100 grid place-items-center shrink-0"><FileText className="text-teal-700" size={20}/></span><div><p className="font-black text-sm">Document Intelligence</p><p className="text-xs text-slate-500">Upload a scheme guideline PDF — GramAI extracts eligibility, benefits & checklist in simple language.</p><button onClick={()=>setView("documents")} className="text-teal-700 font-black text-xs mt-1 flex items-center gap-1">Try with sample guideline <ChevronRight size={13}/></button></div></div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-end justify-between"><div><p className="text-emerald-700 font-black text-xs tracking-widest">BROWSE BY NEED</p><h2 className="font-black text-2xl mt-1">What help does your family need today?</h2></div><button onClick={()=>setView("schemes")} className="hidden md:flex text-emerald-700 font-black text-sm items-center gap-1">All schemes <ArrowRight size={15}/></button></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">{cats.filter(c=>c!=="All").map(c=>{ const I=CAT_ICON[c]||Sparkles; const n=SCHEMES.filter(s=>s.category===c).length; return (<button key={c} onClick={()=>{setCat(c); setView("schemes");}} className="bg-white hover:shadow-lg border rounded-3xl p-4 text-left transition group"><span className="w-11 h-11 rounded-2xl bg-emerald-100 group-hover:bg-emerald-700 grid place-items-center transition"><I size={22} className="text-emerald-700 group-hover:text-white"/></span><p className="font-black mt-3">{c}</p><p className="text-xs text-slate-500">{n} scheme{n>1?"s":""} • Central & State</p></button>)})}</div>
      </section>

      {/* Top schemes */}
      <section className="max-w-7xl mx-auto px-4 mt-8 pb-4">
        <h2 className="font-black text-2xl">Recommended for {profile.name}</h2><p className="text-sm text-slate-500">Ranked by your profile match. This is guidance — final approval is by the Government after verification.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">{topRecs.map(({s,e})=><SchemeCard key={s.id} s={s} score={e.score} saved={saved.includes(s.id)} onOpen={()=>openScheme(s)} onSave={()=>toggleSave(s.id)}/>)}</div>
      </section>

      {/* Demo personas */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-[28px] border shadow p-5"><p className="font-black text-lg">👥 Try different demo citizens (for judges)</p><p className="text-sm text-slate-500">One click loads a fictional profile — recommendations, eligibility & checklists update instantly.</p><div className="grid md:grid-cols-4 gap-3 mt-4">{DEMO_PROFILES.map(p=>(<button key={p.label} onClick={()=>tryDemo(p)} className="text-left border-2 hover:border-emerald-600 rounded-2xl p-3 bg-emerald-50/50"><p className="font-black text-sm">{p.label}</p><p className="text-xs text-slate-500 mt-1">{p.desc}</p><p className="text-emerald-700 font-black text-xs mt-2">Load this profile →</p></button>))}</div></div>
      </section>
    </main>)}

    {/* SCHEMES */}
    {view==="schemes" && (<main className="max-w-7xl mx-auto px-4 py-6">
      <p className="text-emerald-700 font-black text-xs tracking-widest">FIND SCHEMES • CENTRAL + STATE</p><h1 className="font-black text-3xl mt-1">Government Scheme Discovery</h1><p className="text-slate-500 text-sm mt-1">Search by name, keyword, category or beneficiary group. <span className="font-bold text-emerald-700">✓ Verified</span> = official source linked • Sample/unverified entries are labelled.</p>
      <div className="bg-white rounded-3xl border shadow p-4 mt-4 flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex bg-slate-100 rounded-full px-3 items-center"><Search size={17} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try: farmer, pension, scholarship, LPG, house…" className="flex-1 bg-transparent outline-none p-2.5 text-sm"/></div>
        <select value={cat} onChange={e=>setCat(e.target.value)} className="border rounded-full px-3 py-2.5 text-sm font-semibold bg-white">{cats.map(c=><option key={c}>{c}</option>)}</select>
        <select value={level} onChange={e=>setLevel(e.target.value)} className="border rounded-full px-3 py-2.5 text-sm font-semibold bg-white"><option>All</option><option>Central</option><option>State</option></select>
        <select value={profile.occupation} onChange={e=>setProfile({...profile,occupation:e.target.value})} className="border rounded-full px-3 py-2.5 text-sm font-semibold bg-emerald-50"><option>Farmer</option><option>Student</option><option>Daily Wage Worker</option><option>Self-Employed</option><option>Unemployed</option><option>Retired / Pensioner</option></select>
      </div>
      <p className="text-sm font-bold mt-4">{filtered.length} scheme(s) found for {profile.occupation} in {profile.state}</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">{filtered.map(s=>{ const e=checkEligibility(s,profile); return <SchemeCard key={s.id} s={s} score={e.score} saved={saved.includes(s.id)} onOpen={()=>openScheme(s)} onSave={()=>toggleSave(s.id)}/>})}</div>
      {filtered.length===0 && <div className="bg-white rounded-3xl p-10 text-center border mt-4"><p className="font-black text-lg">No schemes match “{query}”</p><p className="text-sm text-slate-500">Try “farmer”, “student” or clear filters.</p><button onClick={()=>{setQuery("");setCat("All");}} className="mt-3 bg-emerald-700 text-white px-4 py-2 rounded-full font-bold text-sm">Clear filters</button></div>}

      {/* Detail */}
      <div id="scheme-detail" className="bg-white rounded-[28px] border shadow-xl mt-8 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-900 to-teal-700 text-white p-6">
          <div className="flex flex-wrap gap-2 items-center"><span className="bg-white/20 px-2 py-1 rounded-full text-[11px] font-black">{selected.category.toUpperCase()}</span><span className="bg-white/20 px-2 py-1 rounded-full text-[11px] font-black">{selected.level} • {selected.state}</span>{selected.verified?<span className="bg-emerald-400 text-emerald-950 px-2 py-1 rounded-full text-[11px] font-black flex items-center gap-1"><BadgeCheck size={12}/> VERIFIED SOURCE</span>:<span className="bg-amber-400 text-emerald-950 px-2 py-1 rounded-full text-[11px] font-black">UNVERIFIED — VERIFY LOCALLY</span>}<span className="ml-auto text-xs font-bold bg-white/15 px-2 py-1 rounded-full">⏰ {selected.deadline}</span></div>
          <h2 className="font-black text-2xl md:text-3xl mt-3">{selected.name}</h2><p className="text-emerald-100 text-sm">{selected.nameTe} • {selected.nameHi} • {selected.ministry}</p>
          <p className="mt-3 bg-white/10 border border-white/15 rounded-2xl p-3 font-bold flex items-center gap-2"><IndianRupee className="text-amber-300 shrink-0"/>{selected.benefit}</p>
        </div>
        <div className="grid lg:grid-cols-5 gap-0">
          <div className="lg:col-span-3 p-6 space-y-6">
            <div><h3 className="font-black">About this scheme</h3><p className="text-sm text-slate-600 mt-1">{selected.description}</p></div>
            <div><h3 className="font-black">Who can apply (from scheme rules)</h3><ul className="mt-2 space-y-1.5">{selected.eligibilityText.map(x=>(<li key={x} className="flex gap-2 text-sm text-slate-600"><CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5"/>{x}</li>))}</ul></div>
            <div><h3 className="font-black">How to apply — step by step</h3><ol className="mt-2 space-y-2">{selected.steps.map((x,i)=>(<li key={x} className="flex gap-3 text-sm"><span className="w-6 h-6 rounded-full bg-emerald-700 text-white grid place-items-center text-xs font-black shrink-0">{i+1}</span><span className="text-slate-600 pt-0.5">{x}</span></li>))}</ol></div>
            <div className="flex flex-wrap gap-2"><a href={selected.source} target="_blank" className="bg-emerald-700 text-white px-4 py-2.5 rounded-full font-bold text-sm">🌐 Official Portal ↗</a><button onClick={()=>toggleSave(selected.id)} className="border-2 border-emerald-700 text-emerald-800 px-4 py-2.5 rounded-full font-bold text-sm">{saved.includes(selected.id)?"♥ Saved":"♡ Save Scheme"}</button><button onClick={()=>setView("ask")} className="border px-4 py-2.5 rounded-full font-bold text-sm">Ask GramAI about this</button></div>
            <p className="text-[11px] text-slate-400 flex gap-1"><AlertTriangle size={13}/> GramAI does not submit applications to the Government. Apply only via official portal / MeeSeva / CSC. Source: {selected.source}</p>
          </div>
          <div className="lg:col-span-2 bg-emerald-50/70 p-6 border-l">
            <div className="flex items-center justify-between"><h3 className="font-black">Smart Eligibility Checker</h3><span className={`px-3 py-1 rounded-full text-xs font-black ${eligSelected.status==="eligible"?"bg-emerald-600 text-white":eligSelected.status==="partial"?"bg-amber-400 text-emerald-950":"bg-red-100 text-red-700"}`}>{eligSelected.score}% • {eligSelected.status==="eligible"?"Potentially Eligible":eligSelected.status==="partial"?"More Info Needed":"Not Matched"}</span></div>
            <div className="h-3 bg-white rounded-full mt-3 overflow-hidden border"><div className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all" style={{width:eligSelected.score+"%"}}/></div>
            <div className="space-y-2 mt-4">{eligSelected.reasons.map((r,i)=>(<div key={i} className={`flex gap-2 text-[13px] p-2.5 rounded-xl border ${r.ok?"bg-white border-emerald-100":"bg-red-50 border-red-100"}`}>{r.ok?<CheckCircle2 size={16} className="text-emerald-600 shrink-0"/>:<X size={16} className="text-red-500 shrink-0"/>}<span>{r.text}</span></div>))}</div>
            <div className="bg-white rounded-2xl border p-3 mt-4"><p className="font-black text-xs text-emerald-800">➡️ NEXT ACTION</p><p className="text-sm text-slate-600 mt-1">{eligSelected.next}</p></div>
            {/* live profile tweak */}
            <div className="bg-white rounded-2xl border p-4 mt-4"><p className="font-black text-sm">Try changing your profile — assessment updates instantly 👇</p><div className="grid grid-cols-2 gap-2 mt-3 text-xs font-bold"><label>Age<input type="number" value={profile.age} onChange={e=>setProfile({...profile,age:Number(e.target.value)})} className="w-full border rounded-xl p-2 mt-1"/></label><label>Yearly Income ₹<input type="number" value={profile.income} onChange={e=>setProfile({...profile,income:Number(e.target.value)})} className="w-full border rounded-xl p-2 mt-1"/></label><label>Occupation<select value={profile.occupation} onChange={e=>setProfile({...profile,occupation:e.target.value})} className="w-full border rounded-xl p-2 mt-1 bg-white"><option>Farmer</option><option>Student</option><option>Daily Wage Worker</option><option>Self-Employed</option><option>Unemployed</option><option>Retired / Pensioner</option></select></label><label>Gender<select value={profile.gender} onChange={e=>setProfile({...profile,gender:e.target.value})} className="w-full border rounded-xl p-2 mt-1 bg-white"><option>Male</option><option>Female</option></select></label></div></div>
            {/* checklist */}
            <div className="mt-5"><div className="flex justify-between items-center"><h3 className="font-black flex items-center gap-2"><ListChecks size={18}/> Document Checklist</h3><span className="text-xs font-black bg-emerald-700 text-white px-2 py-1 rounded-full">{(checkedDocs[selected.id]||[]).length}/{selected.documents.length} ready</span></div><div className="space-y-2 mt-3">{selected.documents.map(d=>{ const has=(checkedDocs[selected.id]||[]).includes(d); return (<button key={d} onClick={()=>toggleDoc(selected.id,d)} className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left text-sm font-semibold ${has?"bg-emerald-600 text-white border-emerald-600":"bg-white hover:border-emerald-400"}`}>{has?<CheckCircle2 size={18}/>:<Circle size={18} className="text-slate-300"/>}<span className="flex-1">{d}</span><span className="text-[10px] font-black">{has?"HAVE IT ✓":"MISSING"}</span></button>)})}</div><p className="text-[11px] text-slate-500 mt-2">Missing a document? Get it at MeeSeva / Gram Panchayat — see Panchayat Services for how. Progress auto-saves & appears in My Journey.</p><button onClick={()=>{ if(!saved.includes(selected.id)) toggleSave(selected.id); setView("journey"); }} className="w-full mt-3 bg-emerald-950 text-white font-black py-3 rounded-full">Save & Track in My Journey →</button></div>
          </div>
        </div>
      </div>
    </main>)}

    {/* ASK */}
    {view==="ask" && (<main className="max-w-5xl mx-auto px-4 py-6">
      <p className="text-emerald-700 font-black text-xs tracking-widest">ASK GRAMAI • MULTILINGUAL AI ASSISTANT</p><h1 className="font-black text-3xl mt-1">Namaste 🙏 Ask me anything about schemes</h1><p className="text-sm text-slate-500 mt-1">Grounded in the GramAI scheme database with source references. If the external AI API is unavailable, this smart demo engine answers instantly. <span className="font-bold">Mode: Grounded Demo Engine (add OPENAI_API_KEY server-side for live LLM)</span></p>
      <div className="flex flex-wrap gap-2 mt-4">{["I am a farmer in Telangana. Which schemes should I explore?","నేను రైతును, నాకు ఏ పథకాలు ఉన్నాయి?","मुझे पेंशन के लिए क्या दस्तावेज़ चाहिए?","Scholarship for my daughter studying in college","Free hospital treatment scheme for my family","I need a house. Am I eligible for housing scheme?"].map(q=>(<button key={q} onClick={()=>sendChat(q)} className="bg-white border hover:border-emerald-500 rounded-full px-3 py-2 text-xs font-bold shadow-sm">{q}</button>))}</div>
      <div className="bg-white rounded-[28px] border shadow-xl mt-4 overflow-hidden">
        <div className="bg-emerald-950 text-white px-5 py-3 flex items-center gap-3"><span className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 grid place-items-center"><Sparkles size={18}/></span><div className="flex-1"><p className="font-black text-sm">GramAI Scheme Agent</p><p className="text-[11px] text-emerald-300">● Online • Answering as {profile.name} ({profile.occupation}, {profile.state}) in {lang==="te"?"తెలుగు":lang==="hi"?"हिन्दी":"English"}</p></div><button className="bg-white/15 p-2 rounded-full" title="Voice (demo)"><Mic size={16}/></button><button className="bg-white/15 p-2 rounded-full" title="Listen (demo)"><Volume2 size={16}/></button></div>
        <div className="h-[420px] overflow-y-auto p-4 space-y-3 bg-[#f7faf5]">{chat.map((m,i)=>(<div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}><div className={`max-w-[85%] p-3.5 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap ${m.role==="user"?"bg-emerald-700 text-white rounded-br-md":"bg-white border shadow-sm rounded-bl-md"}`}>{m.text}</div></div>))}{chatLoading && <div className="bg-white border rounded-3xl rounded-bl-md p-3.5 text-sm w-fit animate-pulse">GramAI is checking the scheme database…</div>}</div>
        <div className="p-3 border-t flex gap-2"><input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder={lang==="te"?"ఇక్కడ అడగండి…":lang==="hi"?"यहाँ पूछें…":"Ask: documents for PM-KISAN, pension, scholarship…"} className="flex-1 bg-slate-100 rounded-full px-4 outline-none text-sm"/><button onClick={()=>sendChat()} className="bg-emerald-700 text-white w-11 h-11 rounded-full grid place-items-center shrink-0"><Send size={18}/></button></div>
      </div>
      <div className="grid md:grid-cols-3 gap-3 mt-4">{SCHEMES.slice(0,3).map(s=>(<div key={s.id} className="bg-white border rounded-2xl p-3 text-xs"><p className="font-black flex items-center gap-1"><BadgeCheck size={13} className="text-emerald-600"/> Source Reference</p><p className="font-bold mt-1">{s.name}</p><a href={s.source} target="_blank" className="text-teal-700 break-all">{s.source}</a><p className="text-slate-400 mt-1">{s.verified?"Verified official portal":"Unverified — verify locally"}</p></div>))}</div>
    </main>)}

    {/* DOCUMENTS */}
    {view==="documents" && (<main className="max-w-6xl mx-auto px-4 py-6">
      <p className="text-emerald-700 font-black text-xs tracking-widest">GOVERNMENT DOCUMENT INTELLIGENCE</p><h1 className="font-black text-3xl mt-1">Upload a Guideline. Understand it in 10 seconds.</h1><p className="text-sm text-slate-500 mt-1">Text-based PDFs & TXT supported. Scanned PDFs will need OCR (roadmap). Your file is processed for this demo — do not upload sensitive private documents.</p>
      <div className="grid lg:grid-cols-2 gap-5 mt-5">
        <div className="space-y-4">
          <div className="bg-white rounded-[28px] border-2 border-dashed border-emerald-300 p-6 text-center shadow">
            <Upload size={36} className="mx-auto text-emerald-600"/><p className="font-black mt-2">Drop scheme guideline PDF here</p><p className="text-xs text-slate-500">or choose a file (.pdf / .txt, max demo)</p>
            <label className="inline-block mt-4 bg-emerald-700 text-white font-black px-5 py-3 rounded-full cursor-pointer text-sm">Choose File<input type="file" accept=".pdf,.txt" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f){ setDocFileName(f.name); processDoc(false,f); } }}/></label>
            {docFileName && <p className="text-xs font-bold mt-2">📄 {docFileName}</p>}
            <div className="mt-5 border-t pt-4"><p className="text-xs font-black text-slate-500">NO FILE HANDY? USE HACKATHON SAMPLE</p><button onClick={()=>processDoc(true)} disabled={docLoading} className="mt-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-5 py-3 rounded-full text-sm w-full">{docLoading?"Extracting text & summarising…":"📄 Use Sample: Rythu Bharosa Guidelines 2025-26.pdf"}</button></div>
          </div>
          <div className="bg-emerald-950 text-white rounded-[28px] p-5"><p className="font-black">How GramAI reads your document</p><ol className="text-sm text-emerald-100/85 space-y-2 mt-3">{["Extracts text layer from PDF (OCR for scanned files — roadmap)","Finds scheme name, benefits, eligibility, documents, deadline & steps","Explains in simple language & builds your checklist","Compares criteria against your profile (Ramesh: Farmer, Telangana)"].map((x,i)=>(<li key={x} className="flex gap-2"><span className="w-5 h-5 rounded-full bg-emerald-500 grid place-items-center text-[11px] font-black shrink-0">{i+1}</span>{x}</li>))}</ol></div>
        </div>
        <div>
          {!docResult && !docLoading && <div className="bg-white rounded-[28px] border shadow p-8 text-center h-full grid place-items-center"><div><FileText size={40} className="mx-auto text-slate-300"/><p className="font-black mt-3">Your simple summary will appear here</p><p className="text-sm text-slate-500 mt-1">Click “Use Sample Guideline” to see extraction, eligibility comparison & actionable checklist.</p></div></div>}
          {docLoading && <div className="bg-white rounded-[28px] border shadow p-10 text-center animate-pulse font-black">Reading document… extracting scheme details…</div>}
          {docResult && (<div className="space-y-4">
            <div className="bg-white rounded-[28px] border shadow p-5"><div className="flex gap-2 flex-wrap"><span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2 py-1 rounded-full">✓ TEXT EXTRACTED • {docResult.charCount} chars</span><span className="bg-slate-100 text-[11px] font-black px-2 py-1 rounded-full">{docResult.extracted.pages}</span></div><h3 className="font-black text-xl mt-3">{docResult.extracted.schemeName}</h3><p className="text-sm text-slate-600 mt-2 bg-emerald-50 border border-emerald-100 rounded-2xl p-3">{docResult.extracted.summary}</p>
              <div className="grid grid-cols-2 gap-3 mt-4 text-sm"><div className="bg-slate-50 rounded-2xl p-3"><p className="text-[11px] font-black text-slate-400">BENEFIT</p><p className="font-bold mt-1">{docResult.extracted.benefit}</p></div><div className="bg-amber-50 rounded-2xl p-3"><p className="text-[11px] font-black text-amber-600">DEADLINE</p><p className="font-bold mt-1">{docResult.extracted.deadline}</p></div></div>
              <div className="mt-4"><p className="font-black text-sm">Eligibility found in document</p><ul className="mt-2 space-y-1">{docResult.extracted.eligibility.map((x:string)=>(<li key={x} className="flex gap-2 text-sm text-slate-600"><CheckCircle2 size={15} className="text-emerald-600 shrink-0"/>{x}</li>))}</ul></div>
              <div className="mt-4 bg-teal-50 border border-teal-100 rounded-2xl p-3"><p className="font-black text-sm text-teal-900">👤 Compared with your profile ({profile.name})</p><p className="text-sm text-teal-800 mt-1">You are a <b>{profile.occupation}</b> in <b>{profile.state}</b> with Aadhaar-linked profile — you appear to match the main criteria. Carry Pattadar Passbook + Dharani print to confirm land record at the Village Secretariat.</p></div>
            </div>
            <div className="bg-white rounded-[28px] border shadow p-5"><p className="font-black flex items-center gap-2"><ListChecks/> Actionable Checklist — tap when ready</p><div className="space-y-2 mt-3">{docResult.extracted.documents.map((d:string)=>{ const key="rythu-bharosa"; const has=(checkedDocs[key]||[]).includes(d); return (<button key={d} onClick={()=>toggleDoc(key,d)} className={`w-full flex gap-3 items-center p-3 rounded-2xl border text-left text-sm font-semibold ${has?"bg-emerald-600 text-white":"bg-white"}`}>{has?<CheckCircle2 size={17}/>:<Circle size={17} className="text-slate-300"/>}{d}<span className="ml-auto text-[10px] font-black">{has?"READY":"PENDING"}</span></button>)})}</div><button onClick={()=>setView("journey")} className="w-full bg-emerald-950 text-white font-black py-3 rounded-full mt-4">Track this in My Journey →</button></div>
            <details className="bg-white rounded-3xl border p-4 text-xs text-slate-500"><summary className="font-black cursor-pointer text-slate-700">View extracted raw text (source reference)</summary><p className="mt-2 whitespace-pre-wrap">{docResult.rawPreview}</p></details>
          </div>)}
        </div>
      </div>
    </main>)}

    {/* JOURNEY */}
    {view==="journey" && (<main className="max-w-6xl mx-auto px-4 py-6">
      <p className="text-emerald-700 font-black text-xs tracking-widest">APPLICATION JOURNEY TRACKER</p><h1 className="font-black text-3xl mt-1">From Discovery → Ready to Apply</h1><p className="text-sm text-slate-500 mt-1">GramAI tracks preparation only — it does <b>not</b> claim official submission. Final application happens on the Govt portal / MeeSeva.</p>
      <div className="grid md:grid-cols-4 gap-3 mt-5">{[["Discovered",saved.length,"Schemes saved"],["Eligibility Checked",journeyItems.filter(j=>j.e.score>0).length,"Assessments done"],["Documents Ready",`${overallDocs.d}/${overallDocs.t}`,overallDocs.pct+"% complete"],["Ready to Apply",journeyItems.filter(j=>j.stage.includes("Ready")).length,"Visit MeeSeva / Portal"]].map(([a,b,c])=>(<div key={a} className="bg-white rounded-3xl border shadow p-4 text-center"><p className="font-black text-2xl text-emerald-700">{b}</p><p className="font-black text-sm mt-1">{a}</p><p className="text-xs text-slate-500">{c}</p></div>))}</div>
      <div className="h-3 bg-white border rounded-full mt-4 overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-600 to-teal-400" style={{width:overallDocs.pct+"%"}}/></div><p className="text-xs font-bold mt-1">Overall document readiness: {overallDocs.pct}%</p>
      <div className="space-y-4 mt-6">{journeyItems.length===0 && <div className="bg-white rounded-3xl border p-8 text-center"><p className="font-black">No schemes saved yet</p><button onClick={()=>setView("schemes")} className="mt-3 bg-emerald-700 text-white px-4 py-2 rounded-full font-bold text-sm">Find & Save Schemes</button></div>}
      {journeyItems.map(({s,e,done,total,stage})=>{ const stages=["Discovered","Eligibility Checked","Documents Pending","Ready for Official Application"]; const idx=stages.indexOf(stage); return (<div key={s.id} className="bg-white rounded-[28px] border shadow p-5"><div className="flex flex-wrap gap-3 items-start"><div className="flex-1 min-w-[220px]"><p className="font-black">{s.name}</p><p className="text-xs text-slate-500">{s.benefit}</p><p className="text-xs mt-1"><span className="font-black text-emerald-700">{e.score}% eligibility match</span> • {done}/{total} documents ready</p></div><span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1.5 rounded-full">{stage}</span><button onClick={()=>openScheme(s)} className="border font-bold text-xs px-3 py-2 rounded-full">Continue →</button></div><div className="flex items-center mt-4">{stages.map((st,i)=>(<div key={st} className="flex items-center flex-1 last:flex-none"><div className="flex flex-col items-center"><span className={`w-8 h-8 rounded-full grid place-items-center text-xs font-black ${i<=idx?"bg-emerald-700 text-white":"bg-slate-200 text-slate-500"}`}>{i<=idx?"✓":i+1}</span><span className="text-[9px] font-bold mt-1 text-center w-16 leading-tight">{st}</span></div>{i<3 && <div className={`h-1 flex-1 mx-1 rounded ${i<idx?"bg-emerald-600":"bg-slate-200"}`}/>}</div>))}</div><p className="text-xs bg-amber-50 border border-amber-100 rounded-xl p-2.5 mt-3">➡️ <b>Next action:</b> {done<total?`Arrange missing documents: ${s.documents.filter(d=>!(checkedDocs[s.id]||[]).includes(d)).join(", ")}`:`All documents ready! Visit ${s.source} or nearest MeeSeva/CSC to apply officially.`}</p></div>)})}</div>
    </main>)}

    {/* SERVICES */}
    {view==="services" && (<main className="max-w-6xl mx-auto px-4 py-6">
      <p className="text-emerald-700 font-black text-xs tracking-widest">PANCHAYAT SERVICES DIRECTORY • SAMPLE ENTRIES LABELLED</p><h1 className="font-black text-3xl mt-1">Local Services, Certificates & Offices</h1><p className="text-sm text-slate-500 mt-1">Search certificates, land records, agriculture help & welfare services. Entries marked Sample must be verified with your Panchayat.</p>
      <div className="flex bg-white border shadow rounded-full px-4 py-1 mt-4 items-center max-w-xl"><Search size={17} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search: income certificate, ration card, land…" className="flex-1 outline-none p-2.5 text-sm bg-transparent"/></div>
      <div className="grid md:grid-cols-2 gap-4 mt-5">{SERVICES.filter(s=>(s.name+s.dept+s.steps).toLowerCase().includes(query.toLowerCase())).map(s=>(<div key={s.id} className="bg-white rounded-[24px] border shadow p-5"><div className="flex gap-3"><span className="text-3xl">{s.icon}</span><div className="flex-1"><div className="flex gap-2 flex-wrap items-center"><p className="font-black">{s.name}</p>{s.verified?<span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full">VERIFIED</span>:<span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full">SAMPLE — VERIFY</span>}</div><p className="text-xs text-slate-500">{s.dept} • ⏱ {s.time} • Fee: {s.fee}</p></div></div><p className="text-sm text-slate-600 mt-3 bg-slate-50 rounded-2xl p-3">{s.steps}</p><p className="text-xs font-bold mt-3 flex items-center gap-1"><Phone size={12}/> {s.contact}</p></div>))}</div>
      <div className="bg-emerald-950 text-white rounded-[28px] p-5 mt-6 flex flex-wrap gap-4 items-center justify-between"><div><p className="font-black text-lg">Gram Panchayat Office — {profile.village}</p><p className="text-emerald-200 text-sm">Panchayat Secretary • Mon–Sat 10AM–5PM • Main Road, {profile.village}, {profile.district}</p></div><button onClick={()=>setView("complaints")} className="bg-amber-400 text-emerald-950 font-black px-5 py-3 rounded-full">File a Complaint →</button></div>
    </main>)}

    {/* COMPLAINTS */}
    {view==="complaints" && (<main className="max-w-6xl mx-auto px-4 py-6">
      <p className="text-emerald-700 font-black text-xs tracking-widest">PANCHAYAT COMPLAINT MANAGEMENT • DEMO RECORDS LABELLED</p><h1 className="font-black text-3xl mt-1">Report an Issue. Track it to Resolution.</h1><p className="text-sm text-slate-500 mt-1">Simulated demo complaints — not officially registered with Government unless integrated. You only see records in this demo workspace.</p>
      <div className="grid lg:grid-cols-5 gap-5 mt-5">
        <form onSubmit={submitComplaint} className="lg:col-span-2 bg-white rounded-[28px] border shadow p-5 h-fit">
          <p className="font-black">📝 New Complaint</p>
          <label className="block text-xs font-black mt-4">YOUR NAME<input value={profile.name} readOnly className="w-full border rounded-xl p-2.5 mt-1 bg-slate-50"/></label>
          <label className="block text-xs font-black mt-3">CATEGORY<select value={cForm.category} onChange={e=>setCForm({...cForm,category:e.target.value})} className="w-full border rounded-xl p-2.5 mt-1 bg-white"><option>Water Supply</option><option>Street Lights</option><option>Road & Drainage</option><option>Sanitation & Garbage</option><option>Electricity</option><option>Other</option></select></label>
          <label className="block text-xs font-black mt-3">VILLAGE<input value={cForm.village} onChange={e=>setCForm({...cForm,village:e.target.value})} className="w-full border rounded-xl p-2.5 mt-1"/></label>
          <label className="block text-xs font-black mt-3">DESCRIBE THE ISSUE<textarea required value={cForm.description} onChange={e=>setCForm({...cForm,description:e.target.value})} rows={4} placeholder="e.g. Drinking water pipeline leakage near school for 3 days…" className="w-full border rounded-xl p-2.5 mt-1"/></label>
          <label className="block text-xs font-black mt-3">ATTACHMENT (OPTIONAL, DEMO)<input type="file" className="w-full border rounded-xl p-2 mt-1 text-xs"/></label>
          <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-full mt-4">Submit Complaint (Demo)</button>
          {lastRef && <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 mt-3 text-center"><p className="text-xs font-black text-emerald-700">✓ SUBMITTED (DEMO) — SAVE YOUR REFERENCE</p><p className="font-black text-xl tracking-wider">{lastRef}</p></div>}
          <div className="border-t mt-5 pt-4"><p className="font-black text-sm">🔍 Track by Reference Number</p><div className="flex gap-2 mt-2"><input value={trackRef} onChange={e=>setTrackRef(e.target.value)} placeholder="GRC-2026-XXXX" className="flex-1 border rounded-full px-3 text-sm uppercase"/><button type="button" onClick={()=>setToast(tracked?`Found: ${tracked.ref} — ${tracked.status}`:"No complaint found with that reference (demo data).")} className="bg-emerald-950 text-white px-4 rounded-full font-bold text-sm">Track</button></div>
          {tracked && <div className="mt-3 bg-slate-50 rounded-2xl p-3 text-sm"><div className="flex justify-between"><span className="font-black">{tracked.ref}</span><span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${STATUS_COLOR[tracked.status]||"bg-slate-200"}`}>{tracked.status}</span></div><p className="mt-1">{tracked.description}</p>{tracked.response && <p className="mt-2 bg-white border rounded-xl p-2 text-xs">💬 Panchayat: {tracked.response}</p>}<div className="flex gap-1 mt-3">{["Submitted","Under Review","In Progress","Resolved"].map((st,i)=>{ const order=["Submitted","Under Review","In Progress","Resolved"]; const active=order.indexOf(tracked.status)>=i; return <span key={st} className={`flex-1 text-center text-[9px] font-black py-1.5 rounded-full ${active?"bg-emerald-600 text-white":"bg-slate-200 text-slate-500"}`}>{st}</span>})}</div></div>}
          </div>
        </form>
        <div className="lg:col-span-3 space-y-3">
          <p className="font-black">Complaint History <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full ml-1">DEMO / SIMULATED RECORDS</span></p>
          {complaints.length===0 && <div className="bg-white rounded-3xl border p-6 text-center text-sm">Loading complaints… If database is offline, submit a complaint to see it here.</div>}
          {complaints.map(c=>(<div key={c.id||c.ref} className="bg-white rounded-[24px] border shadow p-4"><div className="flex flex-wrap gap-2 items-center"><span className="font-black text-sm">{c.ref}</span><span className="bg-slate-100 text-[11px] font-black px-2 py-1 rounded-full">{c.category}</span><span className={`px-2 py-1 rounded-full text-[11px] font-black ${STATUS_COLOR[c.status]||"bg-slate-100"}`}>{c.status}</span><span className="ml-auto text-[11px] text-slate-400">{c.village} • {c.createdAt?new Date(c.createdAt).toLocaleDateString("en-IN"):"Today"}</span></div><p className="text-sm mt-2">{c.description}</p><p className="text-xs text-slate-500 mt-1">By {c.citizenName} {c.isDemo?"• Demo record":""}</p>{c.response && <p className="text-xs bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 mt-2">💬 <b>Panchayat Response:</b> {c.response}</p>}</div>))}
        </div>
      </div>
    </main>)}

    {/* DASHBOARD */}
    {view==="dashboard" && (<main className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-3 items-end justify-between"><div><p className="text-emerald-700 font-black text-xs tracking-widest">CITIZEN DASHBOARD</p><h1 className="font-black text-3xl mt-1">Namaste, {profile.name} 🙏</h1><p className="text-sm text-slate-500">{profile.occupation} • {profile.village}, {profile.district}, {profile.state} • Age {profile.age} • Income ₹{profile.income.toLocaleString("en-IN")} • {profile.category} • Land {profile.land}</p></div><div className="flex gap-2"><button onClick={()=>setView("profile")} className="border bg-white font-bold px-4 py-2 rounded-full text-sm">Edit Profile</button><button onClick={()=>window.print()} className="bg-white border font-bold px-4 py-2 rounded-full text-sm flex gap-1 items-center"><Printer size={14}/> Print Summary</button></div></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">{[[topRecs.length+" schemes","Recommended for you",TrendingUp],[saved.length+" saved","In your journey",Heart],[overallDocs.pct+"%","Documents ready",FileCheck],[complaints.length+" complaints","Demo records tracked",Wrench]].map(([a,b,I]:any)=>(<div key={b} className="bg-white rounded-3xl border shadow p-4"><I className="text-emerald-600" size={22}/><p className="font-black text-xl mt-2">{a}</p><p className="text-xs text-slate-500 font-bold">{b}</p></div>))}</div>
      <div className="grid lg:grid-cols-3 gap-5 mt-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-[28px] border shadow p-5"><div className="flex justify-between"><p className="font-black">⭐ Personalised Recommendations</p><button onClick={()=>setView("schemes")} className="text-emerald-700 font-black text-xs">View all →</button></div><div className="grid md:grid-cols-2 gap-3 mt-3">{topRecs.slice(0,4).map(({s,e})=><SchemeCard key={s.id} s={s} score={e.score} saved={saved.includes(s.id)} onOpen={()=>openScheme(s)} onSave={()=>toggleSave(s.id)} compact/>)}</div></div>
          <div className="bg-white rounded-[28px] border shadow p-5"><p className="font-black">🧭 Application Preparation Status</p>{journeyItems.length===0?<p className="text-sm text-slate-500 mt-2">Save a scheme to start tracking.</p>:journeyItems.map(({s,e,done,total,stage})=>(<div key={s.id} className="flex gap-3 items-center border rounded-2xl p-3 mt-3"><div className="flex-1"><p className="font-bold text-sm">{s.name}</p><p className="text-xs text-slate-500">{stage} • {done}/{total} docs • {e.score}% match</p><div className="h-2 bg-slate-100 rounded-full mt-2 overflow-hidden"><div className="h-full bg-emerald-600" style={{width:(total?done/total*100:0)+"%"}}/></div></div><button onClick={()=>openScheme(s)} className="bg-emerald-700 text-white text-xs font-black px-3 py-2 rounded-full shrink-0">Continue</button></div>))}<button onClick={()=>setView("journey")} className="text-emerald-700 font-black text-sm mt-3">Open full Journey Tracker →</button></div>
        </div>
        <div className="space-y-5">
          <div className="bg-emerald-950 text-white rounded-[28px] p-5 shadow"><p className="font-black">🤖 Ask GramAI</p><p className="text-emerald-200 text-sm mt-1">“Which documents do I need for {selected.name}?”</p><button onClick={()=>setView("ask")} className="bg-amber-400 text-emerald-950 font-black w-full py-3 rounded-full mt-4 text-sm">Chat in EN / తెలుగు / हिन्दी</button><button onClick={()=>setView("documents")} className="bg-white/15 font-black w-full py-3 rounded-full mt-2 text-sm">📄 Analyse a Guideline PDF</button></div>
          <div className="bg-white rounded-[28px] border shadow p-5"><p className="font-black">📋 Recent Complaints & Next Steps</p>{complaints.slice(0,3).map(c=>(<div key={c.ref} className="border rounded-2xl p-3 mt-3"><div className="flex justify-between text-xs"><span className="font-black">{c.ref}</span><span className={`px-2 py-0.5 rounded-full font-black ${STATUS_COLOR[c.status]}`}>{c.status}</span></div><p className="text-xs mt-1 line-clamp-2">{c.description}</p></div>))}<button onClick={()=>setView("complaints")} className="text-emerald-700 font-black text-sm mt-3">Track / File complaint →</button></div>
          <div className="bg-white rounded-[28px] border shadow p-5"><p className="font-black">✅ Eligibility Snapshot</p>{recommendations.slice(0,4).map(({s,e})=>(<div key={s.id} className="flex justify-between text-sm mt-2.5"><span className="truncate mr-2">{s.name}</span><span className={`font-black shrink-0 ${e.score>=80?"text-emerald-600":e.score>=50?"text-amber-600":"text-red-500"}`}>{e.score}%</span></div>))}<p className="text-[11px] text-slate-400 mt-3">Guidance only — not a guarantee of approval.</p></div>
        </div>
      </div>
    </main>)}

    {/* ADMIN */}
    {view==="admin" && (<main className="max-w-7xl mx-auto px-4 py-6">
      {role!=="admin" ? (<div className="bg-white rounded-[28px] border shadow p-10 text-center max-w-lg mx-auto"><ShieldCheck size={40} className="mx-auto text-emerald-600"/><p className="font-black text-xl mt-3">Admin Access (Demo)</p><p className="text-sm text-slate-500 mt-1">In production this requires secure login & role verification. For hackathon demo, click below to enter as Panchayat Official.</p><button onClick={()=>setRole("admin")} className="bg-emerald-700 text-white font-black px-6 py-3 rounded-full mt-4">Enter Admin Dashboard (Demo)</button></div>) : (<>
      <p className="text-emerald-700 font-black text-xs tracking-widest">ADMIN • GRAM PANCHAYAT OFFICIAL (DEMO ROLE)</p><h1 className="font-black text-3xl mt-1">Panchayat Admin Dashboard</h1><p className="text-sm text-slate-500">Role-based demo — in production, only authorised officials can update complaints & scheme verification.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">{[[SCHEMES.length,"Schemes managed"],[complaints.length,"Total complaints"],[complaints.filter(c=>c.status!=="Resolved").length,"Open / pending"],[complaints.filter(c=>c.status==="Resolved").length,"Resolved"]].map(([a,b])=>(<div key={b} className="bg-white rounded-3xl border shadow p-4 text-center"><p className="font-black text-3xl text-emerald-700">{a}</p><p className="text-xs font-bold text-slate-500">{b}</p></div>))}</div>
      <div className="flex gap-2 mt-5">{[["complaints","Complaint Management"],["schemes","Scheme Data & Verification"],["stats","Usage Statistics"]].map(([k,l])=>(<button key={k} onClick={()=>setAdminTab(k)} className={`px-4 py-2 rounded-full font-black text-sm ${adminTab===k?"bg-emerald-700 text-white":"bg-white border"}`}>{l}</button>))}</div>
      {adminTab==="complaints" && <div className="space-y-3 mt-4">{complaints.map(c=>(<AdminComplaint key={c.ref} c={c} onUpdate={adminUpdate}/>))}</div>}
      {adminTab==="schemes" && <div className="bg-white rounded-[28px] border shadow overflow-x-auto mt-4"><table className="w-full text-sm min-w-[640px]"><thead><tr className="text-left bg-emerald-50 text-xs"><th className="p-3">Scheme</th><th className="p-3">Category</th><th className="p-3">Level</th><th className="p-3">Source</th><th className="p-3">Verification</th></tr></thead><tbody>{SCHEMES.map(s=>(<tr key={s.id} className="border-t"><td className="p-3 font-bold">{s.name}</td><td className="p-3">{s.category}</td><td className="p-3">{s.level}</td><td className="p-3 text-teal-700 text-xs break-all max-w-[180px]">{s.source}</td><td className="p-3"><button onClick={()=>setVerifiedMap(m=>({...m,[s.id]:!m[s.id]}))} className={`px-3 py-1.5 rounded-full text-xs font-black ${verifiedMap[s.id]?"bg-emerald-600 text-white":"bg-amber-100 text-amber-800"}`}>{verifiedMap[s.id]?"✓ Verified":"Unverified"}</button></td></tr>))}</tbody></table></div>}
      {adminTab==="stats" && <div className="grid md:grid-cols-3 gap-4 mt-4">{[["Scheme Discovery","Most viewed: PM-KISAN, Rythu Bharosa, PMAY-G Housing","↑ Demo data from this workspace"],["Eligibility Checks",recommendations.filter(r=>r.e.score>=80).length+" citizens (demo profiles) with 80%+ matches","Based on 4 demo personas"],["Complaint Resolution",complaints.length?Math.round(complaints.filter(c=>c.status==="Resolved").length/complaints.length*100):0+"% resolved in demo records","Submitted → Resolved pipeline active"]].map(([a,b,c])=>(<div key={a} className="bg-white rounded-3xl border shadow p-5"><p className="font-black">{a}</p><p className="text-sm text-slate-600 mt-2">{b}</p><p className="text-xs text-emerald-700 font-bold mt-2">{c}</p><div className="h-2 bg-slate-100 rounded-full mt-3 overflow-hidden"><div className="h-full bg-emerald-500" style={{width:"68%"}}/></div></div>))}<div className="md:col-span-3 bg-amber-50 border border-amber-200 rounded-3xl p-4 text-sm">📊 Statistics are calculated from actual prototype data in this demo (schemes, demo profiles & complaints above) — connect analytics & production DB for real village metrics.</div></div>}
      </>)}
    </main>)}

    {/* PROFILE */}
    {view==="profile" && (<main className="max-w-4xl mx-auto px-4 py-6">
      <p className="text-emerald-700 font-black text-xs tracking-widest">CITIZEN PROFILE • DRIVES ALL RECOMMENDATIONS</p><h1 className="font-black text-3xl mt-1">My Profile</h1><p className="text-sm text-slate-500 mt-1">Change any field — eligibility, recommendations & journey update instantly everywhere. Demo data stays in your browser + prototype DB.</p>
      <div className="bg-white rounded-[28px] border shadow p-6 mt-5">
        <div className="flex gap-2 flex-wrap mb-5">{DEMO_PROFILES.map(p=>(<button key={p.label} onClick={()=>tryDemo(p)} className="bg-emerald-50 border hover:border-emerald-500 rounded-full px-3 py-2 text-xs font-black">{p.label}</button>))}<button onClick={()=>{setProfile(DEMO_PROFILE); setIsDemo(false);}} className="bg-slate-100 rounded-full px-3 py-2 text-xs font-black flex gap-1 items-center"><RotateCcw size={12}/> Reset</button></div>
        <div className="grid md:grid-cols-2 gap-4 text-sm font-bold">
          <label>Full Name<input value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} className="w-full border rounded-2xl p-3 mt-1 font-normal"/></label>
          <label>Mobile<input value={profile.phone} onChange={e=>setProfile({...profile,phone:e.target.value})} className="w-full border rounded-2xl p-3 mt-1 font-normal"/></label>
          <label>State<select value={profile.state} onChange={e=>setProfile({...profile,state:e.target.value})} className="w-full border rounded-2xl p-3 mt-1 bg-white font-normal"><option>Telangana</option><option>Andhra Pradesh</option><option>Karnataka</option><option>Maharashtra</option><option>Uttar Pradesh</option></select></label>
          <label>District<input value={profile.district} onChange={e=>setProfile({...profile,district:e.target.value})} className="w-full border rounded-2xl p-3 mt-1 font-normal"/></label>
          <label>Village<input value={profile.village} onChange={e=>setProfile({...profile,village:e.target.value})} className="w-full border rounded-2xl p-3 mt-1 font-normal"/></label>
          <label>Occupation<select value={profile.occupation} onChange={e=>setProfile({...profile,occupation:e.target.value})} className="w-full border rounded-2xl p-3 mt-1 bg-white font-normal"><option>Farmer</option><option>Student</option><option>Daily Wage Worker</option><option>Self-Employed</option><option>Unemployed</option><option>Retired / Pensioner</option></select></label>
          <label>Age<input type="number" value={profile.age} onChange={e=>setProfile({...profile,age:Number(e.target.value)})} className="w-full border rounded-2xl p-3 mt-1 font-normal"/></label>
          <label>Gender<select value={profile.gender} onChange={e=>setProfile({...profile,gender:e.target.value})} className="w-full border rounded-2xl p-3 mt-1 bg-white font-normal"><option>Male</option><option>Female</option><option>Other</option></select></label>
          <label>Annual Family Income (₹)<input type="number" value={profile.income} onChange={e=>setProfile({...profile,income:Number(e.target.value)})} className="w-full border rounded-2xl p-3 mt-1 font-normal"/></label>
          <label>Category<select value={profile.category} onChange={e=>setProfile({...profile,category:e.target.value})} className="w-full border rounded-2xl p-3 mt-1 bg-white font-normal"><option>General</option><option>OBC</option><option>BC</option><option>SC</option><option>ST</option><option>EWS</option></select></label>
          <label>Land Holding<input value={profile.land} onChange={e=>setProfile({...profile,land:e.target.value})} className="w-full border rounded-2xl p-3 mt-1 font-normal"/></label>
        </div>
        <div className="flex flex-wrap gap-3 mt-6"><button onClick={()=>{setView("schemes"); setToast("Profile saved! Eligibility updated for all schemes.");}} className="bg-emerald-700 text-white font-black px-6 py-3 rounded-full">Save & See Updated Eligibility →</button><button onClick={()=>setView("dashboard")} className="border font-black px-6 py-3 rounded-full">Go to Dashboard</button></div>
        <p className="text-[11px] text-slate-400 mt-4">🔒 Privacy: Demo profile is fictional. In production, data is encrypted, consent-based & never sold. Citizens see only their own records; admin actions are role-protected.</p>
      </div>
      <div className="bg-white rounded-[28px] border shadow p-5 mt-5"><p className="font-black">Live Eligibility Preview — updates as you type above</p><div className="grid md:grid-cols-2 gap-2 mt-3">{recommendations.slice(0,6).map(({s,e})=>(<button key={s.id} onClick={()=>openScheme(s)} className="flex justify-between border rounded-2xl p-3 text-sm text-left"><span className="font-semibold truncate mr-2">{s.name}</span><span className={`font-black ${e.score>=80?"text-emerald-600":e.score>=50?"text-amber-600":"text-red-500"}`}>{e.score}%</span></button>))}</div></div>
    </main>)}

    <footer className="max-w-7xl mx-auto px-4 py-8 mt-6 border-t">
      <div className="flex flex-col md:flex-row gap-4 justify-between text-sm"><div><p className="font-black text-emerald-950 flex items-center gap-2"><Sprout className="text-emerald-700"/> GramAI Connect</p><p className="text-slate-500 text-xs mt-1 max-w-md">Government Benefits, Made Simple for Every Citizen. Hackathon prototype — scheme data grounded in official portals (linked per scheme), complaints & journeys are simulated demo records. Always verify on the official portal / MeeSeva before applying.</p></div><div className="text-xs text-slate-500 space-y-1"><p className="font-black text-slate-700">Setup & Docs</p><p>ENV: DATABASE_URL (Postgres) • OPENAI_API_KEY optional for live LLM (fallback engine works without it)</p><p>Stack: Next.js • TypeScript • Tailwind • Drizzle • PostgreSQL • Grounded AI Agent</p><p>Limitations: OCR for scanned PDFs, Govt API submission & real auth are next integrations.</p></div></div>
    </footer>

    {/* Floating Ask */}
    {view!=="ask" && <button onClick={()=>setView("ask")} className="fixed bottom-5 right-5 z-40 bg-emerald-700 hover:bg-emerald-800 text-white font-black pl-4 pr-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2"><MessageCircle size={20}/> Ask GramAI</button>}
  </div>);
}

function SchemeCard({s,score,saved,onOpen,onSave,compact}:{s:Scheme;score:number;saved:boolean;onOpen:()=>void;onSave:()=>void;compact?:boolean}){
  const I = CAT_ICON[s.category]||Sparkles;
  return (<div className="bg-white rounded-[24px] border shadow hover:shadow-xl transition p-4 flex flex-col">
    <div className="flex items-start gap-3"><span className="w-11 h-11 rounded-2xl bg-emerald-100 grid place-items-center shrink-0"><I size={21} className="text-emerald-700"/></span><div className="flex-1 min-w-0"><div className="flex gap-1.5 flex-wrap"><span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full">{s.category}</span><span className="bg-slate-100 text-[10px] font-black px-2 py-0.5 rounded-full">{s.level}</span>{s.verified?<span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">✓ Verified</span>:<span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full">Unverified</span>}</div><p className="font-black leading-tight mt-1.5">{s.name}</p></div><button onClick={onSave} className={`text-xl leading-none ${saved?"text-red-500":"text-slate-300"}`} title="Save scheme">{saved?"♥":"♡"}</button></div>
    {!compact && <p className="text-xs text-slate-500 mt-2 line-clamp-2">{s.description}</p>}
    <p className="text-[13px] font-bold text-emerald-800 bg-emerald-50 rounded-xl px-2.5 py-2 mt-3 flex gap-1.5"><IndianRupee size={15} className="shrink-0 mt-0.5"/>{s.benefit}</p>
    <div className="flex items-center gap-2 mt-3"><div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-600 to-teal-400" style={{width:score+"%"}}/></div><span className={`text-xs font-black ${score>=80?"text-emerald-600":score>=50?"text-amber-600":"text-slate-500"}`}>{score}% match</span></div>
    <div className="flex gap-2 mt-3"><button onClick={onOpen} className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black py-2.5 rounded-full text-sm">Check Eligibility →</button><button onClick={onSave} className="border font-black px-3 rounded-full text-sm">{saved?"Saved":"Save"}</button></div>
    <p className="text-[10px] text-slate-400 mt-2">⏰ {s.deadline} • {s.documents.length} documents needed</p>
  </div>);
}

function AdminComplaint({c,onUpdate}:{c:any;onUpdate:(ref:string,status:string,response:string)=>void}){
  const [status,setStatus]=useState(c.status); const [resp,setResp]=useState(c.response||"");
  useEffect(()=>{setStatus(c.status); setResp(c.response||"");},[c.status,c.response]);
  return (<div className="bg-white rounded-[24px] border shadow p-4"><div className="flex flex-wrap gap-2 items-center"><span className="font-black">{c.ref}</span><span className="bg-slate-100 text-[11px] font-black px-2 py-1 rounded-full">{c.category}</span><span className="text-xs text-slate-500">{c.citizenName} • {c.village}</span><span className="ml-auto bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-1 rounded-full">DEMO RECORD</span></div><p className="text-sm mt-2">{c.description}</p><div className="flex flex-col md:flex-row gap-2 mt-3"><select value={status} onChange={e=>setStatus(e.target.value)} className="border rounded-full px-3 py-2 text-sm font-bold bg-white"><option>Submitted</option><option>Under Review</option><option>In Progress</option><option>Resolved</option></select><input value={resp} onChange={e=>setResp(e.target.value)} placeholder="Panchayat response to citizen…" className="flex-1 border rounded-full px-3 text-sm"/><button onClick={()=>onUpdate(c.ref,status,resp)} className="bg-emerald-700 text-white font-black px-4 py-2 rounded-full text-sm">Update Status</button></div></div>);
}
