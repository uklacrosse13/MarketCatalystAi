import Parser from "rss-parser";
import { stableId } from "./hash";
import { isApprovedFetchUrl, stripHtml } from "./sanitize";
import type { FeedConfig } from "@/config/newsSources";
import type { NormalizedArticle, StoryType } from "./types";

// ---------------------------------------------------------------------------
// Fetches and normalizes a single configured RSS/Atom feed. Designed so one
// broken or slow feed can never break the rest of the site:
//   - a hard timeout aborts slow requests
//   - a single retry handles transient network blips
//   - any error is caught, logged, and results in an empty array, not a throw
// ---------------------------------------------------------------------------

const REQUEST_TIMEOUT_MS = 8000;
const MAX_ITEMS_PER_FEED = 20;

const parser = new Parser({
  timeout: REQUEST_TIMEOUT_MS,
  headers: { "User-Agent": "MarketCatalystAI/1.0 (educational research bot)" },
});

function classifyStoryType(feed: FeedConfig): StoryType {
  if (feed.isGovernment) return "government-announcement";
  if (feed.category === "investor-relations") return "corporate-announcement";
  return "developing-story";
}

function extractImage(item: Parser.Item): string | null {
  const enclosureUrl = (item as { enclosure?: { url?: string } }).enclosure?.url;
  if (enclosureUrl) return enclosureUrl;
  const mediaContent = (item as { mediaContent?: { $?: { url?: string } } }).mediaContent?.$?.url;
  return mediaContent ?? null;
}

function toIso(dateLike: string | undefined): string {
  if (!dateLike) return new Date().toISOString();
  const parsed = new Date(dateLike);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function normalizeItem(item: Parser.Item, feed: FeedConfig): NormalizedArticle | null {
  const url = item.link?.trim();
  const headline = stripHtml(item.title);
  if (!url || !headline) return null;

  return {
    id: stableId(url),
    headline,
    snippet: stripHtml(item.contentSnippet || item.content || item.summary),
    publisher: feed.name,
    publishedAt: toIso(item.isoDate || item.pubDate),
    retrievedAt: new Date().toISOString(),
    url,
    imageUrl: extractImage(item),
    language: null,
    country: null,
    sourceCategory: feed.category,
    isGovernmentSource: feed.isGovernment,
    discoveryMethod: "rss",
    gdeltTone: null,
    storyType: classifyStoryType(feed),
    feedId: feed.id,
  };
}

async function withRetry<T>(fn: () => Promise<T>, retries: number): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise((resolve) => setTimeout(resolve, 500));
    return withRetry(fn, retries - 1);
  }
}

/**
 * Fetches one configured feed and returns normalized articles. Never
 * throws — logs and returns [] on any failure (timeout, network error,
 * malformed XML, disallowed URL) so the rest of the site keeps working.
 */
export async function fetchRssFeed(feed: FeedConfig): Promise<NormalizedArticle[]> {
  if (!feed.enabled) return [];

  if (!isApprovedFetchUrl(feed.url)) {
    console.error(`Blocked fetch to non-approved URL for feed "${feed.id}": ${feed.url}`);
    return [];
  }

  try {
    const result = await withRetry(() => parser.parseURL(feed.url), 1);
    return (result.items ?? [])
      .slice(0, MAX_ITEMS_PER_FEED)
      .map((item) => normalizeItem(item, feed))
      .filter((a): a is NormalizedArticle => a !== null);
  } catch (err) {
    console.error(`RSS fetch failed for feed "${feed.id}" (${feed.url}):`, err);
    return [];
  }
}
