import Link from "next/link";
import type { Sector } from "@/lib/types";
import ImpactBadge from "./ImpactBadge";

export default function SectorCard({ sector }: { sector: Sector }) {
  return (
    <Link
      href={`/sectors/${sector.slug}`}
      className="panel p-5 flex flex-col gap-3 hover:border-signal/40 transition-colors group focus-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display font-semibold text-paper-100 group-hover:text-signal transition-colors">
          {sector.name}
        </h3>
        <ImpactBadge direction={sector.aiSentiment} size="sm" />
      </div>

      <p className="text-sm text-paper-500 line-clamp-2">{sector.overview}</p>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-ink-600">
        <span className="text-paper-500">
          Strength <span className="font-mono text-paper-100">{sector.sectorStrength}</span>
        </span>
        <span className={sector.historicalReturn1Y >= 0 ? "text-rise font-mono" : "text-fall font-mono"}>
          {sector.historicalReturn1Y >= 0 ? "+" : ""}
          {sector.historicalReturn1Y.toFixed(1)}% 1Y
        </span>
      </div>
    </Link>
  );
}
