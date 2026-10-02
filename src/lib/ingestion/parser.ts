import { XMLParser } from "fast-xml-parser";
import { RawFeedItem } from "@/types";

export function parseXmlFeed(xmlText: string): RawFeedItem[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    trimValues: true,
  });

  const parsed = parser.parse(xmlText);
  const items: RawFeedItem[] = [];

  // Channel items (RSS 2.0)
  let rawItems =
    parsed?.rss?.channel?.item ||
    parsed?.feed?.entry ||
    parsed?.rdf?.item ||
    [];

  if (!Array.isArray(rawItems)) {
    rawItems = rawItems ? [rawItems] : [];
  }

  for (const item of rawItems) {
    // 1. Title
    const title = cleanHtml(typeof item.title === "string" ? item.title : item.title?.["#text"] || "");
    if (!title) continue;

    // 2. Link
    let link = "";
    if (typeof item.link === "string") {
      link = item.link;
    } else if (item.link?.["@_href"]) {
      link = item.link["@_href"];
    } else if (item.link?.["#text"]) {
      link = item.link["#text"];
    } else if (typeof item.guid === "string" && item.guid.startsWith("http")) {
      link = item.guid;
    }
    link = link.trim();
    if (!link) continue;

    // 3. Description / Excerpt
    let description =
      item.description ||
      item.summary ||
      item["content:encoded"] ||
      item.content ||
      "";
    if (typeof description !== "string") {
      description = description?.["#text"] || "";
    }
    description = cleanHtml(description).slice(0, 450); // limit to concise snippet

    // 4. Publication Date
    const pubDate =
      item.pubDate ||
      item.published ||
      item.updated ||
      item["dc:date"] ||
      new Date().toISOString();

    // 5. Author
    let author = item.author || item["dc:creator"] || null;
    if (typeof author !== "string") {
      author = author?.name || author?.["#text"] || null;
    }

    // 6. Media / Image URL
    let imageUrl: string | undefined = undefined;
    if (item.enclosure?.["@_url"]) {
      imageUrl = item.enclosure["@_url"];
    } else if (item["media:content"]?.["@_url"]) {
      imageUrl = item["media:content"]["@_url"];
    } else if (item["media:thumbnail"]?.["@_url"]) {
      imageUrl = item["media:thumbnail"]["@_url"];
    }

    items.push({
      guid: typeof item.guid === "string" ? item.guid : item.id || link,
      title,
      link,
      description,
      pubDate,
      author: author ? cleanHtml(author) : undefined,
      imageUrl,
      category: typeof item.category === "string" ? item.category : "Markets",
    });
  }

  return items;
}

export function cleanHtml(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/<!\[CDATA\[(.*?)\]\]>/gis, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}
