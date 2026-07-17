import { NextRequest, NextResponse } from "next/server";
import { filterEvents } from "@/lib/news/aggregator";
import { checkRateLimit, getClientKey } from "@/lib/news/rateLimit";

export const revalidate = 0; // this route reads from the aggregator's own cache

export async function GET(req: NextRequest) {
  const rateLimit = checkRateLimit(`news:${getClientKey(req)}`, 60, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded. Please slow down and try again shortly." }, { status: 429 });
  }

  const params = req.nextUrl.searchParams;
  const sort = params.get("sort");
  const allowedSorts = new Set(["newest", "sourceCount", "confidence"]);

  try {
    const events = await filterEvents({
      category: params.get("category") ?? undefined,
      sector: params.get("sector") ?? undefined,
      source: params.get("source") ?? undefined,
      direction: params.get("direction") ?? undefined,
      sort: sort && allowedSorts.has(sort) ? (sort as "newest" | "sourceCount" | "confidence") : "newest",
    });

    return NextResponse.json({ events, count: events.length });
  } catch (err) {
    console.error("GET /api/news failed:", err);
    // Empty state rather than a hard failure — one broken upstream source
    // should never take the whole feed down.
    return NextResponse.json({ events: [], count: 0, error: "News feed temporarily unavailable." }, { status: 200 });
  }
}
