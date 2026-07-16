import Link from "next/link";
import { historicalEvents } from "@/lib/mockData";

export const metadata = { title: "Historical Events — Market Catalyst AI" };

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-2xl text-paper-100">Historical Event Database</h1>
        <p className="text-sm text-paper-500 mt-1 max-w-2xl">
          A searchable archive of past market-moving events — what happened, which sectors and
          stocks were affected, and the lessons that carried forward.
        </p>
      </div>

      <div className="space-y-3">
        {historicalEvents.map((h) => (
          <Link
            key={h.slug}
            href={`/history/${h.slug}`}
            className="panel p-5 flex flex-col gap-2 hover:border-signal/40 transition-colors block focus-ring"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display font-semibold text-paper-100">{h.name}</h2>
              <span className="text-xs font-mono text-paper-700 shrink-0">{h.dateRange}</span>
            </div>
            <p className="text-sm text-paper-500">{h.summary}</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {h.affectedSectors.map((s) => (
                <span key={s} className="text-xs bg-ink-700 text-paper-300 px-2 py-0.5 rounded capitalize">
                  {s.replace("-", " ")}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
