import type { ConfidenceLevel } from "./types";

// ---------------------------------------------------------------------------
// Transparent confidence scoring. Every point awarded has a named, visible
// reason attached (`confidenceReasons`) — nothing here is a hidden or fake
// precise percentage. The scale is deliberately coarse (High/Medium/Low)
// because the underlying signal (keyword and source-count heuristics) does
// not support meaningfully precise numeric confidence.
// ---------------------------------------------------------------------------

export interface ConfidenceInputs {
  /** Number of distinct publishers reporting the same event. */
  sourceCount: number;
  isGovernmentSource: boolean;
  hasExplicitCompanyMention: boolean;
  /** How many of the matched sector's keywords appeared in the text. */
  sectorKeywordHits: number;
  ageHours: number;
  eventTypeMatched: boolean;
}

export interface ConfidenceResult {
  level: ConfidenceLevel;
  reasons: string[];
  /** Raw point total, exposed for debugging/transparency — not shown to users as a percentage. */
  points: number;
}

export function scoreConfidence(inputs: ConfidenceInputs): ConfidenceResult {
  let points = 0;
  const reasons: string[] = [];

  if (inputs.sourceCount >= 3) {
    points += 2;
    reasons.push(`Reported by ${inputs.sourceCount} independent sources.`);
  } else if (inputs.sourceCount === 2) {
    points += 1;
    reasons.push("Reported by 2 sources.");
  } else {
    reasons.push("Reported by a single source so far.");
  }

  if (inputs.isGovernmentSource) {
    points += 2;
    reasons.push("Confirmed by an official government source.");
  }

  if (inputs.hasExplicitCompanyMention) {
    points += 1;
    reasons.push("A specific company ticker is named directly in the coverage.");
  } else {
    reasons.push("No specific company is named directly — sector association is inferred from keyword matching.");
  }

  if (inputs.sectorKeywordHits >= 3) {
    points += 1;
    reasons.push("Strong keyword match to the identified sector.");
  } else if (inputs.sectorKeywordHits === 0) {
    reasons.push("No direct sector keyword match was found.");
  }

  if (inputs.ageHours <= 6) {
    points += 1;
    reasons.push("Published within the last 6 hours.");
  } else if (inputs.ageHours > 72) {
    reasons.push("Published more than 3 days ago — relevance may have faded or already be reflected in prices.");
  }

  if (inputs.eventTypeMatched) {
    points += 1;
  } else {
    reasons.push("Event type could not be classified with confidence and defaulted to general news.");
  }

  const level: ConfidenceLevel = points >= 5 ? "high" : points >= 3 ? "medium" : "low";

  return { level, reasons, points };
}
