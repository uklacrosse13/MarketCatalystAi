-- ---------------------------------------------------------------------------
-- Market Catalyst AI — Supabase schema
--
-- Run this in the Supabase SQL editor (or via `supabase db push` with the CLI)
-- against a fresh project. It creates the full data model described in the
-- project brief: sectors, companies, market events (AI Event Engine output),
-- news articles, historical events, alerts, and per-user watchlists.
--
-- Row Level Security (RLS) is enabled on user-owned tables (watchlists,
-- watchlist_items) so each signed-in user only sees their own data. Reference
-- data (sectors, companies, events, news, historical_events, alerts) is
-- readable by anyone and written only by service-role ingestion jobs.
-- ---------------------------------------------------------------------------

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Reference data
-- ---------------------------------------------------------------------------

create table if not exists sectors (
  slug text primary key,
  name text not null,
  overview text not null,
  ai_sentiment text not null check (ai_sentiment in ('bullish', 'bearish', 'mixed')),
  sector_strength int not null check (sector_strength between 0 and 100),
  historical_return_1y numeric not null,
  major_risks text[] not null default '{}',
  current_catalysts text[] not null default '{}',
  etfs jsonb not null default '[]', -- [{ "ticker": "SOXX", "name": "..." }]
  updated_at timestamptz not null default now()
);

create table if not exists companies (
  ticker text primary key,
  name text not null,
  sector_slug text references sectors(slug) on delete set null,
  industry text not null,
  price numeric not null default 0,
  change_percent numeric not null default 0,
  market_cap text,
  ai_opportunity_score int not null default 50 check (ai_opportunity_score between 0 and 100),
  ai_summary text,
  recent_catalysts text[] not null default '{}',
  competitors text[] not null default '{}',
  major_customers text[] not null default '{}',
  supply_chain_exposure text[] not null default '{}',
  risk_factors text[] not null default '{}',
  upcoming_earnings date,
  government_contracts text[] not null default '{}',
  sparkline numeric[] not null default '{}',
  updated_at timestamptz not null default now()
);

create index if not exists companies_sector_idx on companies(sector_slug);

-- ---------------------------------------------------------------------------
-- AI Event Engine output — one row per classified news event
-- ---------------------------------------------------------------------------

create table if not exists market_events (
  id uuid primary key default uuid_generate_v4(),
  headline text not null,
  summary text not null,
  category text not null,
  subcategory text,
  published_at timestamptz not null,
  source text,
  potential_winners jsonb not null default '[]', -- [{ ticker, name, direction, rationale }]
  potential_losers jsonb not null default '[]',
  confidence int not null check (confidence between 0 and 100),
  time_horizon text not null check (time_horizon in ('days', 'weeks', '1-6 months', '6-18 months', '1-3 years')),
  reasoning text[] not null default '{}',
  affected_sectors text[] not null default '{}',
  historical_comparisons text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists market_events_published_idx on market_events(published_at desc);
create index if not exists market_events_category_idx on market_events(category);

-- ---------------------------------------------------------------------------
-- News analysis
-- ---------------------------------------------------------------------------

create table if not exists news_articles (
  id uuid primary key default uuid_generate_v4(),
  headline text not null,
  source text,
  published_at timestamptz not null,
  summary text,
  sentiment text not null check (sentiment in ('bullish', 'bearish', 'mixed')),
  affected_industries text[] not null default '{}',
  affected_tickers text[] not null default '{}',
  short_term_impact text,
  long_term_impact text,
  confidence int not null default 0 check (confidence between 0 and 100),
  historical_comparison text,
  investment_thesis text,
  external_url text,
  created_at timestamptz not null default now()
);

create index if not exists news_articles_published_idx on news_articles(published_at desc);

-- ---------------------------------------------------------------------------
-- Historical event archive
-- ---------------------------------------------------------------------------

create table if not exists historical_events (
  slug text primary key,
  name text not null,
  date_range text,
  summary text,
  affected_sectors text[] not null default '{}',
  winners jsonb not null default '[]',
  losers jsonb not null default '[]',
  lessons_learned text[] not null default '{}',
  timeline jsonb not null default '[]' -- [{ date, label }]
);

-- ---------------------------------------------------------------------------
-- Alerts (system-generated; delivered to users via their alert preferences)
-- ---------------------------------------------------------------------------

create table if not exists alerts (
  id uuid primary key default uuid_generate_v4(),
  type text not null,
  message text not null,
  severity text not null check (severity in ('info', 'watch', 'urgent')),
  related_event_id uuid references market_events(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- User-owned data — watchlists
-- ---------------------------------------------------------------------------

create table if not exists watchlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists watchlist_items (
  id uuid primary key default uuid_generate_v4(),
  watchlist_id uuid not null references watchlists(id) on delete cascade,
  ticker text not null references companies(ticker) on delete cascade,
  added_at timestamptz not null default now(),
  unique (watchlist_id, ticker)
);

create table if not exists alert_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  alert_type text not null,
  created_at timestamptz not null default now(),
  unique (user_id, alert_type)
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table sectors enable row level security;
alter table companies enable row level security;
alter table market_events enable row level security;
alter table news_articles enable row level security;
alter table historical_events enable row level security;
alter table alerts enable row level security;
alter table watchlists enable row level security;
alter table watchlist_items enable row level security;
alter table alert_subscriptions enable row level security;

-- Reference data: readable by anyone (anon + authenticated), writable only by service role
create policy "reference data readable by all" on sectors for select using (true);
create policy "reference data readable by all" on companies for select using (true);
create policy "reference data readable by all" on market_events for select using (true);
create policy "reference data readable by all" on news_articles for select using (true);
create policy "reference data readable by all" on historical_events for select using (true);
create policy "reference data readable by all" on alerts for select using (true);
-- Note: no insert/update/delete policies are defined for reference tables, so
-- only requests using the service_role key (server-side ingestion jobs) can
-- write to them, bypassing RLS entirely as service_role always does.

-- User-owned data: only the owning user can read/write
create policy "users manage their own watchlists" on watchlists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users manage their own watchlist items" on watchlist_items
  for all using (
    exists (select 1 from watchlists w where w.id = watchlist_id and w.user_id = auth.uid())
  ) with check (
    exists (select 1 from watchlists w where w.id = watchlist_id and w.user_id = auth.uid())
  );

create policy "users manage their own alert subscriptions" on alert_subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
