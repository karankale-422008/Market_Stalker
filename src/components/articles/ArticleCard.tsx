"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Sparkles, TrendingUp, TrendingDown, Minus, ShieldCheck, Building2 } from "lucide-react";
import { Article } from "@/types";
import { formatRelativeTime, getSentimentBadgeClass, getImportanceBadgeClass, cn } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const analysis = article.analysis;
  const sentimentStyle = getSentimentBadgeClass(analysis?.sentiment);
  const importanceStyle = getImportanceBadgeClass(analysis?.importance_score || 50);

  return (
    <div className="bg-card/60 backdrop-blur-md border border-border/70 rounded-xl p-5 hover:border-border transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-md">
      <div>
        {/* Card Header: Source, Time & Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 font-mono tracking-wide uppercase">
              {article.source?.name || "Publisher"}
            </span>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(article.published_at)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Sentiment Badge */}
            {analysis?.sentiment && (
              <span
                className={cn(
                  "text-[11px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 font-mono",
                  sentimentStyle.bg,
                  sentimentStyle.text,
                  sentimentStyle.border
                )}
              >
                {analysis.sentiment === "Bullish" && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                {analysis.sentiment === "Bearish" && <TrendingDown className="w-3 h-3 text-rose-400" />}
                {analysis.sentiment === "Neutral" && <Minus className="w-3 h-3 text-slate-400" />}
                {analysis.sentiment}
              </span>
            )}

            {/* Importance Badge */}
            {analysis?.importance_score !== undefined && (
              <span
                className={cn(
                  "text-[11px] font-medium px-2 py-0.5 rounded-full border font-mono",
                  importanceStyle.bg
                )}
              >
                Score: {analysis.importance_score}
              </span>
            )}
          </div>
        </div>

        {/* Headline */}
        <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors leading-snug">
          <Link href={`/articles/${article.id}`}>
            {article.title}
          </Link>
        </h3>

        {/* AI Summary Box */}
        <div className="mt-3 p-3 rounded-lg bg-black/30 border border-border/50 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
            <Sparkles className="w-3 h-3" />
            <span>AI Market Synthesis</span>
          </div>
          <p className="leading-relaxed line-clamp-3">
            {analysis?.summary || article.description || "Synthesizing market implications..."}
          </p>
        </div>

        {/* Tags: Companies & Sectors */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {analysis?.companies && analysis.companies.length > 0 && analysis.companies[0] !== "Broader Market / Index" && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-secondary text-slate-200 border border-border/50 font-mono">
              <Building2 className="w-3 h-3 text-muted-foreground" />
              {analysis.companies[0]}
            </span>
          )}

          {analysis?.sectors && analysis.sectors.map((s, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground font-mono"
            >
              {s}
            </span>
          ))}

          {analysis?.event_type && (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-500/20 font-mono">
              {analysis.event_type}
            </span>
          )}
        </div>
      </div>

      {/* Card Actions: View Analysis & Read Original Source */}
      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between gap-3">
        <Link
          href={`/articles/${article.id}`}
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          <span>View Full Intelligence</span>
          <span>→</span>
        </Link>

        {/* Compliance-First Direct Attribution Link */}
        <a
          href={article.original_url}
          target="_blank"
          rel="noopener noreferrer"
          title="Open original article on publisher's site"
          className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-secondary text-slate-300 hover:text-white border border-border/60 transition-colors"
        >
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>READ ORIGINAL SOURCE</span>
          <ExternalLink className="w-3 h-3 text-muted-foreground" />
        </a>
      </div>
    </div>
  );
}
