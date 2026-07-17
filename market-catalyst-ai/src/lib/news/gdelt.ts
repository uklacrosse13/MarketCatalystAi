import { stableId } from "./hash";
import { stripHtml } from "./sanitize";
import type { NormalizedArticle } from "./types";

// ---------------------------------------------------------------------------
// GDELT DOC 2.0 API client (https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/)
//
// Free, keyless, public API monitoring global news coverage. This client
// uses `mode=artlist&format=json`, which returns: url, url_mobile, title,
// seendate, socialimage, domain, language, sourcecountry — confirmed against
// the API's own documentation and multiple independent client libraries.
//
// IMPORTANT LIMITATION: ArtList mode does NOT return a per-article tone
// score. GDELT's tone metric is only available through separate aggregate
// "timeline" query modes (e.g. timelinetone), which describe a whole query's
// coverage over time, not any single article. Rather than approximate a
// per-article tone from an aggregate signal — which would misrepresent it —
// every article's `gdeltTone` is left as `null` here. See types.ts.
//
// GDELT asks integrators to be gentle with request rates; this client
// enforces a minimum spacing between requests.
// ---------------------------------------------------------------------------

const GDELT_ENDPOINT = "https://api.gdeltproject.org/api/v2/doc/doc";
const MIN_REQUEST_INTERVAL_MS = 1100;
const REQUEST_TIMEOUT_MS = 10_000;

let lastRequestAt = 0;

async function respectRateLimit(): Promise<void> {
  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < MIN_REQUEST_INTERVAL_MS) {
    await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_INTERVAL_MS - elapsed));
  }
  lastRequestAt = Date.now();
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "MarketCatalystAI/1.0 (educational research; +https://github.com)" },
    });
  } finally {
    clearTimeout(timer);
  }
}

interface RawGdeltArticle {
  url: string;
  url_mobile?: string;
  title?: string;
  seendate?: string; // e.g. "20260716T101500Z"
  socialimage?: string;
  domain?: string;
  language?: string;
  sourcecountry?: string;
}

function parseGdeltDate(seendate: string | undefined): string {
  if (!seendate) return new Date().toISOString();
  // Format: YYYYMMDDTHHMMSSZ
  const match = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(seendate);
  if (!match) return new Date().toISOString();
  const [, y, mo, d, h, mi, s] = match;
  return new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)).toISOString();
}

function isGovernmentDomain(domain: string | undefined): boolean {
  if (!domain) return false;
  return /\.gov$/i.test(domain) || /\.gov\./i.test(domain) || /\.mil$/i.test(domain);
}

function normalizeGdeltArticle(raw: RawGdeltArticle): NormalizedArticle | null {
  if (!raw.url || !raw.title) return null;

  return {
    id: stableId(raw.url),
    headline: stripHtml(raw.title),
    snippet: "", // ArtList mode provides no separate description field
    publisher: raw.domain ?? "Unknown source",
    publishedAt: parseGdeltDate(raw.seendate),
    retrievedAt: new Date().toISOString(),
    url: raw.url,
    imageUrl: raw.socialimage ?? null,
    language: raw.language ?? null,
    country: raw.sourcecountry ?? null,
    sourceCategory: isGovernmentDomain(raw.domain) ? "government" : "news",
    isGovernmentSource: isGovernmentDomain(raw.domain),
    discoveryMethod: "gdelt",
    gdeltTone: null,
    storyType: isGovernmentDomain(raw.domain) ? "government-announcement" : "developing-story",
  };
}

export interface GdeltSearchOptions {
  /** GDELT timespan string, e.g. "1d", "3d", "1w". Defaults to "1d". */
  timespan?: string;
  /** Max records to request (GDELT allows up to 250). */
  maxRecords?: number;
}

/**
 * Searches GDELT for articles matching a query. Query syntax supports exact
 * phrases in quotes and boolean OR groups in parentheses, e.g.
 * `("semiconductor" OR "chip export")`. Never throws — on any failure it
 * logs and returns an empty array so one bad query can't break the feed.
 */
export async function searchGdelt(query: string, options: GdeltSearchOptions = {}): Promise<NormalizedArticle[]> {
  await respectRateLimit();

  const params = new URLSearchParams({
    query,
    mode: "artlist",
    format: "json",
    maxrecords: String(options.maxRecords ?? 50),
    sort: "datedesc",
    timespan: options.timespan ?? "1d",
  });
  const url = `${GDELT_ENDPOINT}?${params.toString()}`;

  try {
    const res = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS);
    if (!res.ok) {
      console.error(`GDELT request failed (${res.status}) for query: ${query}`);
      return [];
    }

    const text = await res.text();
    let data: { articles?: RawGdeltArticle[] };
    try {
      data = JSON.parse(text);
    } catch {
      // GDELT occasionally returns an HTML error page with a 200 status.
      console.error(`GDELT returned non-JSON response for query: ${query}`);
      return [];
    }

    return (data.articles ?? [])
      .map(normalizeGdeltArticle)
      .filter((a): a is NormalizedArticle => a !== null);
  } catch (err) {
    console.error(`GDELT search failed for query "${query}":`, err);
    return [];
  }
}
