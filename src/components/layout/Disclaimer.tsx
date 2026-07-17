export default function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs text-paper-700 italic">
        Educational research tool — not personalized investment advice.
      </p>
    );
  }

  return (
    <div className="panel-tight px-4 py-3 border-signal-dim/40">
      <p className="text-xs leading-relaxed text-paper-500">
        <span className="text-signal-soft font-semibold">Market Catalyst AI</span> is an educational
        research tool and does not provide personalized investment advice. Companies, sectors, and
        funds are identified through news-based keyword and event matching. A company&apos;s appearance
        does not mean its stock will rise or fall. News may be incomplete, inaccurate, delayed, or
        already reflected in market prices. Always review the original sources and conduct independent
        research before making investment decisions.
      </p>
    </div>
  );
}
