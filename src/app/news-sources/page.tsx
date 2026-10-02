import React from "react";
import { Newspaper, ShieldCheck, RefreshCw } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { SourceCard } from "@/components/sources/SourceCard";
import { Source } from "@/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "10 News Publishers — Market Stalker",
  description: "Official Indian financial news publishers monitored by Market Stalker.",
};

// Fallback list of the initial 10 publishers if database is not yet seeded
const INITIAL_10_SOURCES: Partial<Source>[] = [
  {
    id: "1",
    name: "Economic Times",
    slug: "economic-times",
    logo_url: "https://economictimes.indiatimes.com/favicon.ico",
    website_url: "https://economictimes.indiatimes.com",
    feed_url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
    source_type: "rss",
    description: "India’s premier business daily covering stock markets, economy, IPOs, banking, and corporate developments.",
    active: true,
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    name: "Moneycontrol",
    slug: "moneycontrol",
    logo_url: "https://www.moneycontrol.com/favicon.ico",
    website_url: "https://www.moneycontrol.com",
    feed_url: "https://www.moneycontrol.com/rss/marketreports.xml",
    source_type: "rss",
    description: "Leading financial portal providing real-time stock news, corporate earnings, and investment insights.",
    active: true,
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    name: "Business Standard",
    slug: "business-standard",
    logo_url: "https://www.business-standard.com/favicon.ico",
    website_url: "https://www.business-standard.com",
    feed_url: "https://www.business-standard.com/rss/markets-106.rss",
    source_type: "rss",
    description: "Comprehensive business journalism covering Indian economy, policy regulations, banking, and commodities.",
    active: true,
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: "4",
    name: "Mint",
    slug: "mint",
    logo_url: "https://www.livemint.com/favicon.ico",
    website_url: "https://www.livemint.com",
    feed_url: "https://www.livemint.com/rss/markets",
    source_type: "rss",
    description: "High-credibility analysis and reporting on Indian markets, corporate strategy, policy, and personal finance.",
    active: true,
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: "5",
    name: "Financial Express",
    slug: "financial-express",
    logo_url: "https://www.financialexpress.com/favicon.ico",
    website_url: "https://www.financialexpress.com",
    feed_url: "https://www.financialexpress.com/market/feed/",
    source_type: "rss",
    description: "Express Group publication focusing on Indian economy, market trends, mutual funds, and industrial growth.",
    active: true,
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: "6",
    name: "BusinessLine",
    slug: "businessline",
    logo_url: "https://www.thehindubusinessline.com/favicon.ico",
    website_url: "https://www.thehindubusinessline.com",
    feed_url: "https://www.thehindubusinessline.com/markets/feeder/default.rss",
    source_type: "rss",
    description: "The Hindu group business daily with in-depth coverage of agri-commodities, logistics, banking, and equities.",
    active: true,
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: "7",
    name: "CNBC-TV18",
    slug: "cnbc-tv18",
    logo_url: "https://www.cnbctv18.com/favicon.ico",
    website_url: "https://www.cnbctv18.com",
    feed_url: "https://www.cnbctv18.com/commonfeeds/v1/cns/rss/market.xml",
    source_type: "rss",
    description: "India’s top business television network digital portal providing rapid market scoops and trade setups.",
    active: true,
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: "8",
    name: "NDTV Profit",
    slug: "ndtv-profit",
    logo_url: "https://www.ndtvprofit.com/favicon.ico",
    website_url: "https://www.ndtvprofit.com",
    feed_url: "https://feeds.feedburner.com/ndtvprofit-latest",
    source_type: "rss",
    description: "Real-time Indian business, corporate earnings, and regulatory updates from NDTV Profit.",
    active: true,
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: "9",
    name: "Zee Business",
    slug: "zee-business",
    logo_url: "https://www.zeebiz.com/favicon.ico",
    website_url: "https://www.zeebiz.com",
    feed_url: "https://www.zeebiz.com/market-news/rss",
    source_type: "rss",
    description: "Popular Hindi & English business news portal focusing on retail traders, corporate news, and commodity analysis.",
    active: true,
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: "10",
    name: "Fortune India",
    slug: "fortune-india",
    logo_url: "https://www.fortuneindia.com/favicon.ico",
    website_url: "https://www.fortuneindia.com",
    feed_url: "https://www.fortuneindia.com/rss/all",
    source_type: "rss",
    description: "Thought-leadership business publication focused on enterprise management, Indian billionaires, and economic shifts.",
    active: true,
    status: "active",
    created_at: "",
    updated_at: "",
  },
];

export default async function NewsSourcesPage() {
  const supabase = createAdminClient();

  // Fetch sources with article count
  const { data: dbSources } = await supabase
    .from("sources")
    .select(`
      *,
      articles(count)
    `)
    .order("name", { ascending: true });

  const sources: Source[] =
    dbSources && dbSources.length > 0
      ? dbSources.map((s: any) => ({
          ...s,
          article_count: s.articles?.[0]?.count || 0,
        }))
      : (INITIAL_10_SOURCES as Source[]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border/70">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              10 Indian Financial News Publishers
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Modular RSS & API ingestion feeds. Fair use attribution with direct backlinks to original publisher articles.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Compliant & Permitted Access</span>
        </div>
      </div>

      {/* Grid of 10 Publishers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.map((source) => (
          <SourceCard key={source.slug || source.id} source={source} />
        ))}
      </div>
    </div>
  );
}
