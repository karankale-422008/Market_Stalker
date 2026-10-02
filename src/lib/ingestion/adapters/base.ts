import { RawFeedItem, Source } from "@/types";
import { parseXmlFeed } from "../parser";
import { normalizeUrl } from "../deduplication";
import { NormalizedArticle } from "../types";

export interface SourceAdapter {
  slug: string;
  name: string;
  fetchArticles(source: Source): Promise<NormalizedArticle[]>;
}

export abstract class BaseRssAdapter implements SourceAdapter {
  abstract slug: string;
  abstract name: string;

  protected getFeedUrl(source: Source): string {
    return source.feed_url || "";
  }

  protected getCategory(): string {
    return "Markets";
  }

  async fetchArticles(source: Source): Promise<NormalizedArticle[]> {
    const feedUrl = this.getFeedUrl(source);
    if (!feedUrl) {
      throw new Error(`Feed URL not configured for ${this.name}`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(feedUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "MarketStalkerAI/1.0 (+https://marketstalker.ai; Financial News Intelligence Bot)",
          "Accept": "application/rss+xml, application/xml, text/xml, */*",
        },
        cache: "no-store",
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }

      const xmlText = await response.text();
      const rawItems = parseXmlFeed(xmlText);

      return rawItems.map((item) => this.normalizeItem(item, source));
    } catch (err: any) {
      clearTimeout(timeoutId);
      throw new Error(`Fetch failed for ${this.name}: ${err.message || String(err)}`);
    }
  }

  protected normalizeItem(item: RawFeedItem, source: Source): NormalizedArticle {
    let pubDateIso = new Date().toISOString();
    if (item.pubDate) {
      const parsed = new Date(item.pubDate);
      if (!isNaN(parsed.getTime())) {
        pubDateIso = parsed.toISOString();
      }
    }

    return {
      source_id: source.id,
      external_id: item.guid || null,
      title: item.title,
      description: item.description || null,
      original_url: normalizeUrl(item.link),
      image_url: item.imageUrl || null,
      author: item.author || this.name,
      published_at: pubDateIso,
      language: "en",
      category: item.category || this.getCategory(),
    };
  }
}
