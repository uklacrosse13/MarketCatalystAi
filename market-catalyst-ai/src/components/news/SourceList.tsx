import type { NormalizedArticle } from "@/lib/news/types";
import { StoryTypeBadge } from "./Badges";
import { isSafeArticleUrl } from "@/lib/news/sanitize";
import { timeAgo } from "@/lib/utils";

export default function SourceList({ articles }: { articles: NormalizedArticle[] }) {
  return (
    <ul className="space-y-3">
      {articles.map((article) => (
        <li key={article.id} className="panel-tight p-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-paper-700 mb-1.5">
            <span className="font-medium text-paper-300">{article.publisher}</span>
            {article.isGovernmentSource && (
              <span className="px-1.5 py-0.5 rounded bg-signal-dim/40 text-signal-soft border border-signal/30 text-[10px] uppercase">
                Official Government Source
              </span>
            )}
            <span className="text-paper-700">·</span>
            <span>{article.discoveryMethod === "gdelt" ? "Discovered via GDELT" : "Discovered via RSS"}</span>
            <span className="text-paper-700">·</span>
            <span>{timeAgo(article.publishedAt)}</span>
          </div>

          <p className="text-sm text-paper-100 leading-snug mb-1.5">{article.headline}</p>
          {article.snippet && <p className="text-sm text-paper-500 mb-2">{article.snippet}</p>}

          <div className="flex flex-wrap items-center gap-2">
            <StoryTypeBadge type={article.storyType} />
            {isSafeArticleUrl(article.url) ? (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-xs text-wire hover:text-wire/80 focus-ring rounded"
              >
                Read the original story →
              </a>
            ) : (
              <span className="text-xs text-paper-700 italic">Original link unavailable</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
