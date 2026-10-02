import { RawFeedItem, Source } from "@/types";

export interface NormalizedArticle {
  source_id: string;
  external_id: string | null;
  title: string;
  description: string | null;
  original_url: string;
  image_url: string | null;
  author: string | null;
  published_at: string;
  language: string;
  category: string;
}

export interface IngestionResult {
  source: Source;
  articlesFound: number;
  articlesAdded: number;
  duplicates: number;
  errors: string[];
  durationMs: number;
}
