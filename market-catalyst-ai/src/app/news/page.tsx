import { getAllEvents } from "@/lib/news/aggregator";
import NewsExplorer from "@/components/news/NewsExplorer";
import Disclaimer from "@/components/layout/Disclaimer";

export const metadata = { title: "News Analysis — Market Catalyst AI" };
export const revalidate = 600; // matches the aggregator's own cache window

export default async function NewsPage() {
  const events = await getAllEvents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-2xl text-paper-100">News Analysis</h1>
        <p className="text-sm text-paper-500 mt-1 max-w-2xl">
          Pulled from GDELT and approved government/public RSS feeds (see the centralized list in{" "}
          <code className="text-paper-300">src/config/newsSources.ts</code>), then run through a
          transparent, rules-based engine — no paid AI model required. Every story links back to its
          original publisher.
        </p>
      </div>

      {events.length === 0 && (
        <div className="panel p-6">
          <p className="text-paper-300">
            No live stories are cached yet. This can happen right after a fresh deploy, or if outbound
            network access to news sources is unavailable in this environment.
          </p>
        </div>
      )}

      <NewsExplorer initialEvents={events} />
      <Disclaimer />
    </div>
  );
}
