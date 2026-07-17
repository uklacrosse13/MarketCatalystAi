import { getCompany } from "./mockData";

// ---------------------------------------------------------------------------
// Provider priority: Polygon.io -> Finnhub -> Alpha Vantage -> mock data.
// Each provider function is isolated so you can delete the ones you don't
// need. All three real providers require their own API key (see .env.example).
// ---------------------------------------------------------------------------

export interface QuoteResult {
  ticker: string;
  price: number;
  changePercent: number;
  source: "polygon" | "finnhub" | "alphavantage" | "mock";
}

async function fetchFromPolygon(ticker: string): Promise<QuoteResult | null> {
  const apiKey = process.env.POLYGON_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${apiKey}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const result = data.results?.[0];
    if (!result) return null;

    const changePercent = ((result.c - result.o) / result.o) * 100;
    return { ticker, price: result.c, changePercent, source: "polygon" };
  } catch (err) {
    console.error("Polygon fetch failed:", err);
    return null;
  }
}

async function fetchFromFinnhub(ticker: string): Promise<QuoteResult | null> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.c) return null;

    return { ticker, price: data.c, changePercent: data.dp, source: "finnhub" };
  } catch (err) {
    console.error("Finnhub fetch failed:", err);
    return null;
  }
}

async function fetchFromAlphaVantage(ticker: string): Promise<QuoteResult | null> {
  const apiKey = process.env.ALPHAVANTAGE_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const quote = data["Global Quote"];
    if (!quote || !quote["05. price"]) return null;

    return {
      ticker,
      price: parseFloat(quote["05. price"]),
      changePercent: parseFloat((quote["10. change percent"] ?? "0").replace("%", "")),
      source: "alphavantage",
    };
  } catch (err) {
    console.error("Alpha Vantage fetch failed:", err);
    return null;
  }
}

/**
 * Fetches a live quote, trying Polygon, then Finnhub, then Alpha Vantage,
 * then falling back to the built-in mock dataset so pages never break.
 */
export async function fetchQuote(ticker: string): Promise<QuoteResult> {
  const providers = [fetchFromPolygon, fetchFromFinnhub, fetchFromAlphaVantage];

  for (const provider of providers) {
    const result = await provider(ticker);
    if (result) return result;
  }

  const mock = getCompany(ticker);
  return {
    ticker,
    price: mock?.price ?? 0,
    changePercent: mock?.changePercent ?? 0,
    source: "mock",
  };
}
