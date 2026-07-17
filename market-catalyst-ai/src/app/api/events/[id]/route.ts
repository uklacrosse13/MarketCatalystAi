import { NextRequest, NextResponse } from "next/server";
import { getEventById } from "@/lib/news/aggregator";
import { checkRateLimit, getClientKey } from "@/lib/news/rateLimit";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const rateLimit = checkRateLimit(`event-detail:${getClientKey(req)}`, 60, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded. Please slow down and try again shortly." }, { status: 429 });
  }

  if (!params.id) {
    return NextResponse.json({ error: "Event id is required." }, { status: 400 });
  }

  try {
    const event = await getEventById(params.id);
    if (!event) {
      return NextResponse.json({ error: "Event not found. It may have expired from the cache." }, { status: 404 });
    }
    return NextResponse.json({ event });
  } catch (err) {
    console.error(`GET /api/events/${params.id} failed:`, err);
    return NextResponse.json({ error: "Event lookup temporarily unavailable." }, { status: 200 });
  }
}
