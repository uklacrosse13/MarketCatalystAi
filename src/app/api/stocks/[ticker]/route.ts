import { NextRequest, NextResponse } from "next/server";
import { fetchQuote } from "@/lib/stockProvider";

export async function GET(req: NextRequest, { params }: { params: { ticker: string } }) {
  const quote = await fetchQuote(params.ticker.toUpperCase());
  return NextResponse.json(quote);
}
