import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Target, TrendingUp, Sparkles, Award, ClipboardCheck, 
  Cpu, Briefcase, User, Globe, MessageSquare, Check, HelpCircle, Landmark 
} from "lucide-react";
import { UserBusinessProfile } from "../types";

interface LandingPageProps {
  onNavigate: (view: "leads" | "audit") => void;
  stats: {
    leadsCount: number;
    pitchesCount: number;
    auditsCount: number;
  };
  onOpenSettings?: () => void;
  userProfile: UserBusinessProfile;
  onUpdateProfile: (profile: UserBusinessProfile) => void;
  onboardingStep?: number;
  setOnboardingStep?: (step: number) => void;
  platformStats?: {
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
  };
}

export default function LandingPage({ 
  onNavigate, 
  stats, 
  onOpenSettings, 
  userProfile, 
  onUpdateProfile,
  onboardingStep = 1,
  setOnboardingStep,
  platformStats
}: LandingPageProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form local state (initialized with props)
  const [formState, setFormState] = useState<UserBusinessProfile>({ ...userProfile });

  const handleUpdateField = (key: keyof UserBusinessProfile, value: string) => {
    const updated = { ...formState, [key]: value };
    setFormState(updated);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formState);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col justify-between overflow-hidden text-slate-700 antialiased">
      {/* Premium organic subtle gradient glow effects */}
      <div className="absolute top-0 inset-x-0 h-[450px] bg-gradient-to-b from-indigo-50/70 via-indigo-50/10 to-transparent -z-10" />
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-blue-100/45 blur-3xl -z-10 animate-pulse" />
      <div className="absolute top-40 right-10 w-80 h-80 rounded-full bg-indigo-100/40 blur-3xl -z-10" />

      {/* Header / Top Navigation Bar */}
      <nav id="landing-navbar" className="h-16 border-b border-slate-200/80 flex items-center justify-between px-6 sm:px-8 bg-white/75 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shadow-indigo-600/30">
            L
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 font-sans">
            LEADSPHERE <span className="text-indigo-600 font-semibold">B2B OS</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center bg-slate-100 rounded-full px-3.5 py-1.5 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2.5">Grounding Engine</span>
            <div className="w-px h-3 bg-slate-200 mr-2.5"></div>
            <span className="text-[10px] text-indigo-600 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              Live Search-Grounding Active
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono font-medium">Auto-Resilient</span>
          </div>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-indigo-600 transition-all text-xs font-medium cursor-pointer"
              title="Configure Active LLM Providers"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              <span>AI Setup</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main Hero & Navigation Options */}
      <main className="max-w-6xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6 font-mono"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AUTHENTIC LIVE-SEARCH GROUNDED PROFILES</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.12]"
          >
            Find real-world prospects. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-600">
              Draft organic custom pitches.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
          >
            Welcome to your premium, high-impact consulting workspace. Connect directly with actual registered local & national companies utilizing live Google Search Grounding. No simulated lists here.
          </motion.p>
        </div>

        {/* INTERACTIVE ONBOARDING STEPPER BANNER */}
        <div className="max-w-4xl mx-auto w-full mb-8 bg-gradient-to-r from-indigo-50 via-slate-50 to-indigo-50/30 border border-slate-200/95 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white font-mono">
                  {onboardingStep}
                </span>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Workspace Sequence Walkthrough</span>
              </div>
              <h3 className="text-sm text-slate-500 mt-1 font-normal">
                Follow these consecutive milestones to establish your outreach system.
              </h3>
            </div>
            
            <button 
              onClick={() => {
                if (setOnboardingStep) {
                  setOnboardingStep(1);
                  localStorage.setItem("onboarding_step", "1");
                }
              }}
              className="text-[10px] font-mono font-bold text-indigo-600 hover:text-indigo-800 underline uppercase tracking-wider self-start sm:self-center cursor-pointer"
            >
              Reset Roadmap Progress
            </button>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Step 1 */}
            <div 
              onClick={() => setOnboardingStep?.(1)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                onboardingStep === 1 
                  ? "bg-white border-indigo-600 shadow-xs animate-pulse-custom" 
                  : onboardingStep > 1 
                    ? "bg-white/80 border-slate-200 opacity-80" 
                    : "bg-slate-50/50 border-slate-200/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                  onboardingStep > 1 ? "bg-emerald-500 text-white font-bold" : "bg-indigo-50 text-indigo-600 font-bold"
                }`}>
                  {onboardingStep > 1 ? "✓" : "1"}
                </div>
                <span className="text-[11px] font-bold text-slate-800">Your profile</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Configure services you provide to customize outbound cold-pitches.</p>
              {onboardingStep === 1 && (
                <div className="text-[10px] font-bold text-indigo-600 mt-1.5 flex items-center gap-1">
                  Active Focus <span className="animate-ping w-1 h-1 bg-indigo-600 rounded-full" />
                </div>
              )}
            </div>

            {/* Step 2 */}
            <div 
              onClick={() => {
                setOnboardingStep?.(2);
                onNavigate("leads");
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                onboardingStep === 2 
                  ? "bg-white border-indigo-600 shadow-xs" 
                  : onboardingStep > 2 
                    ? "bg-white/80 border-slate-200 opacity-80" 
                    : "bg-slate-50/50 border-slate-200/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                  onboardingStep > 2 ? "bg-emerald-500 text-white font-bold" : "bg-indigo-50 text-indigo-600 font-bold"
                }`}>
                  {onboardingStep > 2 ? "✓" : "2"}
                </div>
                <span className="text-[11px] font-bold text-slate-800 font-sans">Locate Leads</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Scan real companies and pick candidates to contact.</p>
              {onboardingStep === 2 && (
                <div className="text-[10px] font-bold text-indigo-600 mt-1.5 flex items-center gap-1">
                  Active Focus <span className="animate-ping w-1 h-1 bg-indigo-600 rounded-full" />
                </div>
              )}
            </div>

            {/* Step 3 */}
            <div 
              onClick={() => {
                setOnboardingStep?.(3);
                onNavigate("audit");
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                onboardingStep === 3 
                  ? "bg-white border-indigo-600 shadow-xs" 
                  : onboardingStep > 3 
                    ? "bg-white/80 border-slate-200 opacity-80" 
                    : "bg-slate-50/50 border-slate-200/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                  onboardingStep > 3 ? "bg-emerald-500 text-white font-bold" : "bg-indigo-50 text-indigo-600 font-bold"
                }`}>
                  {onboardingStep > 3 ? "✓" : "3"}
                </div>
                <span className="text-[11px] font-bold text-slate-800">Audit Diagnosis</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Rate digital presence and spot core operational gaps.</p>
              {onboardingStep === 3 && (
                <div className="text-[10px] font-bold text-indigo-600 mt-1.5 flex items-center gap-1">
                  Active Focus <span className="animate-ping w-1 h-1 bg-indigo-600 rounded-full" />
                </div>
              )}
            </div>

            {/* Step 4 */}
            <div 
              onClick={() => {
                setOnboardingStep?.(4);
                onNavigate("leads");
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                onboardingStep === 4 
                  ? "bg-white border-indigo-600 shadow-xs" 
                  : "bg-slate-50/50 border-slate-200/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center bg-indigo-50 text-[10px] font-mono text-indigo-600 font-bold">
                  4
                </div>
                <span className="text-[11px] font-bold text-slate-800">Build Pitch</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Draft zero-cliché custom cold pitches using AI.</p>
              {onboardingStep === 4 && (
                <div className="text-[10px] font-bold text-indigo-600 mt-1.5 flex items-center gap-1">
                  Active Focus <span className="animate-ping w-1 h-1 bg-indigo-600 rounded-full" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Real results info Callout */}
        <div className="max-w-4xl mx-auto w-full mb-10">
          <div className="bg-indigo-50/60 border border-indigo-100/80 rounded-2xl p-4 flex gap-3 text-slate-600">
            <Award className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-slate-900">Are these results actual or simulated? </span>
              LeadSphere handles your searches through <span className="font-semibold text-slate-900">live Google Search integration</span> (when using Gemini models). It crawls live local profiles and extracts real business URLs, active contacts, and genuine operational needs. If you operate without API keys or on system fallbacks, our local smart heuristic crawler generates high-probability mock companies configured perfectly inside your requested location city for testing.
            </div>
          </div>
        </div>

        {/* PERSISTENT USER PROFILE EDITOR SECTION */}
        <div className="max-w-4xl mx-auto w-full mb-10">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
            <div 
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-5 py-4 border-b border-slate-100 bg-slate-50/45 flex items-center justify-between cursor-pointer hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Briefcase className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Your Business / Agency Profile</h4>
                  <p className="text-[11px] text-slate-500">Details defined here are automatically injected to personalize generated pitches & proposals.</p>
                </div>
              </div>
              <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer">
                {isEditingProfile ? "Collapse Section" : "Expand Profile Settings"}
              </button>
            </div>

            <AnimatePresence initial={false}>
              {(!isEditingProfile) ? (
                <div className="p-5 text-xs grid grid-cols-1 md:grid-cols-3 gap-6 bg-white">
                  <div>
                    <span className="text-slate-400 block mb-1">Company / Team Name</span>
                    <strong className="text-slate-900 font-semibold">{userProfile.companyName || "N/A"}</strong>
                    <div className="mt-2 text-slate-400 block">Website</div>
                    <span className="text-slate-700 font-mono block truncate">{userProfile.website || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Your Specialized Services</span>
                    <p className="text-slate-800 line-clamp-3 font-normal leading-relaxed">
                      {userProfile.services || "N/A"}
                    </p>
                  </div>
                  <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Active Contact</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600 font-bold">
                        {userProfile.contactName ? userProfile.contactName[0] : "U"}
                      </div>
                      <div>
                        <span className="text-slate-900 font-semibold block leading-none">{userProfile.contactName || "User"}</span>
                        <span className="text-[10px] text-slate-500 leading-none capitalize mt-1 block">{userProfile.tone || "expert"} Tone</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-t border-slate-100 bg-white"
                >
                  <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">Agency / Company Name</label>
                        <input 
                          type="text"
                          required
                          value={formState.companyName}
                          onChange={(e) => handleUpdateField("companyName", e.target.value)}
                          placeholder="e.g. Apex Media Partners"
                          className="w-full text-xs px-3 py-2 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">Representative / Founder Name</label>
                        <input 
                          type="text"
                          required
                          value={formState.contactName}
                          onChange={(e) => handleUpdateField("contactName", e.target.value)}
                          placeholder="e.g. Sarah Connor"
                          className="w-full text-xs px-3 py-2 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">Your Website URL</label>
                        <input 
                          type="url"
                          required
                          value={formState.website}
                          onChange={(e) => handleUpdateField("website", e.target.value)}
                          placeholder="e.g. https://apexpartners.test"
                          className="w-full text-xs px-3 py-2 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">Communication Tone preference</label>
                        <select
                          value={formState.tone}
                          onChange={(e) => handleUpdateField("tone", e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg outline-none transition-colors"
                        >
                          <option value="direct, sharp, human">Direct, Sharp & Human (recommended)</option>
                          <option value="warm, casual, friendly">Warm, Casual & Friendly</option>
                          <option value="strictly formal, executive">Strictly Formal & Executive</option>
                          <option value="highly consultative, diagnostic">Highly Consultative & Diagnostic</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">What Services Do You Offer Prospected Clients?</label>
                      <input 
                        type="text"
                        required
                        value={formState.services}
                        onChange={(e) => handleUpdateField("services", e.target.value)}
                        placeholder="e.g. AI voice integrations, Google Map Optimization, high-speed landing page design"
                        className="w-full text-xs px-3 py-2 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg outline-none transition-colors"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Specify services separated by commas to align with proposal action steps perfectly.</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">Brief Team / Company Bio</label>
                      <textarea
                        rows={2}
                        value={formState.bio}
                        onChange={(e) => handleUpdateField("bio", e.target.value)}
                        placeholder="e.g. We are a boutique engineering hub focused on automating booking operations for local service clinics."
                        className="w-full text-xs px-3 py-2 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg outline-none transition-colors resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                      <button 
                        type="button"
                        onClick={() => {
                          setFormState({ ...userProfile });
                          setIsEditingProfile(false);
                        }}
                        className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer"
                      >
                        Reset Changes
                      </button>
                      <button 
                        type="submit"
                        className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        {saveSuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved Profile!</span>
                          </>
                        ) : (
                          <span>Apply & Save Profile</span>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Feature Split Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full mb-12">
          {/* Card 1: Lead Opportunity System */}
          <motion.div
            whileHover={{ y: -4, borderColor: "rgba(79, 70, 229, 0.45)" }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => onNavigate("leads")}
            id="leads-module-btn"
            className="group relative cursor-pointer bg-white p-8 rounded-2xl border border-slate-200/90 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-t-2xl" />
            
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                High-Intent Lead Finder
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                Locate bona-fide, real-world businesses with live contact information, custom websites, verifiable phone numbers, and WhatsApp coordinates. Build personalized zero-fluff outreach copy tailored to their actual paintpoints.
              </p>

              <div className="space-y-2 mb-8 border-t border-slate-50 pt-5">
                <div className="flex items-center gap-2.5 text-xs text-slate-500">
                  <ClipboardCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Real business emails & WhatsApp contact parameters</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-500">
                  <ClipboardCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Interactive follow-up tracking board & system</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-500">
                  <ClipboardCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Zero-cliché human-looking pitch scripts</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors">
                Configure Outreach
              </span>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                Launch Lead Finder <span>&rarr;</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Deep Growth Audit */}
          <motion.div
            whileHover={{ y: -4, borderColor: "rgba(79, 70, 229, 0.45)" }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => onNavigate("audit")}
            id="audit-module-btn"
            className="group relative cursor-pointer bg-white p-8 rounded-2xl border border-slate-200/90 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-t-2xl" />
            
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50/75 flex items-center justify-center text-teal-600 mb-6 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Strategic Growth Audit
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                Conduct instantaneous organic health and strategy diagnostics for target prospects. Rate digital presence, operational bottlenecks, review fatigue, and retention parameters to compile beautiful growth-lift audits.
              </p>

              <div className="space-y-2 mb-8 border-t border-slate-50 pt-5">
                <div className="flex items-center gap-2.5 text-xs text-slate-500">
                  <ClipboardCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Interactive 1-10 slider scorecard compiler</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-500">
                  <ClipboardCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Immediate diagnostic executive summaries</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-500">
                  <ClipboardCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Downloadable strategic reports (TXT support)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 group-hover:text-teal-600 transition-colors">
                Run Diagnostics Register
              </span>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
                Start Audit Suite <span>&rarr;</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Database Quick Summary Widget & Platform Hits Counter */}
        <div id="analytics-summary-box" className="max-w-4xl mx-auto w-full space-y-4">
          {platformStats && (
            <div className="bg-indigo-50 border border-indigo-100 py-5 px-6 rounded-2xl flex flex-col space-y-4 shadow-xs">
              {/* Traffic / Hits Counter Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pb-3 border-b border-indigo-100/60">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Globe className="w-4 h-4 animate-spin-slow text-indigo-700" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      Live Traffic & Hit Counter
                      <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                    </h5>
                    <p className="text-[11.5px] text-slate-500 mt-0.5 leading-relaxed">
                      Tracking all page views on this site. Below showing results from **other visitors** (<span className="font-semibold text-indigo-700">excluding your own visits</span>).
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 bg-white/70 border border-indigo-100 md:px-4 py-2 px-3 rounded-xl flex items-center gap-1.5 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-505 animate-pulse" />
                  <span className="text-[11px] font-bold text-slate-700 font-sans">
                    Other Users' Site Traffic: <span className="font-mono text-indigo-700 text-sm font-black">{platformStats.otherUsersWebpageVisits}</span> hits
                  </span>
                </div>
              </div>

              {/* Sub Operations Analytics Stats Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                <span className="text-[11px] text-indigo-850 font-medium">
                  Additional B2B actions logged by other consultants:
                </span>
                
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 sm:pt-0">
                  <div className="text-left">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Other Finder Queries</span>
                    <span className="font-mono text-indigo-750 font-bold text-base">
                      {platformStats.otherUsersLeadsQueries}
                    </span>
                  </div>
                  <div className="w-px h-5 bg-slate-200" />
                  <div className="text-left">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Other Diagnostic Audits</span>
                    <span className="font-mono text-teal-700 font-bold text-base">
                      {platformStats.otherUsersAuditsQueries}
                    </span>
                  </div>
                  <div className="w-px h-5 bg-slate-200" />
                  <div className="text-left">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Your Page Loads</span>
                    <span className="font-mono text-slate-600 font-bold text-base">
                      {platformStats.myWebpageVisits}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 py-4 px-6 rounded-2xl shadow-sm flex flex-wrap items-center justify-around gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-900 font-bold text-lg">{stats.leadsCount}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Stored Leads</span>
            </div>
            <div className="w-px h-6 bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-900 font-bold text-lg">{stats.pitchesCount}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Pitches Formulated</span>
            </div>
            <div className="w-px h-6 bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-900 font-bold text-lg">{stats.auditsCount}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Proposals Generated</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Bottom Control Bar with Architectural Honesty */}
      <footer className="h-14 border-t border-slate-200 bg-white px-8 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <div className="flex gap-4 font-mono text-[10px] text-slate-400">
          <span>&copy; {new Date().getFullYear()} LeadSphere B2B Intelligent Operating System</span>
        </div>
        <div className="hidden sm:flex gap-6 font-mono text-[10px] text-slate-400">
          <span>SECURE SECRETS SANDBOXED</span>
        </div>
      </footer>
    </div>
  );
}
