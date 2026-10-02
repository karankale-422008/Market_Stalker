import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { TradeAnalysisView } from "@/components/trades/TradeAnalysisView";
import { Article, Company } from "@/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Trade & Event Analysis — Market Stalker",
  description: "Historical news-event to market reaction analysis.",
};

const DEFAULT_SAMPLE_COMPANIES: Company[] = [
  { id: "1", name: "Reliance Industries Ltd", symbol: "RELIANCE", exchange: "NSE", sector: "Oil & Gas / Retail", created_at: "" },
  { id: "2", name: "Tata Consultancy Services Ltd", symbol: "TCS", exchange: "NSE", sector: "Information Technology", created_at: "" },
  { id: "3", name: "HDFC Bank Ltd", symbol: "HDFCBANK", exchange: "NSE", sector: "Banking & Financials", created_at: "" },
  { id: "4", name: "Infosys Ltd", symbol: "INFY", exchange: "NSE", sector: "Information Technology", created_at: "" },
  { id: "5", name: "State Bank of India", symbol: "SBIN", exchange: "NSE", sector: "Banking & Financials", created_at: "" },
  { id: "6", name: "Tata Motors Ltd", symbol: "TATAMOTORS", exchange: "NSE", sector: "Automobiles", created_at: "" },
  { id: "7", name: "Sun Pharmaceutical Industries", symbol: "SUNPHARMA", exchange: "NSE", sector: "Pharmaceuticals", created_at: "" },
];

export default async function TradeAnalysisPage() {
  const supabase = createAdminClient();

  const [{ data: rawArticles }, { data: rawCompanies }] = await Promise.all([
    supabase
      .from("articles")
      .select(`
        id,
        source_id,
        title,
        description,
        original_url,
        published_at,
        category,
        source:sources(name, slug, logo_url),
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
      .order("published_at", { ascending: false })
      .limit(20),
    supabase.from("companies").select("*").order("name", { ascending: true }),
  ]);

  const articles: Article[] = (rawArticles as any) || [];
  const companies: Company[] = (rawCompanies && rawCompanies.length > 0)
    ? (rawCompanies as unknown as Company[])
    : DEFAULT_SAMPLE_COMPANIES;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <TradeAnalysisView articles={articles} companies={companies} />
    </div>
  );
}
