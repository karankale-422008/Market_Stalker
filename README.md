# Indian Market AI News Intelligence Platform (MVP)

An AI-powered Indian financial news intelligence and market-analysis platform designed to collect and analyze financial/business news from 10 major Indian publishers, synthesize market implications, and provide AI-driven chat and trade event intelligence.

> **Important Compliance Note**: This is an **AI analysis platform**, not a news republisher. We do NOT copy or reproduce full publisher articles. The platform displays original AI-generated summaries, sentiment, and market relevance, and provides direct attribution links (`"READ ORIGINAL SOURCE"`) back to the publisher.

---

## 🚀 Key Features

1. **Executive Market Dashboard**: Real-time overview of market-moving events, sector impact, sentiment gauge, and top company mentions.
2. **AI Financial Chat**: RAG-enabled AI chat with grounded Supabase database retrieval and clear source citations.
3. **Historical Trade & Event Analysis**: Historical event-driven analysis mapping news events to stock reactions and risk/reward without fabricating ungrounded price data.
4. **10 Indian Financial News Publishers**: Modular source adapters for:
   - The Economic Times
   - Moneycontrol
   - Business Standard
   - Mint (Livemint)
   - The Financial Express
   - The Hindu BusinessLine
   - CNBC-TV18
   - NDTV Profit
   - Zee Business
   - Fortune India
5. **Modular Ingestion Pipeline**: `fetch()` ➔ `parse()` ➔ `normalize()` ➔ `deduplicate()` ➔ `store()` ➔ `AI analysis`.
6. **Enterprise Security & RLS**: Supabase Auth (Email + Google OAuth), Row Level Security, and zero client-exposed API secrets.
7. **Developer & Ingestion Monitoring**: Health checks, source status, fetch latencies, duplicate tracking, and error logs.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router), React 18/19, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons, Shadcn UI styling patterns
- **Database & Auth**: Supabase (PostgreSQL, RLS, Auth)
- **AI Abstraction**: Pluggable AI engine (Google Gemini, OpenAI, Anthropic, Groq, Ollama)
- **Deployment**: Vercel ready with serverless cron support

---

## ⚙️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone <your-github-repo-url>
   cd indian-market-ai-intelligence
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials, AI provider API key, and cron secret.

4. **Apply Database Migrations**:
   Run the migration SQL script located in `supabase/schema.sql` inside your Supabase SQL Editor.

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

---

## 🛡️ License & Source Compliance

All publisher headlines and metadata are processed through official public RSS feeds and APIs in accordance with fair attribution guidelines. No paywalls or technical restrictions are circumvented.
