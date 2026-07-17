import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventById } from "@/lib/news/aggregator";
import { getSector as getMockSector, getCompany as getMockCompany } from "@/lib/mockData";
import { DirectionBadge, ConfidenceBadge } from "@/components/news/Badges";
import SourceList from "@/components/news/SourceList";
import Disclaimer from "@/components/layout/Disclaimer";
import { timeAgo } from "@/lib/utils";
import type { ImpactDirection } from "@/lib/news/types";

export const revalidate = 600;

export async function generateMetadata({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);
  return { title: event ? `${event.primaryHeadline} — Market Catalyst AI` : "Event — Market Catalyst AI" };
}

function positiveEffectsText(sectorLabel: string): string {
  return `Companies and funds tied to ${sectorLabel} may see increased attention if this development leads to higher demand, funding, or favorable policy treatment. This reflects positive catalyst language detected in the coverage — it is not a price prediction.`;
}

function negativeEffectsText(sectorLabel: string): string {
  return `Companies and funds tied to ${sectorLabel} may face headwinds if this development leads to higher costs, new restrictions, or reduced demand. This reflects negative catalyst language detected in the coverage — it is not a price prediction.`;
}

const TIME_HORIZON_EXPLANATION: Record<string, string> = {
  "short-term": "Short-term (days to a few weeks): this event type (e.g. earnings, cyberattacks, natural disasters) tends to have a fast-moving, immediate news cycle.",
  "medium-term": "Medium-term (weeks to months): this event type doesn't fit a clearly fast or slow pattern, so it's treated as a moderate-duration story by default.",
  "long-term": "Long-term (months to years): this event type (e.g. government spending, trade policy, monetary policy) tends to unfold gradually as policy or spending takes effect.",
};

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);
  if (!event) notFound();

  const { marketImpact } = event;
  const direction: ImpactDirection = marketImpact.direction;
  const showPositive = direction === "positive" || direction === "mixed";
  const showNegative = direction === "negative" || direction === "mixed";
  const sectorLabel = marketImpact.primarySector?.replace(/-/g, " ") ?? "the matched sector";

  const allSectorIds = [marketImpact.primarySector, ...marketImpact.relatedSectors].filter(
    (id): id is string => Boolean(id)
  );

  return (
    <div className="max-w-3xl space-y-8">
      <Link href="/news" className="text-sm text-wire hover:text-wire/80">
        ← All news
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-paper-700 mb-2">
          <span className="px-2 py-0.5 rounded-full bg-wire-soft text-wire border border-wire/30 font-medium">
            {marketImpact.eventType}
          </span>
          <span>·</span>
          <span>
            {event.sourceCount} source{event.sourceCount !== 1 ? "s" : ""}
          </span>
          <span>·</span>
          <span>First reported {timeAgo(event.earliestPublished)}</span>
          <span>·</span>
          <span>Updated {timeAgo(event.latestUpdated)}</span>
        </div>

        <h1 className="font-display font-semibold text-2xl text-paper-100 leading-snug">{event.primaryHeadline}</h1>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <DirectionBadge direction={direction} />
          <ConfidenceBadge level={marketImpact.confidenceLevel} />
        </div>
      </div>

      <section className="panel p-5 space-y-2">
        <h2 className="font-display font-semibold text-paper-100">What Happened</h2>
        <p className="text-sm text-paper-300">
          {event.articles.find((a) => a.snippet)?.snippet ||
            "No snippet was supplied by the source feed for this story — read the original article below for full details."}
        </p>
      </section>

      <section className="panel p-5 space-y-2">
        <h2 className="font-display font-semibold text-paper-100">Why It May Matter</h2>
        <p className="text-sm text-paper-300">{marketImpact.reasoning}</p>
      </section>

      <section className="panel p-5 space-y-3">
        <h2 className="font-display font-semibold text-paper-100">Sectors Potentially Affected</h2>
        {allSectorIds.length === 0 ? (
          <p className="text-sm text-paper-700 italic">No sector was matched closely enough to list here.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {allSectorIds.map((id) => {
              const mockSector = getMockSector(id);
              const label = id.replace(/-/g, " ");
              return mockSector ? (
                <Link
                  key={id}
                  href={`/sectors/${id}`}
                  className="text-xs px-2.5 py-1 rounded-full bg-ink-700 text-paper-100 border border-ink-600 hover:border-signal/40 hover:text-signal capitalize"
                >
                  {label}
                </Link>
              ) : (
                <span key={id} className="text-xs px-2.5 py-1 rounded-full bg-ink-700 text-paper-300 border border-ink-600 capitalize">
                  {label}
                </span>
              );
            })}
          </div>
        )}
      </section>

      <section className="panel p-5 space-y-3">
        <h2 className="font-display font-semibold text-paper-100">Companies and Funds to Research</h2>
        <p className="text-xs text-paper-700 italic">
          Identified through keyword and sector-mapping association — not a recommendation, and not a claim
          that any of these will benefit or be harmed.
        </p>
        {marketImpact.companies.length === 0 && marketImpact.etfs.length === 0 ? (
          <p className="text-sm text-paper-700 italic">No specific companies or funds were matched to this story.</p>
        ) : (
          <div className="space-y-3">
            {marketImpact.companies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {marketImpact.companies.map((c) => {
                  const mockCompany = getMockCompany(c.ticker);
                  return mockCompany ? (
                    <Link
                      key={c.ticker}
                      href={`/companies/${c.ticker}`}
                      className="font-mono text-xs px-2.5 py-1 rounded bg-ink-700 text-paper-100 border border-ink-600 hover:border-signal/40 hover:text-signal"
                      title={c.matchedBy === "explicit-mention" ? "Named directly in the coverage" : "Matched via sector mapping"}
                    >
                      {c.ticker}
                    </Link>
                  ) : (
                    <span
                      key={c.ticker}
                      className="font-mono text-xs px-2.5 py-1 rounded bg-ink-700 text-paper-300 border border-ink-600"
                      title={c.matchedBy === "explicit-mention" ? "Named directly in the coverage" : "Matched via sector mapping"}
                    >
                      {c.ticker}
                    </span>
                  );
                })}
              </div>
            )}
            {marketImpact.etfs.length > 0 && (
              <p className="text-sm text-paper-500">
                Related ETFs: <span className="font-mono text-paper-100">{marketImpact.etfs.join(", ")}</span>
              </p>
            )}
          </div>
        )}
      </section>

      {(showPositive || showNegative || direction === "uncertain") && (
        <div className="grid sm:grid-cols-2 gap-4">
          {showPositive && (
            <div className="panel-tight p-4 border-rise/20">
              <p className="text-xs uppercase tracking-wide text-rise mb-2">Potential Positive Effects</p>
              <p className="text-sm text-paper-300">{positiveEffectsText(sectorLabel)}</p>
            </div>
          )}
          {showNegative && (
            <div className="panel-tight p-4 border-fall/20">
              <p className="text-xs uppercase tracking-wide text-fall mb-2">Potential Negative Effects</p>
              <p className="text-sm text-paper-300">{negativeEffectsText(sectorLabel)}</p>
            </div>
          )}
          {direction === "uncertain" && (
            <div className="panel-tight p-4 sm:col-span-2">
              <p className="text-xs uppercase tracking-wide text-paper-500 mb-2">No Clear Directional Signal</p>
              <p className="text-sm text-paper-300">
                Neither positive nor negative catalyst language was detected in this story's coverage.
                It may still be relevant context, but the rules-based engine found no basis to lean either way.
              </p>
            </div>
          )}
        </div>
      )}

      <section className="panel p-5 space-y-2">
        <h2 className="font-display font-semibold text-paper-100">Time Horizon</h2>
        <p className="text-sm text-paper-100 capitalize">{marketImpact.timeHorizon.replace("-", " ")}</p>
        <p className="text-sm text-paper-500">{TIME_HORIZON_EXPLANATION[marketImpact.timeHorizon]}</p>
      </section>

      <section className="panel p-5 space-y-3">
        <h2 className="font-display font-semibold text-paper-100">Confidence Explanation</h2>
        <ConfidenceBadge level={marketImpact.confidenceLevel} />
        <ul className="space-y-1.5 text-sm text-paper-300 list-disc list-inside">
          {marketImpact.confidenceReasons.map((reason, i) => (
            <li key={i}>{reason}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display font-semibold text-xl text-paper-100">
          Original Sources ({event.articles.length})
        </h2>
        <SourceList articles={event.articles} />
      </section>

      <div className="panel-tight p-4 border-signal-dim/40">
        <p className="text-xs text-signal-soft uppercase tracking-wide mb-1">Limitations</p>
        <p className="text-sm text-paper-300">
          This analysis is generated by keyword and mapping rules, not by editorial judgment or a
          verified fact-check. News coverage can be incomplete, delayed, later corrected, or already
          reflected in market prices by the time you read this. Sector and company associations are
          based on text matching and may miss context or attach a company that turns out not to be
          materially affected.
        </p>
      </div>

      <Disclaimer />
    </div>
  );
}
