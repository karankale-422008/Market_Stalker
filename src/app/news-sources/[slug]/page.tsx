import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  Radio,
  Clock,
  Layers,
  Sparkles,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { formatRelativeTime } from "@/lib/utils";
import { Article, Source } from "@/types";

export const dynamic = "force-dynamic";

interface SourceDetailPageProps {
  params: { slug: string };
}

export default async function SourceDetailPage({ params }: SourceDetailPageProps) {
  const { slug } = params;
  const supabase = createAdminClient();

  // 1. Fetch Source Detail
  const { data: source, error } = await supabase
    .from("sources")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !source) {
    // If database not yet initialized, show template page
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Link
          href="/news-sources"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Publishers</span>
        </Link>
        <div className="p-8 rounded-2xl bg-card/60 border border-border/70 text-center">
          <h2 className="text-xl font-bold text-white">Publisher: {slug}</h2>
          <p className="text-xs text-muted-foreground mt-2">
            No articles indexed yet for this source. Run "Sync Feeds" to fetch latest data.
          </p>
        </div>
      </div>
    );
  }

  // 2. Fetch Articles for this Source
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
      source:sources(name, slug, logo_url, website_url),
      analysis:article_analysis(
        summary,
        market_relevance,
        sentiment,
        importance_score,
        companies,
        sectors,
        event_type,
        market_impact,
        reasoning
      )
    `)
    .eq("source_id", source.id)
    .order("published_at", { ascending: false })
    .limit(30);

  const articles: Article[] = (rawArticles as any) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/news-sources"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to 10 Indian Publishers</span>
        </Link>
      </div>

      {/* Publisher Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-card/60 backdrop-blur-md border border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-black/40 border border-border/70 flex items-center justify-center overflow-hidden shrink-0">
            {source.logo_url ? (
              <img src={source.logo_url} alt={source.name} className="w-8 h-8 object-contain" />
            ) : (
              <Radio className="w-7 h-7 text-emerald-400" />
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span>{source.name}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {source.status === "active" ? "Live Feed" : source.status}
              </span>
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {source.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
              <a
                href={source.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 flex items-center gap-1"
              >
                <span>{source.website_url}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>•</span>
              <span>Last fetch: {source.last_successful_fetch ? formatRelativeTime(source.last_successful_fetch) : "Scheduled"}</span>
            </div>
          </div>
        </div>

        {/* Action / Attribution badge */}
        <div className="flex flex-col items-start md:items-end gap-2">
          <span className="text-2xl font-bold text-white font-mono">{articles.length}</span>
          <span className="text-xs text-muted-foreground">Articles Analyzed</span>
        </div>
      </div>

      {/* Articles Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Indexed Intelligence Feed</span>
          </h2>
          <span className="text-xs font-mono text-muted-foreground">
            Showing {articles.length} records
          </span>
        </div>

        {articles.length === 0 ? (
          <div className="p-12 rounded-2xl bg-card/40 border border-dashed border-border/70 text-center space-y-3">
            <p className="text-sm font-semibold text-white">No articles indexed yet for {source.name}.</p>
            <p className="text-xs text-muted-foreground">
              Trigger synchronization in the Ingestion Manager or navbar to pull recent feed data.
            </p>
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
