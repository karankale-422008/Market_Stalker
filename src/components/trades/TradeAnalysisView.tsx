"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Calendar,
  Building,
  Layers,
  Sparkles,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Article, Company, TradeAnalysis } from "@/types";

interface TradeAnalysisViewProps {
  articles: Article[];
  companies: Company[];
}

export function TradeAnalysisView({ articles, companies }: TradeAnalysisViewProps) {
  const [selectedArticleId, setSelectedArticleId] = useState<string>(
    articles[0]?.id || ""
  );
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    companies[0]?.id || ""
  );

  const selectedArticle = articles.find((a) => a.id === selectedArticleId) || articles[0];
  const selectedCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0];

  const analysis = selectedArticle?.analysis;

  return (
    <div className="space-y-6">
      {/* Top Banner & Compliance Disclaimer */}
      <div className="p-4 rounded-xl bg-card/60 backdrop-blur-md border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Historical News-to-Trade Event Analysis
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Evaluate how historical news events correspond to potential trading setups.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Notice: Real broker execution & live OHLC feeds are not connected in MVP.</span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-black/30 p-4 rounded-xl border border-border/60">
        <div>
          <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1.5">
            Select News Event / Article
          </label>
          <select
            value={selectedArticleId}
            onChange={(e) => setSelectedArticleId(e.target.value)}
            className="w-full bg-card border border-border/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
          >
            {articles.map((a) => (
              <option key={a.id} value={a.id}>
                [{a.source?.name || "News"}] {a.title.slice(0, 60)}...
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1.5">
            Select Company / Ticker
          </label>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="w-full bg-card border border-border/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.symbol}) — {c.sector}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1.5">
            Analysis Mode
          </label>
          <div className="px-3 py-2 bg-card border border-border/80 rounded-lg text-xs font-mono text-emerald-400">
            Event-Driven Momentum & Sentiment
          </div>
        </div>
      </div>

      {/* Main Trade Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: News Context & AI Synthesis */}
        <div className="lg:col-span-2 space-y-6">
          {/* News Event Card */}
          <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border/70 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">
                Event Overview
              </span>
              <span className="text-xs text-muted-foreground">
                Source: {selectedArticle?.source?.name || "Indian Publisher"}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white leading-snug">
              {selectedArticle?.title}
            </h3>

            {/* AI Summary */}
            <div className="p-4 rounded-xl bg-black/40 border border-border/50 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Market Interpretation</span>
              </div>
              <p className="leading-relaxed">
                {analysis?.summary || selectedArticle?.description || "Analyzing event..."}
              </p>
            </div>

            {/* Market Impact & Reasoning */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/50 space-y-1">
                <span className="text-[10px] font-mono uppercase text-muted-foreground">
                  Potential Market Impact
                </span>
                <p className="text-slate-200">
                  {analysis?.market_impact || "Potential sector momentum depending on volume confirmation."}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/50 space-y-1">
                <span className="text-[10px] font-mono uppercase text-muted-foreground">
                  AI Rationale
                </span>
                <p className="text-slate-200">
                  {analysis?.reasoning || "Based on reported corporate fundamentals and sentiment analysis."}
                </p>
              </div>
            </div>

            {/* Read Original Source Link */}
            {selectedArticle?.original_url && (
              <div className="pt-2 flex justify-end">
                <a
                  href={selectedArticle.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verify at {selectedArticle.source?.name || "Original Source"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Hypothetical Trade Parameters & Market Data State */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border/70 space-y-5">
            <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center justify-between">
              <span>Hypothetical Setup</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                AI Model
              </span>
            </h4>

            {/* Market Data Status Alert */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-border/80 space-y-1 text-xs">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                Live Price Feed
              </span>
              <span className="text-amber-400 font-mono font-medium block">
                Market data not connected for this analysis.
              </span>
              <p className="text-[11px] text-muted-foreground mt-1">
                Real OHLC & tick-level execution will be linked via NSE/BSE API in the next release.
              </p>
            </div>

            {/* Hypothetical Framework Metrics */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-border/50">
                <span className="text-muted-foreground">Hypothetical Trigger:</span>
                <span className="text-white font-semibold">
                  {analysis?.sentiment === "Bullish" ? "Breakout > Prev Day High" : "Breakdown < Support"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-border/50">
                <span className="text-muted-foreground">Hypothetical Risk/Reward:</span>
                <span className="text-emerald-400 font-semibold">1 : 2.5 (Indicative)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-border/50">
                <span className="text-muted-foreground">Sentiment Bias:</span>
                <span className={`font-semibold ${analysis?.sentiment === "Bullish" ? "text-emerald-400" : analysis?.sentiment === "Bearish" ? "text-rose-400" : "text-slate-300"}`}>
                  {analysis?.sentiment || "Neutral"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-border/50">
                <span className="text-muted-foreground">Impact Horizon:</span>
                <span className="text-slate-200">1 - 3 Trading Sessions</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-secondary/40 border border-border/50 text-[11px] text-muted-foreground leading-relaxed">
              <strong>Risk Disclaimer:</strong> Market Stalker provides AI news intelligence for educational and informational purposes. It does not provide financial advice or execute trades.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
