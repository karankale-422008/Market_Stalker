import { AIAnalysisResult, Article, SourceCitation } from "@/types";

export interface AIProvider {
  analyzeArticle(
    title: string,
    description: string | null,
    sourceName: string
  ): Promise<AIAnalysisResult>;
  chat(
    messages: { role: "user" | "assistant" | "system"; content: string }[],
    contextArticles: Article[]
  ): Promise<{ answer: string; citations: SourceCitation[] }>;
}

// -----------------------------------------------------------------------------
// HEURISTIC RULE-BASED FALLBACK (When AI API Key is not yet configured)
// -----------------------------------------------------------------------------
const SECTOR_KEYWORDS: Record<string, string[]> = {
  "Banking & Financials": ["bank", "rbi", "nbfc", "hdfc", "icici", "sbi", "kotak", "repo", "npa", "lending", "credit"],
  "Information Technology": ["tcs", "infosys", "wipro", "hcl", "tech", "software", "ai", "cloud", "saas", "digital"],
  "Oil, Gas & Energy": ["reliance", "ongc", "oil", "crude", "petrol", "gas", "refinery", "brent", "opec", "energy", "ntpc", "green hydrogen"],
  "Automobiles": ["tata motors", "maruti", "mahindra", "ev", "auto", "vehicle", "electric vehicle", "sales", "bajaj auto"],
  "Pharmaceuticals": ["pharma", "fda", "drug", "sun pharma", "cipla", "dr reddy", "formulation", "biotech"],
  "FMCG & Consumer": ["itc", "hindustan unilever", "nestle", "fmcg", "consumer", "inflation", "retail"],
  "Metals & Mining": ["tata steel", "jsw", "steel", "iron ore", "aluminum", "mining", "copper"],
  "Telecommunications": ["airtel", "jio", "vodafone", "telecom", "5g", "spectrum", "tariff"],
};

const COMPANY_PATTERNS: { name: string; symbol: string; terms: string[] }[] = [
  { name: "Reliance Industries", symbol: "RELIANCE", terms: ["reliance", "ril", "mukesh ambani", "jio"] },
  { name: "Tata Consultancy Services", symbol: "TCS", terms: ["tcs", "tata consultancy"] },
  { name: "HDFC Bank", symbol: "HDFCBANK", terms: ["hdfc bank", "hdfc"] },
  { name: "ICICI Bank", symbol: "ICICIBANK", terms: ["icici bank", "icici"] },
  { name: "Infosys", symbol: "INFY", terms: ["infosys", "salil parekh"] },
  { name: "State Bank of India", symbol: "SBIN", terms: ["sbi", "state bank of india"] },
  { name: "Bharti Airtel", symbol: "BHARTIARTL", terms: ["bharti airtel", "airtel", "sunil mittal"] },
  { name: "ITC Ltd", symbol: "ITC", terms: ["itc"] },
  { name: "Larsen & Toubro", symbol: "LT", terms: ["larsen & toubro", "l&t"] },
  { name: "Tata Motors", symbol: "TATAMOTORS", terms: ["tata motors", "jlr", "jaguar land rover"] },
  { name: "Maruti Suzuki", symbol: "MARUTI", terms: ["maruti suzuki", "maruti"] },
  { name: "Sun Pharma", symbol: "SUNPHARMA", terms: ["sun pharma", "sun pharmaceutical"] },
  { name: "NTPC", symbol: "NTPC", terms: ["ntpc"] },
  { name: "ONGC", symbol: "ONGC", terms: ["ongc"] },
  { name: "Tata Steel", symbol: "TATASTEEL", terms: ["tata steel"] },
];

function fallbackAnalyzeArticle(
  title: string,
  description: string | null,
  sourceName: string
): AIAnalysisResult {
  const combinedText = `${title} ${description || ""}`.toLowerCase();

  // 1. Detect Companies
  const detectedCompanies: string[] = [];
  for (const item of COMPANY_PATTERNS) {
    if (item.terms.some((t) => combinedText.includes(t))) {
      detectedCompanies.push(`${item.name} (${item.symbol})`);
    }
  }

  // 2. Detect Sectors
  const detectedSectors: string[] = [];
  for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    if (keywords.some((k) => combinedText.includes(k))) {
      detectedSectors.push(sector);
    }
  }
  if (detectedSectors.length === 0) detectedSectors.push("General Economy");

  // 3. Sentiment & Importance
  let sentiment: "Bullish" | "Bearish" | "Neutral" = "Neutral";
  let importance = 50;

  const bullishWords = ["surge", "jump", "rally", "profit", "gain", "growth", "high", "record", "soar", "upgrade", "outperform", "dividend", "order win"];
  const bearishWords = ["fall", "drop", "plunge", "loss", "decline", "slump", "penalty", "probe", "downgrade", "inflation spike", "headwind", "deficit"];

  const bullCount = bullishWords.filter((w) => combinedText.includes(w)).length;
  const bearCount = bearishWords.filter((w) => combinedText.includes(w)).length;

  if (bullCount > bearCount) {
    sentiment = "Bullish";
    importance = Math.min(95, 55 + bullCount * 10);
  } else if (bearCount > bullCount) {
    sentiment = "Bearish";
    importance = Math.min(95, 55 + bearCount * 10);
  } else {
    importance = combinedText.includes("rbi") || combinedText.includes("sebi") || combinedText.includes("budget") ? 85 : 45;
  }

  // 4. Event Type
  let eventType = "Sector Development";
  if (combinedText.includes("q1") || combinedText.includes("q2") || combinedText.includes("q3") || combinedText.includes("q4") || combinedText.includes("earnings") || combinedText.includes("profit")) {
    eventType = "Earnings & Financial Results";
  } else if (combinedText.includes("rbi") || combinedText.includes("repo rate") || combinedText.includes("monetary policy")) {
    eventType = "RBI / Monetary Policy";
  } else if (combinedText.includes("sebi") || combinedText.includes("regulation") || combinedText.includes("probe")) {
    eventType = "SEBI / Regulatory Action";
  } else if (combinedText.includes("ipo") || combinedText.includes("listing")) {
    eventType = "IPO & Capital Raising";
  } else if (combinedText.includes("acquisition") || combinedText.includes("merger") || combinedText.includes("stake")) {
    eventType = "M&A / Corporate Action";
  } else if (combinedText.includes("inflation") || combinedText.includes("gdp") || combinedText.includes("trade deficit")) {
    eventType = "Macro-Economic Data";
  }

  return {
    summary: description
      ? `${title}. According to ${sourceName}, the reported development highlights key shifts in ${detectedSectors.join(", ")}.`
      : `${title} as reported by ${sourceName}.`,
    market_relevance: importance >= 75 ? "High" : importance >= 50 ? "Medium" : "Low",
    sentiment,
    importance_score: importance,
    companies: detectedCompanies.length > 0 ? detectedCompanies : ["Broader Market / Index"],
    sectors: detectedSectors,
    keywords: detectedSectors.concat(detectedCompanies).slice(0, 5),
    event_type: eventType,
    market_impact: `[AI Interpretation]: Potential ${sentiment.toLowerCase()} momentum in ${detectedSectors[0]} stocks. Market participants will observe volume confirmations on BSE/NSE.`,
    reasoning: `Based on headline indicators and reporting from ${sourceName}. Confirmed news event reported; market pricing depends on ongoing session liquidity and order flows.`,
  };
}

// -----------------------------------------------------------------------------
// GOOGLE GEMINI PROVIDER
// -----------------------------------------------------------------------------
class GeminiProvider implements AIProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = "gemini-2.0-flash") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async analyzeArticle(
    title: string,
    description: string | null,
    sourceName: string
  ): Promise<AIAnalysisResult> {
    if (!this.apiKey || this.apiKey.includes("placeholder")) {
      return fallbackAnalyzeArticle(title, description, sourceName);
    }

    try {
      const prompt = `You are a senior Indian stock market intelligence analyst for the platform 'Market Stalker'.
Analyze the following Indian financial news headline and permitted excerpt.
DO NOT invent facts. Distinguish confirmed facts, reported claims, and AI interpretation.

Title: "${title}"
Description: "${description || "N/A"}"
Publisher: "${sourceName}"

Respond ONLY with a valid JSON object strictly matching this schema:
{
  "summary": "Concise 2-3 sentence financial summary of the news development",
  "market_relevance": "High" | "Medium" | "Low",
  "sentiment": "Bullish" | "Bearish" | "Neutral",
  "importance_score": number between 1 and 100,
  "companies": ["Company Name (NSE_SYMBOL)"],
  "sectors": ["Sector 1", "Sector 2"],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "event_type": "Earnings" | "Management change" | "Acquisition" | "Government policy" | "RBI decision" | "SEBI regulation" | "Interest rates" | "Inflation" | "IPO" | "Corporate announcement" | "Sector development",
  "market_impact": "[Potential Market Impact]: How this could influence related stocks/sectors",
  "reasoning": "[AI Reasoning]: Key evidence and rationale behind this analysis"
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          }),
        }
      );

      if (!response.ok) {
        console.warn("Gemini API error, falling back to heuristic:", await response.text());
        return fallbackAnalyzeArticle(title, description, sourceName);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) return fallbackAnalyzeArticle(title, description, sourceName);

      const parsed = JSON.parse(rawText);
      return {
        summary: parsed.summary || title,
        market_relevance: parsed.market_relevance || "Medium",
        sentiment: parsed.sentiment || "Neutral",
        importance_score: Number(parsed.importance_score) || 50,
        companies: Array.isArray(parsed.companies) ? parsed.companies : [],
        sectors: Array.isArray(parsed.sectors) ? parsed.sectors : ["General"],
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
        event_type: parsed.event_type || "Sector development",
        market_impact: parsed.market_impact || "Potential sector reaction based on news flows.",
        reasoning: parsed.reasoning || "Synthesized from publisher reporting.",
      };
    } catch (err) {
      console.error("Gemini analysis error:", err);
      return fallbackAnalyzeArticle(title, description, sourceName);
    }
  }

  async chat(
    messages: { role: "user" | "assistant" | "system"; content: string }[],
    contextArticles: Article[]
  ): Promise<{ answer: string; citations: SourceCitation[] }> {
    const citations: SourceCitation[] = contextArticles.map((a) => ({
      publisher: a.source?.name || "Indian Publisher",
      headline: a.title,
      published_at: a.published_at,
      url: a.original_url,
      snippet: a.analysis?.summary || a.description || "",
    }));

    if (!this.apiKey || this.apiKey.includes("placeholder")) {
      const lastQuestion = messages[messages.length - 1]?.content || "";
      return {
        answer: `### Market Intelligence Overview\n\nBased on the latest indexed reports from top Indian publishers regarding **"${lastQuestion}"**:\n\n${
          contextArticles.length > 0
            ? contextArticles
                .slice(0, 4)
                .map(
                  (a, i) =>
                    `**${i + 1}. ${a.title}**\n*Publisher:* ${a.source?.name || "Financial News"}\n*AI Summary:* ${
                      a.analysis?.summary || a.description || "Reported market event."
                    }\n*Sentiment:* ${a.analysis?.sentiment || "Neutral"} | *Importance:* ${a.analysis?.importance_score || 50}/100\n`
                )
                .join("\n")
            : "No specific indexed articles directly matched your search query in our database. Try asking about Reliance, Banking, RBI, IT sector, or today's top market moves."
        }\n\n*Note: Market Stalker connects AI intelligence to authentic Indian news sources. Review original publisher reports via the source citations below.*`,
        citations,
      };
    }

    try {
      const articlesContextText = contextArticles
        .map(
          (a, i) => `[Source ${i + 1}]:
Publisher: ${a.source?.name || "Publisher"}
Title: ${a.title}
Published At: ${a.published_at}
URL: ${a.original_url}
AI Summary: ${a.analysis?.summary || a.description || "N/A"}
Sentiment: ${a.analysis?.sentiment || "Neutral"}
Sectors: ${a.analysis?.sectors?.join(", ") || "N/A"}
Companies: ${a.analysis?.companies?.join(", ") || "N/A"}`
        )
        .join("\n\n");

      const systemPrompt = `You are Market Stalker AI, an institutional-grade Indian financial market intelligence assistant.
Answer the user's question using ONLY the provided verified news articles and analysis context below.
Always maintain high financial rigor.
Rules:
1. Always distinguish confirmed facts, reported claims, and AI interpretation.
2. If price data is not provided, do not fabricate stock prices or exact returns.
3. Explicitly mention the publishers (e.g. Economic Times, Moneycontrol, Mint, etc.) that reported the event.
4. Conclude with actionable market takeaways for the Indian markets (NSE/BSE).

CONTEXT ARTICLES FROM DATABASE:
${articlesContextText || "No matching articles found in database."}`;

      const contents = [
        { role: "user", parts: [{ text: systemPrompt }] },
        ...messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      ];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents, generationConfig: { temperature: 0.3 } }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini Chat error: ${await response.text()}`);
      }

      const data = await response.json();
      const answer =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I was unable to synthesize the market intelligence. Please review the cited sources below.";

      return { answer, citations };
    } catch (err) {
      console.error("AI Chat failed, returning grounded summary:", err);
      return {
        answer: `### Market Stalker Synthesis\n\nHere are the top findings retrieved from our database for your query:\n\n${
          contextArticles
            .slice(0, 3)
            .map((a) => `- **${a.title}** (${a.source?.name}): ${a.analysis?.summary || a.description || ""}`)
            .join("\n\n")
        }`,
        citations,
      };
    }
  }
}

// -----------------------------------------------------------------------------
// FACTORY / SINGLETON GETTER
// -----------------------------------------------------------------------------
export function getAIProvider(): AIProvider {
  const providerType = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  const apiKey = process.env.AI_API_KEY || "";
  const model = process.env.AI_MODEL || (providerType === "gemini" ? "gemini-2.0-flash" : "gpt-4o-mini");

  if (providerType === "gemini") {
    return new GeminiProvider(apiKey, model);
  }

  // Fallback to Gemini/Heuristic if provider is unknown or not configured
  return new GeminiProvider(apiKey, model);
}
