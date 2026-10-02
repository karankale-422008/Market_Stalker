import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAIProvider } from "@/lib/ai";
import { Article } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { messages, sessionId } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content;

    const supabase = createAdminClient();

    // 1. Search Database for relevant articles based on keywords & recency
    const queryTerms = userQuery
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w: string) => w.length > 2)
      .slice(0, 4);

    let queryBuilder = supabase
      .from("articles")
      .select(`
        id,
        title,
        description,
        original_url,
        published_at,
        category,
        source:sources(name, slug, logo_url),
        analysis:article_analysis(summary, sentiment, importance_score, sectors, companies, event_type, market_impact, reasoning)
      `)
      .order("published_at", { ascending: false })
      .limit(10);

    // If query has specific terms, attempt text match
    if (queryTerms.length > 0) {
      const orFilter = queryTerms.map((t: string) => `title.ilike.%${t}%,description.ilike.%${t}%`).join(",");
      queryBuilder = queryBuilder.or(orFilter);
    }

    const { data: matchedArticles, error: dbError } = await queryBuilder;

    // Fallback to top recent articles if filter produced 0 results
    let contextArticles: Article[] = (matchedArticles as any) || [];
    if (contextArticles.length === 0) {
      const { data: recentArticles } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          description,
          original_url,
          published_at,
          category,
          source:sources(name, slug, logo_url),
          analysis:article_analysis(summary, sentiment, importance_score, sectors, companies, event_type, market_impact, reasoning)
        `)
        .order("published_at", { ascending: false })
        .limit(6);

      contextArticles = (recentArticles as any) || [];
    }

    // 2. Generate Grounded AI Response
    const ai = getAIProvider();
    const { answer, citations } = await ai.chat(messages, contextArticles);

    // 3. Save to database if session exists
    if (sessionId) {
      await supabase.from("chat_messages").insert([
        {
          session_id: sessionId,
          role: "user",
          content: userQuery,
          sources_json: [],
        },
        {
          session_id: sessionId,
          role: "assistant",
          content: answer,
          sources_json: citations,
        },
      ]);
    }

    return NextResponse.json({
      answer,
      citations,
      matchedArticlesCount: contextArticles.length,
    });
  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: err.message || "Chat failed" }, { status: 500 });
  }
}
