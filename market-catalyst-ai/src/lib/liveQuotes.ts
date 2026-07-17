import { unstable_cache } from "next/cache";
import { companies as mockCompanies } from "./mockData";
import { fetchQuote } from "./stockProvider";
import type { Company } from "./types";

// ---------------------------------------------------------------------------
// Every page that displays a price (ticker tape, company pages, homepage
// opportunity/risk lists, sector pages, watchlists) reads through this
// module rather than importing `companies` from mockData.ts directly. It
// overlays live price/changePercent from src/lib/stockProvider.ts (Polygon
// -> Finnhub -> Alpha Vantage) onto the sample company records, per ticker,
// falling back to the original sample price for any ticker whose live fetch
// fails or has no key configured — so the page never shows a blank price,
// it just silently stays on sample data for that one ticker.
//
// Cached for 5 minutes so a burst of page views doesn't multiply API calls;
// this also keeps well within every provider's free-tier rate limit for the
// ~14 tickers this app tracks (see README "Cost notes" / stockProvider.ts).
// ---------------------------------------------------------------------------

const CACHE_SECONDS = 300; // 5 minutes

async function overlayLiveQuote(company: Company): Promise<Company> {
  try {
    const quote = await fetchQuote(company.ticker);
    if (quote.source === "mock") return company; // no key configured / fetch failed — keep sample data

    return {
      ...company,
      price: quote.price,
      changePercent: quote.changePercent,
      // Keep the sparkline's shape but end it on the live price so the
      // chart and the displayed number don't visually disagree.
      sparkline: [...company.sparkline.slice(0, -1), quote.price],
    };
  } catch (err) {
    console.error(`liveQuotes: failed to overlay quote for ${company.ticker} —`, err);
    return company;
  }
}

const getLiveCompaniesCached = unstable_cache(
  async (): Promise<Company[]> => {
    return Promise.all(mockCompanies.map(overlayLiveQuote));
  },
  ["market-catalyst-live-companies"],
  { revalidate: CACHE_SECONDS, tags: ["live-quotes"] }
);

/** All companies, with live prices overlaid where a stock-data key is configured. */
export async function getLiveCompanies(): Promise<Company[]> {
  return getLiveCompaniesCached();
}

export async function getLiveCompany(ticker: string): Promise<Company | undefined> {
  const companies = await getLiveCompanies();
  return companies.find((c) => c.ticker.toLowerCase() === ticker.toLowerCase());
}

export async function getLiveCompaniesInSector(sectorSlug: string): Promise<Company[]> {
  const companies = await getLiveCompanies();
  return companies.filter((c) => c.sectorSlug === sectorSlug);
}
