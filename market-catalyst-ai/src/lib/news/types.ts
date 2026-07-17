export type StoryType =
  | "confirmed-event"
  | "developing-story"
  | "opinion-analysis"
  | "press-release"
  | "government-announcement"
  | "corporate-announcement";

export type ImpactDirection = "positive" | "negative" | "mixed" | "uncertain";
export type TimeHorizon = "short-term" | "medium-term" | "long-term";
export type ConfidenceLevel = "high" | "medium" | "low";
export type DiscoveryMethod = "gdelt" | "rss";
export type SourceCategory = "news" | "government" | "investor-relations";

export interface NormalizedArticle {
  /** Stable id derived from the article URL. */
  id: string;
  headline: string;
  /** Short snippet/description as supplied by the source — never the full body. */
  snippet: string;
  publisher: string;
  publishedAt: string; // ISO 8601
  retrievedAt: string; // ISO 8601 — when Market Catalyst AI fetched it
  url: string;
  imageUrl: string | null;
  language: string | null;
  country: string | null;
  sourceCategory: SourceCategory;
  isGovernmentSource: boolean;
  discoveryMethod: DiscoveryMethod;
  /**
   * GDELT's per-article tone score. Always null: the GDELT DOC 2.0 API's
   * ArtList/JSON mode (what this app uses to fetch article lists) does not
   * return a per-article tone field — tone is only available in aggregate
   * timeline modes. This field is kept in the type, and surfaced as
   * "not available" in the UI, rather than approximated or fabricated.
   */
  gdeltTone: number | null;
  storyType: StoryType;
  /** Which configured feed this came from, if discovered via RSS. */
  feedId?: string;
}

export interface CompanyMatch {
  ticker: string;
  /** How this ticker was associated with the article. */
  matchedBy: "explicit-mention" | "sector-mapping";
}

export interface MarketImpactAnalysis {
  eventType: string;
  primarySector: string | null;
  relatedSectors: string[];
  /** "Companies to research" — not a recommendation. */
  companies: CompanyMatch[];
  etfs: string[];
  direction: ImpactDirection;
  timeHorizon: TimeHorizon;
  reasoning: string;
  confidenceLevel: ConfidenceLevel;
  confidenceReasons: string[];
}

export interface EventCard {
  /** Stable id derived from the grouped articles. */
  id: string;
  primaryHeadline: string;
  articles: NormalizedArticle[];
  sourceCount: number;
  earliestPublished: string;
  latestUpdated: string;
  marketImpact: MarketImpactAnalysis;
}
