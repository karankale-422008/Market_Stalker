import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (!q.trim()) {
      return NextResponse.json({ articles: [], sources: [], companies: [] });
    }

    const supabase = createAdminClient();

    // 1. Search Articles
    const { data: articles } = await supabase
      .from("articles")
      .select(`
        id,
        title,
        description,
        original_url,
        published_at,
        source:sources(name, slug, logo_url),
        analysis:article_analysis(summary, sentiment, importance_score, sectors, companies, event_type)
      `)
      .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
      .order("published_at", { ascending: false })
      .limit(10);

    // 2. Search Sources
    const { data: sources } = await supabase
      .from("sources")
      .select("*")
      .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
      .limit(5);

    // 3. Search Companies
    const { data: companies } = await supabase
      .from("companies")
      .select("*")
      .or(`name.ilike.%${q}%,symbol.ilike.%${q}%,sector.ilike.%${q}%`)
      .limit(5);

    return NextResponse.json({
      articles: articles || [],
      sources: sources || [],
      companies: companies || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
