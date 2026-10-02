import { NextRequest, NextResponse } from "next/server";
import { runFullIngestionPipeline } from "@/lib/ingestion/pipeline";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
    }

    const results = await runFullIngestionPipeline();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      sourcesProcessed: results.length,
      articlesAdded: results.reduce((acc, r) => acc + r.articlesAdded, 0),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
