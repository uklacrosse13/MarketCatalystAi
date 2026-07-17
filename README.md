# Market Catalyst AI

**Understand the News. Discover the Opportunity.**

An investment *research* platform. It reads breaking news from free public sources —
GDELT, and official government/public RSS feeds — and explains which industries,
sectors, ETFs, and public companies could be affected, using a transparent,
rules-based engine. No paid news API and no AI model are required for any of this.

> Market Catalyst AI is an educational research tool and does not provide personalized
> investment advice. Companies, sectors, and funds are identified through news-based
> keyword and event matching. A company's appearance does not mean its stock will rise
> or fall. News may be incomplete, inaccurate, delayed, or already reflected in market
> prices. Always review the original sources and conduct independent research before
> making investment decisions.

---

## What's included

| Area | Status |
|---|---|
| **News Analysis** (search, filters, sort) | Live — GDELT + approved RSS feeds, zero API keys |
| **Event Detail pages** | Live — full source attribution, confidence explanation |
| **Rules-based Market-Impact Engine** | Live — no AI model, fully deterministic and editable |
| Homepage (catalysts, top themes, most-mentioned tickers/ETFs) | Live, sourced from the same pipeline |
| Sector pages — "Recent Related Stories" | Live, for sectors with a market-mapping match |
| Dashboard, Company pages, Watchlists, Historical Events | Built on the original sample dataset (`src/lib/mockData.ts`) — unrelated to the news system, unchanged in this update |
| AI Research Assistant chat | Optional — separate feature, needs `OPENAI_API_KEY`; degrades to a labeled canned reply without one |
| Supabase schema | Full schema in `supabase/schema.sql`, not required for the news system |

---

## How the free news system works

```
   GDELT DOC 2.0 API  -+
                        +->  normalize  ->  deduplicate  ->  rules-based   ->  cached
   Approved RSS feeds -+     (types.ts)     into "events"    market-impact     EventCard[]
                                             (dedupe.ts)      analysis
                                                               (marketImpact.ts)
```

1. **Fetching** (`src/lib/news/gdelt.ts`, `src/lib/news/rss.ts`): a handful of broad
   GDELT queries (semiconductors, Fed policy, defense spending, tariffs, energy,
   cybersecurity, FDA/biotech, earnings) plus every enabled feed in
   `src/config/newsSources.ts` are fetched in parallel, server-side only. A broken or
   slow source is caught, logged, and skipped — it can never take the whole site down.
2. **Normalizing** (`src/lib/news/types.ts`): every article, regardless of source,
   becomes the same `NormalizedArticle` shape — headline, snippet, publisher,
   publish/retrieval time, original URL, image, language, country, and whether it's
   an official government source.
3. **Deduplicating** (`src/lib/news/dedupe.ts`): articles covering the same event
   (same URL, or similar headlines published close together) are grouped into one
   `EventCard`, showing every source rather than one duplicated story per publisher.
4. **Market-impact analysis** (`src/lib/news/marketImpact.ts`) — entirely rules-based:
   - matches sector keywords (`src/data/marketMappings.ts`) against the headline/snippet
   - classifies an event type (government spending, trade policy, earnings, etc. —
     `src/lib/news/eventKeywords.ts`)
   - scans for positive/negative catalyst phrases to set a direction
   - matches explicit ticker mentions, falling back to the matched sector's tickers
   - estimates a time horizon from the event type
   - scores confidence as **High / Medium / Low**, with every point award tied to a
     visible, plain-English reason (`src/lib/news/confidence.ts`) — never a fabricated
     precise percentage
5. **Caching** (`src/lib/news/aggregator.ts`): the whole pipeline's output is cached
   for 10 minutes via Next.js's `unstable_cache`. See "How caching works" below.

No article body is ever stored or displayed beyond the source's own short
snippet/description — every card links back to the original publisher to read the
full story.

---

## News sources used

All configured in one place: **`src/config/newsSources.ts`**.

| Source | Type | Verified |
|---|---|---|
| GDELT DOC 2.0 API | Global news monitoring, keyless | Yes, queried directly |
| Federal Reserve -- All Press Releases & Monetary Policy | Government RSS | Yes |
| U.S. Securities and Exchange Commission -- Press Releases | Government RSS | Yes |
| U.S. Department of War (formerly Department of Defense) -- News, Releases, Contract Announcements | Government RSS | Yes |
| U.S. Energy Information Administration -- Today in Energy | Government RSS (DOE) | Yes |
| U.S. Food and Drug Administration -- Press Announcements | Government RSS | Yes |
| GovInfo -- Congressional Bills & Public/Private Laws | Government RSS (Congress) | Yes |
| U.S. Department of Commerce -- Newsroom | Government RSS | Disabled -- see note below |
| The White House -- News | Government RSS | Disabled -- see note below |

Every enabled feed above was independently fetched and confirmed live while building
this feature. Two agencies (Commerce, White House) are included as **disabled
placeholders**: a directory of feeds exists at `commerce.gov/rss`, and
`whitehouse.gov` very likely supports the standard WordPress `/feed/` pattern, but
neither exact URL could be independently confirmed through available tools. Rather
than guess, they're left disabled with a note in the config -- confirm the real URL
and flip `enabled: true` when you're ready.

**Important, honest limitation on GDELT tone:** the brief asks for a "GDELT tone
score when available." The GDELT DOC 2.0 API endpoint this app uses
(`mode=artlist&format=json` -- the one that returns article lists) does **not**
include a per-article tone field; tone is only exposed through separate aggregate
"timeline" query modes that describe a whole query's coverage over time, not any
single article. Rather than approximate one and risk misrepresenting it, every
article's `gdeltTone` is explicitly `null` -- documented in `src/lib/news/gdelt.ts`.

**Company investor-relations feeds** are left empty in the config by default -- most
IR sites do publish an RSS/Atom feed, but the URLs vary per company and go stale
when sites are redesigned. Search `"<company> investor relations rss"`, verify the
feed loads, then add it to `NEWS_FEEDS` (see below).

---

## How to add an RSS feed

Open `src/config/newsSources.ts` and add an entry to the `NEWS_FEEDS` array:

```ts
{
  id: "your-unique-id",
  name: "Display name shown as the source",
  url: "https://example.gov/feed.xml",   // verify this loads in a browser first
  category: "government",                 // "government" | "investor-relations" | "news"
  isGovernment: true,                     // drives the "Official Government Source" badge
  enabled: true,
},
```

Nothing else needs to change -- `src/lib/news/rss.ts` and `src/lib/news/aggregator.ts`
both read from this array at request time. To temporarily stop fetching a feed
without deleting it, set `enabled: false`. The allow-list that prevents the server
from fetching arbitrary URLs (`src/lib/news/sanitize.ts`) is also built from this
file automatically, so a newly added feed's domain is allow-listed the moment you
add it here.

## How to modify sector mappings

Open **`src/data/marketMappings.ts`**. Each sector is a plain object:

```ts
{
  id: "semiconductors",             // stable, used in URLs -- lowercase-with-hyphens
  label: "Semiconductors",
  keywords: ["semiconductor", "chipmaker", "chip export", ...],  // lowercase substrings
  tickers: ["NVDA", "AMD", "INTC", "TSM", "ASML", "AMAT", "LRCX"],
  etfs: ["SOXX", "SMH"],
  relatedSectors: ["artificial-intelligence"],
}
```

- **Add a keyword**: append a lowercase string to `keywords`. Matching is substring-based
  against the lower-cased headline + snippet, so keep phrases specific (`"chip export"`,
  not just `"chip"`) to avoid false positives.
- **Add a company**: append its ticker to `tickers`.
- **Add a sector**: copy an existing block, give it a unique `id`.
- **Remove anything**: delete the line. No other file needs to change -- every
  consumer (`src/lib/news/marketImpact.ts`, the sectors API route, the sector detail
  page) reads this file at request time.

Every ticker and ETF listed is framed as "companies and funds to research," never a
recommendation -- that framing lives in the UI copy (event detail page, event cards),
not in this data file, so it stays consistent no matter how you edit the mappings.

---

## How caching works

- The entire fetch -> normalize -> dedupe -> analyze pipeline is wrapped in a single
  `unstable_cache` call in `src/lib/news/aggregator.ts`, cached for **10 minutes**.
- The **first** request after the cache expires triggers a fresh fetch of every
  enabled source; every request within the following 10 minutes reads the cached
  result instantly, with no repeated network calls.
- This means the site **updates automatically whenever a visitor loads the news
  dashboard** after the cache window has passed -- no cron job is required for the
  app to work.
- **Optional daily cache warm-up**: `vercel.json` defines one daily Vercel Cron job
  hitting `/api/cron/refresh-news`, which just calls `revalidateTag("news-events")`
  so the next visitor doesn't have to wait for a live fetch. It's protected by a
  `CRON_SECRET` you set yourself; if you never configure Vercel Cron, this route is
  simply never called and nothing else is affected.
- Articles older than 72 hours are dropped from the aggregated pool automatically
  (`EXPIRE_AFTER_HOURS` in `aggregator.ts`), so the feed doesn't accumulate stale
  stories indefinitely.
- Each article is only ever run through the rules-based analysis once, as part of
  building its `EventCard` -- not repeatedly per request.

---

## Current limitations

Documented here in the spirit of "no fabricated claims" -- these are real constraints,
not omissions:

- **Rate limiting is best-effort and per-instance** (`src/lib/news/rateLimit.ts`).
  It works correctly within one running server process, but Vercel serverless
  functions don't share memory across instances, so the *effective* limit is "per
  warm instance," not a hard global ceiling. For a strict global limit, swap in a
  shared store (e.g. `@upstash/ratelimit`) behind the same `checkRateLimit` interface.
- **Sector/company matching is keyword-based, not semantic.** It will miss stories
  that are relevant but don't use the mapped phrases, and can occasionally match a
  phrase out of context. Treat every match as a starting point for your own research,
  not a verified fact.
- **Deduplication uses word-overlap similarity within a time window**, not named-entity
  extraction. It's deliberately inspectable (`src/lib/news/dedupe.ts`) rather than a
  black box, but it can occasionally merge two distinct stories that happen to share a
  lot of vocabulary, or miss a genuine duplicate with very different phrasing.
- **GDELT per-article tone is not available** through the API mode this app uses --
  see "News sources used" above. The field exists in the type system and is always
  `null`, by design, rather than approximated.
- **Commerce and White House feeds are disabled by default** pending URL confirmation
  (see above).
- **Two Sector page slugs don't have a live-news mapping counterpart** by name
  (`renewables`/`rare-earths` in the original mock sector data vs.
  `renewable-energy`/`rare-earth-minerals` in the live mappings) -- the sector page
  only shows the "Recent Related Stories" section when a mapping match exists, and
  otherwise omits it rather than showing an always-empty section.
- **Fixed in this pass**: the ticker tape lives in the shared root layout
  (`src/app/layout.tsx`), used by every page. Pages that never declared their own
  `revalidate` (Dashboard, Sectors index, History, Assistant) defaulted to
  `revalidate: false` -- fully static, frozen at build time forever, which is why
  live prices could look correct via the API directly but stale on-page. The root
  layout now exports `revalidate = 300` as a fallback that any page without its own
  value inherits. Per Next.js's docs, "the lowest revalidate across each layout and
  page of a single route will determine the revalidation frequency of the entire
  route" -- so this is a safe floor that doesn't fight a page's own tighter setting.
- **Verification note**: this build environment has no outbound network access, so
  the GDELT/RSS pipeline could not be exercised against live traffic end-to-end here.
  Every piece was individually verified (real feed URLs fetched and confirmed live
  during development, full TypeScript project-mode type-checking with zero genuine
  errors), but please run `npm install && npm run dev` and click through `/news` and
  a few event detail pages yourself after pulling this down, since that's the one
  check that couldn't be done from this side.

---

## Tech stack

Next.js 14 (App Router) - TypeScript - Tailwind CSS - Supabase (optional) - Recharts -
deployed to Vercel. News via GDELT + approved public/government RSS feeds -- no paid
news API. Stock data via Polygon.io/Finnhub/Alpha Vantage (optional, separate
feature). AI Research Assistant chat via OpenAI (optional, separate feature).

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). **No environment variables are
required** -- the News Analysis pipeline runs on free, keyless public sources from the
moment the dev server starts, and every other page falls back to realistic sample data.

To build for production:

```bash
npm run build
npm start
```

---

## Project structure

```
src/
  app/
    page.tsx                Homepage -- live catalysts, themes, most-mentioned tickers/ETFs
    news/page.tsx            News Analysis -- search, filters, sort (live)
    news/[id]/page.tsx       Event Detail -- full analysis + all original sources (live)
    sectors/[slug]/          Sector detail -- includes live "Recent Related Stories"
    dashboard/, companies/[ticker]/, watchlists/, history/[slug]/, assistant/
                              Unchanged from the sample-data platform (out of scope
                              for this update)
    api/
      news/                  GET -- filtered live feed, search, trending, sectors, government
      events/                GET -- all deduplicated events, and /events/[id]
      market-impact/         POST -- run the rules engine on arbitrary headline/snippet text
      cron/refresh-news/     Optional daily cache warm-up (see "How caching works")
      assistant/, stocks/    Unrelated optional features
  components/
    news/                    Badges, SourceList, NewsExplorer (client-side search/filter UI)
    events/                  EventSummaryCard (compact card used across all live-news surfaces)
    layout/, home/, dashboard/, shared/, assistant/, watchlists/
                              Unchanged from the sample-data platform
  lib/
    news/
      types.ts                NormalizedArticle, EventCard, MarketImpactAnalysis
      gdelt.ts                 GDELT DOC 2.0 API client
      rss.ts                    RSS/Atom fetcher (timeout + retry + sanitization)
      sanitize.ts                HTML stripping + SSRF-preventing domain allow-list
      eventKeywords.ts            Event-type + catalyst-phrase keyword sets
      marketImpact.ts               The rules-based analysis engine itself
      confidence.ts                  Transparent High/Medium/Low scoring
      dedupe.ts                       Duplicate-story detection -> EventCard grouping
      aggregator.ts                    Orchestration + caching -- the main entry point
      rateLimit.ts                     Best-effort in-memory request limiting
      hash.ts                          Stable ID generation
    mockData.ts, stockProvider.ts, supabaseClient.ts, openai.ts, types.ts, utils.ts
                              Unchanged -- power the sample-data pages and optional features
  config/
    newsSources.ts            Centralized, editable RSS feed list
  data/
    marketMappings.ts         Centralized, editable sector/ticker/ETF/keyword mappings
supabase/
  schema.sql                 Optional -- not required by the news system
vercel.json                  Optional daily cron config for cache warm-up
```

---

## Deploying to Vercel

1. Push this repo to GitHub (see the exact commands below).
2. Import it at [vercel.com/new](https://vercel.com/new).
3. No environment variables are required for the news system. Only add
   `NEXT_PUBLIC_SUPABASE_URL`/`OPENAI_API_KEY`/stock-quote keys if you're using those
   separate, optional features -- see `.env.example`.
4. If you want the optional daily cache warm-up, add a `CRON_SECRET` value in
   Vercel's Environment Variables (any random string works) -- Vercel Cron will pick
   up the schedule in `vercel.json` automatically.
5. Deploy. Vercel auto-detects Next.js -- no custom build configuration is needed.

---

## Design notes

Dark, data-dense "terminal" aesthetic: near-black charcoal surfaces, an amber signal
color for interactive accents, and green/red/amber used consistently for
positive/negative/mixed across every badge and card. Headlines use Space Grotesk;
body copy and all numeric/ticker data use the IBM Plex Sans/Mono pairing so prices
and tickers read as data, not prose. The scrolling ticker tape at the top of every
page is the platform's signature element.

---

## Everything unrelated to this update

The sections below describe features that existed before this change and were left
as-is per "preserve the existing project" -- they're independent of the free news
system and require no news-related setup.

### Persisting watchlists

The Watchlists page keeps state in React (`useState`) so it works with zero setup,
but changes don't survive a page refresh. `supabase/schema.sql` already defines
`watchlists` / `watchlist_items` tables with Row Level Security -- connect Supabase
Auth and swap `WatchlistManager`'s local state for reads/writes scoped to `auth.uid()`
to persist them.

### Live stock prices

`src/lib/liveQuotes.ts` overlays real prices from `src/lib/stockProvider.ts`
(Polygon.io -> Finnhub -> Alpha Vantage) onto the sample company dataset, cached for
5 minutes. Every page that displays a price -- the ticker tape, company detail pages,
the homepage's Biggest Opportunities/Risks, sector pages, and watchlists -- reads
through this module now, instead of the static sample prices in `mockData.ts`
directly. Without any of the three stock-data keys configured (see `.env.example`),
prices fall back to the original sample numbers per-ticker, so nothing breaks -- they
just won't move.

**Finnhub is the recommended key to add first**: its free tier (60 calls/min, no
card) comfortably covers this app's ~14 tracked tickers refreshing every 5 minutes,
whereas Polygon and Alpha Vantage's free tiers (5 and 25 requests respectively) are
tight enough that not every ticker may get a live price on every refresh if used
alone.

### Stock market data (optional)

`src/lib/stockProvider.ts` tries Polygon.io -> Finnhub -> Alpha Vantage -> the built-in
mock price, in that order, so the app never breaks due to a missing key or rate
limit. Add whichever keys you have to `.env.local`.

### AI Research Assistant chat (optional)

A separate chat feature at `/assistant`, backed by `/api/assistant` and
`src/lib/openai.ts`. It plays no role in the news system. Without `OPENAI_API_KEY`
set, it returns a clearly labeled canned response instead of failing.
