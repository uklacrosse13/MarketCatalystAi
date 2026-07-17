import { stableId } from "./hash";
import { analyzeMarketImpact } from "./marketImpact";
import type { EventCard, NormalizedArticle } from "./types";

// ---------------------------------------------------------------------------
// Groups articles covering the same underlying event into a single
// EventCard. Two articles are considered the same story when either:
//   - they share the exact same URL, or
//   - their headlines are similar enough (word-overlap similarity above a
//     threshold) AND they were published within a close time window
//
// This is intentionally simple and inspectable rather than a black box —
// it's a normalized-word-overlap (Jaccard-style) similarity score, not a
// machine-learning model.
// ---------------------------------------------------------------------------

const SIMILARITY_THRESHOLD = 0.45;
const TIME_WINDOW_HOURS = 30;
const STOPWORDS = new Set(["this", "that", "with", "from", "have", "will", "your", "their", "about", "after", "into"]);

function normalizeHeadline(headline: string): string {
  return headline
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function significantWords(headline: string): Set<string> {
  return new Set(
    normalizeHeadline(headline)
      .split(" ")
      .filter((word) => word.length > 3 && !STOPWORDS.has(word))
  );
}

function headlineSimilarity(a: string, b: string): number {
  const wordsA = significantWords(a);
  const wordsB = significantWords(b);
  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersection = 0;
  for (const word of wordsA) if (wordsB.has(word)) intersection += 1;
  const union = wordsA.size + wordsB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function withinTimeWindow(a: string, b: string, hours: number): boolean {
  const diffMs = Math.abs(new Date(a).getTime() - new Date(b).getTime());
  return diffMs <= hours * 60 * 60 * 1000;
}

function belongsToGroup(article: NormalizedArticle, group: NormalizedArticle[]): boolean {
  return group.some((existing) => {
    if (existing.url === article.url) return true;
    const similar = headlineSimilarity(existing.headline, article.headline) >= SIMILARITY_THRESHOLD;
    const closeInTime = withinTimeWindow(existing.publishedAt, article.publishedAt, TIME_WINDOW_HOURS);
    return similar && closeInTime;
  });
}

/** Prefers a government source as the representative headline (most
 * authoritative when available); otherwise uses the earliest report. */
function pickPrimaryArticle(group: NormalizedArticle[]): NormalizedArticle {
  const governmentSource = group.find((article) => article.isGovernmentSource);
  if (governmentSource) return governmentSource;
  return [...group].sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())[0];
}

function buildEventCard(group: NormalizedArticle[]): EventCard {
  const sortedByTime = [...group].sort(
    (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  );
  const primary = pickPrimaryArticle(group);
  const distinctPublishers = new Set(group.map((article) => article.publisher)).size;

  return {
    id: stableId(sortedByTime[0].url + group.length),
    primaryHeadline: primary.headline,
    articles: sortedByTime,
    sourceCount: distinctPublishers,
    earliestPublished: sortedByTime[0].publishedAt,
    latestUpdated: sortedByTime[sortedByTime.length - 1].publishedAt,
    marketImpact: analyzeMarketImpact(primary, distinctPublishers),
  };
}

/** Groups a flat list of articles into deduplicated event cards. */
export function groupIntoEvents(articles: NormalizedArticle[]): EventCard[] {
  const groups: NormalizedArticle[][] = [];

  for (const article of articles) {
    const existingGroup = groups.find((group) => belongsToGroup(article, group));
    if (existingGroup) {
      existingGroup.push(article);
    } else {
      groups.push([article]);
    }
  }

  return groups.map(buildEventCard);
}
