import { watchlists } from "@/lib/mockData";
import WatchlistManager from "@/components/watchlists/WatchlistManager";

export const metadata = { title: "Watchlists — Market Catalyst AI" };

export default function WatchlistsPage() {
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
      <WatchlistManager initial={watchlists} />
    </div>
  );
}
