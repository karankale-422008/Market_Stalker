-- ==============================================================================
-- MARKET STALKER — SUPABASE RELATIONAL DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Sources Table (10 initial Indian financial publishers)
CREATE TABLE IF NOT EXISTS public.sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    website_url TEXT NOT NULL,
    feed_url TEXT,
    api_url TEXT,
    source_type TEXT NOT NULL DEFAULT 'rss', -- 'rss' | 'api' | 'license_required'
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'error' | 'pending' | 'license_required'
    last_successful_fetch TIMESTAMPTZ,
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Articles Table (Attribution-first, minimal metadata storage, no full scraping)
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES public.sources(id) ON DELETE CASCADE,
    external_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    original_url TEXT UNIQUE NOT NULL,
    image_url TEXT,
    author TEXT,
    published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    content_reference TEXT,
    language TEXT NOT NULL DEFAULT 'en',
    category TEXT DEFAULT 'Markets',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Article Analysis Table (AI Synthesis, Market Relevance, Sentiment, Events)
CREATE TABLE IF NOT EXISTS public.article_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID UNIQUE NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    market_relevance TEXT NOT NULL DEFAULT 'Medium', -- 'High' | 'Medium' | 'Low'
    sentiment TEXT NOT NULL DEFAULT 'Neutral', -- 'Bullish' | 'Bearish' | 'Neutral'
    importance_score INTEGER NOT NULL DEFAULT 50 CHECK (importance_score >= 1 AND importance_score <= 100),
    companies TEXT[] DEFAULT '{}',
    sectors TEXT[] DEFAULT '{}',
    keywords TEXT[] DEFAULT '{}',
    event_type TEXT NOT NULL DEFAULT 'Sector Development',
    market_impact TEXT NOT NULL,
    reasoning TEXT NOT NULL,
    analysis_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Companies Table (NSE/BSE Listed Indian Corporates)
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    symbol TEXT UNIQUE NOT NULL,
    exchange TEXT NOT NULL DEFAULT 'NSE',
    sector TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Article-Companies Junction Table
CREATE TABLE IF NOT EXISTS public.article_companies (
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, company_id)
);

-- 7. Chat Sessions Table (User Conversational Intelligence)
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Market Intelligence Chat',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Chat Messages Table (Messages with source citations)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    sources_json JSONB DEFAULT '[]'::jsonb, -- Array of { publisher, headline, published_at, url }
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Trade Analyses Table (Hypothetical Event-Driven Trade Setups)
CREATE TABLE IF NOT EXISTS public.trade_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    analysis_date DATE NOT NULL DEFAULT CURRENT_DATE,
    market_context TEXT,
    hypothetical_entry TEXT,
    hypothetical_stop_loss TEXT,
    hypothetical_target TEXT,
    risk_reward TEXT,
    price_reaction TEXT DEFAULT 'Market data not connected for this analysis.',
    analysis TEXT NOT NULL,
    result TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Ingestion Logs Table (Audit & Monitoring)
CREATE TABLE IF NOT EXISTS public.ingestion_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES public.sources(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at TIMESTAMPTZ,
    articles_found INTEGER NOT NULL DEFAULT 0,
    articles_added INTEGER NOT NULL DEFAULT 0,
    duplicates INTEGER NOT NULL DEFAULT 0,
    errors TEXT,
    status TEXT NOT NULL DEFAULT 'in_progress' -- 'success' | 'partial_error' | 'failed'
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_articles_source_id ON public.articles(source_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_article_analysis_article_id ON public.article_analysis(article_id);
CREATE INDEX IF NOT EXISTS idx_article_analysis_sentiment ON public.article_analysis(sentiment);
CREATE INDEX IF NOT EXISTS idx_article_analysis_importance ON public.article_analysis(importance_score DESC);
CREATE INDEX IF NOT EXISTS idx_article_analysis_event_type ON public.article_analysis(event_type);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ingestion_logs_source_id ON public.ingestion_logs(source_id);
CREATE INDEX IF NOT EXISTS idx_ingestion_logs_started_at ON public.ingestion_logs(started_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingestion_logs ENABLE ROW LEVEL SECURITY;

-- Public Read for Market Data & News
CREATE POLICY "Public read sources" ON public.sources FOR SELECT USING (true);
CREATE POLICY "Public read articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Public read analysis" ON public.article_analysis FOR SELECT USING (true);
CREATE POLICY "Public read companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Public read article_companies" ON public.article_companies FOR SELECT USING (true);
CREATE POLICY "Public read trade_analyses" ON public.trade_analyses FOR SELECT USING (true);
CREATE POLICY "Public read ingestion_logs" ON public.ingestion_logs FOR SELECT USING (true);

-- User Isolation for Chat Sessions & Messages
CREATE POLICY "Users can manage their own chat sessions" ON public.chat_sessions
    FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can manage messages in their sessions" ON public.chat_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.chat_sessions
            WHERE chat_sessions.id = chat_messages.session_id
            AND (chat_sessions.user_id = auth.uid() OR chat_sessions.user_id IS NULL)
        )
    );

-- Service Role Key has full access to all tables for ingestion
