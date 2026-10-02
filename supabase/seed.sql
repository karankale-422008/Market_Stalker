-- ==============================================================================
-- SEED DATA: 10 INDIAN FINANCIAL PUBLISHERS & TOP INDIAN COMPANIES
-- ==============================================================================

-- 1. Insert 10 Initial Indian Financial News Publishers
INSERT INTO public.sources (name, slug, logo_url, website_url, feed_url, source_type, description, active, status)
VALUES
(
    'Economic Times',
    'economic-times',
    'https://economictimes.indiatimes.com/favicon.ico',
    'https://economictimes.indiatimes.com',
    'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
    'rss',
    'India’s premier business daily covering stock markets, economy, IPOs, banking, and corporate developments.',
    true,
    'active'
),
(
    'Moneycontrol',
    'moneycontrol',
    'https://www.moneycontrol.com/favicon.ico',
    'https://www.moneycontrol.com',
    'https://www.moneycontrol.com/rss/marketreports.xml',
    'rss',
    'Leading financial portal providing real-time stock news, corporate earnings, and investment insights.',
    true,
    'active'
),
(
    'Business Standard',
    'business-standard',
    'https://www.business-standard.com/favicon.ico',
    'https://www.business-standard.com',
    'https://www.business-standard.com/rss/markets-106.rss',
    'rss',
    'Comprehensive business journalism covering Indian economy, policy regulations, banking, and commodities.',
    true,
    'active'
),
(
    'Mint',
    'mint',
    'https://www.livemint.com/favicon.ico',
    'https://www.livemint.com',
    'https://www.livemint.com/rss/markets',
    'rss',
    'High-credibility analysis and reporting on Indian markets, corporate strategy, policy, and personal finance.',
    true,
    'active'
),
(
    'Financial Express',
    'financial-express',
    'https://www.financialexpress.com/favicon.ico',
    'https://www.financialexpress.com',
    'https://www.financialexpress.com/market/feed/',
    'rss',
    'Express Group publication focusing on Indian economy, market trends, mutual funds, and industrial growth.',
    true,
    'active'
),
(
    'BusinessLine',
    'businessline',
    'https://www.thehindubusinessline.com/favicon.ico',
    'https://www.thehindubusinessline.com',
    'https://www.thehindubusinessline.com/markets/feeder/default.rss',
    'rss',
    'The Hindu group business daily with in-depth coverage of agri-commodities, logistics, banking, and equities.',
    true,
    'active'
),
(
    'CNBC-TV18',
    'cnbc-tv18',
    'https://www.cnbctv18.com/favicon.ico',
    'https://www.cnbctv18.com',
    'https://www.cnbctv18.com/commonfeeds/v1/cns/rss/market.xml',
    'rss',
    'India’s top business television network digital portal providing rapid market scoops, management interviews, and trade setups.',
    true,
    'active'
),
(
    'NDTV Profit',
    'ndtv-profit',
    'https://www.ndtvprofit.com/favicon.ico',
    'https://www.ndtvprofit.com',
    'https://feeds.feedburner.com/ndtvprofit-latest',
    'rss',
    'Real-time Indian business, corporate earnings, and regulatory updates from NDTV Profit.',
    true,
    'active'
),
(
    'Zee Business',
    'zee-business',
    'https://www.zeebiz.com/favicon.ico',
    'https://www.zeebiz.com',
    'https://www.zeebiz.com/market-news/rss',
    'rss',
    'Popular Hindi & English business news portal focusing on retail traders, corporate news, and commodity analysis.',
    true,
    'active'
),
(
    'Fortune India',
    'fortune-india',
    'https://www.fortuneindia.com/favicon.ico',
    'https://www.fortuneindia.com',
    'https://www.fortuneindia.com/rss/all',
    'rss',
    'Thought-leadership business publication focused on enterprise management, Indian billionaires, startup ecosystem, and economic shifts.',
    true,
    'active'
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    logo_url = EXCLUDED.logo_url,
    website_url = EXCLUDED.website_url,
    feed_url = EXCLUDED.feed_url,
    description = EXCLUDED.description;

-- 2. Insert Top Indian NSE/BSE Listed Companies
INSERT INTO public.companies (name, symbol, exchange, sector)
VALUES
    ('Reliance Industries Ltd', 'RELIANCE', 'NSE', 'Oil & Gas / Conglomerate'),
    ('Tata Consultancy Services Ltd', 'TCS', 'NSE', 'Information Technology'),
    ('HDFC Bank Ltd', 'HDFCBANK', 'NSE', 'Banking & Financials'),
    ('ICICI Bank Ltd', 'ICICIBANK', 'NSE', 'Banking & Financials'),
    ('Infosys Ltd', 'INFY', 'NSE', 'Information Technology'),
    ('State Bank of India', 'SBIN', 'NSE', 'Public Sector Banking'),
    ('Bharti Airtel Ltd', 'BHARTIARTL', 'NSE', 'Telecommunications'),
    ('ITC Ltd', 'ITC', 'NSE', 'FMCG / Conglomerate'),
    ('Larsen & Toubro Ltd', 'LT', 'NSE', 'Capital Goods / Infrastructure'),
    ('Kotak Mahindra Bank Ltd', 'KOTAKBANK', 'NSE', 'Banking & Financials'),
    ('Axis Bank Ltd', 'AXISBANK', 'NSE', 'Banking & Financials'),
    ('Hindustan Unilever Ltd', 'HINDUNILVR', 'NSE', 'FMCG'),
    ('Bajaj Finance Ltd', 'BAJFINANCE', 'NSE', 'NBFC / Financials'),
    ('Maruti Suzuki India Ltd', 'MARUTI', 'NSE', 'Automobiles'),
    ('Tata Motors Ltd', 'TATAMOTORS', 'NSE', 'Automobiles'),
    ('Sun Pharmaceutical Industries Ltd', 'SUNPHARMA', 'NSE', 'Pharmaceuticals'),
    ('NTPC Ltd', 'NTPC', 'NSE', 'Power & Energy'),
    ('Oil & Natural Gas Corporation Ltd', 'ONGC', 'NSE', 'Oil & Gas'),
    ('Tata Steel Ltd', 'TATASTEEL', 'NSE', 'Metals & Mining'),
    ('Mahindra & Mahindra Ltd', 'M&M', 'NSE', 'Automobiles')
ON CONFLICT (symbol) DO NOTHING;
