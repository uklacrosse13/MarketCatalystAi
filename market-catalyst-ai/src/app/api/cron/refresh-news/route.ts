import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// ---------------------------------------------------------------------------
// OPTIONAL. The site works correctly without this: the news cache
// (src/lib/news/aggregator.ts) refreshes itself automatically the next time
// it's read after its 10-minute window expires — no cron required.
//
// This endpoint just lets you proactively warm the cache on a schedule
// (see vercel.json) so the very first visitor after a refresh doesn't have
// to wait for a live fetch. If you don't configure Vercel Cron, this route
// simply never gets called and nothing breaks.
//
// Protected by CRON_SECRET so it can't be triggered by random requests. If
// CRON_SECRET isn't set, the endpoint refuses all requests rather than
// running unauthenticated.
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET is not configured." }, { status: 503 });
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    revalidateTag("news-events");
    return NextResponse.json({ ok: true, revalidated: "news-events", at: new Date().toISOString() });
  } catch (err) {
    console.error("Cron refresh failed:", err);
    return NextResponse.json({ error: "Revalidation failed." }, { status: 500 });
  }
}
