import Link from "next/link";
import { newsArticles } from "@/lib/mockData";
import ImpactBadge from "@/components/shared/ImpactBadge";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "News Analysis — Market Catalyst AI" };

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-2xl text-paper-100">News Analysis</h1>
        <p className="text-sm text-paper-500 mt-1">
          Every article is scored for sentiment, affected industries and companies, and confidence.
        </p>
      </div>

      <div className="space-y-3">
        {newsArticles.map((a) => (
          <Link key={a.id} href={`/news/${a.id}`} className="panel p-5 flex flex-col gap-2 hover:border-signal/40 transition-colors block focus-ring">
            <div className="flex items-center gap-2 text-xs text-paper-700">
              <span>{a.source}</span>
              <span>·</span>
              <span>{timeAgo(a.publishedAt)}</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display font-semibold text-paper-100 leading-snug">{a.headline}</h2>
              <ImpactBadge direction={a.sentiment} />
            </div>
            <p className="text-sm text-paper-500">{a.summary}</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {a.affectedTickers.map((t) => (
                <span key={t} className="font-mono text-xs bg-ink-700 text-paper-300 px-2 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
