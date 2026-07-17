import { NextRequest, NextResponse } from "next/server";
import { getGovernmentEvents } from "@/lib/news/aggregator";
import { checkRateLimit, getClientKey } from "@/lib/news/rateLimit";

export async function GET(req: NextRequest) {
  const rateLimit = checkRateLimit(`news-government:${getClientKey(req)}`, 60, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded. Please slow down and try again shortly." }, { status: 429 });
  }

  try {
    const events = await getGovernmentEvents();
    return NextResponse.json({ events, count: events.length });
  } catch (err) {
    console.error("GET /api/news/government failed:", err);
    return NextResponse.json({ events: [], count: 0, error: "Government feed temporarily unavailable." }, { status: 200 });
  }
}
