import { NextRequest, NextResponse } from "next/server";
import { getAllEvents, getEventsBySector } from "@/lib/news/aggregator";
import { SECTOR_MAPPINGS, getSectorMapping } from "@/data/marketMappings";
import { checkRateLimit, getClientKey } from "@/lib/news/rateLimit";

export async function GET(req: NextRequest) {
  const rateLimit = checkRateLimit(`news-sectors:${getClientKey(req)}`, 60, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded. Please slow down and try again shortly." }, { status: 429 });
  }

  const sectorId = req.nextUrl.searchParams.get("sector");

  try {
    if (sectorId) {
      const sector = getSectorMapping(sectorId);
      if (!sector) {
        return NextResponse.json({ error: `Unknown sector id "${sectorId}".` }, { status: 400 });
      }
      const events = await getEventsBySector(sectorId);
      return NextResponse.json({ sector, events, count: events.length });
    }

    // No sector specified — return a summary of story counts per sector.
    const allEvents = await getAllEvents();
    const summary = SECTOR_MAPPINGS.map((sector) => ({
      id: sector.id,
      label: sector.label,
      eventCount: allEvents.filter(
        (event) => event.marketImpact.primarySector === sector.id || event.marketImpact.relatedSectors.includes(sector.id)
      ).length,
    }));

    return NextResponse.json({ sectors: summary });
  } catch (err) {
    console.error("GET /api/news/sectors failed:", err);
    return NextResponse.json({ events: [], count: 0, error: "Sector feed temporarily unavailable." }, { status: 200 });
  }
}
