import type { MarketEvent } from "@/lib/types";
import ImpactBadge from "./ImpactBadge";
import ConfidenceMeter from "./ConfidenceMeter";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";

export default function EventCard({ event }: { event: MarketEvent }) {
  return (
    <article className="panel p-5 space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-paper-500">
        <span className="px-2 py-0.5 rounded-full bg-wire-soft text-wire border border-wire/30 font-medium">
          {event.category}
        </span>
        <span>·</span>
        <span>{event.subcategory}</span>
        <span>·</span>
        <span>{event.source}</span>
        <span>·</span>
        <span>{timeAgo(event.publishedAt)}</span>
      </div>

      <h3 className="font-display font-semibold text-lg text-paper-100 leading-snug">{event.headline}</h3>
      <p className="text-sm text-paper-300">{event.summary}</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-rise mb-2">Potential Winners</p>
          <ul className="space-y-1.5">
            {event.potentialWinners.map((w) => (
              <li key={w.ticker} className="text-sm">
                <Link href={`/companies/${w.ticker}`} className="font-mono font-semibold text-paper-100 hover:text-signal">
                  {w.ticker}
                </Link>{" "}
                <span className="text-paper-500">— {w.rationale}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-fall mb-2">Potential Losers</p>
          {event.potentialLosers.length === 0 ? (
            <p className="text-sm text-paper-700 italic">No significant negative exposure identified.</p>
          ) : (
            <ul className="space-y-1.5">
              {event.potentialLosers.map((l) => (
                <li key={l.ticker} className="text-sm">
                  <Link href={`/companies/${l.ticker}`} className="font-mono font-semibold text-paper-100 hover:text-signal">
                    {l.ticker}
                  </Link>{" "}
                  <span className="text-paper-500">— {l.rationale}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <details className="group">
        <summary className="cursor-pointer text-sm text-wire hover:text-wire/80 list-none flex items-center gap-1 focus-ring rounded">
          AI reasoning
          <span className="transition-transform group-open:rotate-90">›</span>
        </summary>
        <ul className="mt-2 space-y-1.5 text-sm text-paper-500 list-disc list-inside">
          {event.reasoning.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </details>

      <div className="flex items-center justify-between gap-4 pt-3 border-t border-ink-600">
        <div className="w-40">
          <ConfidenceMeter score={event.confidence} />
        </div>
        <span className="text-xs text-paper-500">
          Time horizon: <span className="text-paper-100 font-medium">{event.timeHorizon}</span>
        </span>
      </div>
    </article>
  );
}
