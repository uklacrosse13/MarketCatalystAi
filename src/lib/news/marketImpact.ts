import { SECTOR_MAPPINGS, type SectorMapping } from "@/data/marketMappings";
import { EVENT_TYPES, POSITIVE_CATALYST_PHRASES, NEGATIVE_CATALYST_PHRASES } from "./eventKeywords";
import { scoreConfidence } from "./confidence";
import type { CompanyMatch, ImpactDirection, MarketImpactAnalysis, NormalizedArticle, TimeHorizon } from "./types";

// ---------------------------------------------------------------------------
// The transparent, rules-based analysis engine described in the project
// brief. No AI model is used or required — every step below is a documented
// keyword/mapping lookup that can be inspected, edited, and reasoned about.
//
// Pipeline: sector keyword matching -> event-type classification ->
// positive/negative catalyst phrase matching -> ticker matching -> time
// horizon heuristic -> confidence scoring (see confidence.ts).
// ---------------------------------------------------------------------------

function textOf(article: NormalizedArticle): string {
  return `${article.headline} ${article.snippet}`.toLowerCase();
}

function matchSectors(text: string): { sector: SectorMapping; hits: number }[] {
  return SECTOR_MAPPINGS.map((sector) => ({
    sector,
    hits: sector.keywords.filter((keyword) => text.includes(keyword)).length,
  }))
    .filter((match) => match.hits > 0)
    .sort((a, b) => b.hits - a.hits);
}

function matchEventType(text: string) {
  for (const type of EVENT_TYPES) {
    if (type.keywords.length > 0 && type.keywords.some((keyword) => text.includes(keyword))) {
      return type;
    }
  }
  return EVENT_TYPES[EVENT_TYPES.length - 1]; // "general-news" fallback
}

function matchDirection(text: string): { direction: ImpactDirection; positiveHits: number; negativeHits: number } {
  const positiveHits = POSITIVE_CATALYST_PHRASES.filter((phrase) => text.includes(phrase)).length;
  const negativeHits = NEGATIVE_CATALYST_PHRASES.filter((phrase) => text.includes(phrase)).length;

  if (positiveHits > 0 && negativeHits === 0) return { direction: "positive", positiveHits, negativeHits };
  if (negativeHits > 0 && positiveHits === 0) return { direction: "negative", positiveHits, negativeHits };
  if (positiveHits > 0 && negativeHits > 0) return { direction: "mixed", positiveHits, negativeHits };
  return { direction: "uncertain", positiveHits, negativeHits };
}

function matchCompanies(text: string, sectorTickers: string[]): CompanyMatch[] {
  const upperText = text.toUpperCase();
  const allKnownTickers = new Set(SECTOR_MAPPINGS.flatMap((sector) => sector.tickers));

  const explicit: CompanyMatch[] = [];
  for (const ticker of allKnownTickers) {
    const pattern = new RegExp(`\\b${ticker}\\b`);
    if (pattern.test(upperText)) explicit.push({ ticker, matchedBy: "explicit-mention" });
  }

  const explicitSet = new Set(explicit.map((match) => match.ticker));
  const fromSector: CompanyMatch[] = sectorTickers
    .filter((ticker) => !explicitSet.has(ticker))
    .map((ticker) => ({ ticker, matchedBy: "sector-mapping" as const }));

  return [...explicit, ...fromSector].slice(0, 8);
}

const SHORT_TERM_EVENTS = new Set(["corporate-earnings", "cybersecurity-incident", "natural-disaster"]);
const LONG_TERM_EVENTS = new Set(["government-spending", "trade-policy", "monetary-policy"]);

function estimateTimeHorizon(eventTypeId: string): TimeHorizon {
  if (SHORT_TERM_EVENTS.has(eventTypeId)) return "short-term";
  if (LONG_TERM_EVENTS.has(eventTypeId)) return "long-term";
  return "medium-term";
}

function hoursSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60);
}

function buildReasoning(params: {
  eventTypeLabel: string;
  primarySector: SectorMapping | null;
  direction: ImpactDirection;
}): string {
  const { eventTypeLabel, primarySector, direction } = params;

  if (!primarySector) {
    return `This story was classified as "${eventTypeLabel}" but did not match a specific tracked sector closely enough to identify related companies or funds. Treat this as a general news item rather than a sector-specific signal.`;
  }

  const directionPhrase: Record<ImpactDirection, string> = {
    positive: "could see increased attention or demand as a result",
    negative: "could face headwinds as a result",
    mixed: "could see mixed effects, with both supportive and adverse elements present in this story",
    uncertain: "may be relevant, though this story does not contain clear directional language",
  };

  return `Classified as "${eventTypeLabel}" and matched to the ${primarySector.label} sector based on keyword overlap. Companies and funds tied to ${primarySector.label} ${directionPhrase[direction]}. This is a mechanical keyword association, not a prediction — always read the original sources linked below before drawing conclusions.`;
}

/**
 * Runs the full rules-based analysis on a single article (used as the
 * representative "primary" article for a deduplicated event card).
 * `relatedSourceCount` should be the number of distinct publishers covering
 * the same underlying event, from src/lib/news/dedupe.ts.
 */
export function analyzeMarketImpact(article: NormalizedArticle, relatedSourceCount = 1): MarketImpactAnalysis {
  const text = textOf(article);
  const sectorMatches = matchSectors(text);
  const eventType = matchEventType(text);
  const { direction } = matchDirection(text);

  const primarySector = sectorMatches[0]?.sector ?? null;
  const relatedSectors = sectorMatches.slice(1, 4).map((match) => match.sector.id);
  const companies = matchCompanies(text, primarySector?.tickers ?? []);
  const etfs = primarySector?.etfs ?? [];
  const timeHorizon = estimateTimeHorizon(eventType.id);

  const confidence = scoreConfidence({
    sourceCount: relatedSourceCount,
    isGovernmentSource: article.isGovernmentSource,
    hasExplicitCompanyMention: companies.some((match) => match.matchedBy === "explicit-mention"),
    sectorKeywordHits: sectorMatches[0]?.hits ?? 0,
    ageHours: hoursSince(article.publishedAt),
    eventTypeMatched: eventType.id !== "general-news",
  });

  return {
    eventType: eventType.label,
    primarySector: primarySector?.id ?? null,
    relatedSectors,
    companies,
    etfs,
    direction,
    timeHorizon,
    reasoning: buildReasoning({ eventTypeLabel: eventType.label, primarySector, direction }),
    confidenceLevel: confidence.level,
    confidenceReasons: confidence.reasons,
  };
}
