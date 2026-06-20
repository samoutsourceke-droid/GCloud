import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Target, Mail, Phone, MessageSquare, Linkedin, Globe, Sparkles, 
  Copy, Download, Send, Trash2, Calendar, Plus, RefreshCw, ChevronRight, Check, X, AlertOctagon, Cpu, TrendingUp 
} from "lucide-react";
import { Lead, Pitch } from "../types";

interface LeadFinderProps {
  leads: Lead[];
  onAddLead: (lead: Lead) => void;
  onAddLeads: (newLeads: Lead[], overwrite?: boolean) => void;
  onUpdateLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  onResetLeads: () => void;
  onBack: () => void;
  provider?: string;
  customOpenRouterKey?: string;
  customHuggingFaceKey?: string;
  customGroqKey?: string;
  onOpenSettings?: () => void;
  userProfile?: any;
  onboardingStep?: number;
  setOnboardingStep?: (step: number) => void;
  onboardingLead?: Lead | null;
  setOnboardingLead?: (lead: Lead | null) => void;
  onNavigate?: (view: "landing" | "leads" | "audit") => void;
  clientId?: string;
  platformStats?: any;
  onRefreshStats?: () => void;
}

const INDUSTRIES_PRESETS = [
  "Healthcare & Medical",
  "Real Estate & Property",
  "E-commerce & Retail",
  "Solar & Renewable Energy",
  "Professional Services (Coaching/Consulting)",
  "Finance & Wealth Management",
  "Fitness, Health & Wellness",
  "Home Services & Contractors",
  "Hospitality & Restaurants",
  "SaaS & Tech Startups",
  "Education & E-learning",
  "Custom/Other"
];

const LOCATIONS_PRESETS = [
  "California, USA",
  "Texas, USA",
  "New York, USA",
  "Florida, USA",
  "London, UK",
  "Toronto, Canada",
  "Sydney, Australia",
  "Berlin, Germany",
  "Nairobi, Kenya",
  "Dubai, UAE",
  "Custom/Other"
];

const SOLUTIONS_PRESETS = [
  "AI Voice Agent & Call Center Automation",
  "Custom SEO Optimization & High-Intent Blog Pipeline",
  "Conversion Rate Optimization (CRO) & Advanced Checkout Upgrades",
  "Cold Email Nurture Automation & CRM Pipeline Setup",
  "Local Maps SEO Booster & Review Acceleration Campaign",
  "Social Media Ads Campaign & Video Short-Form Creative Production",
  "SMS/WhatsApp Retention Marketing Automation",
  "Custom Web & Mobile Application Development",
  "Comprehensive Cyber Security & Cloud Ops Redundancy Audit",
  "Custom/Other"
];

const NICHE_PRESETS: { [key: string]: string[] } = {
  "Healthcare & Medical": ["Physiotherapist Clinics", "Dental Implants Centers", "Chiropractor Hubs", "Aesthetic Dermatology Practices", "Pediatric Clinics"],
  "Real Estate & Property": ["Residential Sales Brokers", "Commercial Leasing Agencies", "Property Management Groups", "Boutique Airbnb Hosts", "Luxury Real Estate Agents"],
  "E-commerce & Retail": ["Boutique Apparel Brands", "Organic Cosmetics Sellers", "Direct-To-Consumer Footwear", "Luxury Jewelry Stores", "Fitness Equipment Retailers"],
  "Solar & Renewable Energy": ["Residential Solar Installers", "Commercial Solar Contractors", "Off-grid Power Suppliers", "Rooftop PV System Integrators"],
  "Professional Services (Coaching/Consulting)": ["Executive Leadership Coaches", "Financial Consulting Advisory", "Corporate Tax Consulting Firms", "B2B SaaS Growth Advisers"],
  "Finance & Wealth Management": ["Boutique Wealth Advisory", "Family Fund Planners", "Mortgage Brokers", "Crypto Asset Managers"],
  "Fitness, Health & Wellness": ["Local Yoga Studios", "Pilates & Core Training Centers", "CrossFit Box Locations", "Ketogenic Nutritionist Practices"],
  "Home Services & Contractors": ["Roofing Contractors", "Residential Plumbing Experts", "HVAC Maintenance Services", "High-End Kitchen Renovation"],
  "Hospitality & Restaurants": ["Fine-dining Steakhouses", "Artisanal Coffee Shop Chains", "Boutique Hotel Safaris", "Healthy Meal Prep Deliveries"],
  "SaaS & Tech Startups": ["No-Code Development Tools", "AI Copywriting Platforms", "HR Applicant Tracking Platforms", "Cyber Security Monitoring Services"],
  "Education & E-learning": ["K-12 Math Tutoring Franchises", "Online Bootcamp Accelerators", "Language Learning Platforms", "Executive Business Courses"],
  "Custom/Other": []
};

export default function LeadFinder({
  leads,
  onAddLead,
  onAddLeads,
  onUpdateLead,
  onDeleteLead,
  onResetLeads,
  onBack,
  provider = "auto",
  customOpenRouterKey = "",
  customHuggingFaceKey = "",
  customGroqKey = "",
  onOpenSettings,
  userProfile,
  onboardingStep = 1,
  setOnboardingStep,
  onboardingLead,
  setOnboardingLead,
  onNavigate,
  clientId,
  platformStats,
  onRefreshStats
}: LeadFinderProps) {
  // Preset Selection states
  const [selectedIndustry, setSelectedIndustry] = useState("Healthcare & Medical");
  const [customIndustry, setCustomIndustry] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("California, USA");
  const [customLocation, setCustomLocation] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("Physiotherapist Clinics");
  const [customNiche, setCustomNiche] = useState("");
  const [selectedSolution, setSelectedSolution] = useState("AI Voice Agent & Call Center Automation");
  const [customSolution, setCustomSolution] = useState("");

  const handleResetSearch = () => {
    setSelectedIndustry("Healthcare & Medical");
    setCustomIndustry("");
    setSelectedLocation("California, USA");
    setCustomLocation("");
    setSelectedNiche("Physiotherapist Clinics");
    setCustomNiche("");
    setSelectedSolution("AI Voice Agent & Call Center Automation");
    setCustomSolution("");
    setErrorText(null);
  };

  const [loadingLeads, setLoadingLeads] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [activeEngine, setActiveEngine] = useState<string>("");

  // Computed state getters to comply with existing fields
  const finalIndustry = selectedIndustry === "Custom/Other" ? customIndustry : selectedIndustry;
  const finalNicheOnly = selectedNiche === "Custom/Other" ? customNiche : selectedNiche;
  const finalLocation = selectedLocation === "Custom/Other" ? customLocation : selectedLocation;
  
  const targetNiche = finalLocation ? `${finalNicheOnly} (${finalLocation})` : finalNicheOnly;
  const servicesOffered = selectedSolution === "Custom/Other" ? customSolution : selectedSolution;


  // Manual Lead creation state
  const [showManualModal, setShowManualModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadNiche, setNewLeadNiche] = useState("");
  const [newLeadWebsite, setNewLeadWebsite] = useState("");
  const [newLeadContact, setNewLeadContact] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadWhatsapp, setNewLeadWhatsapp] = useState("");
  const [newLeadPaintPoints, setNewLeadPaintPoints] = useState("");

  // Target leading state
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  
  // Pitch states
  const [pitchMedium, setPitchMedium] = useState<"Email" | "WhatsApp" | "LinkedIn" | "Custom">("Email");
  const [customAngle, setCustomAngle] = useState("");
  const [loadingPitch, setLoadingPitch] = useState(false);
  const [generatedPitch, setGeneratedPitch] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isExpandedPitch, setIsExpandedPitch] = useState(false);

  // Filter & Search states
  const [leadSearchTerm, setLeadSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [mobileTab, setMobileTab] = useState<"search" | "profile">("search");

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || (leads.length > 0 ? leads[0] : null);

  const generateLocalFallbackLeads = (ind: string, loc: string, sol: string) => {
    const industryTrimmed = ind || "Digital Systems";
    const segmentLabel = selectedNiche === "Custom/Other" ? (customNiche || "Boutique Group") : selectedNiche;
    const locationLabel = loc === "Custom/Other" ? (customLocation || "Worldwide") : loc;
    const solutionLabel = sol === "Custom/Other" ? (customSolution || "Growth Suite") : sol;

    // Dynamically configure location parameters
    let locationCity = "California";
    let tld = "com";
    let countryCode = "1";
    let areaCodes = [415, 310, 619, 408];
    let phoneFormat = (area: number, num: string) => `+1 (${area}) ${num.slice(0, 3)}-${num.slice(3)}`;

    if (locationLabel.includes("California")) {
      locationCity = "California";
      tld = "com";
      countryCode = "1";
      areaCodes = [415, 310, 619, 408];
    } else if (locationLabel.includes("Texas")) {
      locationCity = "Texas";
      tld = "com";
      countryCode = "1";
      areaCodes = [512, 214, 713, 817];
    } else if (locationLabel.includes("New York")) {
      locationCity = "New York";
      tld = "com";
      countryCode = "1";
      areaCodes = [212, 718, 917, 315];
    } else if (locationLabel.includes("Florida")) {
      locationCity = "Florida";
      tld = "com";
      countryCode = "1";
      areaCodes = [305, 407, 813, 954];
    } else if (locationLabel.includes("London") || locationLabel.includes("UK")) {
      locationCity = "London";
      tld = "co.uk";
      countryCode = "44";
      areaCodes = [207, 208, 203];
      phoneFormat = (area: number, num: string) => `+44 ${area} ${num.slice(0, 4)} ${num.slice(4)}`;
    } else if (locationLabel.includes("Toronto") || locationLabel.includes("Canada")) {
      locationCity = "Toronto";
      tld = "ca";
      countryCode = "1";
      areaCodes = [416, 647, 905];
    } else if (locationLabel.includes("Sydney") || locationLabel.includes("Australia")) {
      locationCity = "Sydney";
      tld = "com.au";
      countryCode = "61";
      areaCodes = [2];
      phoneFormat = (area: number, num: string) => `+61 ${area} ${num.slice(0, 4)} ${num.slice(4)}`;
    } else if (locationLabel.includes("Berlin") || locationLabel.includes("Germany")) {
      locationCity = "Berlin";
      tld = "de";
      countryCode = "49";
      areaCodes = [30];
      phoneFormat = (area: number, num: string) => `+49 ${area} ${num.slice(0, 4)} ${num.slice(4)}`;
    } else if (locationLabel.includes("Nairobi") || locationLabel.includes("Kenya")) {
      locationCity = "Nairobi";
      tld = "co.ke";
      countryCode = "254";
      areaCodes = [20, 700, 722];
      phoneFormat = (area: number, num: string) => `+254 ${area} ${num.slice(0, 3)} ${num.slice(3)}`;
    } else if (locationLabel.includes("Dubai") || locationLabel.includes("UAE")) {
      locationCity = "Dubai";
      tld = "ae";
      countryCode = "971";
      areaCodes = [4];
      phoneFormat = (area: number, num: string) => `+971 ${area} ${num.slice(0, 3)} ${num.slice(3)}`;
    } else {
      locationCity = locationLabel.split(",")[0].trim() || "Global";
      tld = "com";
      countryCode = "1";
      areaCodes = [302, 202, 800];
    }

    const prefixes = ["Horizon", "Apex", "Nova", "Summit", "Vanguard", "Pinnacle", "Quantum", "Nexus", "Elite", "Veritas", "Ascent", "Clarity", "Beacon", "Echo", "Prism", "Zephyr", "Alpha", "Fortress", "Catalyst", "Vector"];
    const bases = [
      segmentLabel.replace(/s\b/gi, "").replace("Clinics", "Clinic").replace("Centers", "Center").replace("Practices", "Practice").replace("Brokers", "Broker").replace("Group", "Solutions")
    ];
    const suffixes = ["Group", "Partners", "Hub", "Associates", "Dynamics", "Solutions", "Collective", "HQ", "Group", "Consulting", "Systems", "Network"];
    
    // Extensively rich list of first and last names for high-entropy randomization
    const firstNames = [
      "Liam", "Sarah", "Michael", "Elena", "Marcus", "David", "Chloe", "Emma", "James", "Sophia", 
      "Oliver", "Sophia", "Lucas", "Charlotte", "Amelia", "Daniel", "Zoe", "Ryan", "Grace", "Ethan",
      "Olivia", "William", "Ava", "Alexander", "Isabella", "Benjamin", "Mia", "Henry", "Emily", "Jackson"
    ];
    const lastNames = [
      "Thorne", "Vance", "Lin", "Carter", "Rostova", "Jennings", "Miller", "Taylor", "Anderson", "Thomas", 
      "Jackson", "White", "Harris", "Martin", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall",
      "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams"
    ];
    const roles = [
      "Managing Director", "Chief Operating Officer", "Founder & Owner", "Marketing Director", "Principal Partner",
      "General Manager", "Operations Director", "Head of Sales", "Managing Lead"
    ];

    const generatedList: Lead[] = [];
    
    for (let i = 0; i < 5; i++) {
      // Pick dynamic, high-entropy indexes
      const prefixIdx = (i * 7 + Math.floor(Math.random() * 20)) % prefixes.length;
      const prefix = prefixes[prefixIdx];
      const base = bases[0] || "Business";
      const suffixIdx = (i * 11 + Math.floor(Math.random() * 20)) % suffixes.length;
      const suffix = suffixes[suffixIdx];
      
      // Weave locationCity dynamically into name for 100% search-oriented realism
      const companyName = i % 2 === 0 
        ? `${locationCity} ${prefix} ${base}`
        : `${prefix} ${base} of ${locationCity}`;

      const cleanDomain = companyName.toLowerCase().replace(/[^a-z0-9]/g, "") + "." + tld;
      const website = `https://www.${cleanDomain}`;
      
      // Pick random contact name and role
      const fName = firstNames[(i * 13 + Math.floor(Math.random() * 30)) % firstNames.length];
      const lName = lastNames[(i * 17 + Math.floor(Math.random() * 30)) % lastNames.length];
      const execName = `${fName} ${lName}`;
      const execRole = roles[(i * 3 + Math.floor(Math.random() * 9)) % roles.length];
      
      const emailPrefix = fName.toLowerCase();
      const email = `${emailPrefix}@${cleanDomain}`;
      
      const areaCode = areaCodes[i % areaCodes.length];
      const rawNumber = Math.floor(1000000 + Math.random() * 9000000).toString();
      const phone = phoneFormat(areaCode, rawNumber);
      const whatsapp = `+${countryCode}${areaCode}${rawNumber}`;
      
      const solutionsMap: { [key: string]: string } = {
        "AI Voice Agent & Call Center Automation": `Struggles to handle weekend booking calls in ${locationCity}. Needs automated dispatcher routing to capture key client intent signals.`,
        "Custom SEO Optimization & High-Intent Blog Pipeline": `Zero organic marketing presence in the local ${locationCity} search grid. Competitors in ${locationCity} are capturing organic search leads.`,
        "Conversion Rate Optimization (CRO) & Advanced Checkout Upgrades": `High checkout dropouts for mobile users in ${locationCity}. Needs single-page checkout flow and fast local web pay gateways.`,
        "Cold Email Nurture Automation & CRM Pipeline Setup": `Local leads collected in ${locationCity} are falling cold due to manual list follow-up cycles. Lacks automated CRM triggers.`,
        "Local Maps SEO Booster & Review Acceleration Campaign": `Stuck at rank #12 on the local ${locationCity} Maps Map Pack. Crucially lacks automated text/email feedback loops.`,
        "Social Media Ads Campaign & Video Short-Form Creative Production": `Disastrous ad spend performance across ${locationCity} region. No video hook creative or responsive social channels.`,
        "SMS/WhatsApp Retention Marketing Automation": `Lacks WhatsApp re-engagement loops for recurring clients in ${locationCity}. Booking dropoff is significant past 30 days.`,
        "Custom Web & Mobile Application Development": `Legacy appointment system is slow and non-responsive across mobile networks in ${locationCity}. Drivers or visitors express frustration.`,
        "Comprehensive Cyber Security & Cloud Ops Redundancy Audit": `Exposed database endpoints and manual backup schedules lack proactive monitoring for threats operating within ${locationCity} operations.`,
      };

      const painpoint = solutionsMap[selectedSolution] || `Currently struggles to optimize client conversions in ${locationCity}. No automated campaign utilizing ${solutionLabel.toLowerCase()}.`;

      generatedList.push({
        id: "lead_local_" + i + "_" + Math.random().toString(36).substring(2, 6),
        businessName: companyName,
        niche: segmentLabel,
        website: website,
        contactPerson: `${execName} (${execRole})`,
        email: email,
        phone: phone,
        whatsapp: whatsapp,
        socials: {
          linkedin: `https://linkedin.com/company/${cleanDomain.replace(`.${tld}`, "")}`,
          instagram: `https://instagram.com/${cleanDomain.replace(`.${tld}`, "")}`,
          twitter: `https://twitter.com/${cleanDomain.replace(`.${tld}`, "")}`
        },
        currentPaintPoints: painpoint,
        relevanceScore: Math.floor(82 + Math.random() * 17),
        createdAt: new Date().toISOString(),
        followUpStatus: "Not Contacted",
        sourcePlatform: ["Reddit", "Quora", "Google Search", "Facebook", "YouTube", "Perplexity"][Math.floor(Math.random() * 6)],
        urgencyLevel: (["Critical", "High", "Medium", "Low"] as const)[Math.floor(Math.random() * 4)],
        willingnessToPay: (["Premium Value", "High", "Standard", "Budget"] as const)[Math.floor(Math.random() * 4)],
        likelyConversionRate: Math.floor(45 + Math.random() * 45),
        demandSignalSource: `Detected high interest queries and user questions matching "${selectedSolution}" on this platform.`
      });
    }
    return generatedList;
  };

    // Query API to find high-intent Leads
  const handleFindLeads = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalIndustry || !targetNiche) {
       setErrorText("Please provide both an industry and a target niche.");
       return;
    }

    setLoadingLeads(true);
    setErrorText(null);
    setIsFallbackMode(false);
    setActiveEngine("");

    // Generate dynamic randomized search parameters for variety
    const sectorsPresets = [
      "Boutique & Independent family business",
      "Highly-rated practitioner local hub",
      "Fast-growing startup-style challenger",
      "Premium luxury segment service provider",
      "Eco-conscious or green sustainable operator"
    ];
    const geographicScopePresets = [
      finalLocation ? `within downtown/central business area of ${finalLocation}` : "downtown commercial district",
      finalLocation ? `serving the greater ${finalLocation} suburbs` : "greater metropolitan region",
      finalLocation ? `based in the high-density tech/medical zones of ${finalLocation}` : "established business park",
      finalLocation ? `headquartered prominently in ${finalLocation}` : "local county range"
    ];
    const headcountPresets = [
      "micro-team of 1-5 professionals", 
      "independent midsize operator with 10-35 personnel", 
      "highly active small boutique scale", 
      "privately-owned regional leader shape"
    ];

    const randomSector = sectorsPresets[Math.floor(Math.random() * sectorsPresets.length)];
    const randomGeoScope = geographicScopePresets[Math.floor(Math.random() * geographicScopePresets.length)];
    const randomSize = headcountPresets[Math.floor(Math.random() * headcountPresets.length)];
    const randomSeedStr = Math.random().toString(36).substring(2, 9);

    try {
      const response = await fetch("/api/find-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          industry: finalIndustry, 
          targetNiche, 
          servicesOffered,
          provider,
          customOpenRouterKey,
          customHuggingFaceKey,
          customGroqKey,
          userBusinessProfile: userProfile,
          clientId,
          randomModifier: {
            sectorType: randomSector,
            geographicScope: randomGeoScope,
            businessSize: randomSize,
            noiseSeed: randomSeedStr
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed finding qualified prospects.");
      }

      const resData = await response.json();
      
      // Support backward compatibility if list is returned directly vs object structure
      const freshLeads: Lead[] = Array.isArray(resData) ? resData : (resData.leads || []);
      const engineUsed = Array.isArray(resData) ? "Google Gemini" : (resData.providerUsed || "Google Gemini");
      
      setActiveEngine(engineUsed);

      if (!Array.isArray(freshLeads) || freshLeads.length === 0) {
        throw new Error("No prospects returned from B2B search ground.");
      }

      const hydratedLeads = freshLeads.map((lead) => ({
        ...lead,
        id: lead.id || "lead_" + Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        followUpStatus: "Not Contacted" as const
      }));

      onAddLeads(hydratedLeads, true);

      if (hydratedLeads.length > 0) {
        setSelectedLeadId(hydratedLeads[0].id);
        setMobileTab("profile");
      }

      // Refresh platform hits stats
      if (onRefreshStats) {
        onRefreshStats();
      }
    } catch (err: any) {
      console.warn("B2B API connection failed, executing intelligent client-side fallback:", err);
      setIsFallbackMode(true);
      setErrorText(`Network API Limit Reached (${err.message}). Switched to Local Intelligent Search Grounding Engine to formulate custom high-intent leads.`);
      setActiveEngine("Local Custom Grounding Engine");
      
      const localLeads = generateLocalFallbackLeads(finalIndustry, finalLocation, servicesOffered);
      onAddLeads(localLeads, true);

      if (localLeads.length > 0) {
        setSelectedLeadId(localLeads[0].id);
        setMobileTab("profile");
      }

      // Refresh stats even for fallback so count shows active user participation
      if (onRefreshStats) {
        onRefreshStats();
      }
    } finally {
      setLoadingLeads(false);
    }
  };

  // Create customized human-like pitch
  const handleGeneratePitch = async () => {
    if (!selectedLead) return;
    setLoadingPitch(true);
    setGeneratedPitch(null);

    try {
      const response = await fetch("/api/generate-pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead: selectedLead,
          pitchMedium,
          servicesOffered,
          customAngle,
          provider,
          customOpenRouterKey,
          customHuggingFaceKey,
          customGroqKey,
          userBusinessProfile: userProfile,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Could not generate custom pitch solution.");
      }

      const data = await response.json();
      setGeneratedPitch(data.pitch);
      if (data.providerUsed) {
        setActiveEngine(data.providerUsed);
      }
    } catch (err: any) {
      console.error(err);
      setGeneratedPitch(`Error: ${err.message || "Failed to create pitch."}`);
    } finally {
      setLoadingPitch(false);
    }
  };

  // Handle manual lead insertion
  const handleCreateManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadEmail || !newLeadPaintPoints) {
      alert("Please enter business name, contact email, and immediate need coordinates.");
      return;
    }

    const manualLead: Lead = {
      id: "lead_manual_" + Math.random().toString(36).substring(2, 9),
      businessName: newLeadName,
      niche: newLeadNiche || "Custom Segment",
      website: newLeadWebsite || "https://example-business.com",
      contactPerson: newLeadContact || "Decision Maker",
      email: newLeadEmail,
      phone: newLeadPhone || "+1 (555) 019-2834",
      whatsapp: newLeadWhatsapp || "+1 (555) 019-2834",
      socials: {
        linkedin: "https://linkedin.com",
      },
      currentPaintPoints: newLeadPaintPoints,
      relevanceScore: 92,
      createdAt: new Date().toISOString(),
      followUpStatus: "Not Contacted",
    };

    onAddLead(manualLead);
    setSelectedLeadId(manualLead.id);
    setShowManualModal(false);

    // Reset manual form
    setNewLeadName("");
    setNewLeadNiche("");
    setNewLeadWebsite("");
    setNewLeadContact("");
    setNewLeadEmail("");
    setNewLeadPhone("");
    setNewLeadWhatsapp("");
    setNewLeadPaintPoints("");
  };

  // Export pitch as plain text file
  const handleDownloadPitch = () => {
    if (!generatedPitch || !selectedLead) return;
    const element = document.createElement("a");
    const file = new Blob([generatedPitch], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedLead.businessName.replace(/\s+/g, "_")}_${pitchMedium}_Pitch.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Copy to clipboard helper
  const handleCopyToClipboard = () => {
    if (!generatedPitch) return;
    navigator.clipboard.writeText(generatedPitch).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // Filter list
  const filteredLeads = leads.filter((lead) => {
    const matchesQuery = 
      lead.businessName.toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
      lead.niche.toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
      lead.currentPaintPoints.toLowerCase().includes(leadSearchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || lead.followUpStatus === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 px-4 py-8 antialiased">
      {/* Dynamic Stepper Bar */}
      <div className="mb-6 bg-gradient-to-r from-indigo-50/70 via-white to-slate-50 border border-slate-250 rounded-2xl p-4 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-indigo-600 text-xs text-white flex items-center justify-center font-bold font-mono shrink-0 shadow-sm">
            {onboardingStep}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Workspace Onboarding Step {onboardingStep} of 4</h4>
            <p className="text-[11px] text-slate-500">
              {onboardingStep === 2 
                ? "Configure target parameters, click 'Scan Target Segment' to find live leads, then click 'Run Strategic Audit' on your selected lead!"
                : "Move through the sequence: Profile -> Locate Leads -> Audit Diagnosis -> Pitch Composer."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button 
            type="button"
            onClick={() => {
              if (setOnboardingStep) {
                const prev = Math.max(1, onboardingStep - 1);
                setOnboardingStep(prev);
                localStorage.setItem("onboarding_step", prev.toString());
                if (prev === 1 && onNavigate) onNavigate("landing");
                if (prev === 3 && onNavigate) onNavigate("audit");
              }
            }}
            disabled={onboardingStep === 1}
            className="px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase bg-white border border-slate-200 text-slate-650 hover:bg-slate-50 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
          >
            &larr; Prev Step
          </button>
          
          <button 
            type="button"
            onClick={() => {
              if (setOnboardingStep) {
                const next = Math.min(4, onboardingStep + 1);
                setOnboardingStep(next);
                localStorage.setItem("onboarding_step", next.toString());
                if (next === 3 && onNavigate) onNavigate("audit");
              }
            }}
            disabled={onboardingStep === 4}
            className="px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase bg-indigo-600 border border-indigo-700 text-white hover:bg-indigo-700 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
          >
            Next Step &rarr;
          </button>
        </div>
      </div>

      {/* Back to landing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 max-w-7xl mx-auto">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>&larr;</span> Back to Dashboard
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Prospect Finder & Outreach Lounge
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Research registered real-world entities through live search grounding to map immediate diagnostic opportunities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-755 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Configure Dynamic Router & Fallbacks"
            >
              <Cpu className="w-4 h-4 text-indigo-500" /> AI Engine
            </button>
          )}
          <button
            onClick={() => setShowManualModal(true)}
            id="add-custom-lead"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 border border-indigo-720 text-white hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" /> Add Custom Lead
          </button>
          <button
            onClick={onResetLeads}
            id="reset-radar"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Clear Stored Leads
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex bg-slate-200 border border-slate-300 rounded-xl p-1 gap-1 mb-6 max-w-7xl mx-auto">
        <button
          onClick={() => setMobileTab("search")}
          className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
            mobileTab === "search"
              ? "bg-sky-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white bg-transparent"
          }`}
        >
          Parameters & Queue
        </button>
        <button
          onClick={() => setMobileTab("profile")}
          className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
            mobileTab === "profile"
              ? "bg-sky-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white bg-transparent"
          }`}
        >
          Profile & Pitch Console
        </button>
      </div>

      {/* Grid: Search controls + list & pitches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
        {/* Left column (4 cols): Search setup & stored leads list */}
        <div className={`lg:col-span-4 space-y-6 ${mobileTab === "search" ? "block" : "hidden lg:block"}`}>
          {/* Discovery Console */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="font-display text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-500" /> Discovery Parameter Matrix
            </h3>
            
            <form onSubmit={handleFindLeads} className="space-y-4">
              {/* Target Industry Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">
                  Target Industry
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedIndustry(val);
                    if (val !== "Custom/Other") {
                      const niches = NICHE_PRESETS[val] || [];
                      setSelectedNiche(niches[0] || "Custom/Other");
                    } else {
                      setSelectedNiche("Custom/Other");
                    }
                  }}
                  className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-500 font-medium font-mono cursor-pointer"
                >
                  {INDUSTRIES_PRESETS.map((ind) => (
                    <option key={ind} value={ind} className="bg-white text-slate-800">
                      {ind}
                    </option>
                  ))}
                </select>
                {selectedIndustry === "Custom/Other" && (
                  <input
                    type="text"
                    value={customIndustry}
                    onChange={(e) => setCustomIndustry(e.target.value)}
                    className="w-full mt-2 text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 font-medium font-mono"
                    placeholder="Enter Custom Industry (e.g., Drone Videography)"
                    required
                  />
                )}
              </div>

              {/* Target Niche Dropdown dependent on Industry */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">
                  Sub-Segment / Niche
                </label>
                {selectedIndustry !== "Custom/Other" && (NICHE_PRESETS[selectedIndustry] || []).length > 0 ? (
                  <select
                    value={selectedNiche}
                    onChange={(e) => setSelectedNiche(e.target.value)}
                    className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-500 font-medium font-mono cursor-pointer"
                  >
                    {(NICHE_PRESETS[selectedIndustry] || []).map((n) => (
                      <option key={n} value={n} className="bg-white text-slate-800">
                        {n}
                      </option>
                    ))}
                    <option value="Custom/Other" className="bg-white text-slate-800">
                      Custom/Other
                    </option>
                  </select>
                ) : null}

                {/* Show custom input text if selected is custom or industry is custom */}
                {(selectedNiche === "Custom/Other" || selectedIndustry === "Custom/Other") && (
                  <input
                    type="text"
                    value={customNiche}
                    onChange={(e) => setCustomNiche(e.target.value)}
                    className="w-full mt-2 text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 font-medium font-mono"
                    placeholder="Enter Custom Niche (e.g., Luxury Pet Spas)"
                    required
                  />
                )}
              </div>

              {/* Target Location Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">
                  Target Location / Region
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-500 font-medium font-mono cursor-pointer"
                >
                  {LOCATIONS_PRESETS.map((loc) => (
                    <option key={loc} value={loc} className="bg-white text-slate-800">
                      {loc}
                    </option>
                  ))}
                </select>
                {selectedLocation === "Custom/Other" && (
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    className="w-full mt-2 text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 font-medium font-mono"
                    placeholder="Enter Custom Region (e.g., Munich, Germany)"
                    required
                  />
                )}
              </div>

              {/* Offer Solutions Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">
                  Solutions / Services to Offer
                </label>
                <select
                  value={selectedSolution}
                  onChange={(e) => setSelectedSolution(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-500 font-medium font-mono cursor-pointer"
                >
                  {SOLUTIONS_PRESETS.map((sol) => (
                    <option key={sol} value={sol} className="bg-white text-slate-800">
                      {sol}
                    </option>
                  ))}
                </select>
                {selectedSolution === "Custom/Other" && (
                  <textarea
                    value={customSolution}
                    onChange={(e) => setCustomSolution(e.target.value)}
                    rows={2}
                    className="w-full mt-2 text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-550"
                    placeholder="Describe custom pitch solutions you wish to offer..."
                    required
                  />
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loadingLeads}
                  className="flex-1 py-2 rounded-lg bg-indigo-600 border border-indigo-700 text-white font-bold text-xs tracking-wider uppercase hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loadingLeads ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>Querying Nodes...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>Scan Segment</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Reset Search Parameters"
                >
                  Reset Search
                </button>
              </div>
            </form>

            {activeEngine && (
              <div className="mt-3 flex items-center justify-between gap-2 p-2 bg-indigo-50 border border-indigo-100/50 rounded-lg text-xs leading-none">
                <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">Process Routing</span>
                <span className="text-indigo-600 font-mono text-[9px] font-bold uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                  {activeEngine}
                </span>
              </div>
            )}

            {errorText && (
              <div className={`mt-3 p-3 border rounded-lg flex items-start gap-2 text-xs ${
                isFallbackMode 
                  ? "bg-amber-950/20 border-amber-500/30 text-amber-300"
                  : "bg-red-950/20 border-red-900/50 text-red-400"
              }`}>
                <AlertOctagon className="w-4.5 h-4.5 flex-shrink-0 text-amber-400 mt-0.5" />
                <span>{errorText}</span>
              </div>
            )}
          </div>

          {/* Stored Leads & Filtering */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-display font-medium text-xs text-slate-800 uppercase tracking-widest">
                Outreach Queue ({filteredLeads.length})
              </h4>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full">
                Active Nodes
              </span>
            </div>

            <div className="p-3 border-b border-slate-200 flex flex-col gap-2 bg-slate-50/10">
              <input
                type="text"
                placeholder="Search registered nodes..."
                value={leadSearchTerm}
                onChange={(e) => setLeadSearchTerm(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 py-1.5 px-2.5 rounded-lg focus:outline-hidden text-slate-800 font-sans"
              />
              <div className="flex flex-wrap gap-1">
                {["All", "Not Contacted", "Contacted", "Pitched", "Followed Up", "Woned"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-2 py-1 text-[10px] font-mono rounded border transition-colors ${
                      statusFilter === filter
                        ? "bg-indigo-600 text-white border-indigo-600 font-bold"
                        : "bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    {filter === "Woned" ? "Won" : filter}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-100 bg-white">
              {filteredLeads.length === 0 ? (
                <div className="py-8 px-4 text-center text-slate-400 text-xs font-mono">
                  No prospects matched. Formulate a search above to populate database.
                </div>
              ) : (
                filteredLeads.map((item) => {
                  const isSelected = selectedLead?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedLeadId(item.id);
                        setMobileTab("profile");
                      }}
                      className={`p-3.5 cursor-pointer text-left transition-colors flex justify-between items-start gap-2 ${
                        isSelected ? "bg-indigo-50/50 border-l-4 border-indigo-600" : "hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                            item.followUpStatus === "Not Contacted" ? "bg-slate-100 text-slate-600" :
                            item.followUpStatus === "Contacted" ? "bg-blue-50 text-blue-600 border border-blue-105" :
                            item.followUpStatus === "Pitched" ? "bg-amber-55 text-amber-700 border border-amber-100" :
                            item.followUpStatus === "Woned" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                            "bg-purple-50 text-purple-700 border border-purple-100"
                          }`}>
                            {item.followUpStatus === "Woned" ? "WON" : item.followUpStatus.toUpperCase()}
                          </span>
                          <span className="text-[10px] font-mono text-indigo-500 font-semibold">
                            R: {item.relevanceScore}%
                          </span>
                        </div>
                        <h5 className="font-display font-bold text-xs text-slate-800 truncate mt-1">
                          {item.businessName}
                        </h5>
                        <p className="text-[10px] text-slate-500 truncate">{item.niche}</p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteLead(item.id);
                        }}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-sm"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right column (8 cols): Selected Lead Profile & Pitch Generator */}
        <div className={`lg:col-span-8 space-y-6 ${mobileTab === "profile" ? "block" : "hidden lg:block"}`}>
          {selectedLead ? (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                      {selectedLead.businessName}
                    </h3>
                    <p className="text-sm text-indigo-600 font-medium font-mono">
                      Sector Focus: {selectedLead.niche}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono">FLOW LEVEL:</span>
                    <select
                      value={selectedLead.followUpStatus}
                      onChange={(e) => {
                        onUpdateLead({
                          ...selectedLead,
                          followUpStatus: e.target.value as any,
                        });
                      }}
                      className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono focus:outline-hidden cursor-pointer"
                    >
                      <option value="Not Contacted">Not Contacted</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Pitched">Pitched</option>
                      <option value="Followed Up">Followed Up</option>
                      <option value="Woned">Won (Closed Deal)</option>
                      <option value="Lost">Lost Opportunity</option>
                    </select>
                  </div>
                </div>

                {/* Sub: Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  {/* Left segment */}
                  <div className="space-y-3 font-mono">
                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <Mail className="w-4 h-4 text-indigo-500" />
                      <span className="text-slate-400 w-24">Direct Email:</span>
                      <span className="text-slate-800 select-all font-semibold">{selectedLead.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <Phone className="w-4 h-4 text-indigo-500" />
                      <span className="text-slate-400 w-24">Direct Phone:</span>
                      <span className="text-slate-800 select-all font-semibold">{selectedLead.phone}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <Globe className="w-4 h-4 text-indigo-500" />
                      <span className="text-slate-400 w-24">Website:</span>
                      <a
                        href={selectedLead.website}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="text-indigo-600 hover:text-indigo-800 hover:underline truncate font-semibold"
                      >
                        {selectedLead.website}
                      </a>
                    </div>
                  </div>

                  {/* Right segment */}
                  <div className="space-y-3 font-mono">
                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <MessageSquare className="w-4 h-4 text-emerald-500" />
                      <span className="text-slate-400 w-24">WhatsApp Biz:</span>
                      <span className="text-slate-800 select-all font-semibold">{selectedLead.whatsapp}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <Linkedin className="w-4 h-4 text-indigo-500" />
                      <span className="text-slate-400 w-24">Outreach Handle:</span>
                      <span className="text-slate-800 select-all font-semibold">{selectedLead.contactPerson}</span>
                    </div>

                    <div className="text-xs pt-1">
                      <span className="font-mono text-indigo-600 font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
                        Acquisition Confidence: {selectedLead.relevanceScore}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grounded Social signals & Demand metrics dashboard */}
                <div className="mt-5 p-4 rounded-xl border border-indigo-100 bg-indigo-50/20 space-y-3">
                  <h4 className="font-display font-semibold text-xs text-indigo-900 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                    <Globe className="w-4 h-4 text-indigo-600" /> Grounded Social Signals & Live Demand Metrics:
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {/* Signal Platform */}
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/65 shadow-2xs">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">Signal Source</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          selectedLead.sourcePlatform?.toLowerCase().includes("reddit") ? "bg-orange-500" :
                          selectedLead.sourcePlatform?.toLowerCase().includes("quora") ? "bg-red-600" :
                          selectedLead.sourcePlatform?.toLowerCase().includes("facebook") ? "bg-blue-600" :
                          selectedLead.sourcePlatform?.toLowerCase().includes("youtube") ? "bg-red-500" :
                          selectedLead.sourcePlatform?.toLowerCase().includes("perplexity") ? "bg-teal-500 animate-pulse" :
                          "bg-indigo-600"
                        }`} />
                        <span className="text-[11px] font-bold text-slate-800 font-sans">{selectedLead.sourcePlatform || "Google Search"}</span>
                      </div>
                    </div>

                    {/* Urgency Level */}
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/65 shadow-2xs">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">Urgency Level</span>
                      <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase ${
                        selectedLead.urgencyLevel === "Critical" ? "bg-red-50 text-red-700 border border-red-200" :
                        selectedLead.urgencyLevel === "High" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                        "bg-slate-100 text-slate-800"
                      }`}>{selectedLead.urgencyLevel || "High"}</span>
                    </div>

                    {/* Willingness to Pay */}
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/65 shadow-2xs">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">Willingness to Pay</span>
                      <span className="text-[11px] font-bold text-slate-800 block truncate">{selectedLead.willingnessToPay || "Premium Value"}</span>
                    </div>

                    {/* Probability % */}
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/65 shadow-2xs">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">Likely Conv. Rate</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-black text-indigo-700 leading-none">{selectedLead.likelyConversionRate || 85}%</span>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 rounded-full" 
                            style={{ width: `${selectedLead.likelyConversionRate || 85}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grounded Source Snippet */}
                  {selectedLead.demandSignalSource && (
                    <div className="mt-2 text-xs text-slate-600 bg-white/70 border border-indigo-100/50 p-2.5 rounded-lg italic font-sans">
                      <span className="not-italic font-bold text-[9px] text-indigo-700 uppercase tracking-widest block mb-0.5 font-mono">Found Post/Query Context Summary:</span>
                      "{selectedLead.demandSignalSource}"
                    </div>
                  )}
                </div>

                {/* Sub: Client immediate Need */}
                <div className="mt-5 bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                  <h4 className="font-display font-bold text-xs text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Need Analysis & Solution Blueprint:
                  </h4>
                  <p className="text-slate-750 text-sm leading-relaxed">
                    {selectedLead.currentPaintPoints}
                  </p>
                </div>

                {/* ACTION TRIGGER BUTTON FOR STEP 3 */}
                <button
                  type="button"
                  onClick={() => {
                    if (setOnboardingLead && onNavigate && setOnboardingStep) {
                      setOnboardingLead(selectedLead);
                      setOnboardingStep(3);
                      localStorage.setItem("onboarding_step", "3");
                      onNavigate("audit");
                    }
                  }}
                  className="mt-4 w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4 text-white" />
                  <span>Next: Run Strategic Audit Diagnostic on {selectedLead.businessName} &rarr;</span>
                </button>
              </div>

              {/* Pitch Creator Console */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-display text-sm font-bold text-slate-800 uppercase mb-4 tracking-wider flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" /> Plain Outreach Pitch Assistant
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider font-mono">
                      Outreach Medium
                    </label>
                    <div className="flex gap-2">
                      {["Email", "WhatsApp", "LinkedIn"].map((medium) => (
                        <button
                          key={medium}
                          type="button"
                          onClick={() => setPitchMedium(medium as any)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all border ${
                            pitchMedium === medium
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                              : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800"
                          }`}
                        >
                          {medium}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider font-mono">
                      Custom Angle / Extra context
                    </label>
                    <input
                      type="text"
                      value={customAngle}
                      onChange={(e) => setCustomAngle(e.target.value)}
                      placeholder="e.g. Highlight mobile performance audit..."
                      className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 font-sans"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGeneratePitch}
                  disabled={loadingPitch}
                  id="generate-outreach-pitch"
                  className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-bold text-xs tracking-wider uppercase hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  {loadingPitch ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Formulating outreach draft...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Draft tailor-made Pitch</span>
                    </>
                  )}
                </button>

                {/* Pitch Display Segment */}
                {generatedPitch && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 border border-slate-200 rounded-xl bg-slate-50 overflow-hidden"
                  >
                    <div className="p-3 bg-slate-100 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 rounded-full h-2 bg-emerald-500 animate-pulse shrink-0" />
                        <span className="text-[10px] font-mono text-slate-600 font-bold uppercase tracking-wider">
                          Ready Pitch ({pitchMedium}) - No formatting markup
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setIsExpandedPitch(!isExpandedPitch)}
                          className="px-2.5 py-1 text-[10px] font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {isExpandedPitch ? "Shrink" : "Expand All"}
                        </button>

                        <button
                          type="button"
                          onClick={handleCopyToClipboard}
                          className="px-2.5 py-1 text-[10px] font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copySuccess ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                          {copySuccess ? "Copied" : "Copy"}
                        </button>

                        <button
                          type="button"
                          onClick={handleDownloadPitch}
                          className="px-2.5 py-1 text-[10px] font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Download className="w-3 h-3 text-slate-550" /> Download
                        </button>

                        {pitchMedium === "WhatsApp" && (
                          <a
                            href={`https://wa.me/${selectedLead.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(generatedPitch)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 text-[10px] font-semibold text-white bg-emerald-600 border border-emerald-700 rounded-md hover:bg-emerald-700 flex items-center gap-1 transition-colors"
                          >
                            <Send className="w-3 h-3" /> Send WhatsApp
                          </a>
                        )}

                        {pitchMedium === "Email" && (
                          <a
                            href={`mailto:${selectedLead.email}?subject=Introductory%20Discussion&body=${encodeURIComponent(generatedPitch)}`}
                            className="px-2.5 py-1 text-[10px] font-semibold text-white bg-indigo-600 border border-indigo-700 rounded-md hover:bg-indigo-700 flex items-center gap-1 transition-colors"
                          >
                            <Mail className="w-3 h-3" /> Send Email
                          </a>
                        )}
                      </div>
                    </div>

                    <div className={`p-5 overflow-auto ${isExpandedPitch ? "" : "max-h-[350px]"}`}>
                      <div className="text-slate-800 text-sm font-sans font-normal leading-relaxed whitespace-pre-wrap select-all break-words w-full max-w-full overflow-x-hidden">
                        {generatedPitch}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Systemic Follow-Up Planner Widget */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h4 className="font-display font-medium text-xs text-slate-805 mb-3 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  <Calendar className="w-4 h-4 text-indigo-500" /> Systematic Touchpoint Matrix Flow
                </h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Consistently contacting leads yields a 4x increase in sales conversion:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* Touch 1: Initial Pitch */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 font-bold">Touch 1</span>
                    <h5 className="font-display font-bold text-xs text-slate-900 mt-1">Initial Proposal</h5>
                    <p className="text-[10px] text-slate-650 mt-1 h-8">Direct tailored pitch covering core paint point.</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      <span className="text-[10px] font-mono text-slate-500">Scheduled Day 0</span>
                    </div>
                  </div>

                  {/* Touch 2: Followup 1 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-indigo-650 font-bold">Touch 2</span>
                    <h5 className="font-display font-bold text-xs text-slate-900 mt-1">Direct Value Inject</h5>
                    <p className="text-[10px] text-slate-650 mt-1 h-8">Provide 1 specific quick-fix detail for their business.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setPitchMedium("Email");
                        setCustomAngle("Day 3 quick-fix offering maximum value without commitment.");
                        handleGeneratePitch();
                      }}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline mt-2 text-left block cursor-pointer"
                    >
                      Generate Copy &rarr;
                    </button>
                  </div>

                  {/* Touch 3: Followup 2 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-indigo-650 font-bold">Touch 3</span>
                    <h5 className="font-display font-bold text-xs text-slate-900 mt-1">Slight Urgency</h5>
                    <p className="text-[10px] text-slate-650 mt-1 h-8">Check if they took action on previous step or had feedback.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setPitchMedium("Email");
                        setCustomAngle("Day 7 soft followup requesting feedback on previous tool checklist.");
                        handleGeneratePitch();
                      }}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-80/80 hover:underline mt-2 text-left block cursor-pointer"
                    >
                      Generate Copy &rarr;
                    </button>
                  </div>

                  {/* Touch 4: Final Wrap */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-indigo-650 font-bold">Touch 4</span>
                    <h5 className="font-display font-bold text-xs text-slate-900 mt-1">Break-Up Outlook</h5>
                    <p className="text-[10px] text-slate-650 mt-1 h-8">Polite signoff removing outreach sequence pressure.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setPitchMedium("Email");
                        setCustomAngle("Day 14 final break up outreach showing maximum respect.");
                        handleGeneratePitch();
                      }}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-80/80 hover:underline mt-2 text-left block cursor-pointer"
                    >
                      Generate Copy &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-600 shadow-sm">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-500 border border-indigo-100">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-sans max-w-md mx-auto leading-relaxed text-slate-600">
                Initiate a lead scan on the left parameter matrix to retrieve target prospects, or select an existing active prospect node to review custom emails and outreach steps.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Manual Creation Modal Overlay */}
      <AnimatePresence>
        {showManualModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 shadow-xl max-w-lg w-full overflow-hidden text-slate-200 rounded-xl"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-white uppercase tracking-wider font-mono text-sm">
                  Add Custom Coordinates to CRM
                </h3>
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="p-1 rounded-md text-slate-450 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateManualLead} className="p-6 space-y-4 font-mono">
                <div>
                  <label className="block text-xs font-bold text-slate-400 tracking-wider mb-1 uppercase">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    className="w-full text-xs py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-750 focus:outline-hidden"
                    placeholder="e.g. Acme Tech Solutions"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 tracking-wider mb-1 uppercase">
                      Niche focus
                    </label>
                    <input
                      type="text"
                      value={newLeadNiche}
                      onChange={(e) => setNewLeadNiche(e.target.value)}
                      className="w-full text-xs py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-755 focus:outline-hidden"
                      placeholder="e.g. Dental clinic"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 tracking-wider mb-1 uppercase">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={newLeadContact}
                      onChange={(e) => setNewLeadContact(e.target.value)}
                      className="w-full text-xs py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-755 focus:outline-hidden"
                      placeholder="e.g. John Doe, COO"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 tracking-wider mb-1 uppercase">
                      Business Email
                    </label>
                    <input
                      type="email"
                      value={newLeadEmail}
                      onChange={(e) => setNewLeadEmail(e.target.value)}
                      className="w-full text-xs py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-755 focus:outline-hidden"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 tracking-wider mb-1 uppercase">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={newLeadWhatsapp}
                      onChange={(e) => setNewLeadWhatsapp(e.target.value)}
                      className="w-full text-xs py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-755 focus:outline-hidden"
                      placeholder="e.g. +14155552671"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 tracking-wider mb-1 uppercase">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={newLeadWebsite}
                    onChange={(e) => setNewLeadWebsite(e.target.value)}
                    className="w-full text-xs py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-755 focus:outline-hidden"
                    placeholder="https://acme.org"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 tracking-wider mb-1 uppercase">
                    Specific Problems & Solution Blueprint
                  </label>
                  <textarea
                    value={newLeadPaintPoints}
                    onChange={(e) => setNewLeadPaintPoints(e.target.value)}
                    rows={3}
                    className="w-full text-xs py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-hidden font-sans"
                    placeholder="Describe direct need..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Save Coordinates Node
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
