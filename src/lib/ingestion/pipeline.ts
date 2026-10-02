import { createAdminClient } from "../supabase/admin";
import { getAIProvider } from "../ai";
import { getAdapterForSource } from "./adapters";
import { IngestionResult } from "./types";
import { Source } from "@/types";

export async function runIngestionForSource(source: Source): Promise<IngestionResult> {
  const supabase = createAdminClient();
  const ai = getAIProvider();
  const startTime = Date.now();
  const errors: string[] = [];

  let articlesFound = 0;
  let articlesAdded = 0;
  let duplicates = 0;

  // 1. Create Ingestion Log Entry
  const { data: logRecord } = await supabase
    .from("ingestion_logs")
    .insert({
      source_id: source.id,
      started_at: new Date().toISOString(),
      status: "in_progress",
    })
    .select("id")
    .single();

  const logId = logRecord?.id;

  try {
    // 2. Fetch & Normalize Articles via Modular Adapter
    const adapter = getAdapterForSource(source);
    const normalizedArticles = await adapter.fetchArticles(source);
    articlesFound = normalizedArticles.length;

    // Limit to top 15 freshest items per cycle to optimize AI latency & rate limits
    const candidateArticles = normalizedArticles.slice(0, 15);

    for (const item of candidateArticles) {
      try {
        // 3. Deduplication Check by Original URL
        const { data: existing } = await supabase
          .from("articles")
          .select("id")
          .eq("original_url", item.original_url)
          .maybeSingle();

        if (existing) {
          duplicates++;
          continue;
        }

        // 4. Store Article in Supabase
        const { data: insertedArticle, error: articleErr } = await supabase
          .from("articles")
          .insert({
            source_id: source.id,
            external_id: item.external_id,
            title: item.title,
            description: item.description,
            original_url: item.original_url,
            image_url: item.image_url,
            author: item.author,
            published_at: item.published_at,
            language: item.language,
            category: item.category,
          })
          .select("id")
          .single();

        if (articleErr || !insertedArticle) {
          errors.push(`Failed to insert article "${item.title.slice(0, 30)}": ${articleErr?.message}`);
          continue;
        }

        // 5. Run AI News & Market Analysis
        const analysis = await ai.analyzeArticle(
          item.title,
          item.description,
          source.name
        );

        // 6. Store AI Analysis
        await supabase.from("article_analysis").insert({
          article_id: insertedArticle.id,
          summary: analysis.summary,
          market_relevance: analysis.market_relevance,
          sentiment: analysis.sentiment,
          importance_score: analysis.importance_score,
          companies: analysis.companies,
          sectors: analysis.sectors,
          keywords: analysis.keywords,
          event_type: analysis.event_type,
          market_impact: analysis.market_impact,
          reasoning: analysis.reasoning,
        });

        articlesAdded++;
      } catch (itemErr: any) {
        errors.push(`Item error: ${itemErr.message || String(itemErr)}`);
      }
    }

    // 7. Update Source Status
    await supabase
      .from("sources")
      .update({
        last_successful_fetch: new Date().toISOString(),
        last_error: errors.length > 0 ? errors.join("; ") : null,
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", source.id);

    // 8. Finalize Ingestion Log
    if (logId) {
      await supabase
        .from("ingestion_logs")
        .update({
          finished_at: new Date().toISOString(),
          articles_found: articlesFound,
          articles_added: articlesAdded,
          duplicates: duplicates,
          errors: errors.length > 0 ? errors.join("; ") : null,
          status: errors.length > 0 ? (articlesAdded > 0 ? "partial_error" : "failed") : "success",
        })
        .eq("id", logId);
    }
  } catch (sourceErr: any) {
    const errorMsg = sourceErr.message || String(sourceErr);
    errors.push(errorMsg);

    await supabase
      .from("sources")
      .update({
        last_error: errorMsg,
        status: "error",
        updated_at: new Date().toISOString(),
      })
      .eq("id", source.id);

    if (logId) {
      await supabase
        .from("ingestion_logs")
        .update({
          finished_at: new Date().toISOString(),
          errors: errorMsg,
          status: "failed",
        })
        .eq("id", logId);
    }
  }

  return {
    source,
    articlesFound,
    articlesAdded,
    duplicates,
    errors,
    durationMs: Date.now() - startTime,
  };
}

export async function runFullIngestionPipeline(): Promise<IngestionResult[]> {
  const supabase = createAdminClient();

  // Fetch all active sources
  const { data: sources, error } = await supabase
    .from("sources")
    .select("*")
    .eq("active", true);

  if (error || !sources || sources.length === 0) {
    console.warn("No active sources found for ingestion.");
    return [];
  }

  const results: IngestionResult[] = [];
  // Run sources concurrently with isolated error boundaries
  const promises = sources.map(async (source) => {
    try {
      const res = await runIngestionForSource(source);
      return res;
    } catch (err: any) {
      return {
        source,
        articlesFound: 0,
        articlesAdded: 0,
        duplicates: 0,
        errors: [err.message || String(err)],
        durationMs: 0,
      };
    }
  });

  return Promise.all(promises);
}
