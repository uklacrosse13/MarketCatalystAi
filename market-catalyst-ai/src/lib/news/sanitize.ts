import { NEWS_FEEDS } from "@/config/newsSources";

// ---------------------------------------------------------------------------
// Security helpers for the news pipeline.
//
// - stripHtml(): removes markup from RSS descriptions so snippets render as
//   plain text. Combined with React's default text escaping (this app never
//   uses dangerouslySetInnerHTML on feed content), this prevents injected
//   markup/scripts from RSS content reaching the DOM.
// - isApprovedFetchUrl(): an allow-list check used before the SERVER makes
//   any outbound request (RSS feeds, GDELT). Only hosts that are either a
//   configured feed's domain or GDELT's own API domain are fetchable — this
//   prevents the server from being used to request arbitrary URLs (SSRF).
//   It does not restrict which article URLs can be *linked to* in the UI;
//   those are just anchor hrefs the browser follows, never fetched by our
//   server.
// ---------------------------------------------------------------------------

const GDELT_HOST = "api.gdeltproject.org";

function approvedHosts(): Set<string> {
  const hosts = new Set<string>([GDELT_HOST]);
  for (const feed of NEWS_FEEDS) {
    try {
      hosts.add(new URL(feed.url).hostname);
    } catch {
      // Malformed feed URL in config — skip rather than throw, so one bad
      // config entry can't break the allow-list for everything else.
    }
  }
  return hosts;
}

let cachedHosts: Set<string> | null = null;

export function isApprovedFetchUrl(url: string): boolean {
  if (!cachedHosts) cachedHosts = approvedHosts();
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    return cachedHosts.has(parsed.hostname);
  } catch {
    return false;
  }
}

/** Strips HTML tags and decodes a small set of common entities. */
export function stripHtml(input: string | undefined | null): string {
  if (!input) return "";
  const withoutTags = input.replace(/<[^>]*>/g, " ");
  const decoded = withoutTags
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'");
  return decoded.replace(/\s+/g, " ").trim();
}

/** True if the string looks like a well-formed http(s) URL — used to
 * validate article links before rendering them as hrefs. */
export function isSafeArticleUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function truncate(input: string, maxLength: number): string {
  if (input.length <= maxLength) return input;
  return `${input.slice(0, maxLength - 1).trimEnd()}…`;
}
