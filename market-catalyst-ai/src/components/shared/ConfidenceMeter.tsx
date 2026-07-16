import { cx } from "@/lib/utils";

export default function ConfidenceMeter({ score, label = "AI Confidence" }: { score: number; label?: string }) {
  const color = score >= 75 ? "bg-rise" : score >= 50 ? "bg-signal" : "bg-fall";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs uppercase tracking-wide text-paper-500">{label}</span>
        <span className="text-xs font-mono font-semibold text-paper-100">{score}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-ink-600 overflow-hidden">
        <div className={cx("h-full rounded-full", color)} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
