import type { ImpactDirection, ConfidenceLevel, StoryType } from "@/lib/news/types";
import { cx } from "@/lib/utils";

const DIRECTION_LABELS: Record<ImpactDirection, string> = {
  positive: "Potentially Positive",
  negative: "Potentially Negative",
  mixed: "Mixed",
  uncertain: "Uncertain",
};

const DIRECTION_CLASSES: Record<ImpactDirection, string> = {
  positive: "bg-rise-soft text-rise border-rise/30",
  negative: "bg-fall-soft text-fall border-fall/30",
  mixed: "bg-signal-dim/40 text-signal-soft border-signal/30",
  uncertain: "bg-ink-600 text-paper-500 border-ink-500",
};

export function DirectionBadge({ direction, size = "md" }: { direction: ImpactDirection; size?: "sm" | "md" }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border font-medium whitespace-nowrap",
        DIRECTION_CLASSES[direction],
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      )}
    >
      {DIRECTION_LABELS[direction]}
    </span>
  );
}

const CONFIDENCE_CLASSES: Record<ConfidenceLevel, string> = {
  high: "bg-rise-soft text-rise border-rise/30",
  medium: "bg-signal-dim/40 text-signal-soft border-signal/30",
  low: "bg-ink-600 text-paper-500 border-ink-500",
};

export function ConfidenceBadge({ level, size = "md" }: { level: ConfidenceLevel; size?: "sm" | "md" }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border font-medium capitalize whitespace-nowrap",
        CONFIDENCE_CLASSES[level],
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      )}
    >
      {level} confidence
    </span>
  );
}

const STORY_TYPE_LABELS: Record<StoryType, string> = {
  "confirmed-event": "Confirmed Event",
  "developing-story": "Developing Story",
  "opinion-analysis": "Opinion / Analysis",
  "press-release": "Press Release",
  "government-announcement": "Government Announcement",
  "corporate-announcement": "Corporate Announcement",
};

export function StoryTypeBadge({ type }: { type: StoryType }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-wire/30 bg-wire-soft px-2 py-0.5 text-[11px] font-medium text-wire whitespace-nowrap">
      {STORY_TYPE_LABELS[type]}
    </span>
  );
}
