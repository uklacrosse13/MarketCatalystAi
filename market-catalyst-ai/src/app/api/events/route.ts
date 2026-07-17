import { NextRequest, NextResponse } from "next/server";
import { getAllEvents } from "@/lib/news/aggregator";
import { checkRateLimit, getClientKey } from "@/lib/news/rateLimit";

export async function GET(req: NextRequest) {
  const rateLimit = checkRateLimit(`events:${getClientKey(req)}`, 60, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded. Please slow down and try again shortly." }, { status: 429 });
  }

  try {
    const events = await getAllEvents();
    return NextResponse.json({ events, count: events.length });
  } catch (err) {
    console.error("GET /api/events failed:", err);
    return NextResponse.json({ events: [], count: 0, error: "Events feed temporarily unavailable." }, { status: 200 });
  }
}
