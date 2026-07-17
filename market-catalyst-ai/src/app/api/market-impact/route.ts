import { NextRequest, NextResponse } from "next/server";
import { analyzeMarketImpact } from "@/lib/news/marketImpact";
import { checkRateLimit, getClientKey } from "@/lib/news/rateLimit";
import { stableId } from "@/lib/news/hash";
import type { NormalizedArticle } from "@/lib/news/types";

const MAX_TEXT_LENGTH = 2000;

/**
 * Runs the rules-based market-impact engine on an arbitrary headline/snippet
 * without needing it to come from a real fetched article — useful for
 * testing the engine, or for any future integration that wants an on-demand
 * analysis. No AI model is called; this exercises the same deterministic
 * keyword/mapping logic used across the rest of the site.
 */
export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`market-impact:${getClientKey(req)}`, 20, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded. Please slow down and try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const { headline, snippet } = (body ?? {}) as { headline?: string; snippet?: string };

  if (!headline || typeof headline !== "string" || !headline.trim()) {
    return NextResponse.json({ error: "'headline' is required and must be a non-empty string." }, { status: 400 });
  }
  if (headline.length > MAX_TEXT_LENGTH || (snippet && snippet.length > MAX_TEXT_LENGTH)) {
    return NextResponse.json({ error: `Fields must be under ${MAX_TEXT_LENGTH} characters.` }, { status: 400 });
  }

  const pseudoArticle: NormalizedArticle = {
    id: stableId(headline),
    headline,
    snippet: snippet ?? "",
    publisher: "On-demand analysis (not a fetched article)",
    publishedAt: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    url: "",
    imageUrl: null,
    language: null,
    country: null,
    sourceCategory: "news",
    isGovernmentSource: false,
    discoveryMethod: "rss",
    gdeltTone: null,
    storyType: "developing-story",
  };

  try {
    const marketImpact = analyzeMarketImpact(pseudoArticle, 1);
    return NextResponse.json({ marketImpact });
  } catch (err) {
    console.error("POST /api/market-impact failed:", err);
    return NextResponse.json({ error: "Analysis failed." }, { status: 500 });
  }
}
