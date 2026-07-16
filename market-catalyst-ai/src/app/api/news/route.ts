import { NextRequest, NextResponse } from "next/server";
import { fetchLatestHeadlines } from "@/lib/newsProvider";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") ?? undefined;
  const articles = await fetchLatestHeadlines(query);
  return NextResponse.json({ articles });
}
