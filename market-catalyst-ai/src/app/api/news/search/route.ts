import { NextRequest, NextResponse } from "next/server";
import { searchEvents } from "@/lib/news/aggregator";
import { checkRateLimit, getClientKey } from "@/lib/news/rateLimit";

const MAX_QUERY_LENGTH = 200;

export async function GET(req: NextRequest) {
  const rateLimit = checkRateLimit(`news-search:${getClientKey(req)}`, 30, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded. Please slow down and try again shortly." }, { status: 429 });
  }

  const query = req.nextUrl.searchParams.get("q");
  if (!query || !query.trim()) {
    return NextResponse.json({ error: "Query parameter 'q' is required." }, { status: 400 });
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json({ error: `Query is too long (max ${MAX_QUERY_LENGTH} characters).` }, { status: 400 });
  }

  try {
    const events = await searchEvents(query);
    return NextResponse.json({ events, count: events.length, query });
  } catch (err) {
    console.error("GET /api/news/search failed:", err);
    return NextResponse.json({ events: [], count: 0, error: "Search temporarily unavailable." }, { status: 200 });
  }
}
