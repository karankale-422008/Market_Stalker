import React from "react";
import Link from "next/link";
import { Sparkles, TrendingUp, ArrowRight, ShieldCheck, RefreshCw, Layers, Building2 } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { SectorHeatmap } from "@/components/dashboard/SectorHeatmap";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Article, Source } from "@/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createAdminClient();

  // 1. Fetch Sources
  const { data: sources } = await supabase
    .from("sources")
    .select("*")
    .order("name", { ascending: true });

  // 2. Fetch Latest Articles with AI Analysis
  const { data: rawArticles } = await supabase
    .from("articles")
    .select(`
      id,
      source_id,
      title,
      description,
      original_url,
      image_url,
      author,
      published_at,
      category,
      source:sources(id, name, slug, logo_url, website_url),
      analysis:article_analysis(
        id,
        summary,
        market_relevance,
        sentiment,
        importance_score,
        companies,
        sectors,
        keywords,
        event_type,
        market_impact,
        reasoning
      )
    `)
    .order("published_at", { ascending: false })
    .limit(20);

  const articles: Article[] = (rawArticles as any) || [];

  // Fallback demo/initial data if database is empty before first ingestion
  const activeSourcesCount = sources?.filter((s) => s.active)?.length || 10;
  const criticalEventsCount = articles.filter(
    (a) => (a.analysis?.importance_score || 0) >= 75
  ).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome & Market Pulse Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/40 via-card/80 to-teal-950/30 border border-emerald-500/20 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>INDIAN MARKET INTELLIGENCE TERMINAL</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Market Stalker <span className="text-emerald-400">AI News Intelligence</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Synthesizing real-time market implications, corporate earnings, and regulatory shifts across 10 leading Indian financial publishers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/chat"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs tracking-wide transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Chat with Market AI</span>
            </Link>

            <Link
              href="/trades"
              className="px-5 py-2.5 rounded-xl bg-secondary/80 hover:bg-secondary text-white font-medium text-xs border border-border/80 transition-all flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Event Trade Analysis</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Statistics Grid */}
      <StatsGrid
        articlesCount={articles.length}
        criticalEventsCount={criticalEventsCount}
        companiesCount={25}
        sectorsCount={8}
        activeSourcesCount={activeSourcesCount}
      />

      {/* Sector Activity & AI Sentiment Heatmap */}
      <SectorHeatmap />

      {/* Main Intelligence Feeds Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Latest AI News Insights</h2>
          </div>

          <Link
            href="/news-sources"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>View All 10 Sources</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="p-12 rounded-2xl bg-card/40 border border-dashed border-border/80 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No Ingested Articles Yet</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                Click <strong>"Sync Feeds"</strong> in the top navbar or visit the <strong>Ingestion & Audit</strong> page to fetch and analyze the latest headlines from Economic Times, Moneycontrol, Mint, and more.
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black text-xs font-semibold rounded-lg shadow-sm"
            >
              <span>Go to Ingestion Manager</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
