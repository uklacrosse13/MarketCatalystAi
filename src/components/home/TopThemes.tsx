import type { MarketEvent, ImpactDirection } from "@/lib/types";
import Link from "next/link";
import ImpactBadge from "../shared/ImpactBadge";

function overallSentiment(e: MarketEvent): ImpactDirection {
  if (e.potentialWinners.length === 0 && e.potentialLosers.length === 0) return "mixed";
  if (e.potentialLosers.length > e.potentialWinners.length) return "bearish";
  if (e.potentialWinners.length > e.potentialLosers.length) return "bullish";
  return "mixed";
}

export default function TopThemes({ events }: { events: MarketEvent[] }) {
  return (
    <div className="panel p-5">
      <h2 className="font-display font-semibold text-paper-100 mb-4">Today's Top Market Themes</h2>
      <ol className="space-y-3">
        {events.slice(0, 5).map((e, i) => {
          const overall = overallSentiment(e);
          return (
            <li key={e.id}>
              <Link href={`/news`} className="flex items-start gap-3 group focus-ring rounded">
                <span className="font-mono text-paper-700 text-sm pt-0.5 w-5 shrink-0">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-paper-100 group-hover:text-signal transition-colors leading-snug">
                    {e.headline}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-paper-700">{e.category}</span>
                    <ImpactBadge direction={overall} size="sm" />
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
