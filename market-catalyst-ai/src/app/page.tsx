import HeroSection from "@/components/home/HeroSection";
import MarketHeatMap from "@/components/home/MarketHeatMap";
import SectorCard from "@/components/shared/SectorCard";
import CompanyCard from "@/components/shared/CompanyCard";
import EventSummaryCard from "@/components/events/EventSummaryCard";
import { DirectionBadge } from "@/components/news/Badges";
import Disclaimer from "@/components/layout/Disclaimer";
import { sectors, alerts } from "@/lib/mockData";
import { getLiveCompanies } from "@/lib/liveQuotes";
import { severityColorClass, timeAgo } from "@/lib/utils";
import { getAllEvents, getTrendingEvents } from "@/lib/news/aggregator";
import Link from "next/link";

export const revalidate = 600; // matches the news aggregator's cache window

export default async function HomePage() {
  const [allEvents, trendingEvents, companies] = await Promise.all([
    getAllEvents(),
    getTrendingEvents(6),
    getLiveCompanies(),
  ]);

  const latestEvents = [...allEvents]
    .sort((a, b) => new Date(b.latestUpdated).getTime() - new Date(a.latestUpdated).getTime())
    .slice(0, 6);

  const topCatalysts = allEvents.filter((e) => e.marketImpact.confidenceLevel !== "low").slice(0, 3);
  const positiveCatalysts = allEvents.filter((e) => e.marketImpact.direction === "positive").slice(0, 4);
  const negativeCatalysts = allEvents.filter((e) => e.marketImpact.direction === "negative").slice(0, 4);

  const tickerCounts = new Map<string, number>();
  const etfCounts = new Map<string, number>();
  for (const event of allEvents) {
    for (const company of event.marketImpact.companies) {
      tickerCounts.set(company.ticker, (tickerCounts.get(company.ticker) ?? 0) + 1);
    }
    for (const etf of event.marketImpact.etfs) {
      etfCounts.set(etf, (etfCounts.get(etf) ?? 0) + 1);
    }
  }
  const mostMentionedCompanies = [...tickerCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const mostMentionedEtfs = [...etfCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  const trendingSectors = [...sectors].sort((a, b) => b.sectorStrength - a.sectorStrength).slice(0, 3);
  const biggestOpportunities = [...companies].sort((a, b) => b.aiOpportunityScore - a.aiOpportunityScore).slice(0, 4);
  const biggestRisks = [...companies].sort((a, b) => a.changePercent - b.changePercent).slice(0, 4);

  return (
    <div className="space-y-10">
      <HeroSection />

      {topCatalysts.length > 0 && (
        <section>
          <h2 className="font-display font-semibold text-xl text-paper-100 mb-3">Today's Biggest Catalysts</h2>
          <div className="space-y-3">
            {topCatalysts.map((event) => (
              <EventSummaryCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="panel p-5">
          <h2 className="font-display font-semibold text-paper-100 mb-3">Potential Positive Catalysts</h2>
          {positiveCatalysts.length === 0 ? (
            <p className="text-sm text-paper-700 italic">No clearly positive-leaning stories right now.</p>
          ) : (
            <ul className="space-y-2.5">
              {positiveCatalysts.map((event) => (
                <li key={event.id}>
                  <Link href={`/news/${event.id}`} className="flex items-start justify-between gap-3 group focus-ring rounded">
                    <span className="text-sm text-paper-100 group-hover:text-signal leading-snug">{event.primaryHeadline}</span>
                    <DirectionBadge direction="positive" size="sm" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel p-5">
          <h2 className="font-display font-semibold text-paper-100 mb-3">Potential Negative Catalysts</h2>
          {negativeCatalysts.length === 0 ? (
            <p className="text-sm text-paper-700 italic">No clearly negative-leaning stories right now.</p>
          ) : (
            <ul className="space-y-2.5">
              {negativeCatalysts.map((event) => (
                <li key={event.id}>
                  <Link href={`/news/${event.id}`} className="flex items-start justify-between gap-3 group focus-ring rounded">
                    <span className="text-sm text-paper-100 group-hover:text-signal leading-snug">{event.primaryHeadline}</span>
                    <DirectionBadge direction="negative" size="sm" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="panel divide-y divide-ink-600">
            <div className="px-5 py-4 flex items-center justify-between">
              <h2 className="font-display font-semibold text-paper-100">Latest Important Stories</h2>
              <Link href="/news" className="text-xs text-wire hover:text-wire/80 focus-ring rounded">
                View all →
              </Link>
            </div>
            {latestEvents.length === 0 ? (
              <p className="px-5 py-6 text-sm text-paper-500">
                No live stories are cached yet — check back shortly, or see README.md if this environment
                has no outbound network access.
              </p>
            ) : (
              <div className="p-5 space-y-3">
                {latestEvents.map((event) => (
                  <EventSummaryCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-paper-100">Biggest Opportunities</h2>
              <span className="text-xs text-paper-700">By AI Opportunity Score</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {biggestOpportunities.map((c) => (
                <CompanyCard key={c.ticker} company={c} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-paper-100">Biggest Risks Today</h2>
              <span className="text-xs text-paper-700">By price movement</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {biggestRisks.map((c) => (
                <CompanyCard key={c.ticker} company={c} />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="panel p-5">
            <h2 className="font-display font-semibold text-paper-100 mb-4">Today's Top Market Themes</h2>
            {trendingEvents.length === 0 ? (
              <p className="text-sm text-paper-700 italic">Nothing trending yet.</p>
            ) : (
              <ol className="space-y-3">
                {trendingEvents.map((event, i) => (
                  <li key={event.id}>
                    <Link href={`/news/${event.id}`} className="flex items-start gap-3 group focus-ring rounded">
                      <span className="font-mono text-paper-700 text-sm pt-0.5 w-5 shrink-0">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-paper-100 group-hover:text-signal transition-colors leading-snug">
                          {event.primaryHeadline}
                        </p>
                        <p className="text-xs text-paper-700 mt-1">
                          {event.sourceCount} source{event.sourceCount !== 1 ? "s" : ""} · {event.marketImpact.eventType}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <MarketHeatMap sectors={sectors} />

          <div className="panel p-5">
            <h2 className="font-display font-semibold text-paper-100 mb-3">Most-Mentioned Companies</h2>
            {mostMentionedCompanies.length === 0 ? (
              <p className="text-sm text-paper-700 italic">No live matches yet.</p>
            ) : (
              <ul className="space-y-2">
                {mostMentionedCompanies.map(([ticker, count]) => (
                  <li key={ticker} className="flex items-center justify-between text-sm">
                    <span className="font-mono text-paper-100">{ticker}</span>
                    <span className="text-xs text-paper-700 font-mono">{count} mention{count !== 1 ? "s" : ""}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="panel p-5">
            <h2 className="font-display font-semibold text-paper-100 mb-3">Most-Mentioned ETFs</h2>
            {mostMentionedEtfs.length === 0 ? (
              <p className="text-sm text-paper-700 italic">No live matches yet.</p>
            ) : (
              <ul className="space-y-2">
                {mostMentionedEtfs.map(([etf, count]) => (
                  <li key={etf} className="flex items-center justify-between text-sm">
                    <span className="font-mono text-paper-100">{etf}</span>
                    <span className="text-xs text-paper-700 font-mono">{count} mention{count !== 1 ? "s" : ""}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="panel p-5">
            <h2 className="font-display font-semibold text-paper-100 mb-3">Recent Alerts</h2>
            <ul className="space-y-2.5">
              {alerts.slice(0, 5).map((a) => (
                <li key={a.id} className="flex items-start gap-2 text-sm">
                  <span className={`mt-0.5 shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-mono uppercase ${severityColorClass(a.severity)}`}>
                    {a.severity}
                  </span>
                  <div>
                    <p className="text-paper-100 leading-snug">{a.message}</p>
                    <p className="text-xs text-paper-700 mt-0.5">{timeAgo(a.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-xl text-paper-100">Trending Sectors</h2>
          <Link href="/sectors" className="text-sm text-wire hover:text-wire/80 focus-ring rounded">
            View all sectors →
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {trendingSectors.map((s) => (
            <SectorCard key={s.slug} sector={s} />
          ))}
        </div>
      </section>

      <Disclaimer />
    </div>
  );
}
