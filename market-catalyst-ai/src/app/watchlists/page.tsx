import { watchlists } from "@/lib/mockData";
import { getLiveCompanies } from "@/lib/liveQuotes";
import WatchlistManager from "@/components/watchlists/WatchlistManager";

export const metadata = { title: "Watchlists — Market Catalyst AI" };
export const revalidate = 300; // matches the live-quotes cache window

export default async function WatchlistsPage() {
  const companies = await getLiveCompanies();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-2xl text-paper-100">AI Watchlists</h1>
        <p className="text-sm text-paper-500 mt-1 max-w-2xl">
          Build themed watchlists — AI, Defense, Healthcare, Dividend Stocks, Energy, and more.
          Changes here are local to this session; connect Supabase (see README) to persist
          watchlists per signed-in user.
        </p>
      </div>
      <WatchlistManager initial={watchlists} companies={companies} />
    </div>
  );
}
