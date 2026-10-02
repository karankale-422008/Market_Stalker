import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  Building2,
  Layers,
  Tag,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate, formatRelativeTime, getSentimentBadgeClass, getImportanceBadgeClass, cn } from "@/lib/utils";
import { Article } from "@/types";

export const dynamic = "force-dynamic";

interface ArticleDetailPageProps {
  params: { id: string };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { id } = params;
  const supabase = createAdminClient();

  const { data: rawArticle, error } = await supabase
    .from("articles")
    .select(`
      *,
      source:sources(*),
      analysis:article_analysis(*)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error || !rawArticle) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Article Intelligence Not Found</h2>
        <p className="text-xs text-muted-foreground">The requested article could not be retrieved from the database.</p>
        <Link href="/" className="inline-flex text-xs text-emerald-400 font-semibold">
          ← Return to Dashboard
        </Link>
      </div>
    );
  }

  const article: Article = rawArticle as any;
  const analysis = article.analysis;
  const sentimentStyle = getSentimentBadgeClass(analysis?.sentiment);
  const importanceStyle = getImportanceBadgeClass(analysis?.importance_score || 50);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back Navigation */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Market Dashboard</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="space-y-6">
        {/* Article Metadata & Publisher Attribution Banner */}
        <div className="p-6 md:p-8 rounded-2xl bg-card/60 backdrop-blur-md border border-border/70 space-y-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-400 font-mono uppercase tracking-wider">
                {article.source?.name || "Indian Publisher"}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-slate-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                {formatDate(article.published_at)} ({formatRelativeTime(article.published_at)})
              </span>
            </div>

            <div className="flex items-center gap-2">
              {analysis?.sentiment && (
                <span
                  className={cn(
                    "text-xs font-mono px-2.5 py-1 rounded-full border flex items-center gap-1.5",
                    sentimentStyle.bg,
                    sentimentStyle.text,
                    sentimentStyle.border
                  )}
                >
                  {analysis.sentiment === "Bullish" && <TrendingUp className="w-3.5 h-3.5" />}
                  {analysis.sentiment === "Bearish" && <TrendingDown className="w-3.5 h-3.5" />}
                  {analysis.sentiment === "Neutral" && <Minus className="w-3.5 h-3.5" />}
                  {analysis.sentiment}
                </span>
              )}

              {analysis?.importance_score !== undefined && (
                <span className={cn("text-xs font-mono px-2.5 py-1 rounded-full border", importanceStyle.bg)}>
                  Impact: {analysis.importance_score}/100
                </span>
              )}
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight tracking-tight">
            {article.title}
          </h1>

          {/* Prominent Attribution & Read Original Source Action */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Attribution-First Compliance</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Original reporting by <strong>{article.source?.name}</strong>. Full article copyright belongs to publisher.
              </p>
            </div>

            <a
              href={article.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all shrink-0"
            >
              <span>READ ORIGINAL SOURCE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* AI Analysis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left 2 Cols: AI Summary, Market Impact & Reasoning */}
          <div className="md:col-span-2 space-y-6">
            {/* AI Summary Box */}
            <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border/70 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase font-mono tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>AI Synthesis & Executive Summary</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {analysis?.summary || article.description || "Analysis currently generating..."}
              </p>
            </div>

            {/* Market Impact */}
            <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border/70 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase font-mono tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>Potential Market Impact</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {analysis?.market_impact || "Evaluation based on news momentum and historical sector response."}
              </p>
            </div>

            {/* AI Reasoning / Evidence */}
            <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border/70 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase font-mono tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Analytical Reasoning & Evidence</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {analysis?.reasoning || "Synthesized from reported facts and financial metadata."}
              </p>
            </div>
          </div>

          {/* Right Col: Structured Tags, Sectors, Companies */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border/70 space-y-5">
              <h3 className="text-xs font-bold font-mono uppercase text-muted-foreground tracking-wider">
                Event Classification
              </h3>

              {/* Event Type */}
              <div>
                <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">
                  Event Type
                </span>
                <span className="inline-block px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                  {analysis?.event_type || "Sector Development"}
                </span>
              </div>

              {/* Market Relevance */}
              <div>
                <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">
                  Market Relevance
                </span>
                <span className="text-xs font-mono text-white">
                  {analysis?.market_relevance || "Medium"} Relevance
                </span>
              </div>

              {/* Tagged Companies */}
              {analysis?.companies && analysis.companies.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-1.5">
                    Companies Mentioned
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.companies.map((comp, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary text-white text-xs border border-border/60 font-mono"
                      >
                        <Building2 className="w-3 h-3 text-emerald-400" />
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tagged Sectors */}
              {analysis?.sectors && analysis.sectors.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-1.5">
                    Sectors Involved
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.sectors.map((sec, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-muted text-slate-300 text-xs font-mono"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords */}
              {analysis?.keywords && analysis.keywords.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-1.5">
                    Key Indicators
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-black/40 text-muted-foreground font-mono"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
