import { notFound } from "next/navigation";
import Link from "next/link";
import { getCompany, companies, getSector, events } from "@/lib/mockData";
import { formatPrice, formatPercent, cx } from "@/lib/utils";
import StockSparkline from "@/components/shared/StockSparkline";
import ConfidenceMeter from "@/components/shared/ConfidenceMeter";

export function generateStaticParams() {
  return companies.map((c) => ({ ticker: c.ticker }));
}

export function generateMetadata({ params }: { params: { ticker: string } }) {
  const company = getCompany(params.ticker);
  return { title: company ? `${company.ticker} — Market Catalyst AI` : "Company — Market Catalyst AI" };
}

export default function CompanyPage({ params }: { params: { ticker: string } }) {
  const company = getCompany(params.ticker);
  if (!company) notFound();

  const sector = getSector(company.sectorSlug);
  const positive = company.changePercent >= 0;
  const relatedEvents = events.filter(
    (e) => e.potentialWinners.some((w) => w.ticker === company.ticker) || e.potentialLosers.some((l) => l.ticker === company.ticker)
  );

  return (
    <div className="space-y-8">
      <div>
        {sector && (
          <Link href={`/sectors/${sector.slug}`} className="text-sm text-wire hover:text-wire/80">
            ← {sector.name}
          </Link>
        )}
        <div className="flex flex-wrap items-end justify-between gap-4 mt-2">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display font-semibold text-3xl text-paper-100">{company.ticker}</h1>
              <span className="text-paper-500">{company.name}</span>
            </div>
            <p className="text-sm text-paper-700 mt-1">
              {company.industry} · Market Cap {company.marketCap}
            </p>
          </div>
          <div className="text-right">
            <p className="data-num text-3xl text-paper-100">${formatPrice(company.price)}</p>
            <p className={cx("data-num text-sm", positive ? "text-rise" : "text-fall")}>
              {formatPercent(company.changePercent)} today
            </p>
          </div>
        </div>
      </div>

      <div className="panel p-5">
        <StockSparkline data={company.sparkline} positive={positive} />
        <p className="text-sm text-paper-300 mt-4">{company.aiSummary}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="panel-tight p-4">
          <p className="text-xs text-paper-500 uppercase tracking-wide">AI Opportunity Score</p>
          <p className="data-num text-2xl text-signal mt-1">{company.aiOpportunityScore}</p>
        </div>
        <div className="panel-tight p-4">
          <p className="text-xs text-paper-500 uppercase tracking-wide">Upcoming Earnings</p>
          <p className="text-paper-100 mt-1">{company.upcomingEarnings}</p>
        </div>
        <div className="panel-tight p-4">
          <p className="text-xs text-paper-500 uppercase tracking-wide">Sector</p>
          <p className="text-paper-100 mt-1">{sector?.name ?? "—"}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="panel p-5">
          <h2 className="font-display font-semibold text-paper-100 mb-3">Recent Catalysts</h2>
          <ul className="space-y-2 text-sm text-paper-300 list-disc list-inside">
            {company.recentCatalysts.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
        <div className="panel p-5">
          <h2 className="font-display font-semibold text-paper-100 mb-3">Risk Factors</h2>
          <ul className="space-y-2 text-sm text-paper-300 list-disc list-inside">
            {company.riskFactors.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="panel-tight p-4">
          <p className="text-xs text-paper-500 uppercase tracking-wide mb-2">Competitors</p>
          <p className="text-sm text-paper-100">{company.competitors.join(", ") || "—"}</p>
        </div>
        <div className="panel-tight p-4">
          <p className="text-xs text-paper-500 uppercase tracking-wide mb-2">Major Customers</p>
          <p className="text-sm text-paper-100">{company.majorCustomers.join(", ") || "—"}</p>
        </div>
        <div className="panel-tight p-4">
          <p className="text-xs text-paper-500 uppercase tracking-wide mb-2">Supply Chain Exposure</p>
          <p className="text-sm text-paper-100">{company.supplyChainExposure.join(", ") || "—"}</p>
        </div>
        {company.governmentContracts.length > 0 && (
          <div className="panel-tight p-4 sm:col-span-2 lg:col-span-3">
            <p className="text-xs text-paper-500 uppercase tracking-wide mb-2">Government Contracts</p>
            <p className="text-sm text-paper-100">{company.governmentContracts.join(", ")}</p>
          </div>
        )}
      </div>

      {relatedEvents.length > 0 && (
        <section>
          <h2 className="font-display font-semibold text-xl text-paper-100 mb-3">Related Events</h2>
          <div className="space-y-3">
            {relatedEvents.map((e) => (
              <div key={e.id} className="panel-tight p-4">
                <p className="text-sm text-paper-100 leading-snug">{e.headline}</p>
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
