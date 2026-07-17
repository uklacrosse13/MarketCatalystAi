import Link from "next/link";
import type { NewsArticle } from "@/lib/types";
import ImpactBadge from "../shared/ImpactBadge";
import { timeAgo } from "@/lib/utils";

export default function BreakingNewsFeed({ articles }: { articles: NewsArticle[] }) {
  return (
    <div className="panel divide-y divide-ink-600">
      <div className="px-5 py-4 flex items-center justify-between">
        <h2 className="font-display font-semibold text-paper-100">Breaking News</h2>
        <Link href="/news" className="text-xs text-wire hover:text-wire/80 focus-ring rounded">
          View all →
        </Link>
      </div>
      {articles.slice(0, 6).map((a) => (
        <Link key={a.id} href={`/news/${a.id}`} className="block px-5 py-4 hover:bg-ink-700/40 transition-colors focus-ring">
          <div className="flex items-center gap-2 text-xs text-paper-700 mb-1.5">
            <span>{a.source}</span>
            <span>·</span>
            <span>{timeAgo(a.publishedAt)}</span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm text-paper-100 font-medium leading-snug">{a.headline}</p>
            <ImpactBadge direction={a.sentiment} size="sm" />
          </div>
        </Link>
      ))}
    </div>
  );
}
