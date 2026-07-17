import { notFound } from "next/navigation";
import Link from "next/link";
import { getSector, sectors, events } from "@/lib/mockData";
import { getLiveCompaniesInSector } from "@/lib/liveQuotes";
import ImpactBadge from "@/components/shared/ImpactBadge";
import CompanyCard from "@/components/shared/CompanyCard";
import ConfidenceMeter from "@/components/shared/ConfidenceMeter";
import EventSummaryCard from "@/components/events/EventSummaryCard";
import { getEventsBySector } from "@/lib/news/aggregator";
import { getSectorMapping } from "@/data/marketMappings";

export const revalidate = 300; // matches the live-quotes cache window

export function generateStaticParams() {
  return sectors.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const sector = getSector(params.slug);
  return { title: sector ? `${sector.name} — Market Catalyst AI` : "Sector — Market Catalyst AI" };
}

export default async function SectorDetailPage({ params }: { params: { slug: string } }) {
  const sector = getSector(params.slug);
  if (!sector) notFound();

  const topCompanies = await getLiveCompaniesInSector(sector.slug);
  const relatedEvents = events.filter((e) => e.affectedSectors.includes(sector.slug));

  // The live news pipeline's sector ids (src/data/marketMappings.ts) mostly,
  // but not entirely, line up with this page's mock sector slugs — only
  // fetch live stories when there's a real mapping to avoid a misleading
  // empty section.
  const hasLiveMapping = Boolean(getSectorMapping(sector.slug));
  const liveEvents = hasLiveMapping ? await getEventsBySector(sector.slug) : [];

  return (
    <div className="space-y-8">
      <div>
        <Link href="/sectors" className="text-sm text-wire hover:text-wire/80">
          ← All sectors
        </Link>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <h1 className="font-display font-semibold text-2xl text-paper-100">{sector.name}</h1>
          <ImpactBadge direction={sector.aiSentiment} />
        </div>
        <p className="text-paper-500 mt-3 max-w-3xl">{sector.overview}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="panel-tight p-4">
          <p className="text-xs text-paper-500 uppercase tracking-wide">Sector Strength Score</p>
          <p className="data-num text-2xl text-paper-100 mt-1">{sector.sectorStrength}</p>
        </div>
        <div className="panel-tight p-4">
          <p className="text-xs text-paper-500 uppercase tracking-wide">Historical 1Y Return</p>
          <p className={`data-num text-2xl mt-1 ${sector.historicalReturn1Y >= 0 ? "text-rise" : "text-fall"}`}>
            {sector.historicalReturn1Y >= 0 ? "+" : ""}
            {sector.historicalReturn1Y.toFixed(1)}%
          </p>
        </div>
        <div className="panel-tight p-4">
          <p className="text-xs text-paper-500 uppercase tracking-wide">ETF Tracking</p>
          <p className="text-paper-100 mt-1 font-mono text-sm">
            {sector.etfs.map((e) => e.ticker).join(", ")}
          </p>
        </div>
      </div>

      {hasLiveMapping && (
        <section>
          <h2 className="font-display font-semibold text-xl text-paper-100 mb-3">Recent Related Stories</h2>
          {liveEvents.length === 0 ? (
            <div className="panel p-6">
              <p className="text-sm text-paper-500">
                No live stories matched to this sector in the current cache window. Check back soon, or
                see <Link href="/news" className="text-wire hover:text-wire/80">News Analysis</Link> for
                the full live feed.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {liveEvents.slice(0, 6).map((event) => (
                <EventSummaryCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="panel p-5">
          <h2 className="font-display font-semibold text-paper-100 mb-3">Current Catalysts</h2>
          <ul className="space-y-2 text-sm text-paper-300 list-disc list-inside">
            {sector.currentCatalysts.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
        <div className="panel p-5">
          <h2 className="font-display font-semibold text-paper-100 mb-3">Major Risks</h2>
          <ul className="space-y-2 text-sm text-paper-300 list-disc list-inside">
            {sector.majorRisks.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      <section>
        <h2 className="font-display font-semibold text-xl text-paper-100 mb-3">Top Companies</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {topCompanies.map((c) => (
            <CompanyCard key={c.ticker} company={c} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display font-semibold text-xl text-paper-100 mb-3">ETFs Tracking This Sector</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {sector.etfs.map((etf) => (
            <div key={etf.ticker} className="panel-tight p-4 flex items-center justify-between">
              <span className="font-mono font-semibold text-paper-100">{etf.ticker}</span>
              <span className="text-sm text-paper-500">{etf.name}</span>
            </div>
          ))}
        </div>
      </section>

      {relatedEvents.length > 0 && (
        <section>
          <h2 className="font-display font-semibold text-xl text-paper-100 mb-3">Related Events (Sample Data)</h2>
          <div className="space-y-3">
            {relatedEvents.map((e) => (
              <div key={e.id} className="panel-tight p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-paper-100 leading-snug">{e.headline}</p>
                </div>
                <div className="mt-2 w-32">
                  <ConfidenceMeter score={e.confidence} label="Confidence" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
