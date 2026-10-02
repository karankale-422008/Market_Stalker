import React from "react";
import { Activity, RefreshCw, CheckCircle2, AlertTriangle, Radio, ShieldCheck, Database } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatRelativeTime, formatDate } from "@/lib/utils";
import { IngestionLog, Source } from "@/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ingestion & Audit Monitoring — Market Stalker",
  description: "Real-time developer monitoring for news feed adapters, deduplication, and AI pipeline status.",
};

export default async function AdminMonitoringPage() {
  const supabase = createAdminClient();

  const [{ data: sources }, { data: rawLogs }] = await Promise.all([
    supabase.from("sources").select("*").order("name", { ascending: true }),
    supabase
      .from("ingestion_logs")
      .select(`
        *,
        source:sources(name, slug, logo_url)
      `)
      .order("started_at", { ascending: false })
      .limit(25),
  ]);

  const logs: IngestionLog[] = (rawLogs as any) || [];
  const sourceList: Source[] = (sources as any) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-card/60 backdrop-blur-md border border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Ingestion Pipeline & Source Health Monitor
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Track real-time RSS feed parsing, URL deduplication metrics, and AI analysis throughput.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <form action="/api/ingest" method="POST">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Trigger Pipeline Now</span>
            </button>
          </form>
        </div>
      </div>

      {/* 10 Sources Status Matrix */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400" />
          <span>Source Health & Ingestion Matrix (10 Feeds)</span>
        </h2>

        <div className="bg-card/60 backdrop-blur-md border border-border/70 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/40 border-b border-border/60 text-muted-foreground font-mono uppercase text-[11px]">
                <tr>
                  <th className="p-4 font-semibold">Publisher</th>
                  <th className="p-4 font-semibold">Feed URL / Ingestion Type</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Last Fetch</th>
                  <th className="p-4 font-semibold">Error Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                {sourceList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      Sources table not yet populated. Apply migrations and seed script.
                    </td>
                  </tr>
                ) : (
                  sourceList.map((src) => (
                    <tr key={src.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-sans font-medium text-white flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-black/50 border border-border/70 flex items-center justify-center overflow-hidden">
                          {src.logo_url ? (
                            <img src={src.logo_url} alt="" className="w-4 h-4 object-contain" />
                          ) : (
                            <Radio className="w-3 h-3 text-emerald-400" />
                          )}
                        </div>
                        <span>{src.name}</span>
                      </td>

                      <td className="p-4 text-slate-300">
                        <span className="truncate max-w-xs block" title={src.feed_url || ""}>
                          {src.feed_url ? src.feed_url.slice(0, 45) + "..." : "REST API"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">Type: {src.source_type}</span>
                      </td>

                      <td className="p-4">
                        {src.status === "active" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                            <CheckCircle2 className="w-3 h-3" />
                            Healthy
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px]">
                            <AlertTriangle className="w-3 h-3" />
                            {src.status}
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-slate-300">
                        {src.last_successful_fetch ? formatRelativeTime(src.last_successful_fetch) : "Never"}
                      </td>

                      <td className="p-4 text-rose-400 text-[11px] truncate max-w-xs" title={src.last_error || "None"}>
                        {src.last_error || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Ingestion Logs Table */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Recent Pipeline Execution Audit Logs</span>
        </h2>

        <div className="bg-card/60 backdrop-blur-md border border-border/70 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/40 border-b border-border/60 text-muted-foreground uppercase text-[11px]">
                <tr>
                  <th className="p-4 font-semibold">Timestamp</th>
                  <th className="p-4 font-semibold">Publisher</th>
                  <th className="p-4 font-semibold">Articles Found</th>
                  <th className="p-4 font-semibold">New Added</th>
                  <th className="p-4 font-semibold">Duplicates Skipped</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No ingestion runs logged yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-slate-300">{formatDate(log.started_at)}</td>
                      <td className="p-4 text-white font-sans font-medium">{log.source?.name || "System"}</td>
                      <td className="p-4 text-slate-300">{log.articles_found}</td>
                      <td className="p-4 text-emerald-400 font-bold">+{log.articles_added}</td>
                      <td className="p-4 text-muted-foreground">{log.duplicates}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] border ${
                            log.status === "success"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : log.status === "partial_error"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
