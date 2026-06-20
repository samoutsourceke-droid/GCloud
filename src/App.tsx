import { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import LeadFinder from "./components/LeadFinder";
import BusinessAuditSuite from "./components/BusinessAuditSuite";
import AISettingsModal from "./components/AISettingsModal";
import { Lead, BusinessAudit, UserBusinessProfile } from "./types";

// Seed data to make the app incredibly responsive and feature-rich out of the box
const SEED_LEADS: Lead[] = [
  {
    id: "lead_seed_1",
    businessName: "Elite Chiropractic Care",
    niche: "Local Chiropractic Group",
    website: "https://elite-chiropractic.example.com",
    contactPerson: "Dr. Marcus Vance (Founder & Owner)",
    email: "marcus.vance@elite-chiro.example.com",
    phone: "+1 (555) 438-9901",
    whatsapp: "+15554389901",
    socials: {
      linkedin: "https://linkedin.com/in/dr-vance-elitechiro",
    },
    currentPaintPoints: "High volume of website visitor drop-offs. Dr. Marcus needs an optimized online scheduling portal and automated text message booking reminders to capture weekend emergencies.",
    relevanceScore: 94,
    createdAt: new Date().toISOString(),
    followUpStatus: "Not Contacted",
  },
  {
    id: "lead_seed_2",
    businessName: "Evergreen Roofers LLC",
    niche: "Construction & Contracting",
    website: "https://evergreenroofers.example.com",
    contactPerson: "Sarah Jennings (Head of Sales)",
    email: "sales@evergreenroofers.example.com",
    phone: "+1 (555) 890-3321",
    whatsapp: "+15558903321",
    socials: {
      linkedin: "https://linkedin.com/company/evergreenroofers",
    },
    currentPaintPoints: "Looking for an immediate strategic workflow system. Sarah wants to create a personalized multi-channel follow-up sequence for insurance settlement leads that currently slip through the cracks.",
    relevanceScore: 89,
    createdAt: new Date().toISOString(),
    followUpStatus: "Pitched",
  },
];

const SEED_AUDITS: BusinessAudit[] = [
  {
    id: "audit_seed_1",
    companyName: "Gourmet Grind Coffee Shop",
    website: "https://gourmetgrind.example.com",
    coreActivity: "Artisanal Specialty Coffee Cafe",
    challenge: "Low customer lifetime loyalty score and manual paper-card rewards program fatigue.",
    scoreBreakdown: {
      marketing: 6,
      presence: 8,
      operations: 4,
      retention: 5,
    },
    executiveSummary: "Gourmet Grind is situated in a high-traffic urban neighborhood and boasts exceptional product quality. However, they lack dynamic customer capture channels and heavily depend on outdated cardboard stamp loyalty mechanisms.",
    criticalGap: "Over 68% of first-time weekend tourists never return due to zero direct-contact marketing channels post-purchase. No automated newsletters or review-boost triggers exist.",
    recommendations: [
      {
        title: "Integrate Digital Wallet Loyalty Systems",
        actionableDetail: "Scrap standard card stamps. Deploy frictionless Apple/Google Wallet digital loyalty passports that trigger geo-fenced promos as regulars walk near.",
      },
      {
        title: "Run Automatic Google Review Asks",
        actionableDetail: "Launch immediate thank-you emails holding a direct feedback link within 30 minutes after standard POS checkouts.",
      },
      {
        title: "Launch Customer Reactivation Campaigns",
        actionableDetail: "Automate customized win-back emails holding coffee/croissant perks to subscribers inactive for more than 14 days.",
      },
    ],
    growthLiftEstimate: "Reclaim up to 22% of dormant customers within 90 days and boost Google Maps positive review score by 120%.",
    pitchHookIdea: "Scrap cardboard stamp loops. Bring premium, frictionless digital loyalty passports right to your subscribers' digital wallets.",
    createdAt: new Date().toISOString(),
  },
];

export default function App() {
  const [view, setView] = useState<"landing" | "leads" | "audit">("landing");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [audits, setAudits] = useState<BusinessAudit[]>([]);
  const [resetConfirmType, setResetConfirmType] = useState<"leads" | "audits" | null>(null);
  
  // Onboarding sequence state
  const [onboardingStep, setOnboardingStep] = useState<number>(() => {
    const saved = localStorage.getItem("onboarding_step");
    return saved ? parseInt(saved, 10) : 1;
  });
  const [onboardingLead, setOnboardingLead] = useState<Lead | null>(null);

  useEffect(() => {
    localStorage.setItem("onboarding_step", onboardingStep.toString());
  }, [onboardingStep]);

  // User B2B Profile settings
  const [userProfile, setUserProfile] = useState<UserBusinessProfile>(() => {
    const saved = localStorage.getItem("user_business_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return {
      companyName: "Acme Growth Partners",
      website: "https://acmegrowth.example.com",
      services: "Cold email systems, Google review boosters, landing page optimization",
      contactName: "Alex Mercer",
      bio: "We help local service providers and niche SaaS brands scale their customer retention and digital engagement using conversational custom tools and automated follow-ups.",
      tone: "expert, direct, consultative, with zero hype"
    };
  });

  useEffect(() => {
    localStorage.setItem("user_business_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  // AI Resilience & Engine configurations
  const [provider, setProvider] = useState<string>(() => localStorage.getItem("ai_provider") || "auto");
  const [customOpenRouterKey, setCustomOpenRouterKey] = useState<string>(() => localStorage.getItem("custom_openrouter_key") || "");
  const [customHuggingFaceKey, setCustomHuggingFaceKey] = useState<string>(() => localStorage.getItem("custom_huggingface_key") || "");
  const [customGroqKey, setCustomGroqKey] = useState<string>(() => localStorage.getItem("custom_groq_key") || "");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("ai_provider", provider);
  }, [provider]);

  useEffect(() => {
    localStorage.setItem("custom_openrouter_key", customOpenRouterKey);
  }, [customOpenRouterKey]);

  useEffect(() => {
    localStorage.setItem("custom_huggingface_key", customHuggingFaceKey);
  }, [customHuggingFaceKey]);

  useEffect(() => {
    localStorage.setItem("custom_groq_key", customGroqKey);
  }, [customGroqKey]);

  // Client identification & platform counts
  const [clientId] = useState<string>(() => {
    let id = localStorage.getItem("leadsphere_client_id");
    if (!id) {
      id = "client_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("leadsphere_client_id", id);
    }
    return id;
  });

  const [platformStats, setPlatformStats] = useState<{
    globalLeadsQueries: number;
    globalAuditsQueries: number;
    globalWebpageVisits: number;
    otherUsersLeadsQueries: number;
    otherUsersAuditsQueries: number;
    otherUsersWebpageVisits: number;
    otherUsersTotalHits: number;
    myLeadsCount: number;
    myAuditsCount: number;
    myWebpageVisits: number;
  }>({
    globalLeadsQueries: 142,
    globalAuditsQueries: 68,
    globalWebpageVisits: 1845,
    otherUsersLeadsQueries: 142,
    otherUsersAuditsQueries: 68,
    otherUsersWebpageVisits: 1845,
    otherUsersTotalHits: 210,
    myLeadsCount: 0,
    myAuditsCount: 0,
    myWebpageVisits: 0
  });

  const refreshPlatformStats = async (registerVisit = false) => {
    try {
      const res = await fetch(`/api/platform-stats?clientId=${clientId}${registerVisit ? "&registerVisit=true" : ""}`);
      if (res.ok) {
        const data = await res.json();
        setPlatformStats(data);
      }
    } catch (e) {
      console.warn("Could not load global platform stats:", e);
    }
  };

  useEffect(() => {
    // On mount, register a page view and fetch starting counts
    refreshPlatformStats(true);
  }, [clientId]);

  // Initialize storage
  useEffect(() => {
    const savedLeads = localStorage.getItem("leads_database");
    const savedAudits = localStorage.getItem("audits_database");

    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    } else {
      setLeads([]);
      localStorage.setItem("leads_database", JSON.stringify([]));
    }

    if (savedAudits) {
      setAudits(JSON.parse(savedAudits));
    } else {
      setAudits([]);
      localStorage.setItem("audits_database", JSON.stringify([]));
    }
  }, []);

  // Update leads database
  const saveLeadsToStorage = (updatedLeads: Lead[]) => {
    setLeads(updatedLeads);
    localStorage.setItem("leads_database", JSON.stringify(updatedLeads));
  };

  const handleAddLead = (lead: Lead) => {
    setLeads((prev) => {
      const next = [lead, ...prev];
      localStorage.setItem("leads_database", JSON.stringify(next));
      return next;
    });
  };

  const handleAddLeads = (newLeads: Lead[], overwrite = false) => {
    setLeads((prev) => {
      const nextLeads = overwrite ? newLeads : [...newLeads, ...prev];
      localStorage.setItem("leads_database", JSON.stringify(nextLeads));
      return nextLeads;
    });
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    const nextLeads = leads.map((l) => (l.id === updatedLead.id ? updatedLead : l));
    saveLeadsToStorage(nextLeads);
  };

  const handleDeleteLead = (id: string) => {
    const nextLeads = leads.filter((l) => l.id !== id);
    saveLeadsToStorage(nextLeads);
  };

  const handleResetLeads = () => {
    if (confirm("Are you sure you want to clear your lead database? This clears all personal pitch coordinates and logs.")) {
      saveLeadsToStorage([]);
    }
  };

  // Update audits database
  const saveAuditsToStorage = (updatedAudits: BusinessAudit[]) => {
    setAudits(updatedAudits);
    localStorage.setItem("audits_database", JSON.stringify(updatedAudits));
  };

  const handleAddAudit = (audit: BusinessAudit) => {
    const nextAudits = [audit, ...audits];
    saveAuditsToStorage(nextAudits);
  };

  const handleDeleteAudit = (id: string) => {
    const nextAudits = audits.filter((a) => a.id !== id);
    saveAuditsToStorage(nextAudits);
  };

  const handleResetAudits = () => {
    if (confirm("Are you sure you want to clear your business audits? This action cannot be undone.")) {
      saveAuditsToStorage([]);
    }
  };

  // Stats summaries
  const stats = {
    leadsCount: leads.length,
    pitchesCount: leads.filter((l) => l.followUpStatus === "Pitched" || l.followUpStatus === "Followed Up").length + 2,
    auditsCount: audits.length,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-850">
      {view === "landing" && (
        <LandingPage 
          onNavigate={setView} 
          stats={stats} 
          onOpenSettings={() => setIsSettingsOpen(true)}
          userProfile={userProfile}
          onUpdateProfile={setUserProfile}
          onboardingStep={onboardingStep}
          setOnboardingStep={setOnboardingStep}
          platformStats={platformStats}
        />
      )}

      {view === "leads" && (
        <LeadFinder
          leads={leads}
          onAddLead={handleAddLead}
          onAddLeads={handleAddLeads}
          onUpdateLead={handleUpdateLead}
          onDeleteLead={handleDeleteLead}
          onResetLeads={handleResetLeads}
          onBack={() => setView("landing")}
          provider={provider}
          customOpenRouterKey={customOpenRouterKey}
          customHuggingFaceKey={customHuggingFaceKey}
          customGroqKey={customGroqKey}
          onOpenSettings={() => setIsSettingsOpen(true)}
          userProfile={userProfile}
          onboardingStep={onboardingStep}
          setOnboardingStep={setOnboardingStep}
          onboardingLead={onboardingLead}
          setOnboardingLead={setOnboardingLead}
          onNavigate={setView}
          clientId={clientId}
          platformStats={platformStats}
          onRefreshStats={refreshPlatformStats}
        />
      )}

      {view === "audit" && (
        <BusinessAuditSuite
          audits={audits}
          onAddAudit={handleAddAudit}
          onDeleteAudit={handleDeleteAudit}
          onResetAudits={handleResetAudits}
          onBack={() => setView("landing")}
          provider={provider}
          customOpenRouterKey={customOpenRouterKey}
          customHuggingFaceKey={customHuggingFaceKey}
          customGroqKey={customGroqKey}
          onOpenSettings={() => setIsSettingsOpen(true)}
          userProfile={userProfile}
          onboardingStep={onboardingStep}
          setOnboardingStep={setOnboardingStep}
          onboardingLead={onboardingLead}
          setOnboardingLead={setOnboardingLead}
          onNavigate={setView}
          clientId={clientId}
          platformStats={platformStats}
          onRefreshStats={refreshPlatformStats}
        />
      )}

      <AISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        provider={provider}
        setProvider={setProvider}
        customOpenRouterKey={customOpenRouterKey}
        setCustomOpenRouterKey={setCustomOpenRouterKey}
        customHuggingFaceKey={customHuggingFaceKey}
        setCustomHuggingFaceKey={setCustomHuggingFaceKey}
        customGroqKey={customGroqKey}
        setCustomGroqKey={setCustomGroqKey}
      />
    </div>
  );
}
