export type SupportedLang = "en" | "te" | "hi";

export const CATEGORY_TRANSLATIONS: Record<SupportedLang, Record<string, string>> = {
  en: {
    All: "All Categories",
    Agriculture: "Agriculture",
    Education: "Education",
    Employment: "Employment",
    "Women & Child": "Women & Child",
    Healthcare: "Healthcare",
    Housing: "Housing",
    Pensions: "Pensions",
    "Financial Assistance": "Financial Assistance",
  },
  te: {
    All: "అన్ని రంగాలు",
    Agriculture: "వ్యవసాయం",
    Education: "విద్య",
    Employment: "ఉపాధి",
    "Women & Child": "మహిళలు & శిశు సంక్షేమం",
    Healthcare: "ఆరోగ్యం",
    Housing: "గృహ నిర్మాణం",
    Pensions: "పెన్షన్లు",
    "Financial Assistance": "ఆర్థిక సహాయం",
  },
  hi: {
    All: "सभी श्रेणियां",
    Agriculture: "कृषि",
    Education: "शिक्षा",
    Employment: "रोज़गार",
    "Women & Child": "महिला एवं बाल कल्याण",
    Healthcare: "स्वास्थ्य",
    Housing: "आवास",
    Pensions: "पेंशन",
    "Financial Assistance": "वित्तीय सहायता",
  },
};

export const STATUS_TRANSLATIONS: Record<SupportedLang, Record<string, string>> = {
  en: {
    Submitted: "Submitted",
    "Under Review": "Under Review",
    "In Progress": "In Progress",
    Resolved: "Resolved",
  },
  te: {
    Submitted: "సమర్పించబడింది",
    "Under Review": "పరిశీలనలో ఉంది",
    "In Progress": "పని పురోగతిలో ఉంది",
    Resolved: "పరిష్కరించబడింది",
  },
  hi: {
    Submitted: "दर्ज की गई",
    "Under Review": "समीक्षाधीन",
    "In Progress": "कार्य प्रगति पर",
    Resolved: "समाधान किया गया",
  },
};

export const STAGE_TRANSLATIONS: Record<SupportedLang, Record<string, string>> = {
  en: {
    Discovered: "Discovered",
    "Eligibility Checked": "Eligibility Checked",
    "Documents Pending": "Documents Pending",
    "Ready for Official Application": "Ready for Official Application",
  },
  te: {
    Discovered: "కనుగొనబడింది",
    "Eligibility Checked": "అర్హత పరిశీలించబడింది",
    "Documents Pending": "పత్రాలు అవసరం",
    "Ready for Official Application": "అధికారిక దరఖాస్తుకు సిద్ధం",
  },
  hi: {
    Discovered: "योजना खोजी गई",
    "Eligibility Checked": "पात्रता जांची गई",
    "Documents Pending": "दस्तावेज़ लंबित",
    "Ready for Official Application": "आधिकारिक आवेदन हेतु तैयार",
  },
};

export const TRANSLATIONS: Record<SupportedLang, Record<string, string>> = {
  en: {
    // Top bar & Header
    topStripNotice: "Gram Panchayat Digital Seva • Live OpenRouter & Sarvam AI Integration • Not an official Govt portal",
    helpline: "Helpline 1800-425-XXXX",
    meesevaCsc: "MeeSeva • CSC Centre",
    adminModeOn: "Admin Mode ON — Exit",
    adminLogin: "Admin Login",
    tagline: "Government Benefits, Made Simple for Every Citizen.",
    demoBtn: "Try Demo",
    myProfile: "My Profile",
    navLogin: "Log in",
    navSignup: "Sign up",
    navLogout: "Log out",
    citizenRole: "Citizen",
    officerRole: "Panchayat Officer",
    adminRole: "Admin",

    // Navigation
    navHome: "Home",
    navSchemes: "Find Schemes",
    navAsk: "Ask GramAI",
    navDocs: "Documents & OCR",
    navJourney: "My Journey",
    navServices: "Panchayat Services",
    navComplaints: "Complaints",
    navDashboard: "Dashboard",
    navAdmin: "Admin",
    navProfile: "Profile",

    // Hero Section
    heroBadge: "AI-POWERED • VOICE-ENABLED • MULTILINGUAL",
    heroTitle: "Every scheme you deserve. One simple place.",
    heroSub: "Discover welfare schemes, check eligibility in plain language, analyze documents with OCR, prepare applications and track your journey — in English, తెలుగు & हिन्दी.",
    searchPlaceholder: "Search: farmer, scholarship, pension, house, health…",
    searchBtn: "Search",
    tryDemoCta: "Try Demo — Load Sample Citizen",
    askGramAiCta: "Ask GramAI Assistant",

    // Stats
    statSchemesDb: "Schemes in database",
    statMatchedFor: "Matched for",
    statLanguages: "Languages EN • TE • HI",
    statComplaints: "Panchayat complaints tracked",

    // Profile card on home
    forYou: "FOR YOU",
    namaste: "Namaste",
    openDashboard: "Open My Dashboard",
    docIntelTitle: "Document Intelligence & OCR",
    docIntelSub: "Upload a scheme guideline PDF or image — GramAI extracts eligibility, benefits & checklist with AI.",
    trySampleGuideline: "Try with sample guideline",

    // Categories
    browseByNeed: "BROWSE BY NEED",
    whatHelpTitle: "What help does your family need today?",
    allSchemes: "All schemes",
    schemesLabel: "schemes",

    // Recommendations
    recommendedFor: "Recommended for",
    rankingSub: "Ranked by your profile match. Guidance only — final approval by the Government after verification.",
    matchLabel: "match",
    checkEligibilityBtn: "Check Eligibility →",
    saveSchemeBtn: "Save",
    savedSchemeBtn: "Saved",
    verifiedBadge: "Verified Source",
    unverifiedBadge: "Unverified — Verify locally",

    // Demo personas
    demoPersonasTitle: "Try different demo citizens",
    demoPersonasSub: "One click loads a citizen profile — recommendations, eligibility and checklists update instantly.",
    loadThisProfile: "Load this profile →",

    // Scheme Discovery Page
    schemeDiscoveryBadge: "FIND SCHEMES • CENTRAL + STATE",
    schemeDiscoveryTitle: "Government Scheme Discovery",
    schemeDiscoverySub: "Search by name, keyword, category or beneficiary group. Verified entries link to official government portals.",
    filterAllLevel: "All Levels",
    filterCentral: "Central Schemes",
    filterState: "State Schemes",
    foundCountText: "scheme(s) found for",
    inState: "in",
    noSchemesMatch: "No schemes match your search",
    clearFilters: "Clear filters",

    // Scheme Detail
    aboutScheme: "About this scheme",
    whoCanApply: "Who can apply (from scheme rules)",
    howToApply: "How to apply — step by step",
    officialPortalBtn: "Official Portal ↗",
    askAboutSchemeBtn: "Ask GramAI about this",
    disclaimerScheme: "GramAI assists in discovery and preparation. Apply only via official portal / MeeSeva / CSC.",
    smartEligibility: "Smart Eligibility Checker",
    nextAction: "NEXT ACTION",
    tweakProfileNotice: "Change your profile fields — assessment updates instantly:",
    ageLabel: "Age",
    incomeLabel: "Yearly Family Income (₹)",
    occupationLabel: "Occupation",
    genderLabel: "Gender",
    documentChecklist: "Document Checklist",
    haveIt: "HAVE IT ✓",
    missing: "MISSING",
    saveTrackJourneyBtn: "Save & Track in My Journey →",

    // Ask GramAI Page
    askHeaderBadge: "ASK GRAMAI • MULTILINGUAL AI ASSISTANT",
    askHeaderTitle: "Namaste 🙏 Ask me anything about government schemes",
    askHeaderSub: "Powered by OpenRouter LLM and Sarvam AI voice. Grounded in verified scheme rules.",
    listeningStatus: "Listening to your voice… speak in Telugu, Hindi or English",
    speakingStatus: "Playing voice response…",
    recordingMicBtn: "Speak in Telugu / Hindi / English",
    recordingStopBtn: "Stop Recording",
    chatPlaceholder: "Ask: documents for PM-KISAN, how to apply for pension, scholarship…",
    sendBtn: "Send",
    transcriptNotice: "Speech recognized:",
    confirmSendAudio: "Use Transcript",
    editTranscript: "Edit text",
    sourceReference: "Official Source Reference",

    // Document Intelligence Page
    docIntelBadge: "GOVERNMENT DOCUMENT INTELLIGENCE & OCR",
    docIntelHeaderTitle: "Upload a Guideline or Certificate. Understand it in seconds.",
    docIntelHeaderSub: "Upload PDFs, scanned documents or images. GramAI extracts text, benefits, eligibility and prepares an actionable checklist.",
    dropzoneTitle: "Drop scheme guideline PDF or image here",
    dropzoneSub: "Supports .pdf, .png, .jpg, .txt (max 20MB)",
    chooseFileBtn: "Choose File",
    useSampleBtn: "Use Sample: Rythu Bharosa Guidelines 2025-26.pdf",
    extractingText: "Reading document with OCR… extracting scheme details…",
    extractionDoneBadge: "TEXT EXTRACTED",
    benefitLabel: "BENEFIT",
    deadlineLabel: "DEADLINE",
    eligibilityFound: "Eligibility criteria found in document",
    comparedWithProfile: "Compared with your profile",
    actionableChecklistTitle: "Actionable Checklist — tap when ready",
    trackInJourneyBtn: "Track this in My Journey →",
    viewRawText: "View extracted raw text (source reference)",

    // Form Preparation
    formPrepTitle: "Conversational Form Preparation",
    formPrepSub: "GramAI helps you fill and verify official application fields before visiting MeeSeva or CSC.",
    formStep1: "1. Basic Details",
    formStep2: "2. Required Documents",
    formStep3: "3. Verification & Confirmation",
    applicantName: "Applicant Name",
    applicantPhone: "Mobile Number",
    aadhaarLast4: "Aadhaar Last 4 Digits",
    bankAccountNo: "Bank Account Number",
    bankIfsc: "Bank IFSC Code",
    landSurveyNo: "Land Survey / Patta Number",
    confirmAccuracy: "I certify that all details provided are accurate according to my official identity documents.",
    saveApplicationDraft: "Save Prepared Application Draft",
    downloadApplicationSummary: "Download / Print Application Package",
    applicationPreparedNotice: "Application package prepared and saved to your Journey. Present this at your local MeeSeva or CSC centre for official biometric submission.",

    // My Journey Page
    journeyBadge: "APPLICATION JOURNEY TRACKER",
    journeyTitle: "From Discovery → Ready to Apply",
    journeySub: "GramAI tracks preparation and document readiness. Final application is submitted on the Government portal or MeeSeva.",
    overallReadiness: "Overall document readiness:",
    noSchemesSaved: "No schemes saved yet",
    findSchemesBtn: "Find & Save Schemes",
    continueBtn: "Continue →",

    // Panchayat Services
    servicesBadge: "PANCHAYAT SERVICES DIRECTORY",
    servicesTitle: "Local Services, Certificates & Offices",
    servicesSub: "Certificates, revenue services, water supply and Gram Panchayat assistance.",
    searchServicesPlaceholder: "Search: income certificate, ration card, land records, death certificate…",
    fileComplaintBtn: "File a Complaint →",

    // Complaints Page
    complaintsBadge: "PANCHAYAT COMPLAINT MANAGEMENT",
    complaintsTitle: "Report an Issue. Track it to Resolution.",
    complaintsSub: "Register civic and infrastructure complaints directly with the Gram Panchayat. Track real-time progress.",
    newComplaintHeader: "New Complaint",
    complaintCategory: "CATEGORY",
    villageLabel: "VILLAGE",
    describeIssue: "DESCRIBE THE ISSUE",
    describeIssuePlaceholder: "e.g. Drinking water pipeline leakage near SC Colony for 3 days…",
    attachPhoto: "ATTACH PHOTO (OPTIONAL)",
    submitComplaintBtn: "Submit Complaint",
    trackByRef: "Track by Reference Number",
    trackRefPlaceholder: "GRC-2026-XXXX",
    trackBtn: "Track",
    complaintHistory: "Complaint History",
    panchayatResponse: "Panchayat Response:",

    // Dashboard Page
    dashboardBadge: "CITIZEN DASHBOARD",
    printSummaryBtn: "Print Summary",
    editProfileBtn: "Edit Profile",
    personalizedRecs: "Personalised Recommendations",
    viewAllSchemes: "View all →",
    appPrepStatus: "Application Preparation Status",
    recentComplaints: "Recent Complaints & Status",
    eligibilitySnapshot: "Eligibility Snapshot",

    // Admin Page
    adminBadge: "ADMIN • GRAM PANCHAYAT OFFICIAL",
    adminTitle: "Panchayat Administration Dashboard",
    adminSub: "Manage citizen complaints, verify scheme rules, and review village service metrics.",
    schemesManaged: "Schemes managed",
    totalComplaints: "Total complaints",
    openPending: "Open / Pending",
    resolvedComplaints: "Resolved",
    tabComplaints: "Complaint Management",
    tabSchemes: "Scheme Data & Verification",
    tabStats: "Village Statistics",
    updateStatusBtn: "Update Status",

    // Profile Page
    profileBadge: "CITIZEN PROFILE • DRIVES ALL RECOMMENDATIONS",
    profileTitle: "My Profile",
    profileSub: "Update any field — recommendations, eligibility and checklists recalculate instantly.",
    fullName: "Full Name",
    mobilePhone: "Mobile Number",
    stateField: "State",
    districtField: "District",
    villageField: "Village",
    occupationField: "Occupation",
    ageField: "Age",
    genderField: "Gender",
    incomeField: "Annual Family Income (₹)",
    categoryField: "Social Category",
    landField: "Land Holding",
    saveProfileBtn: "Save & Update Eligibility →",
    resetProfileBtn: "Reset to Default",
    privacyNotice: "Privacy: Personal data is securely stored and never shared without consent.",

    // Footer
    footerAboutTitle: "GramAI Connect",
    footerAboutText: "Government Benefits, Made Simple for Every Citizen. Powered by OpenRouter AI, Sarvam AI Voice, and verified government scheme rules.",
    footerTechNotice: "Integrated Stack: Next.js • OpenRouter • Sarvam AI • Neon PostgreSQL • Drizzle ORM.",
  },

  te: {
    // Top bar & Header
    topStripNotice: "గ్రామ పంచాయతీ డిజిటల్ సేవ • ఓపెన్‌రూటర్ AI & సర్వమ్ వాయిస్ అనుసంధానం • అధికారిక పోర్టల్ కాదు",
    helpline: "సహాయవాణి 1800-425-XXXX",
    meesevaCsc: "మీసేవ • CSC కేంద్రం",
    adminModeOn: "అడ్మిన్ మోడ్ ఆన్ — నిష్క్రమించండి",
    adminLogin: "అడ్మిన్ లాగిన్",
    tagline: "ప్రతి పౌరుడికి ప్రభుత్వ ప్రయోజనాలు, సులభంగా.",
    demoBtn: "డెమో చూడండి",
    myProfile: "నా ప్రొఫైల్",
    navLogin: "లాగిన్",
    navSignup: "రిజిస్టర్",
    navLogout: "లాగౌట్",
    citizenRole: "పౌరుడు",
    officerRole: "పంచాయతీ అధికారి",
    adminRole: "అడ్మిన్",

    // Navigation
    navHome: "హోమ్",
    navSchemes: "పథకాలు కనుగొనండి",
    navAsk: "గ్రామ్AI ని అడగండి",
    navDocs: "పత్రాలు & OCR",
    navJourney: "నా ప్రయాణం",
    navServices: "పంచాయతీ సేవలు",
    navComplaints: "ఫిర్యాదులు",
    navDashboard: "డ్యాష్‌బోర్డ్",
    navAdmin: "అడ్మిన్",
    navProfile: "ప్రొఫైల్",

    // Hero Section
    heroBadge: "AI ఆధారిత • వాయిస్ సదుపాయం • బహుభాషా వేదిక",
    heroTitle: "మీకు అర్హత ఉన్న ప్రతి పథకం. ఒకే సులభమైన చోట.",
    heroSub: "సంక్షేమ పథకాలు కనుగొనండి, సులభమైన తెలుగులో అర్హత తెలుసుకోండి, OCR ద్వారా పత్రాలను విశ్లేషించండి, దరఖాస్తును సిద్ధం చేయండి — తెలుగు, हिन्दी & English లో.",
    searchPlaceholder: "శోధించండి: రైతు, స్కాలర్‌షిప్, పెన్షన్, ఇల్లు, ఆరోగ్యం…",
    searchBtn: "శోధించండి",
    tryDemoCta: "డెమో ప్రయత్నించండి — పౌరుడి వివరాలు",
    askGramAiCta: "గ్రామ్AI సహాయకుడిని అడగండి",

    // Stats
    statSchemesDb: "డేటాబేస్‌లో పథకాలు",
    statMatchedFor: "అర్హత కలిగినవి:",
    statLanguages: "భాషలు: తెలుగు • हिन्दी • EN",
    statComplaints: "పరిష్కరిస్తున్న ఫిర్యాదులు",

    // Profile card on home
    forYou: "మీ కోసం",
    namaste: "నమస్కారం",
    openDashboard: "నా డ్యాష్‌బోర్డ్ తెరవండి",
    docIntelTitle: "పత్రాల విశ్లేషణ & OCR",
    docIntelSub: "పథకం మార్గదర్శకాల PDF లేదా ఫోటో అప్‌లోడ్ చేయండి — గ్రామ్AI అర్హతలు, ప్రయోజనాలు & చెక్‌లిస్ట్‌ను తెలుగులో అందిస్తుంది.",
    trySampleGuideline: "నమూనా మార్గదర్శకాలను చూడండి",

    // Categories
    browseByNeed: "అవసరాల వారీగా పథకాలు",
    whatHelpTitle: "మీ కుటుంబానికి నేడు ఎలాంటి సహాయం కావాలి?",
    allSchemes: "అన్ని పథకాలు",
    schemesLabel: "పథకాలు",

    // Recommendations
    recommendedFor: "మీకు సిఫార్సు చేయబడిన పథకాలు",
    rankingSub: "మీ ప్రొఫైల్ ఆధారంగా సూచించబడినవి. అధికారిక ధృవీకరణ తర్వాతే ప్రభుత్వ ఆమోదం లభిస్తుంది.",
    matchLabel: "సరిపోలిక",
    checkEligibilityBtn: "అర్హత పరిశీలించండి →",
    saveSchemeBtn: "భద్రపరచు",
    savedSchemeBtn: "భద్రపరచబడింది",
    verifiedBadge: "ధృవీకరించబడిన మూలం",
    unverifiedBadge: "స్థానికంగా ధృవీకరించుకోండి",

    // Demo personas
    demoPersonasTitle: "వివిధ నమూనా పౌరుల ప్రొఫైల్స్ చూడండి",
    demoPersonasSub: "ఒక్క క్లిక్‌తో ప్రొఫైల్ లోడ్ అవుతుంది — తక్షణమే సిఫార్సులు, అర్హతలు మరియు చెక్‌లిస్ట్ మారుతాయి.",
    loadThisProfile: "ఈ ప్రొఫైల్‌ను లోడ్ చేయండి →",

    // Scheme Discovery Page
    schemeDiscoveryBadge: "పథకాలు • కేంద్ర + రాష్ట్ర ప్రభుత్వాలు",
    schemeDiscoveryTitle: "ప్రభుత్వ సంక్షేమ పథకాల శోధన",
    schemeDiscoverySub: "పేరు, రంగం లేదా లబ్ధిదారుల వర్గం ఆధారంగా వెతకండి. ధృవీకరించబడిన పథకాలకు అధికారిక ప్రభుత్వ పోర్టల్ లింక్ ఉంటుంది.",
    filterAllLevel: "అన్ని రంగాలు",
    filterCentral: "కేంద్ర ప్రభుత్వ పథకాలు",
    filterState: "రాష్ట్ర ప్రభుత్వ పథకాలు",
    foundCountText: "పథకాలు లభించాయి — వర్గం:",
    inState: "రాష్ట్రం:",
    noSchemesMatch: "మీరు వెతికిన పదానికి పథకాలు కనిపించలేదు",
    clearFilters: "ఫిల్టర్లను తొలగించండి",

    // Scheme Detail
    aboutScheme: "ఈ పథకం గురించి",
    whoCanApply: "ఎవరు దరఖాస్తు చేసుకోవచ్చు (నిబంధనలు)",
    howToApply: "దరఖాస్తు విధానం — దశల వారీగా",
    officialPortalBtn: "అధికారిక పోర్టల్ ↗",
    askAboutSchemeBtn: "గ్రామ్AI ని దీని గురించి అడగండి",
    disclaimerScheme: "గ్రామ్AI మార్గదర్శకత్వాన్ని మాత్రమే అందిస్తుంది. మీసేవ లేదా అధికారిక పోర్టల్ ద్వారా మాత్రమే దరఖాస్తు చేసుకోండి.",
    smartEligibility: "స్మార్ట్ అర్హత తనిఖీ",
    nextAction: "తదుపరి చర్య",
    tweakProfileNotice: "మీ వివరాలను మార్చండి — అర్హత శాతం తక్షణమే నవీకరించబడుతుంది:",
    ageLabel: "వయస్సు",
    incomeLabel: "వార్షిక కుటుంబ ఆదాయం (₹)",
    occupationLabel: "వృత్తి",
    genderLabel: "లింగం",
    documentChecklist: "అవసరమైన పత్రాల చెక్‌లిస్ట్",
    haveIt: "వద్ద ఉంది ✓",
    missing: "కావాలి",
    saveTrackJourneyBtn: "భద్రపరచి నా ప్రయాణంలో ట్రాక్ చేయండి →",

    // Ask GramAI Page
    askHeaderBadge: "గ్రామ్AI సహాయకుడు • బహుభాషా వాయిస్ AI",
    askHeaderTitle: "నమస్కారం 🙏 ప్రభుత్వ పథకాల గురించి నన్ను ఏదైనా అడగండి",
    askHeaderSub: "ఓపెన్‌రూటర్ AI మరియు సర్వమ్ వాయిస్ ద్వారా ఆధారితం. తెలుగులో మాట్లాడండి లేదా టైప్ చేయండి.",
    listeningStatus: "మీ స్వరాన్ని వింటున్నాను… తెలుగులో మాట్లాడండి",
    speakingStatus: "సమాధానం చదువుతున్నాను…",
    recordingMicBtn: "మైక్రోఫోన్ ద్వారా మాట్లాడండి (తెలుగు)",
    recordingStopBtn: "రికార్డింగ్ ఆపండి",
    chatPlaceholder: "అడగండి: పీఎం కిసాన్ పత్రాలు, పెన్షన్ అర్హత, రైతు భరోసా వివరాలు…",
    sendBtn: "పంపు",
    transcriptNotice: "గుర్తించిన మాటలు:",
    confirmSendAudio: "ఈ సందేశాన్ని పంపండి",
    editTranscript: "సవరించండి",
    sourceReference: "అధికారిక ప్రభుత్వ మూలం",

    // Document Intelligence Page
    docIntelBadge: "ప్రభుత్వ పత్రాల విశ్లేషణ & OCR",
    docIntelHeaderTitle: "మార్గదర్శకాలు లేదా సర్టిఫికెట్ అప్‌లోడ్ చేయండి. క్షణాల్లో అర్థం చేసుకోండి.",
    docIntelHeaderSub: "PDF లేదా ఫోటోలను అప్‌లోడ్ చేయండి. గ్రామ్AI అర్హతలు, ప్రయోజనాలు మరియు అవసరమైన పత్రాల జాబితాను రూపొందిస్తుంది.",
    dropzoneTitle: "PDF లేదా పత్రం ఫోటోను ఇక్కడ ఉంచండి",
    dropzoneSub: "సహాయపడే ఫైల్స్: .pdf, .png, .jpg, .txt (గరిష్టంగా 20MB)",
    chooseFileBtn: "ఫైల్ ఎంచుకోండి",
    useSampleBtn: "నమూనా: రైతు భరోసా మార్గదర్శకాలు 2025-26.pdf",
    extractingText: "పత్రం చదువుతున్నాము… వివరాలు సేకరిస్తున్నాము…",
    extractionDoneBadge: "పత్రం చదవబడింది",
    benefitLabel: "లభించే ప్రయోజనం",
    deadlineLabel: "చివరి తేదీ",
    eligibilityFound: "పత్రంలో గుర్తించిన అర్హతలు",
    comparedWithProfile: "మీ ప్రొఫైల్‌తో పోలిక",
    actionableChecklistTitle: "పత్రాల చెక్‌లిస్ట్ — సిద్ధమైన వాటిని గుర్తించండి",
    trackInJourneyBtn: "నా ప్రయాణంలో ట్రాక్ చేయండి →",
    viewRawText: "పత్రం అసలు పాఠం చూడండి",

    // Form Preparation
    formPrepTitle: "దరఖాస్తు ఫారమ్ తయారీ సహాయకుడు",
    formPrepSub: "మీసేవ లేదా CSC కి వెళ్లేముందు మీ దరఖాస్తు వివరాలను ఇక్కడ సరిచూసుకోండి.",
    formStep1: "1. ప్రాథమిక వివరాలు",
    formStep2: "2. అవసరమైన పత్రాలు",
    formStep3: "3. ధృవీకరణ & నిర్ధారణ",
    applicantName: "దరఖాస్తుదారుడి పేరు",
    applicantPhone: "మొబైల్ నంబర్",
    aadhaarLast4: "ఆధార్ చివరి 4 అంకెలు",
    bankAccountNo: "బ్యాంక్ ఖాతా సంఖ్య",
    bankIfsc: "బ్యాంక్ IFSC కోడ్",
    landSurveyNo: "భూమి సర్వే నంబర్ / పట్టా",
    confirmAccuracy: "పైన ఇచ్చిన వివరాలన్నీ నా అధికారిక గుర్తింపు కార్డుల ప్రకారం సరైనవని ధృవీకరిస్తున్నాను.",
    saveApplicationDraft: "తయారుచేసిన దరఖాస్తును భద్రపరచండి",
    downloadApplicationSummary: "దరఖాస్తు సారాంశాన్ని ప్రింట్ చేయండి",
    applicationPreparedNotice: "మీ దరఖాస్తు ప్యాకేజీ సిద్ధమైంది. దీనిని మీ సమీపంలోని మీసేవ లేదా గ్రామ పంచాయతీ కేంద్రానికి తీసుకెళ్లండి.",

    // My Journey Page
    journeyBadge: "దరఖాస్తు ప్రయాణ ట్రాకర్",
    journeyTitle: "పథకం కనుగొనడం నుండి దరఖాస్తు సిద్ధం వరకు",
    journeySub: "గ్రామ్AI పత్రాల సంసిద్ధతను ట్రాక్ చేస్తుంది. తుది దరఖాస్తు అధికారిక పోర్టల్ లేదా మీసేవ ద్వారా చేయాలి.",
    overallReadiness: "మొత్తం పత్రాల సంసిద్ధత:",
    noSchemesSaved: "ఇంకా ఏ పథకాన్ని భద్రపరచలేదు",
    findSchemesBtn: "పథకాలను వెతికి భద్రపరచండి",
    continueBtn: "కొనసాగించండి →",

    // Panchayat Services
    servicesBadge: "పంచాయతీ సేవల డైరెక్టరీ",
    servicesTitle: "స్థానిక సేవలు, ధృవీకరణ పత్రాలు & కార్యాలయాలు",
    servicesSub: "ఆదాయం, కులం, జనన ధృవీకరణ పత్రాలు, తాగునీరు మరియు పంచాయతీ సేవలు.",
    searchServicesPlaceholder: "శోధించండి: ఆదాయ ధృవీకరణ పత్రం, రేషన్ కార్డు, భూమి పత్రాలు…",
    fileComplaintBtn: "ఫిర్యాదు నమోదు చేయండి →",

    // Complaints Page
    complaintsBadge: "పంచాయతీ ఫిర్యాదుల నిర్వహణ",
    complaintsTitle: "సమస్యను నివేదించండి. పరిష్కారం వరకు ట్రాక్ చేయండి.",
    complaintsSub: "తాగునీరు, వీధి దీపాలు, రహదారుల సమస్యలను గ్రామ పంచాయతీకి నివేదించండి.",
    newComplaintHeader: "నూతన ఫిర్యాదు",
    complaintCategory: "వర్గం",
    villageLabel: "గ్రామం",
    describeIssue: "సమస్య వివరాలు",
    describeIssuePlaceholder: "ఉదా: పాఠశాల సమీపంలో పైపులైను లీకేజీ 3 రోజులుగా ఉంది…",
    attachPhoto: "ఫోటో జతచేయండి (ఐచ్ఛికం)",
    submitComplaintBtn: "ఫిర్యాదు సమర్పించండి",
    trackByRef: "రిఫరెన్స్ నంబర్ ద్వారా ట్రాక్ చేయండి",
    trackRefPlaceholder: "GRC-2026-XXXX",
    trackBtn: "ట్రాక్ చేయండి",
    complaintHistory: "ఫిర్యాదుల చరిత్ర",
    panchayatResponse: "పంచాయతీ సమాధానం:",

    // Dashboard Page
    dashboardBadge: "పౌరుడి డ్యాష్‌బోర్డ్",
    printSummaryBtn: "సారాంశం ప్రింట్ చేయండి",
    editProfileBtn: "ప్రొఫైల్ సవరించండి",
    personalizedRecs: "మీకు అనువైన సిఫార్సులు",
    viewAllSchemes: "అన్నీ చూడండి →",
    appPrepStatus: "దరఖాస్తు సంసిద్ధత స్థితి",
    recentComplaints: "ఇటీవలి ఫిర్యాదులు & స్థితి",
    eligibilitySnapshot: "అర్హత స్థితి అవలోకనం",

    // Admin Page
    adminBadge: "అడ్మిన్ • గ్రామ పంచాయతీ అధికారి",
    adminTitle: "పంచాయతీ పరిపాలన డ్యాష్‌బోర్డ్",
    adminSub: "పౌరుల ఫిర్యాదులను పరిష్కరించండి మరియు సేవల స్థితిని సమీక్షించండి.",
    schemesManaged: "నిర్వహిస్తున్న పథకాలు",
    totalComplaints: "మొత్తం ఫిర్యాదులు",
    openPending: "పరిష్కారం కావాల్సినవి",
    resolvedComplaints: "పరిష్కరించబడినవి",
    tabComplaints: "ఫిర్యాదుల నిర్వహణ",
    tabSchemes: "పథకాల ధృవీకరణ",
    tabStats: "గ్రామ గణాంకాలు",
    updateStatusBtn: "స్థితిని నవీకరించండి",

    // Profile Page
    profileBadge: "పౌరుడి ప్రొఫైల్ • సిఫార్సుల ఆధారం",
    profileTitle: "నా ప్రొఫైల్",
    profileSub: "వివరాలను మార్చండి — అర్హత శాతం, సిఫార్సులు మరియు చెక్‌లిస్ట్‌లు తక్షణమే మారుతాయి.",
    fullName: "పూర్తి పేరు",
    mobilePhone: "మొబైల్ నంబర్",
    stateField: "రాష్ట్రం",
    districtField: "జిల్లా",
    villageField: "గ్రామం",
    occupationField: "వృత్తి",
    ageField: "వయస్సు",
    genderField: "లింగం",
    incomeField: "వార్షిక కుటుంబ ఆదాయం (₹)",
    categoryField: "సామాజిక వర్గం",
    landField: "భూమి వివరాలు",
    saveProfileBtn: "భద్రపరచి అర్హతలను నవీకరించండి →",
    resetProfileBtn: "రీసెట్ చేయండి",
    privacyNotice: "గోప్యత: మీ వ్యక్తిగత సమాచారం సురక్షితంగా ఉంటుంది.",

    // Footer
    footerAboutTitle: "గ్రామ్AI కనెక్ట్",
    footerAboutText: "ప్రతి పౌరుడికి ప్రభుత్వ సంక్షేమ పథకాలు సులభంగా అందేలా చేయడం. ఓపెన్‌రూటర్ AI మరియు సర్వమ్ వాయిస్ సాంకేతికతతో.",
    footerTechNotice: "సాంకేతికత: Next.js • OpenRouter • Sarvam AI • Neon PostgreSQL • Drizzle ORM.",
  },

  hi: {
    // Top bar & Header
    topStripNotice: "ग्राम पंचायत डिजिटल सेवा • ओपनराउटर AI एवं सर्वम वॉइस इंटीग्रेशन • आधिकारिक पोर्टल नहीं",
    helpline: "हेल्पलाइन 1800-425-XXXX",
    meesevaCsc: "MeeSeva • CSC केंद्र",
    adminModeOn: "एडमिन मोड चालू — बाहर निकलें",
    adminLogin: "एडमिन लॉगिन",
    tagline: "हर नागरिक के लिए सरकारी लाभ, आसान भाषा में।",
    demoBtn: "डेमो देखें",
    myProfile: "मेरी प्रोफ़ाइल",
    navLogin: "लॉग इन",
    navSignup: "साइन अप",
    navLogout: "लॉग आउट",
    citizenRole: "नागरिक",
    officerRole: "पंचायत अधिकारी",
    adminRole: "व्यवस्थापक",

    // Navigation
    navHome: "होम",
    navSchemes: "योजनाएँ खोजें",
    navAsk: "GramAI से पूछें",
    navDocs: "दस्तावेज़ एवं OCR",
    navJourney: "मेरी यात्रा",
    navServices: "पंचायत सेवाएँ",
    navComplaints: "शिकायतें",
    navDashboard: "डैशबोर्ड",
    navAdmin: "एडमिन",
    navProfile: "प्रोफ़ाइल",

    // Hero Section
    heroBadge: "AI-संचालित • वॉइस-सक्षम • बहुभाषी मंच",
    heroTitle: "हर योजना जिसके आप हकदार हैं। एक ही आसान जगह।",
    heroSub: "कल्याणकारी योजनाएँ खोजें, आसान भाषा में पात्रता जांचें, OCR से दस्तावेज़ों को समझें और आवेदन तैयार करें — हिन्दी, తెలుగు एवं English में।",
    searchPlaceholder: "खोजें: किसान, छात्रवृत्ति, पेंशन, मकान, स्वास्थ्य…",
    searchBtn: "खोजें",
    tryDemoCta: "डेमो आज़माएँ — नागरिक प्रोफ़ाइल लोड करें",
    askGramAiCta: "GramAI सहायक से पूछें",

    // Stats
    statSchemesDb: "डेटाबेस में योजनाएँ",
    statMatchedFor: "पात्र योजनाएँ:",
    statLanguages: "भाषाएँ: हिन्दी • తెలుగు • EN",
    statComplaints: "ट्रैक की गई शिकायतें",

    // Profile card on home
    forYou: "आपके लिए",
    namaste: "नमस्ते",
    openDashboard: "मेरा डैशबोर्ड खोलें",
    docIntelTitle: "दस्तावेज़ विश्लेषण एवं OCR",
    docIntelSub: "सरकारी योजना दिशानिर्देश PDF या फोटो अपलोड करें — GramAI पात्रता, लाभ और चेकलिस्ट तैयार करता है।",
    trySampleGuideline: "नमूना दिशानिर्देश देखें",

    // Categories
    browseByNeed: "ज़रूरत के अनुसार योजनाएँ",
    whatHelpTitle: "आपके परिवार को आज किस सहायता की आवश्यकता है?",
    allSchemes: "सभी योजनाएँ",
    schemesLabel: "योजनाएँ",

    // Recommendations
    recommendedFor: "आपके लिए अनुशंसित योजनाएँ",
    rankingSub: "आपकी प्रोफ़ाइल के अनुसार रैंक की गई। अंतिम स्वीकृति सरकारी सत्यापन के बाद ही मान्य होगी।",
    matchLabel: "मैच",
    checkEligibilityBtn: "पात्रता जांचें →",
    saveSchemeBtn: "सुरक्षित करें",
    savedSchemeBtn: "सुरक्षित है",
    verifiedBadge: "सत्यापित स्रोत",
    unverifiedBadge: "स्थानीय स्तर पर पुष्टि करें",

    // Demo personas
    demoPersonasTitle: "विभिन्न नागरिक प्रोफ़ाइल देखें",
    demoPersonasSub: "एक क्लिक में प्रोफ़ाइल लोड करें — अनुशंसाएँ, पात्रता और चेकलिस्ट तुरंत अपडेट हो जाती हैं।",
    loadThisProfile: "यह प्रोफ़ाइल लोड करें →",

    // Scheme Discovery Page
    schemeDiscoveryBadge: "योजनाएँ • केंद्र + राज्य सरकारें",
    schemeDiscoveryTitle: "सरकारी योजना खोज",
    schemeDiscoverySub: "नाम, श्रेणी या लाभार्थी वर्ग के आधार पर खोजें। सत्यापित योजनाओं में आधिकारिक पोर्टल लिंक शामिल है।",
    filterAllLevel: "सभी स्तर",
    filterCentral: "केंद्रीय योजनाएँ",
    filterState: "राज्य योजनाएँ",
    foundCountText: "योजनाएँ मिलीं — श्रेणी:",
    inState: "राज्य:",
    noSchemesMatch: "खोज के अनुसार कोई योजना नहीं मिली",
    clearFilters: "फ़िल्टर हटाएं",

    // Scheme Detail
    aboutScheme: "इस योजना के बारे में",
    whoCanApply: "कौन आवेदन कर सकता है (नियम)",
    howToApply: "आवेदन प्रक्रिया — चरण दर चरण",
    officialPortalBtn: "आधिकारिक पोर्टल ↗",
    askAboutSchemeBtn: "इसके बारे में GramAI से पूछें",
    disclaimerScheme: "GramAI मार्गदर्शन प्रदान करता है। आधिकारिक पोर्टल या MeeSeva/CSC के माध्यम से ही आवेदन करें।",
    smartEligibility: "स्मार्ट पात्रता चेकर",
    nextAction: "अगला कदम",
    tweakProfileNotice: "अपनी जानकारी बदलें — पात्रता स्कोर तुरंत अपडेट होगा:",
    ageLabel: "आयु",
    incomeLabel: "वार्षिक पारिवारिक आय (₹)",
    occupationLabel: "व्यवसाय",
    genderLabel: "लिंग",
    documentChecklist: "ज़रूरी दस्तावेज़ों की चेकलिस्ट",
    haveIt: "पास है ✓",
    missing: "चाहिए",
    saveTrackJourneyBtn: "सुरक्षित करें और यात्रा में ट्रैक करें →",

    // Ask GramAI Page
    askHeaderBadge: "GramAI सहायक • बहुभाषी वॉइस AI",
    askHeaderTitle: "नमस्ते 🙏 सरकारी योजनाओं के बारे में मुझसे कुछ भी पूछें",
    askHeaderSub: "ओपनराउटर AI और सर्वम वॉइस द्वारा संचालित। हिन्दी में बोलें या टाइप करें।",
    listeningStatus: "आपकी आवाज़ सुन रहा हूँ… हिन्दी में बोलें",
    speakingStatus: "उत्तर सुनाया जा रहा है…",
    recordingMicBtn: "माइक द्वारा बोलें (हिन्दी)",
    recordingStopBtn: "रिकॉर्डिंग रोकें",
    chatPlaceholder: "पूछें: पीएम किसान के दस्तावेज़, पेंशन के नियम, छात्रवृत्ति…",
    sendBtn: "भेजें",
    transcriptNotice: "पहचाने गए शब्द:",
    confirmSendAudio: "यह संदेश भेजें",
    editTranscript: "संशोधित करें",
    sourceReference: "आधिकारिक सरकारी स्रोत",

    // Document Intelligence Page
    docIntelBadge: "सरकारी दस्तावेज़ विश्लेषण एवं OCR",
    docIntelHeaderTitle: "दिशानिर्देश या प्रमाण पत्र अपलोड करें। मिनटों में समझें।",
    docIntelHeaderSub: "PDF या स्कैन दस्तावेज़ अपलोड करें। GramAI पात्रता, लाभ और चेकलिस्ट आसानी से तैयार करता है।",
    dropzoneTitle: "यहाँ योजना दिशानिर्देश PDF या फोटो छोड़ें",
    dropzoneSub: "समर्थित फ़ाइलें: .pdf, .png, .jpg, .txt (अधिकतम 20MB)",
    chooseFileBtn: "फ़ाइल चुनें",
    useSampleBtn: "नमूना: रायथु भरोसा दिशानिर्देश 2025-26.pdf",
    extractingText: "दस्तावेज़ पढ़ा जा रहा है… विवरण निकाले जा रहे हैं…",
    extractionDoneBadge: "दस्तावेज़ पढ़ा गया",
    benefitLabel: "मिलने वाला लाभ",
    deadlineLabel: "अंतिम तिथि",
    eligibilityFound: "दस्तावेज़ में पहचानी गई पात्रता",
    comparedWithProfile: "आपकी प्रोफ़ाइल से तुलना",
    actionableChecklistTitle: "दस्तावेज़ चेकलिस्ट — तैयार होने पर चिह्नित करें",
    trackInJourneyBtn: "मेरी यात्रा में ट्रैक करें →",
    viewRawText: "दस्तावेज़ का मूल पाठ देखें",

    // Form Preparation
    formPrepTitle: "आवेदन फ़ॉर्म तैयारी सहायक",
    formPrepSub: "MeeSeva या CSC जाने से पहले अपना आवेदन विवरण यहाँ जांचें और तैयार करें।",
    formStep1: "1. बुनियादी विवरण",
    formStep2: "2. ज़रूरी दस्तावेज़",
    formStep3: "3. सत्यापन एवं पुष्टि",
    applicantName: "आवेदक का नाम",
    applicantPhone: "मोबाइल नंबर",
    aadhaarLast4: "आधार के अंतिम 4 अंक",
    bankAccountNo: "बैंक खाता संख्या",
    bankIfsc: "बैंक IFSC कोड",
    landSurveyNo: "भूमि खसरा / सर्वे नंबर",
    confirmAccuracy: "मैं प्रमाणित करता हूँ कि दिए गए सभी विवरण मेरे आधिकारिक पहचान पत्रों के अनुसार सही हैं।",
    saveApplicationDraft: "तैयार आवेदन ड्राफ्ट सुरक्षित करें",
    downloadApplicationSummary: "आवेदन सारांश प्रिंट / डाउनलोड करें",
    applicationPreparedNotice: "आपका आवेदन पैकेज तैयार हो गया है। आधिकारिक बायोमेट्रिक सबमिशन के लिए इसे अपने नजदीकी CSC या MeeSeva केंद्र पर ले जाएं।",

    // My Journey Page
    journeyBadge: "आवेदन यात्रा ट्रैकर",
    journeyTitle: "योजना की खोज से लेकर आवेदन की तैयारी तक",
    journeySub: "GramAI दस्तावेज़ तैयारी को ट्रैक करता है। अंतिम आवेदन आधिकारिक पोर्टल या MeeSeva पर जमा किया जाता है।",
    overallReadiness: "कुल दस्तावेज़ तैयारी:",
    noSchemesSaved: "अभी तक कोई योजना सुरक्षित नहीं की गई",
    findSchemesBtn: "योजनाएँ खोजें और सुरक्षित करें",
    continueBtn: "जारी रखें →",

    // Panchayat Services
    servicesBadge: "पंचायत सेवा डायरेक्टरी",
    servicesTitle: "स्थानीय सेवाएँ, प्रमाण पत्र एवं कार्यालय",
    servicesSub: "आय, जाति, निवास प्रमाण पत्र, पेयजल और ग्राम पंचायत सहायता।",
    searchServicesPlaceholder: "खोजें: आय प्रमाण पत्र, राशन कार्ड, भूमि रिकॉर्ड, मृत्यु प्रमाण पत्र…",
    fileComplaintBtn: "शिकायत दर्ज करें →",

    // Complaints Page
    complaintsBadge: "पंचायत शिकायत प्रबंधन",
    complaintsTitle: "समस्या दर्ज करें। समाधान तक ट्रैक करें।",
    complaintsSub: "पेयजल, स्ट्रीट लाइट, सड़क या नाली की समस्या सीधे ग्राम पंचायत को सूचित करें।",
    newComplaintHeader: "नई शिकायत",
    complaintCategory: "श्रेणी",
    villageLabel: "गाँव",
    describeIssue: "समस्या का विवरण",
    describeIssuePlaceholder: "उदा: प्राथमिक विद्यालय के पास पेयजल पाइपलाइन 3 दिनों से लीक हो रही है…",
    attachPhoto: "फ़ोटो संलग्न करें (वैकल्पिक)",
    submitComplaintBtn: "शिकायत दर्ज करें",
    trackByRef: "संदर्भ संख्या से ट्रैक करें",
    trackRefPlaceholder: "GRC-2026-XXXX",
    trackBtn: "ट्रैक करें",
    complaintHistory: "शिकायतों का इतिहास",
    panchayatResponse: "पंचायत की प्रतिक्रिया:",

    // Dashboard Page
    dashboardBadge: "नागरिक डैशबोर्ड",
    printSummaryBtn: "सारांश प्रिंट करें",
    editProfileBtn: "प्रोफ़ाइल संपादित करें",
    personalizedRecs: "आपके लिए व्यक्तिगत अनुशंसाएँ",
    viewAllSchemes: "सभी देखें →",
    appPrepStatus: "आवेदन तैयारी की स्थिति",
    recentComplaints: "हाल की शिकायतें एवं स्थिति",
    eligibilitySnapshot: "पात्रता स्नैपशॉट",

    // Admin Page
    adminBadge: "एडमिन • ग्राम पंचायत अधिकारी",
    adminTitle: "पंचायत प्रशासन डैशबोर्ड",
    adminSub: "नागरिकों की शिकायतों का समाधान करें और योजनाओं की स्थिति की समीक्षा करें।",
    schemesManaged: "प्रबंधित योजनाएँ",
    totalComplaints: "कुल शिकायतें",
    openPending: "लंबित शिकायतें",
    resolvedComplaints: "समाधान की गई",
    tabComplaints: "शिकायत प्रबंधन",
    tabSchemes: "योजना सत्यापन",
    tabStats: "गाँव के आँकड़े",
    updateStatusBtn: "स्थिति अपडेट करें",

    // Profile Page
    profileBadge: "नागरिक प्रोफ़ाइल • अनुशंसाओं का आधार",
    profileTitle: "मेरी प्रोफ़ाइल",
    profileSub: "विवरण अपडेट करें — पात्रता स्कोर, अनुशंसाएँ और चेकलिस्ट तुरंत अपडेट होंगी।",
    fullName: "पूरा नाम",
    mobilePhone: "मोबाइल नंबर",
    stateField: "राज्य",
    districtField: "ज़िला",
    villageField: "गाँव",
    occupationField: "व्यवसाय",
    ageField: "आयु",
    genderField: "लिंग",
    incomeField: "वार्षिक पारिवारिक आय (₹)",
    categoryField: "सामाजिक श्रेणी",
    landField: "भूमि जोत",
    saveProfileBtn: "सुरक्षित करें और पात्रता अपडेट करें →",
    resetProfileBtn: "रीसेट करें",
    privacyNotice: "गोपनीयता: आपकी जानकारी सुरक्षित रखी जाती है और किसी के साथ साझा नहीं की जाती।",

    // Footer
    footerAboutTitle: "GramAI Connect",
    footerAboutText: "हर नागरिक के लिए सरकारी कल्याणकारी योजनाएँ आसान बनाना। ओपनराउटर AI और सर्वम वॉइस तकनीक द्वारा संचालित।",
    footerTechNotice: "इंटीग्रेटेड स्टैक: Next.js • OpenRouter • Sarvam AI • Neon PostgreSQL • Drizzle ORM.",
  },
};

export function getTranslation(key: string, lang: string = "en"): string {
  const supported = (lang === "te" || lang === "hi" ? lang : "en") as SupportedLang;
  return TRANSLATIONS[supported]?.[key] || TRANSLATIONS.en[key] || key;
}

export function translateCategory(cat: string, lang: string = "en"): string {
  const supported = (lang === "te" || lang === "hi" ? lang : "en") as SupportedLang;
  return CATEGORY_TRANSLATIONS[supported]?.[cat] || cat;
}

export function translateStatus(status: string, lang: string = "en"): string {
  const supported = (lang === "te" || lang === "hi" ? lang : "en") as SupportedLang;
  return STATUS_TRANSLATIONS[supported]?.[status] || status;
}

export function translateStage(stage: string, lang: string = "en"): string {
  const supported = (lang === "te" || lang === "hi" ? lang : "en") as SupportedLang;
  return STAGE_TRANSLATIONS[supported]?.[stage] || stage;
}
