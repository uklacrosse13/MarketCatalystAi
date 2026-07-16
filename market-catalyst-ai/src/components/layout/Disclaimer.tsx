export default function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs text-paper-700 italic">
        Research and educational purposes only — not personalized investment advice.
      </p>
    );
  }

  return (
    <div className="panel-tight px-4 py-3 border-signal-dim/40">
      <p className="text-xs leading-relaxed text-paper-500">
        <span className="text-signal-soft font-semibold">Disclaimer: </span>
        This platform is designed for research and educational purposes only. It does not provide
        personalized investment advice or guarantee future investment performance. Users should
        conduct their own due diligence before making investment decisions.
      </p>
    </div>
  );
}
