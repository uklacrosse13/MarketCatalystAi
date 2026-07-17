import { newsArticles } from "./mockData";
import type { NewsArticle } from "./types";

// ---------------------------------------------------------------------------
// Swap the body of fetchLatestHeadlines() to call your news provider of
// choice. NewsAPI.org is used here as the reference implementation since
// it's the provider named in the project brief. To switch providers (e.g.
// GNews, The Guardian API, or a paid financial-news feed), only this file
// needs to change — every page imports from here, not from NewsAPI directly.
// ---------------------------------------------------------------------------

interface RawNewsApiArticle {
  title: string;
  source: { name: string };
  publishedAt: string;
  description: string | null;
  url: string;
}

export async function fetchLatestHeadlines(query = "markets OR economy OR geopolitics"): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSAPI_API_KEY;

  if (!apiKey) {
    // No key configured — serve the built-in sample dataset so the UI is
    // always populated in local development.
    return newsArticles;
  }

  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) throw new Error(`NewsAPI request failed with status ${res.status}`);

    const data = await res.json();
    const raw: RawNewsApiArticle[] = data.articles ?? [];

    // Raw articles from NewsAPI don't include AI-generated sentiment,
    // affected tickers, or confidence — that enrichment should happen in
    // classifyEventFromHeadline() (src/lib/openai.ts) as part of an
    // ingestion pipeline, then be stored in Supabase. Until that pipeline is
    // wired up, unenriched articles are returned with placeholder analysis
    // fields so the UI still renders correctly.
    return raw.map((a, i) => ({
      id: `live-${i}-${Date.now()}`,
      headline: a.title,
      source: a.source?.name ?? "Unknown",
      publishedAt: a.publishedAt,
      summary: a.description ?? "",
      sentiment: "mixed" as const,
      affectedIndustries: [],
      affectedTickers: [],
      shortTermImpact: "Not yet analyzed — connect the AI Event Engine to populate this field.",
      longTermImpact: "Not yet analyzed — connect the AI Event Engine to populate this field.",
      confidence: 0,
      historicalComparison: "",
      investmentThesis: "",
    }));
  } catch (err) {
    console.error("newsProvider: falling back to mock data —", err);
    return newsArticles;
  }
}
