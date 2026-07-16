import HeroSection from "@/components/home/HeroSection";
import BreakingNewsFeed from "@/components/home/BreakingNewsFeed";
import TopThemes from "@/components/home/TopThemes";
import MarketHeatMap from "@/components/home/MarketHeatMap";
import SectorCard from "@/components/shared/SectorCard";
import CompanyCard from "@/components/shared/CompanyCard";
import EventCard from "@/components/shared/EventCard";
import { newsArticles, events, sectors, companies, alerts } from "@/lib/mockData";
import { severityColorClass, timeAgo } from "@/lib/utils";
import Link from "next/link";

export default function HomePage() {
  const trendingSectors = [...sectors].sort((a, b) => b.sectorStrength - a.sectorStrength).slice(0, 3);
  const biggestOpportunities = [...companies].sort((a, b) => b.aiOpportunityScore - a.aiOpportunityScore).slice(0, 4);
  const biggestRisks = [...companies].sort((a, b) => a.changePercent - b.changePercent).slice(0, 4);
  const topEvents = [...events].sort((a, b) => b.confidence - a.confidence).slice(0, 2);

  return (
    <div className="space-y-10">
      <HeroSection />

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-xl text-paper-100">AI Event Engine — Today's Biggest Catalysts</h2>
        </div>
        <div className="space-y-4">
          {topEvents.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BreakingNewsFeed articles={newsArticles} />

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
          <TopThemes events={events} />
          <MarketHeatMap sectors={sectors} />

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
    </div>
  );
}
