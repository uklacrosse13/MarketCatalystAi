export default function SentimentGauge({ bullishPct }: { bullishPct: number }) {
  const bearishPct = 100 - bullishPct;

  return (
    <div className="panel p-5">
      <h2 className="font-display font-semibold text-paper-100 mb-4">Market Sentiment</h2>
      <div className="flex h-3 w-full rounded-full overflow-hidden border border-ink-600">
        <div className="bg-rise" style={{ width: `${bullishPct}%` }} />
        <div className="bg-fall" style={{ width: `${bearishPct}%` }} />
      </div>
      <div className="flex items-center justify-between mt-2 text-xs font-mono">
        <span className="text-rise">{bullishPct}% Bullish</span>
        <span className="text-fall">{bearishPct}% Bearish</span>
      </div>
      <p className="text-xs text-paper-700 mt-3">
        Based on AI sentiment classification across today's tracked events and news articles.
      </p>
    </div>
  );
}
