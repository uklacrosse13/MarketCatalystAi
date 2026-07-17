import { unstable_cache } from "next/cache";
import { enabledFeeds } from "@/config/newsSources";
import { fetchRssFeed } from "./rss";
import { searchGdelt } from "./gdelt";
import { groupIntoEvents } from "./dedupe";
import type { EventCard, NormalizedArticle } from "./types";

// ---------------------------------------------------------------------------
// The single entry point every page and API route uses to get news. Fetches
// all enabled RSS feeds and a handful of representative GDELT queries in
// parallel, normalizes and deduplicates everything into EventCards, and
// caches the combined result so repeated page loads within the cache window
// don't re-fetch every source. No cron job is required — the cache simply
// refreshes itself the next time it's read after expiring.
// ---------------------------------------------------------------------------

const CACHE_SECONDS = 600; // 10 minutes
const EXPIRE_AFTER_HOURS = 72; // drop articles older than this from the feed

// A handful of broad, representative GDELT queries rather than one per
// mapped sector — this keeps total request volume reasonable given GDELT's
// rate limiting (see gdelt.ts) while still covering the categories most
// likely to move markets day-to-day. Extend this list as needed.
const GDELT_QUERIES = [
  '("semiconductor" OR "chip export" OR "AI chip" OR "chip tariff")',
  '("Federal Reserve" OR "interest rate decision" OR "inflation report")',
  '("defense spending" OR "Pentagon contract" OR "military aid")',
  '("tariff" OR "trade deal" OR "export controls")',
  '("oil price" OR "OPEC" OR "energy policy" OR "nuclear power")',
  '("cyberattack" OR "data breach" OR "ransomware")',
  '("FDA approval" OR "drug trial" OR "biotech")',
  '("earnings report" OR "guidance raised" OR "guidance cut")',
];

function dedupeByUrl(articles: NormalizedArticle[]): NormalizedArticle[] {
  const seen = new Set<string>();
  const result: NormalizedArticle[] = [];
  for (const article of articles) {
    if (seen.has(article.url)) continue;
    seen.add(article.url);
    result.push(article);
  }
  return result;
}

function dropExpired(articles: NormalizedArticle[]): NormalizedArticle[] {
  const cutoff = Date.now() - EXPIRE_AFTER_HOURS * 60 * 60 * 1000;
  return articles.filter((article) => new Date(article.publishedAt).getTime() >= cutoff);
}

async function collectAllArticles(): Promise<NormalizedArticle[]> {
  const rssSettled = await Promise.allSettled(enabledFeeds().map(fetchRssFeed));
  const rssArticles = rssSettled.flatMap((result) => (result.status === "fulfilled" ? result.value : []));

  const gdeltSettled = await Promise.allSettled(
    GDELT_QUERIES.map((query) => searchGdelt(query, { timespan: "1d", maxRecords: 30 }))
  );
  const gdeltArticles = gdeltSettled.flatMap((result) => (result.status === "fulfilled" ? result.value : []));

  return dropExpired(dedupeByUrl([...rssArticles, ...gdeltArticles]));
}

const getCachedEvents = unstable_cache(
  async (): Promise<EventCard[]> => {
    const articles = await collectAllArticles();
    const events = groupIntoEvents(articles);
    return events.sort((a, b) => new Date(b.latestUpdated).getTime() - new Date(a.latestUpdated).getTime());
  },
  ["market-catalyst-events"],
  { revalidate: CACHE_SECONDS, tags: ["news-events"] }
);

/** Every deduplicated event, newest first. The one function everything else builds on. */
export async function getAllEvents(): Promise<EventCard[]> {
  return getCachedEvents();
}

export async function getEventById(id: string): Promise<EventCard | undefined> {
  const events = await getAllEvents();
  return events.find((event) => event.id === id);
}

export async function getEventsBySector(sectorId: string): Promise<EventCard[]> {
  const events = await getAllEvents();
  return events.filter(
    (event) => event.marketImpact.primarySector === sectorId || event.marketImpact.relatedSectors.includes(sectorId)
  );
}

export async function getGovernmentEvents(): Promise<EventCard[]> {
  const events = await getAllEvents();
  return events.filter((event) => event.articles.some((article) => article.isGovernmentSource));
}

export async function getTrendingEvents(limit = 10): Promise<EventCard[]> {
  const events = await getAllEvents();
  return [...events].sort((a, b) => b.sourceCount - a.sourceCount).slice(0, limit);
}

export async function searchEvents(query: string): Promise<EventCard[]> {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return getAllEvents();

  const events = await getAllEvents();
  return events.filter(
    (event) =>
      event.primaryHeadline.toLowerCase().includes(normalizedQuery) ||
      event.articles.some((article) => article.snippet.toLowerCase().includes(normalizedQuery))
  );
}

export interface EventFilters {
  category?: string; // event type id
  sector?: string; // sector id
  source?: string; // feed id or publisher substring
  direction?: string; // ImpactDirection
  sort?: "newest" | "sourceCount" | "confidence";
}

const CONFIDENCE_RANK = { high: 3, medium: 2, low: 1 } as const;

export async function filterEvents(filters: EventFilters): Promise<EventCard[]> {
  let events = await getAllEvents();

  if (filters.sector) {
    const sector = filters.sector;
    events = events.filter(
      (event) => event.marketImpact.primarySector === sector || event.marketImpact.relatedSectors.includes(sector)
    );
  }

  if (filters.direction) {
    events = events.filter((event) => event.marketImpact.direction === filters.direction);
  }

  if (filters.source) {
    const source = filters.source.toLowerCase();
    events = events.filter((event) => event.articles.some((article) => article.publisher.toLowerCase().includes(source)));
  }

  if (filters.category) {
    const category = filters.category.toLowerCase();
    events = events.filter((event) => event.marketImpact.eventType.toLowerCase().includes(category));
  }

  const sorted = [...events];
  if (filters.sort === "sourceCount") {
    sorted.sort((a, b) => b.sourceCount - a.sourceCount);
  } else if (filters.sort === "confidence") {
    sorted.sort((a, b) => CONFIDENCE_RANK[b.marketImpact.confidenceLevel] - CONFIDENCE_RANK[a.marketImpact.confidenceLevel]);
  } else {
    sorted.sort((a, b) => new Date(b.latestUpdated).getTime() - new Date(a.latestUpdated).getTime());
  }

  return sorted;
}
