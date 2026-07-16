import { notFound } from "next/navigation";
import Link from "next/link";
import { getNewsArticle, newsArticles } from "@/lib/mockData";
import ImpactBadge from "@/components/shared/ImpactBadge";
import ConfidenceMeter from "@/components/shared/ConfidenceMeter";
import { timeAgo } from "@/lib/utils";

export function generateStaticParams() {
  return newsArticles.map((a) => ({ id: a.id }));
}

export default function NewsArticlePage({ params }: { params: { id: string } }) {
  const article = getNewsArticle(params.id);
  if (!article) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/news" className="text-sm text-wire hover:text-wire/80">
        ← All news
      </Link>

      <div>
        <div className="flex items-center gap-2 text-xs text-paper-700 mb-2">
          <span>{article.source}</span>
          <span>·</span>
          <span>{timeAgo(article.publishedAt)}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display font-semibold text-2xl text-paper-100 leading-snug">{article.headline}</h1>
          <ImpactBadge direction={article.sentiment} />
        </div>
        <p className="text-paper-300 mt-3">{article.summary}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="panel-tight p-4">
          <p className="text-xs text-paper-500 uppercase tracking-wide mb-1">Short-Term Impact</p>
          <p className="text-sm text-paper-100">{article.shortTermImpact}</p>
        </div>
        <div className="panel-tight p-4">
          <p className="text-xs text-paper-500 uppercase tracking-wide mb-1">Long-Term Impact</p>
          <p className="text-sm text-paper-100">{article.longTermImpact}</p>
        </div>
      </div>

      <div className="panel p-5 space-y-4">
        <div>
          <p className="text-xs text-paper-500 uppercase tracking-wide mb-1">Affected Industries</p>
          <p className="text-sm text-paper-100">{article.affectedIndustries.join(", ") || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-paper-500 uppercase tracking-wide mb-2">Affected Companies</p>
          <div className="flex flex-wrap gap-2">
            {article.affectedTickers.map((t) => (
              <Link key={t} href={`/companies/${t}`} className="font-mono text-xs bg-ink-700 text-paper-100 px-2 py-1 rounded hover:text-signal">
                {t}
              </Link>
            ))}
          </div>
        </div>
        <div className="w-48">
          <ConfidenceMeter score={article.confidence} />
        </div>
      </div>

      <div className="panel-tight p-4">
        <p className="text-xs text-paper-500 uppercase tracking-wide mb-1">Historical Comparison</p>
        <p className="text-sm text-paper-100">{article.historicalComparison || "No close historical precedent identified."}</p>
      </div>

      <div className="panel-tight p-4 border-signal-dim/40">
        <p className="text-xs text-signal-soft uppercase tracking-wide mb-1">Investment Thesis (Research Only)</p>
        <p className="text-sm text-paper-100">{article.investmentThesis}</p>
      </div>
    </div>
  );
}
