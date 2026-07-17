import Link from "next/link";
import type { EventCard } from "@/lib/news/types";
import { DirectionBadge, ConfidenceBadge } from "@/components/news/Badges";
import { timeAgo } from "@/lib/utils";

export default function EventSummaryCard({ event }: { event: EventCard }) {
  const { marketImpact } = event;

  return (
    <Link
      href={`/news/${event.id}`}
      className="panel p-5 flex flex-col gap-3 hover:border-signal/40 transition-colors block focus-ring"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs text-paper-700">
        <span className="px-2 py-0.5 rounded-full bg-wire-soft text-wire border border-wire/30 font-medium">
          {marketImpact.eventType}
        </span>
        <span>·</span>
        <span>
          {event.sourceCount} source{event.sourceCount !== 1 ? "s" : ""}
        </span>
        <span>·</span>
        <span>{timeAgo(event.latestUpdated)}</span>
      </div>

      <h3 className="font-display font-semibold text-paper-100 leading-snug">{event.primaryHeadline}</h3>

      {marketImpact.primarySector && (
        <p className="text-sm text-paper-500">
          Primary sector: <span className="text-paper-100">{marketImpact.primarySector.replace(/-/g, " ")}</span>
          {marketImpact.companies.length > 0 && (
            <>
              {" "}
              · Companies to research:{" "}
              <span className="font-mono text-paper-100">
                {marketImpact.companies.slice(0, 4).map((c) => c.ticker).join(", ")}
              </span>
            </>
          )}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <DirectionBadge direction={marketImpact.direction} size="sm" />
        <ConfidenceBadge level={marketImpact.confidenceLevel} size="sm" />
      </div>
    </Link>
  );
}
