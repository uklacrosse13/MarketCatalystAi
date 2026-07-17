import Link from "next/link";
import type { Sector } from "@/lib/types";
import { cx } from "@/lib/utils";

function heatClass(sentiment: Sector["aiSentiment"], strength: number): string {
  const intensity = strength >= 75 ? "600" : strength >= 55 ? "500" : "400";
  if (sentiment === "bullish") return `bg-rise-soft border-rise/40`;
  if (sentiment === "bearish") return `bg-fall-soft border-fall/40`;
  return `bg-signal-dim/30 border-signal/30`;
}

export default function MarketHeatMap({ sectors }: { sectors: Sector[] }) {
  return (
    <div className="panel p-5">
      <h2 className="font-display font-semibold text-paper-100 mb-4">Sector Heat Map</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {sectors.map((s) => (
          <Link
            key={s.slug}
            href={`/sectors/${s.slug}`}
            className={cx(
              "rounded-lg border p-3 flex flex-col gap-1 hover:scale-[1.02] transition-transform focus-ring",
              heatClass(s.aiSentiment, s.sectorStrength)
            )}
          >
            <span className="text-sm font-medium text-paper-100 leading-tight">{s.name}</span>
            <span className="font-mono text-xs text-paper-300">Strength {s.sectorStrength}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
