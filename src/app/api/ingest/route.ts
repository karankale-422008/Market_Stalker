import { NextRequest, NextResponse } from "next/server";
import { runFullIngestionPipeline, runIngestionForSource } from "@/lib/ingestion/pipeline";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sourceSlug } = body;

    if (sourceSlug) {
      const supabase = createAdminClient();
      const { data: source, error } = await supabase
        .from("sources")
        .select("*")
        .eq("slug", sourceSlug)
        .single();

      if (error || !source) {
        return NextResponse.json({ error: "Source not found" }, { status: 404 });
      }

      const result = await runIngestionForSource(source);
      return NextResponse.json({ success: true, result });
    }

    // Run all sources
    const results = await runFullIngestionPipeline();
    return NextResponse.json({
      success: true,
      totalSources: results.length,
      totalAdded: results.reduce((acc, r) => acc + r.articlesAdded, 0),
      totalFound: results.reduce((acc, r) => acc + r.articlesFound, 0),
      results,
    });
  } catch (err: any) {
    console.error("Ingestion API error:", err);
    return NextResponse.json({ error: err.message || "Ingestion failed" }, { status: 500 });
  }
}
