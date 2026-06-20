import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, Compass, Award, ShieldAlert, Sparkles, Copy, Download, 
  Trash2, Plus, RefreshCw, Send, CheckCircle2, ChevronRight, HelpCircle, Cpu 
} from "lucide-react";
import { BusinessAudit } from "../types";

interface BusinessAuditSuiteProps {
  audits: BusinessAudit[];
  onAddAudit: (audit: BusinessAudit) => void;
  onDeleteAudit: (id: string) => void;
  onResetAudits: () => void;
  onBack: () => void;
  provider?: string;
  customOpenRouterKey?: string;
  customHuggingFaceKey?: string;
  customGroqKey?: string;
  onOpenSettings?: () => void;
  userProfile?: any;
  onboardingStep?: number;
  setOnboardingStep?: (step: number) => void;
  onboardingLead?: any;
  setOnboardingLead?: (lead: any) => void;
  onNavigate?: (view: any) => void;
  clientId?: string;
  platformStats?: any;
  onRefreshStats?: () => void;
}

export default function BusinessAuditSuite({
  audits,
  onAddAudit,
  onDeleteAudit,
  onResetAudits,
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
}: BusinessAuditSuiteProps) {
  // Setup inputs
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [coreActivity, setCoreActivity] = useState("");
  const [challenge, setChallenge] = useState("");

  // Auto-populate when onboarding lead changes
  React.useEffect(() => {
    if (onboardingLead) {
      setCompanyName(onboardingLead.businessName || "");
      setWebsite(onboardingLead.website || "");
      setCoreActivity(onboardingLead.niche || "");
      setChallenge(onboardingLead.currentPaintPoints || "");
    }
  }, [onboardingLead]);
  
  // Scoring parameters
  const [marketingScore, setMarketingScore] = useState(6);
  const [presenceScore, setPresenceScore] = useState(5);
  const [operationsScore, setOperationsScore] = useState(4);
  const [retentionScore, setRetentionScore] = useState(7);

  const [loading, setLoading] = useState(false);
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"setup" | "report">("setup");
  const [activeEngine, setActiveEngine] = useState<string>("");

  const selectedAudit = audits.find((a) => a.id === selectedAuditId) || (audits.length > 0 ? audits[0] : null);

  // Send request to server-side Gemini API
  const handlePerformAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !coreActivity) {
      setErrorText("Company Name and Core Business Activity are required.");
      return;
    }

    setLoading(true);
    setErrorText(null);
    setActiveEngine("");

    try {
      const scoreBreakdown = {
        marketing: marketingScore,
        presence: presenceScore,
        operations: operationsScore,
        retention: retentionScore,
      };

      const response = await fetch("/api/analyze-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          website,
          coreActivity,
          challenge,
          scoreBreakdown,
          provider,
          customOpenRouterKey,
          customHuggingFaceKey,
          customGroqKey,
          userBusinessProfile: userProfile,
          clientId,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate dynamic business audit.");
      }

      const reportData = await response.json();
      
      // Handle the object structure returned from API
      const actualReport = reportData.audit || reportData;

      if (reportData.providerUsed) {
        setActiveEngine(reportData.providerUsed);
      }

      const newAudit: BusinessAudit = {
        id: "audit_" + Math.random().toString(36).substring(2, 9),
        companyName,
        website: website || "https://example.com/company",
        coreActivity,
        challenge: challenge || "Scaling client acquisition and optimizing bottleneck efficiency",
        scoreBreakdown,
        executiveSummary: actualReport.executiveSummary,
        criticalGap: actualReport.criticalGap,
        recommendations: actualReport.recommendations,
        growthLiftEstimate: actualReport.growthLiftEstimate,
        pitchHookIdea: actualReport.pitchHookIdea,
        createdAt: new Date().toISOString(),
      };

      onAddAudit(newAudit);
      setSelectedAuditId(newAudit.id);
      setMobileTab("report");

      // Refetch / trigger platform stats reload
      if (onRefreshStats) {
        onRefreshStats();
      }

      // Clear setup inputs
      setCompanyName("");
      setWebsite("");
      setCoreActivity("");
      setChallenge("");
      
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "Failed running strategic audit module.");
    } finally {
      setLoading(false);
    }
  };

  // Convert full Audit details into beautifully formatted plain text for Dispatch or Pitch
  const buildAuditOutputText = (audit: BusinessAudit) => {
    return `
========================================
GROWTH STRATEGY AUDIT REPORT: ${audit.companyName.toUpperCase()}
========================================
Generated on: ${new Date(audit.createdAt).toLocaleDateString()}
Website: ${audit.website}
Core Business: ${audit.coreActivity}
Core Operational Challenge: ${audit.challenge}

DIAGNOSTIC RATINGS (Out of 10):
- Marketing & Leads Acquisition: ${audit.scoreBreakdown.marketing}/10
- Digital Presence & SEO: ${audit.scoreBreakdown.presence}/10
- Operational flow & Automation: ${audit.scoreBreakdown.operations}/10
- Customer Retention & Service: ${audit.scoreBreakdown.retention}/10

----------------------------------------
EXECUTIVE SUMMARY
----------------------------------------
${audit.executiveSummary}

----------------------------------------
THE STRATEGIC HOLE / REVENUE LEAK
----------------------------------------
${audit.criticalGap}

----------------------------------------
ACTIONABLE GROWTH PATH RECOVERY (3-Steps)
----------------------------------------
${audit.recommendations.map((rec, i) => `${i + 1}. [${rec.title}]
   Action Detail: ${rec.actionableDetail}`).join("\n\n")}

----------------------------------------
ESTIMATED KPI RECOVERY
----------------------------------------
Estimate Lift: ${audit.growthLiftEstimate}
Recommended Marketing Pitch Angle: "${audit.pitchHookIdea}"

========================================
Report generated by LeadSphere Audit OS
========================================
`;
  };

  const handleDownloadReport = () => {
    if (!selectedAudit) return;
    const reportText = buildAuditOutputText(selectedAudit);
    const element = document.createElement("a");
    const file = new Blob([reportText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedAudit.companyName.replace(/\s+/g, "_")}_Growth_Audit.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyReport = () => {
    if (!selectedAudit) return;
    const reportText = buildAuditOutputText(selectedAudit);
    navigator.clipboard.writeText(reportText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // Calculate generic score averages
  const getOverallGrading = (score: number) => {
    if (score >= 8) return { label: "OPTIMAL STATUS", color: "text-emerald-700 bg-emerald-50 border-emerald-100 font-semibold" };
    if (score >= 5.5) return { label: "MODERATE RISK", color: "text-amber-700 bg-amber-50 border-amber-100 font-semibold" };
    return { label: "CRITICAL HOLE", color: "text-rose-700 bg-rose-50 border-rose-100 font-semibold" };
  };

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
              {onboardingStep === 3 
                ? `Conduct Strategic operational diagnostics. We've automatically preloaded ${companyName || 'your selected lead'} details!`
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
                if (prev === 2 && onNavigate) onNavigate("leads");
                if (prev === 1 && onNavigate) onNavigate("landing");
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
                if (next === 2 && onNavigate) onNavigate("leads");
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
            Diagnostic Audit & Pitch Customizer
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Conduct strategic diagnostic mapping, locate operational bottlenecks, and formulate perfect proposal pitches.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-755 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Configure Active AI Engine"
            >
              <Cpu className="w-4 h-4 text-indigo-505" /> AI Engine
            </button>
          )}
          {audits.length > 0 && (
            <button
              onClick={onResetAudits}
              id="clear-audits"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-105 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Clear Audits
            </button>
          )}
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex bg-white border border-slate-200 rounded-xl p-1 gap-1 mb-6 max-w-7xl mx-auto">
        <button
          onClick={() => setMobileTab("setup")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            mobileTab === "setup"
              ? "bg-indigo-600 text-white shadow-xs font-bold"
              : "text-slate-500 hover:text-slate-800 bg-transparent"
          }`}
        >
          Setup Parameters
        </button>
        <button
          onClick={() => setMobileTab("report")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            mobileTab === "report"
              ? "bg-indigo-600 text-white shadow-xs font-bold"
              : "text-slate-500 hover:text-slate-800 bg-transparent"
          }`}
        >
          Audit Report Overview
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
        {/* Left Input form (5 columns) */}
        <div className={`lg:col-span-5 space-y-6 ${mobileTab === "setup" ? "block" : "hidden lg:block"}`}>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-display text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-600" /> Audit Parameters Matrix
            </h3>

            <form onSubmit={handlePerformAudit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5 font-mono">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-slate-5 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-500 font-medium"
                  placeholder="e.g. Apex Wellness Center"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5 font-mono">
                  Company Website / Domain
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-slate-5 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-500 font-sans"
                  placeholder="https://apexwellness.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5 font-mono">
                  Operational Core Activity
                </label>
                <input
                  type="text"
                  value={coreActivity}
                  onChange={(e) => setCoreActivity(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-slate-5 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-500"
                  placeholder="e.g. Local chiropractors selling therapy sessions"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 font-mono">
                  Performance Diagnostic Ratings (Scale 1 to 10)
                </label>

                <div className="space-y-3.5">
                  {/* Category 1 */}
                  <div>
                    <div className="flex justify-between items-center text-xs text-slate-655 font-semibold mb-1">
                      <span>Marketing & Acquisition</span>
                      <span className="font-mono text-indigo-650 font-bold">{marketingScore}/10</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={marketingScore}
                      onChange={(e) => setMarketingScore(parseInt(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                    />
                  </div>

                  {/* Category 2 */}
                  <div>
                    <div className="flex justify-between items-center text-xs text-slate-655 font-semibold mb-1">
                      <span>Digital Footprint & SEO</span>
                      <span className="font-mono text-indigo-655 font-bold">{presenceScore}/10</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={presenceScore}
                      onChange={(e) => setPresenceScore(parseInt(e.target.value))}
                      className="w-full accent-indigo-605 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                    />
                  </div>

                  {/* Category 3 */}
                  <div>
                    <div className="flex justify-between items-center text-xs text-slate-655 font-semibold mb-1">
                      <span>Operations & CRM Automations</span>
                      <span className="font-mono text-indigo-655 font-bold">{operationsScore}/10</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={operationsScore}
                      onChange={(e) => setOperationsScore(parseInt(e.target.value))}
                      className="w-full accent-indigo-605 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                    />
                  </div>

                  {/* Category 4 */}
                  <div>
                    <div className="flex justify-between items-center text-xs text-slate-655 font-semibold mb-1">
                      <span>Client Retention & satisfaction</span>
                      <span className="font-mono text-indigo-655 font-bold">{retentionScore}/10</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={retentionScore}
                      onChange={(e) => setRetentionScore(parseInt(e.target.value))}
                      className="w-full accent-indigo-605 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5 font-mono">
                  Identified Bottleneck / Challenge
                </label>
                <textarea
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  rows={2}
                  className="w-full text-xs py-2 px-3 bg-slate-5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 font-sans"
                  placeholder="e.g. Inbound lead dropoffs or outdated email booking cycles..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                id="run-business-audit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 border border-indigo-700 text-white font-bold text-xs tracking-wider uppercase hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing Target Matrix...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 text-white" />
                    <span>Run Strategic Diagnosis &rarr;</span>
                  </>
                )}
              </button>
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
              <div className="mt-3 p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs text-rose-800">
                {errorText}
              </div>
            )}
          </div>

          {/* Audit History List */}
          {audits.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-slate-700">AUDIT DIRECTORY INDEX</span>
                <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase">{audits.length} Records</span>
              </div>
              <div className="max-h-[220px] overflow-y-auto divide-y divide-slate-100 bg-white">
                {audits.map((item) => {
                  const isSelected = selectedAudit?.id === item.id;
                  const avgScore = (item.scoreBreakdown.marketing + item.scoreBreakdown.presence + item.scoreBreakdown.operations + item.scoreBreakdown.retention) / 4;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedAuditId(item.id);
                        setMobileTab("report");
                      }}
                      className={`p-3 text-left cursor-pointer flex justify-between items-center transition-colors ${
                        isSelected ? "bg-indigo-50/50 border-l-4 border-indigo-600" : "hover:bg-slate-50/50"
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{item.companyName}</h4>
                        <p className="text-[10px] text-slate-500 font-mono">{new Date(item.createdAt).toLocaleDateString()} &bull; Avg Score: {avgScore.toFixed(1)}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteAudit(item.id);
                        }}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Audit report display container (7 columns) */}
        <div className={`lg:col-span-7 ${mobileTab === "report" ? "block" : "hidden lg:block"}`}>
          {selectedAudit ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <span className="px-2.5 py-1 text-[9px] font-mono font-extrabold uppercase rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    DIAGNOSTICS RECORD OUTPUT
                  </span>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900 mt-2">
                    {selectedAudit.companyName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-mono">
                    Target Domain: <a href={selectedAudit.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-850 hover:underline">{selectedAudit.website}</a>
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyReport}
                    className="px-3 py-1.5 text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-semibold flex items-center gap-1.5 transition-colors font-mono cursor-pointer"
                  >
                    {copySuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copySuccess ? "Copied" : "Copy Report"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadReport}
                    className="px-3 py-1.5 text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold flex items-center gap-1.5 transition-colors font-mono cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download TXT</span>
                  </button>
                </div>
              </div>

              {/* Score breakdown metrics graphic visualization */}
              <div>
                <h4 className="font-display text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 font-mono">
                  System Diagnostics Array Mapping
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Marketing", score: selectedAudit.scoreBreakdown.marketing },
                    { label: "Digital CRO", score: selectedAudit.scoreBreakdown.presence },
                    { label: "Operations", score: selectedAudit.scoreBreakdown.operations },
                    { label: "Retention", score: selectedAudit.scoreBreakdown.retention },
                  ].map((category) => {
                    const grade = getOverallGrading(category.score);
                    return (
                      <div key={category.label} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block font-mono uppercase tracking-wider">{category.label}</span>
                          <span className="font-display text-xl sm:text-2xl font-bold text-slate-905 mt-1 block">
                            {category.score} <span className="text-xs text-slate-400">/10</span>
                          </span>
                        </div>
                        <span className={`text-[8px] font-mono font-extrabold border rounded-md inline-block px-1.5 py-0.5 mt-3 text-center ${grade.color}`}>
                          {grade.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Growth Audit Summary sections */}
              <div className="space-y-6 pt-2">
                {/* Executive summary */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg">
                  <h4 className="font-display text-xs font-bold text-indigo-755 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Executive Strategic Standing
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-sans">{selectedAudit.executiveSummary}</p>
                </div>

                {/* Critical gaps */}
                <div className="bg-rose-50 border border-rose-100 p-5 rounded-lg">
                  <h4 className="font-display text-xs font-bold text-rose-700 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                    <ShieldAlert className="w-4 h-4 text-rose-600" /> Identified Operational Leak / System Bottleneck
                  </h4>
                  <p className="text-sm text-slate-800 leading-relaxed font-sans">{selectedAudit.criticalGap}</p>
                </div>

                {/* Recommendations (3 Action steps) */}
                <div>
                  <h4 className="font-display text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 font-mono">
                    Structured Strategy Recovery (Action Plan)
                  </h4>

                  <div className="space-y-4">
                    {selectedAudit.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                        <div className="w-7 h-7 rounded-sm bg-indigo-50 text-indigo-650 border border-indigo-100 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <h5 className="font-mono font-bold text-xs text-slate-900 mb-1 uppercase tracking-wider">{rec.title}</h5>
                          <p className="text-slate-600 text-xs leading-relaxed font-sans">{rec.actionableDetail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Growth projections & pitch angles hook */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100 font-mono">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 block pb-1">KPI RECOVERY RATIO</span>
                    <h5 className="font-bold text-sm text-emerald-950 mt-1 select-all">{selectedAudit.growthLiftEstimate}</h5>
                  </div>
                  <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-105 font-mono">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-700 block pb-1">TAILORED OUTREACH HOOK</span>
                    <h5 className="font-sans italic text-indigo-950 mt-1 text-xs select-all">"{selectedAudit.pitchHookIdea}"</h5>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 h-full flex flex-col justify-center items-center shadow-sm">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-500 border border-indigo-100">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <p className="text-sm font-sans text-slate-600 max-w-sm">
                No active session diagnostic. Enter company parameters on the left and click "Run Strategic Diagnosis" to prompt AI models and generate your core report details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
