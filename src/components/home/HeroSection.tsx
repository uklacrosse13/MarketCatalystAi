import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-ink-600 bg-ink-800/60 px-6 py-14 sm:px-12 sm:py-20 bg-grid-fade">
      <div className="relative max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-signal-soft bg-signal-dim/30 border border-signal/30 rounded-full px-3 py-1 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-slow" />
          AI EVENT ENGINE — LIVE
        </div>

        <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-paper-100 tracking-tight">
          The market moves before <span className="text-signal">most investors understand why.</span>
        </h1>

        <p className="mt-6 text-lg text-paper-500 max-w-2xl">
          Market Catalyst AI reads breaking news, legislation, geopolitics, earnings, and economic
          reports, then explains which sectors and companies could be affected — and why.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="px-5 py-3 rounded-lg bg-signal text-ink-950 font-semibold text-sm hover:bg-signal-soft transition-colors focus-ring"
          >
            Open Dashboard
          </Link>
          <Link
            href="/assistant"
            className="px-5 py-3 rounded-lg border border-ink-500 text-paper-100 font-semibold text-sm hover:border-signal/50 hover:text-signal transition-colors focus-ring"
          >
            Ask the Research Assistant
          </Link>
        </div>

        <p className="mt-8 text-xs text-paper-700 max-w-xl italic">
          Understand the news. Discover the opportunity. Research and educational purposes only —
          not personalized investment advice.
        </p>
      </div>
    </section>
  );
}
