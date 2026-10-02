export type SentimentType = 'Bullish' | 'Bearish' | 'Neutral';
export type MarketRelevanceType = 'High' | 'Medium' | 'Low';
export type SourceStatusType = 'active' | 'error' | 'pending' | 'license_required';

export interface Source {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website_url: string;
  feed_url: string | null;
  api_url: string | null;
  source_type: 'rss' | 'api' | 'license_required';
  description: string | null;
  active: boolean;
  status: SourceStatusType;
  last_successful_fetch: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
  article_count?: number;
}

export interface Article {
  id: string;
  source_id: string;
  external_id: string | null;
  title: string;
  description: string | null;
  original_url: string;
  image_url: string | null;
  author: string | null;
  published_at: string;
  content_reference: string | null;
  language: string;
  category: string | null;
  created_at: string;
  updated_at: string;
  source?: Source;
  analysis?: ArticleAnalysis;
}

export interface ArticleAnalysis {
  id: string;
  article_id: string;
  summary: string;
  market_relevance: MarketRelevanceType;
  sentiment: SentimentType;
  importance_score: number; // 1 - 100
  companies: string[];
  sectors: string[];
  keywords: string[];
  event_type: string;
  market_impact: string;
  reasoning: string;
  analysis_json?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  symbol: string;
  exchange: string;
  sector: string | null;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string | null;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface SourceCitation {
  publisher: string;
  headline: string;
  published_at: string;
  url: string;
  snippet?: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources_json: SourceCitation[];
  created_at: string;
}

export interface TradeAnalysis {
  id: string;
  article_id: string | null;
  company_id: string | null;
  analysis_date: string;
  market_context: string | null;
  hypothetical_entry: string | null;
  hypothetical_stop_loss: string | null;
  hypothetical_target: string | null;
  risk_reward: string | null;
  price_reaction: string | null;
  analysis: string;
  result: string | null;
  created_at: string;
  article?: Article;
  company?: Company;
}

export interface IngestionLog {
  id: string;
  source_id: string;
  started_at: string;
  finished_at: string | null;
  articles_found: number;
  articles_added: number;
  duplicates: number;
  errors: string | null;
  status: 'in_progress' | 'success' | 'partial_error' | 'failed';
  source?: Source;
}

export interface AIAnalysisResult {
  summary: string;
  market_relevance: MarketRelevanceType;
  sentiment: SentimentType;
  importance_score: number;
  companies: string[];
  sectors: string[];
  keywords: string[];
  event_type: string;
  market_impact: string;
  reasoning: string;
}

export interface RawFeedItem {
  guid?: string;
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  author?: string;
  imageUrl?: string;
  category?: string;
}
