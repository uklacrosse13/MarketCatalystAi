import { NextRequest, NextResponse } from "next/server";
import { getTrendingEvents } from "@/lib/news/aggregator";
import { checkRateLimit, getClientKey } from "@/lib/news/rateLimit";

const MAX_LIMIT = 50;

export async function GET(req: NextRequest) {
  const rateLimit = checkRateLimit(`news-trending:${getClientKey(req)}`, 60, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded. Please slow down and try again shortly." }, { status: 429 });
  }

  const limitParam = req.nextUrl.searchParams.get("limit");
  const parsedLimit = limitParam ? Number.parseInt(limitParam, 10) : 10;
  const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), MAX_LIMIT) : 10;

  try {
    const events = await getTrendingEvents(limit);
    return NextResponse.json({ events, count: events.length });
  } catch (err) {
    console.error("GET /api/news/trending failed:", err);
    return NextResponse.json({ events: [], count: 0, error: "Trending feed temporarily unavailable." }, { status: 200 });
  }
}
