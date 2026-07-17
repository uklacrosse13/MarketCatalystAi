import { notFound } from "next/navigation";
import Link from "next/link";
import { getHistoricalEvent, historicalEvents } from "@/lib/mockData";

export function generateStaticParams() {
  return historicalEvents.map((h) => ({ slug: h.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const h = getHistoricalEvent(params.slug);
  return { title: h ? `${h.name} — Market Catalyst AI` : "Historical Event — Market Catalyst AI" };
}

export default function HistoricalEventPage({ params }: { params: { slug: string } }) {
  const h = getHistoricalEvent(params.slug);
  if (!h) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/history" className="text-sm text-wire hover:text-wire/80">
        ← Historical events
      </Link>

      <div>
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-display font-semibold text-2xl text-paper-100">{h.name}</h1>
          <span className="text-xs font-mono text-paper-700 shrink-0">{h.dateRange}</span>
        </div>
        <p className="text-paper-300 mt-3">{h.summary}</p>
      </div>

      <div className="panel p-5">
        <h2 className="font-display font-semibold text-paper-100 mb-4">Timeline</h2>
        <ol className="relative border-l border-ink-600 pl-4 space-y-4">
          {h.timeline.map((t, i) => (
            <li key={i}>
              <span className="absolute -left-[5px] mt-1.5 h-2 w-2 rounded-full bg-signal" />
              <p className="text-xs text-paper-700 font-mono">{t.date}</p>
              <p className="text-sm text-paper-100">{t.label}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="panel-tight p-4">
          <p className="text-xs uppercase tracking-wide text-rise mb-2">Winning Stocks</p>
          <ul className="space-y-1.5 text-sm">
            {h.winners.length === 0 ? (
              <li className="text-paper-700 italic">None identified.</li>
            ) : (
              h.winners.map((w) => (
                <li key={w.ticker}>
                  <Link href={`/companies/${w.ticker}`} className="font-mono font-semibold text-paper-100 hover:text-signal">
                    {w.ticker}
                  </Link>{" "}
                  <span className="text-paper-500">— {w.rationale}</span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="panel-tight p-4">
          <p className="text-xs uppercase tracking-wide text-fall mb-2">Losing Stocks</p>
          <ul className="space-y-1.5 text-sm">
            {h.losers.length === 0 ? (
              <li className="text-paper-700 italic">None identified.</li>
            ) : (
              h.losers.map((l) => (
                <li key={l.ticker}>
                  <Link href={`/companies/${l.ticker}`} className="font-mono font-semibold text-paper-100 hover:text-signal">
                    {l.ticker}
                  </Link>{" "}
                  <span className="text-paper-500">— {l.rationale}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="panel p-5">
        <h2 className="font-display font-semibold text-paper-100 mb-3">Lessons Learned</h2>
        <ul className="space-y-2 text-sm text-paper-300 list-disc list-inside">
          {h.lessonsLearned.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
