# Market Catalyst AI

**Understand the News. Discover the Opportunity.**

An AI-powered investment *research* platform. It reads breaking news, legislation,
geopolitics, and economic reports and explains which industries, sectors, ETFs, and
public companies could be affected — and why — without ever telling you what to buy
or sell.

> This platform is designed for research and educational purposes only. It does not
> provide personalized investment advice or guarantee future investment performance.
> Users should conduct their own due diligence before making investment decisions.

---

## What's included

The app runs completely on a built-in mock dataset (`src/lib/mockData.ts`) with **zero
configuration** — every page, chart, and the AI Research Assistant is explorable the
moment you run `npm install && npm run dev`. Real data providers (news, stock quotes,
OpenAI) are wired in as swappable modules; add API keys to `.env.local` one at a time
and each feature upgrades from mock to live data automatically.

| Area | Status |
|---|---|
| Homepage (hero, breaking news, AI Event Engine, heat map, opportunities/risks) | ✅ Built, mock data |
| Dashboard (sentiment, mentions, bullish/bearish themes, calendar) | ✅ Built, mock data |
| Sector pages (index + detail) | ✅ Built, mock data |
| Company pages (index via sectors + detail) | ✅ Built, mock data |
| News analysis (index + detail) | ✅ Built, mock + live NewsAPI wrapper |
| AI Watchlists | ✅ Built, in-memory (see "Persisting watchlists" below) |
| AI Research Assistant chat | ✅ Built, mock replies + live OpenAI wrapper |
| Historical Event Database | ✅ Built, mock data |
| Alerts feed | ✅ Built, mock data (UI only — see "Extending alerts" below) |
| Supabase schema | ✅ Full schema in `supabase/schema.sql`, not yet wired into pages |

The 40+ event categories, alert triggers, and data fields from the original brief are
all represented in the type system (`src/lib/types.ts`) and schema — the sample dataset
covers a realistic cross-section (semiconductors, defense, energy, rare earths, banking,
renewables, cybersecurity, agriculture) rather than exhaustively populating every category,
so you have real, working examples to extend from rather than empty placeholders.

---

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase · OpenAI · Recharts ·
deployed to Vercel. News via NewsAPI.org; stock data via Polygon.io/Finnhub with Alpha
Vantage as a fallback.

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables are
required to explore the full app — every page falls back to realistic sample data.

To build for production:

```bash
npm run build
npm start
```

---

## Project structure

```
src/
  app/                    Next.js App Router pages
    page.tsx              Homepage
    dashboard/            Dashboard
    sectors/[slug]/       Sector detail
    companies/[ticker]/   Company detail
    news/[id]/            News article analysis
    watchlists/           AI Watchlists
    assistant/            AI Research Assistant chat
    history/[slug]/       Historical Event Database
    api/                  Route handlers (assistant, news, stocks)
  components/
    layout/                Navbar, Footer, TickerTape, Disclaimer
    home/                  Homepage widgets (hero, news feed, heat map, themes)
    dashboard/             Dashboard widgets (sentiment gauge, calendar)
    shared/                Reusable cards (company, sector, event, badges, sparkline)
    assistant/             Chat window
    watchlists/            Watchlist manager
  lib/
    types.ts               Shared TypeScript types — the contract every page relies on
    mockData.ts            Sample dataset (events, companies, sectors, news, history)
    supabaseClient.ts       Supabase client (returns null if unconfigured)
    openai.ts               OpenAI wrapper for the chat assistant + event classification
    newsProvider.ts         NewsAPI wrapper with mock fallback
    stockProvider.ts        Polygon → Finnhub → Alpha Vantage → mock fallback chain
    utils.ts                Formatting and styling helpers
supabase/
  schema.sql                Full Postgres schema + Row Level Security policies
```

---

## Connecting real data

Each provider is isolated in its own file under `src/lib/`, so wiring one up never
requires touching page or component code — pages already read through these modules.

### 1. Supabase (database, auth, persistence)

1. Create a project at [supabase.com](https://supabase.com).
2. In the Supabase SQL editor, run the contents of `supabase/schema.sql`. This creates
   `sectors`, `companies`, `market_events`, `news_articles`, `historical_events`,
   `alerts`, and user-owned `watchlists` / `watchlist_items` tables with Row Level
   Security enabled.
3. Copy your project URL and anon key into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-side only, never expose to the client
   ```
4. `getSupabaseClient()` in `src/lib/supabaseClient.ts` will start returning a real
   client automatically. Replace the mock-data imports in each page (e.g.
   `import { sectors } from "@/lib/mockData"`) with Supabase queries as you migrate
   each section — the shapes in `types.ts` match the schema columns one-to-one to
   make this a mechanical swap.
5. Add Supabase Auth (email, Google, etc.) via the Supabase dashboard, then update
   `WatchlistManager` to read/write through `watchlist_items` scoped to
   `auth.uid()` instead of local React state.

### 2. OpenAI (AI Event Engine + Research Assistant)

1. Get an API key from [platform.openai.com](https://platform.openai.com).
2. Add to `.env.local`:
   ```
   OPENAI_API_KEY=sk-...
   OPENAI_MODEL=gpt-4o-mini
   ```
3. `/api/assistant` (used by the chat page) will immediately start calling OpenAI
   instead of returning the canned mock reply.
4. For the AI Event Engine itself (auto-classifying incoming news into winners/losers/
   confidence/reasoning), use `classifyEventFromHeadline()` in `src/lib/openai.ts` as
   the core of an ingestion pipeline: a scheduled job (Vercel Cron, a Supabase Edge
   Function, or a small worker) that pulls headlines from `newsProvider.ts`, classifies
   each with this function, and writes the result into the `market_events` table.

### 3. News provider (NewsAPI.org)

1. Get a free key at [newsapi.org](https://newsapi.org).
2. Add `NEWSAPI_API_KEY=...` to `.env.local`.
3. `src/lib/newsProvider.ts` will fetch live headlines instead of serving the sample
   articles. Raw articles don't include sentiment/tickers/confidence — run them through
   `classifyEventFromHeadline()` (see above) before displaying, or store the
   AI-enriched version in `news_articles` and read from there instead.
4. To use a different provider, only `fetchLatestHeadlines()` in that file needs to
   change — its return type (`NewsArticle[]`) is what the rest of the app expects.

### 4. Stock market data (Polygon.io / Finnhub / Alpha Vantage)

1. Get keys from [polygon.io](https://polygon.io), [finnhub.io](https://finnhub.io),
   and/or [alphavantage.co](https://www.alphavantage.co) (Alpha Vantage is the free
   fallback if you only want one key to start).
2. Add whichever keys you have to `.env.local` — `POLYGON_API_KEY`, `FINNHUB_API_KEY`,
   `ALPHAVANTAGE_API_KEY`.
3. `fetchQuote()` in `src/lib/stockProvider.ts` tries each configured provider in
   order and falls back to the mock price if none are set or all fail, so the app
   never breaks due to a rate limit or missing key.
4. The company detail page and ticker tape currently read prices from
   `mockData.ts` for consistent demo data; call `/api/stocks/[ticker]` (already
   built) from a client component with `useEffect`/`SWR` to switch to live pricing.

---

## Persisting watchlists

The Watchlists page currently keeps state in React (`useState`) so it works with zero
setup, but changes don't survive a page refresh. Once Supabase Auth is added (see
above), swap `WatchlistManager`'s local state for reads/writes against the
`watchlists` and `watchlist_items` tables — RLS policies are already in place so each
user only ever sees their own lists.

## Extending alerts

The Alerts feed on the homepage/dashboard renders from `mockData.ts`. To make it live:
1. Write new rows into the `alerts` table whenever your event-ingestion pipeline
   classifies a high-confidence or high-severity event.
2. Add a Supabase Realtime subscription (or simple polling) in the alerts widget to
   pick up new rows.
3. For push/email notifications, pair `alert_subscriptions` with a serverless
   function (e.g. a Supabase Edge Function triggered on insert) that emails or
   pushes to subscribed users.

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the same environment variables from `.env.local` in the Vercel project's
   Settings → Environment Variables.
4. Deploy. Vercel auto-detects Next.js — no custom build configuration is needed.

---

## Design notes

Dark, data-dense "terminal" aesthetic: near-black charcoal surfaces, an amber signal
color for the AI Event Engine and interactive accents, and green/red used consistently
for bullish/bearish across every chart, badge, and heat-map tile. Headlines use Space
Grotesk; body copy and all numeric/ticker data use the IBM Plex Sans/Mono pairing so
prices and tickers read as data, not prose. The scrolling ticker tape at the top of
every page is the platform's signature element.
