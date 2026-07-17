import { getLiveCompanies } from "@/lib/liveQuotes";
import { formatPrice, formatPercent, cx } from "@/lib/utils";

export default async function TickerTape() {
  const companies = await getLiveCompanies();
  const items = [...companies, ...companies]; // duplicated for seamless loop

  return (
    <div className="w-full overflow-hidden border-b border-ink-600 bg-ink-950 text-xs">
      <div className="flex w-max animate-marquee py-1.5">
        {items.map((c, i) => (
          <div key={`${c.ticker}-${i}`} className="flex items-center gap-2 px-4 border-r border-ink-700 font-mono whitespace-nowrap">
            <span className="text-paper-300 font-semibold">{c.ticker}</span>
            <span className="text-paper-500">{formatPrice(c.price)}</span>
            <span className={cx(c.changePercent >= 0 ? "text-rise" : "text-fall")}>
              {formatPercent(c.changePercent)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
