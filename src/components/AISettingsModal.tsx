import { motion, AnimatePresence } from "motion/react";
import { X, Key, Cpu, HelpCircle, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: string;
  setProvider: (p: string) => void;
  customOpenRouterKey: string;
  setCustomOpenRouterKey: (k: string) => void;
  customHuggingFaceKey: string;
  setCustomHuggingFaceKey: (k: string) => void;
  customGroqKey: string;
  setCustomGroqKey: (k: string) => void;
}

export default function AISettingsModal({
  isOpen,
  onClose,
  provider,
  setProvider,
  customOpenRouterKey,
  setCustomOpenRouterKey,
  customHuggingFaceKey,
  setCustomHuggingFaceKey,
  customGroqKey,
  setCustomGroqKey,
}: AISettingsModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col text-slate-200"
        >
          {/* Top colored aesthetic bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-sky-400" />
              <h3 className="font-display text-lg font-bold text-white tracking-tight">
                AI Engine & Resilience Settings
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 px-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
            {/* Context/Overview */}
            <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-800/40 text-xs text-sky-300 leading-relaxed">
              <div className="flex gap-2 font-semibold mb-1 text-sky-200">
                <ShieldCheck className="w-4 h-4 shrink-0 text-sky-400" />
                <span>Enterprise Multi-Engine Integrity</span>
              </div>
              Select your active LLM provider or enable automatic cascade failover. If Google Gemini primary queries hit limit quotas, the system instantly executes resilient routing checkpoints to OpenRouter and Hugging Face.
            </div>

            {/* Provider Select Radio */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Active B2B Intelligence Provider
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {/* Option 1: Auto Cascade */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  provider === "auto"
                    ? "bg-sky-950/40 border-sky-500 text-white"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}>
                  <input
                    type="radio"
                    name="ai_provider"
                    value="auto"
                    checked={provider === "auto"}
                    onChange={(e) => setProvider(e.target.value)}
                    className="mt-1 accent-sky-500"
                  />
                  <div className="flex-1 text-left">
                    <span className="text-sm font-bold block flex items-center gap-1.5">
                      Auto Resilience Cascade
                      <span className="px-1.5 py-0.5 text-[9px] bg-sky-500/20 text-sky-300 rounded font-mono font-bold uppercase tracking-wider">
                        Recommended
                      </span>
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Gemini 3.5 ➔ OpenRouter ➔ Hugging Face free fallback sequence.
                    </span>
                  </div>
                </label>

                {/* Option 2: Gemini */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  provider === "gemini"
                    ? "bg-slate-850/60 border-sky-500 text-white"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}>
                  <input
                    type="radio"
                    name="ai_provider"
                    value="gemini"
                    checked={provider === "gemini"}
                    onChange={(e) => setProvider(e.target.value)}
                    className="mt-1 accent-sky-500"
                  />
                  <div className="flex-1 text-left">
                    <span className="text-sm font-bold block">Google Gemini 3.5 Flash Only</span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Primary web grounding (Google Search live lookups).
                    </span>
                  </div>
                </label>

                {/* Option 3: Groq Cloud */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  provider === "groq"
                    ? "bg-slate-850/60 border-orange-500 text-white"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}>
                  <input
                    type="radio"
                    name="ai_provider"
                    value="groq"
                    checked={provider === "groq"}
                    onChange={(e) => setProvider(e.target.value)}
                    className="mt-1 accent-orange-500"
                  />
                  <div className="flex-1 text-left">
                    <span className="text-sm font-bold block flex items-center gap-1.5 animate-pulse">
                      Groq Cloud (Llama 3.3)
                      <span className="px-1.5 py-0.5 text-[9px] bg-orange-500/20 text-orange-400 rounded font-mono font-bold uppercase tracking-wider">
                        Super Fast
                      </span>
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Exceptional speed using Llama 3.3 70B & Mixtral models.
                    </span>
                  </div>
                </label>

                {/* Option 3: OpenRouter */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  provider === "openrouter"
                    ? "bg-slate-850/60 border-purple-500 text-white"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}>
                  <input
                    type="radio"
                    name="ai_provider"
                    value="openrouter"
                    checked={provider === "openrouter"}
                    onChange={(e) => setProvider(e.target.value)}
                    className="mt-1 accent-purple-500"
                  />
                  <div className="flex-1 text-left">
                    <span className="text-sm font-bold block">OpenRouter Connection</span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Utilizes OpenRouter's high-speed independent LLM models.
                    </span>
                  </div>
                </label>

                {/* Option 4: Hugging Face */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  provider === "huggingface"
                    ? "bg-slate-850/60 border-pink-500 text-white"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}>
                  <input
                    type="radio"
                    name="ai_provider"
                    value="huggingface"
                    checked={provider === "huggingface"}
                    onChange={(e) => setProvider(e.target.value)}
                    className="mt-1 accent-pink-500"
                  />
                  <div className="flex-1 text-left">
                    <span className="text-sm font-bold block">Hugging Face Inference API</span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Utilizes state-of-the-art open Qwen 2.5-72B deep model arrays.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Custom Credentials Block */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Custom API Keys & Tokens (Optional)
              </label>

              {/* OpenRouter Key */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-purple-400" />
                    OpenRouter API Key
                  </span>
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-sky-400 hover:underline"
                  >
                    Get Key
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="sk-or-v1-..."
                  value={customOpenRouterKey}
                  onChange={(e) => setCustomOpenRouterKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-purple-500 text-slate-200"
                />
                <span className="text-[10px] text-slate-500 block">
                  Takes precedence over system standard variables if supplied.
                </span>
              </div>

              {/* Hugging Face Key */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-pink-400" />
                    Hugging Face Token
                  </span>
                  <a
                    href="https://huggingface.co/settings/tokens"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-sky-400 hover:underline"
                  >
                    Get Token
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="hf_..."
                  value={customHuggingFaceKey}
                  onChange={(e) => setCustomHuggingFaceKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-pink-500 text-slate-200"
                />
                <span className="text-[10px] text-slate-500 block">
                  Enables connection to Hugging Face serverless client arrays.
                </span>
              </div>

              {/* Groq Cloud Key */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-orange-400" />
                    Groq Cloud API Key
                  </span>
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-sky-400 hover:underline"
                  >
                    Get Key
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="gsk_..."
                  value={customGroqKey}
                  onChange={(e) => setCustomGroqKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-orange-500 text-slate-200"
                />
                <span className="text-[10px] text-slate-500 block">
                  Enables lightning-fast Llama-3 generation. Takes precedence if supplied.
                </span>
              </div>
            </div>

            {/* Recommended Free Fallback API Keys Section */}
            <div className="pt-4.5 border-t border-slate-800 space-y-3.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Recommended Free Fallback Keys
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Need to bypass active quotas or test with custom, high-speed credentials for free? Here are excellent free options:
              </p>

              <div className="space-y-2">
                {/* Google AI Studio */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/60 flex justify-between items-center text-xs">
                  <div>
                    <strong className="text-slate-100 block font-sans">1. Google AI Studio (Gemini 2.5 Flash)</strong>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Free 15 RPM. Excellent search grounding.</span>
                  </div>
                  <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-[11px] font-semibold text-sky-400 hover:underline shrink-0">Get Key ↗</a>
                </div>

                {/* Groq Console */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/60 flex justify-between items-center text-xs">
                  <div>
                    <strong className="text-slate-100 block font-sans">2. Groq Developer Console (Llama 3)</strong>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Ultralight latency. Generous daily free tier.</span>
                  </div>
                  <a href="https://console.groq.com/" target="_blank" rel="noreferrer" className="text-[11px] font-semibold text-sky-400 hover:underline shrink-0">Get Key ↗</a>
                </div>

                {/* Cohere Dashboard */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/60 flex justify-between items-center text-xs">
                  <div>
                    <strong className="text-slate-100 block font-sans">3. Cohere Trial Dashboard (Command R)</strong>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Generous free developer keys for trial uses.</span>
                  </div>
                  <a href="https://dashboard.cohere.com/" target="_blank" rel="noreferrer" className="text-[11px] font-semibold text-sky-400 hover:underline shrink-0">Get Key ↗</a>
                </div>

                {/* Mistral Console */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/60 flex justify-between items-center text-xs">
                  <div>
                    <strong className="text-slate-100 block font-sans">4. Mistral Console (Mistral Nemo)</strong>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Robust open weights models. Free trial credits.</span>
                  </div>
                  <a href="https://console.mistral.ai/" target="_blank" rel="noreferrer" className="text-[11px] font-semibold text-sky-400 hover:underline shrink-0">Get Key ↗</a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono">
              Auto-saved locally
            </span>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold bg-sky-500 text-slate-950 rounded-lg hover:bg-sky-400 active:scale-95 transition-all shadow-md"
            >
              Apply Configurations
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
