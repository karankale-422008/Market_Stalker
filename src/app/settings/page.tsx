import React from "react";
import { Sliders, ShieldCheck, Key, Database, Cpu, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Settings & System Diagnostics — Market Stalker",
  description: "Configure AI models, Supabase credentials, and view system health.",
};

export default function SettingsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = Boolean(supabaseUrl && !supabaseUrl.includes("placeholder"));

  const aiProvider = process.env.AI_PROVIDER || "gemini";
  const aiKey = process.env.AI_API_KEY;
  const isAiConfigured = Boolean(aiKey && !aiKey.includes("placeholder"));

  const isCronConfigured = Boolean(process.env.CRON_SECRET);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Settings Header */}
      <div className="p-6 md:p-8 rounded-2xl bg-card/60 backdrop-blur-md border border-border/70 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-emerald-400" />
            <span>Platform Configuration & Diagnostics</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Environment variables, database status, and AI model parameters.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <ShieldCheck className="w-4 h-4" />
          <span>Secured with .env.local</span>
        </div>
      </div>

      {/* Diagnostics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Supabase Status */}
        <div className="p-5 rounded-xl bg-card/60 border border-border/70 space-y-3">
          <div className="flex items-center justify-between">
            <Database className="w-5 h-5 text-blue-400" />
            {isSupabaseConfigured ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> Configured
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
                <AlertCircle className="w-3.5 h-3.5" /> Pending in .env.local
              </span>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Supabase PostgreSQL</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {isSupabaseConfigured ? "Connected to Supabase project instance" : "Requires NEXT_PUBLIC_SUPABASE_URL"}
            </p>
          </div>
        </div>

        {/* AI Engine Status */}
        <div className="p-5 rounded-xl bg-card/60 border border-border/70 space-y-3">
          <div className="flex items-center justify-between">
            <Cpu className="w-5 h-5 text-emerald-400" />
            {isAiConfigured ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
                <AlertCircle className="w-3.5 h-3.5" /> Heuristic Fallback
              </span>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">AI Engine ({aiProvider})</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {isAiConfigured ? `Active Model: ${process.env.AI_MODEL || "gemini-2.0-flash"}` : "Running deterministic financial heuristics"}
            </p>
          </div>
        </div>

        {/* Cron Status */}
        <div className="p-5 rounded-xl bg-card/60 border border-border/70 space-y-3">
          <div className="flex items-center justify-between">
            <Key className="w-5 h-5 text-purple-400" />
            {isCronConfigured ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> Protected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                Optional
              </span>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Automated Ingestion Cron</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Endpoint: <code className="text-[10px] text-slate-300">/api/cron/ingest</code>
            </p>
          </div>
        </div>
      </div>

      {/* Setup Guide */}
      <div className="p-6 rounded-2xl bg-card/60 border border-border/70 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
          How to configure your environment:
        </h3>
        <div className="p-4 rounded-xl bg-black/40 border border-border/50 text-xs font-mono text-slate-300 space-y-2 leading-relaxed">
          <p className="text-emerald-400 font-bold"># Step 1: Open .env.local and configure your credentials</p>
          <p>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</p>
          <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...</p>
          <p>SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi... (for background ingestion)</p>
          <p>AI_PROVIDER=gemini</p>
          <p>AI_API_KEY=AIzaSy...</p>
          <p>AI_MODEL=gemini-2.0-flash</p>
          <p>CRON_SECRET=your_secret_bearer_token</p>
        </div>

        <p className="text-xs text-muted-foreground">
          After saving <code className="text-emerald-400">.env.local</code>, restart the development server or deploy environment variables to Vercel.
        </p>
      </div>
    </div>
  );
}
