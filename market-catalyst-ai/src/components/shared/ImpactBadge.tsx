import type { ImpactDirection } from "@/lib/types";
import { directionBgClass, cx } from "@/lib/utils";

const LABELS: Record<ImpactDirection, string> = {
  bullish: "Bullish",
  bearish: "Bearish",
  mixed: "Mixed",
};

export default function ImpactBadge({ direction, size = "md" }: { direction: ImpactDirection; size?: "sm" | "md" }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        directionBgClass(direction),
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      )}
    >
      <span
        className={cx(
          "h-1.5 w-1.5 rounded-full",
          direction === "bullish" ? "bg-rise" : direction === "bearish" ? "bg-fall" : "bg-signal"
        )}
      />
      {LABELS[direction]}
    </span>
  );
}
