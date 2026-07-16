import type { ImpactDirection } from "./types";

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatPercent(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

export function directionColorClass(direction: ImpactDirection): string {
  switch (direction) {
    case "bullish":
      return "text-rise";
    case "bearish":
      return "text-fall";
    default:
      return "text-signal";
  }
}

export function directionBgClass(direction: ImpactDirection): string {
  switch (direction) {
    case "bullish":
      return "bg-rise-soft text-rise border-rise/30";
    case "bearish":
      return "bg-fall-soft text-fall border-fall/30";
    default:
      return "bg-signal-dim/40 text-signal-soft border-signal/30";
  }
}

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function severityColorClass(severity: "info" | "watch" | "urgent"): string {
  switch (severity) {
    case "urgent":
      return "bg-fall-soft text-fall border-fall/30";
    case "watch":
      return "bg-signal-dim/40 text-signal-soft border-signal/30";
    default:
      return "bg-wire-soft text-wire border-wire/30";
  }
}
