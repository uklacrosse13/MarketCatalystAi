import { events, newsArticles, sectors, companies } from "@/lib/mockData";
import SentimentGauge from "@/components/dashboard/SentimentGauge";
import EconomicCalendar from "@/components/dashboard/EconomicCalendar";
import MarketHeatMap from "@/components/home/MarketHeatMap";
import ConfidenceMeter from "@/components/shared/ConfidenceMeter";
import ImpactBadge from "@/components/shared/ImpactBadge";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Dashboard — Market Catalyst AI" };

export default function DashboardPage() {
  const bullishEvents = events.filter((e) => e.potentialWinners.length >= e.potentialLosers.length).slice(0, 4);
  const bearishEvents = events.filter((e) => e.potentialLosers.length > e.potentialWinners.length).slice(0, 4);

  const bullishArticles = newsArticles.filter((a) => a.sentiment === "bullish").length;
  const bullishPct = Math.round((bullishArticles / newsArticles.length) * 100);

  const tickerMentions = new Map<string, number>();
  const addMention = (ticker: string) => tickerMentions.set(ticker, (tickerMentions.get(ticker) ?? 0) + 1);
  events.forEach((e) => [...e.potentialWinners, ...e.potentialLosers].forEach((c) => addMention(c.ticker)));
  newsArticles.forEach((a) => a.affectedTickers.forEach(addMention));
  const mostMentioned = [...tickerMentions.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  const industryMentions = new Map<string, number>();
  events.forEach((e) => industryMentions.set(e.category, (industryMentions.get(e.category) ?? 0) + 1));
  const topIndustries = [...industryMentions.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-semibold text-2xl text-paper-100">Dashboard</h1>
        <p className="text-sm text-paper-500 mt-1">A single view of today's market-moving themes.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <SentimentGauge bullishPct={bullishPct} />

        <div className="panel p-5">
          <h2 className="font-display font-semibold text-paper-100 mb-4">Most Mentioned Companies</h2>
          <ul className="space-y-2.5">
            {mostMentioned.map(([ticker, count]) => (
              <li key={ticker} className="flex items-center justify-between text-sm">
                <Link href={`/companies/${ticker}`} className="font-mono text-paper-100 hover:text-signal">
                  {ticker}
                </Link>
                <span className="text-xs text-paper-700 font-mono">{count} mentions</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel p-5">
          <h2 className="font-display font-semibold text-paper-100 mb-4">Most Mentioned Industries</h2>
          <ul className="space-y-2.5">
            {topIndustries.map(([cat, count]) => (
              <li key={cat} className="flex items-center justify-between text-sm">
                <span className="text-paper-100">{cat}</span>
                <span className="text-xs text-paper-700 font-mono">{count} events</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="panel p-5">
          <h2 className="font-display font-semibold text-paper-100 mb-4">Top Bullish Themes</h2>
          <ul className="space-y-4">
            {bullishEvents.map((e) => (
              <li key={e.id} className="pb-4 border-b border-ink-600 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-paper-100 leading-snug">{e.headline}</p>
                  <ImpactBadge direction="bullish" size="sm" />
                </div>
                <div className="mt-2 w-32">
                  <ConfidenceMeter score={e.confidence} label="Confidence" />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel p-5">
          <h2 className="font-display font-semibold text-paper-100 mb-4">Top Bearish Themes</h2>
          {bearishEvents.length === 0 ? (
            <p className="text-sm text-paper-700 italic">No predominantly bearish themes right now.</p>
          ) : (
            <ul className="space-y-4">
              {bearishEvents.map((e) => (
                <li key={e.id} className="pb-4 border-b border-ink-600 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-paper-100 leading-snug">{e.headline}</p>
                    <ImpactBadge direction="bearish" size="sm" />
                  </div>
                  <div className="mt-2 w-32">
                    <ConfidenceMeter score={e.confidence} label="Confidence" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <MarketHeatMap sectors={sectors} />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="panel p-5">
          <h2 className="font-display font-semibold text-paper-100 mb-4">Breaking News Timeline</h2>
          <ol className="relative border-l border-ink-600 pl-4 space-y-5">
            {newsArticles.map((a) => (
              <li key={a.id} className="relative">
                <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-signal" />
                <p className="text-xs text-paper-700 font-mono">{timeAgo(a.publishedAt)}</p>
                <Link href={`/news/${a.id}`} className="text-sm text-paper-100 hover:text-signal leading-snug">
                  {a.headline}
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <EconomicCalendar />
      </div>
    </div>
  );
}
