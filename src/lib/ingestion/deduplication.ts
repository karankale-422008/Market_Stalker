export function normalizeUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    // Remove analytics and tracking query params
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "ref",
      "fbclid",
      "gclid",
      "_ga",
    ];
    trackingParams.forEach((param) => url.searchParams.delete(param));
    // Remove trailing slash
    let cleaned = url.toString();
    if (cleaned.endsWith("/")) {
      cleaned = cleaned.slice(0, -1);
    }
    return cleaned;
  } catch {
    return rawUrl.trim();
  }
}

export function normalizeHeadline(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function calculateHeadlineSimilarity(titleA: string, titleB: string): number {
  const wordsA = new Set(normalizeHeadline(titleA).split(" "));
  const wordsB = new Set(normalizeHeadline(titleB).split(" "));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersection = 0;
  wordsA.forEach((word) => {
    if (wordsB.has(word) && word.length > 3) {
      intersection++;
    }
  });

  const union = new Set([...wordsA, ...wordsB]).size;
  return intersection / union;
}
