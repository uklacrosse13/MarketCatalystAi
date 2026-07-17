// ---------------------------------------------------------------------------
// Market Catalyst AI — Approved News Source Configuration
//
// This is the single place to add, remove, or disable an RSS/Atom feed.
// Nothing outside this file needs to change to adjust which sources are
// used — src/lib/news/rss.ts and src/lib/news/aggregator.ts both read from
// NEWS_FEEDS at request time.
//
// EVERY FEED URL BELOW WAS INDEPENDENTLY VERIFIED (fetched and confirmed
// live) as part of building this feature. A small number of agencies
// (marked `enabled: false`) do not have a feed URL that could be verified
// through public search at the time this was written — they're included as
// placeholders so you can find and add the real URL later rather than being
// silently missing. Disabled feeds are never fetched.
//
// TO ADD A FEED: copy an existing entry, give it a unique `id`, set `url` to
// the feed's real XML address, and set `enabled: true`.
// TO REMOVE A FEED: delete its entry (or set `enabled: false` to keep it
// around for later without fetching it).
// ---------------------------------------------------------------------------

export type FeedCategory = "news" | "government" | "investor-relations";

export interface FeedConfig {
  /** Stable identifier, used for caching and attribution. */
  id: string;
  /** Human-readable name shown as the source/publisher. */
  name: string;
  /** The feed's real XML URL. */
  url: string;
  category: FeedCategory;
  /** True if this is an official government agency feed. */
  isGovernment: boolean;
  /** Whether this feed is actually fetched. Disabled feeds are skipped entirely. */
  enabled: boolean;
  /** Optional note — why a feed is disabled, or any caveat worth knowing. */
  note?: string;
}

export const NEWS_FEEDS: FeedConfig[] = [
  // -- Federal Reserve --------------------------------------------------
  {
    id: "fed-press-all",
    name: "Federal Reserve — All Press Releases",
    url: "https://www.federalreserve.gov/feeds/press_all.xml",
    category: "government",
    isGovernment: true,
    enabled: true,
  },
  {
    id: "fed-press-monetary",
    name: "Federal Reserve — Monetary Policy",
    url: "https://www.federalreserve.gov/feeds/press_monetary.xml",
    category: "government",
    isGovernment: true,
    enabled: true,
  },

  // -- SEC ----------------------------------------------------------------
  {
    id: "sec-press-releases",
    name: "U.S. Securities and Exchange Commission — Press Releases",
    url: "https://www.sec.gov/news/pressreleases.rss",
    category: "government",
    isGovernment: true,
    enabled: true,
  },

  // -- Department of War (formerly Department of Defense) -----------------
  // Note: as of this writing, the agency's official site and feeds now use
  // the war.gov domain rather than defense.gov.
  {
    id: "dow-news",
    name: "U.S. Department of War — News",
    url: "https://www.war.gov/DesktopModules/ArticleCS/RSS.ashx?max=15&ContentType=1&Site=945",
    category: "government",
    isGovernment: true,
    enabled: true,
  },
  {
    id: "dow-releases",
    name: "U.S. Department of War — Official Releases",
    url: "https://www.war.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=9&Site=945&max=15",
    category: "government",
    isGovernment: true,
    enabled: true,
  },
  {
    id: "dow-contracts",
    name: "U.S. Department of War — Contract Announcements",
    url: "https://www.war.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=400&Site=945&max=15",
    category: "government",
    isGovernment: true,
    enabled: true,
  },

  // -- Department of Energy (via EIA) --------------------------------------
  // Note: the main energy.gov newsroom does not appear to publish a directly
  // linkable RSS feed. The U.S. Energy Information Administration (EIA), a
  // statistical agency within DOE, does — used here instead.
  {
    id: "eia-today-in-energy",
    name: "U.S. Energy Information Administration — Today in Energy",
    url: "https://www.eia.gov/rss/todayinenergy.xml",
    category: "government",
    isGovernment: true,
    enabled: true,
  },

  // -- FDA ------------------------------------------------------------------
  {
    id: "fda-press-announcements",
    name: "U.S. Food and Drug Administration — Press Announcements",
    url: "https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-releases/rss.xml",
    category: "government",
    isGovernment: true,
    enabled: true,
  },

  // -- Congress (via GovInfo, the Government Publishing Office's platform) --
  {
    id: "govinfo-bills",
    name: "GovInfo — Congressional Bills",
    url: "https://www.govinfo.gov/rss/bills.xml",
    category: "government",
    isGovernment: true,
    enabled: true,
  },
  {
    id: "govinfo-public-laws",
    name: "GovInfo — Public and Private Laws",
    url: "https://www.govinfo.gov/rss/plaw.xml",
    category: "government",
    isGovernment: true,
    enabled: true,
  },

  // -- Department of Commerce ----------------------------------------------
  {
    id: "commerce-newsroom",
    name: "U.S. Department of Commerce — Newsroom",
    url: "https://www.commerce.gov/news/rss.xml",
    category: "government",
    isGovernment: true,
    enabled: false,
    note: "commerce.gov confirms an RSS directory exists at commerce.gov/rss, but the exact feed URL could not be independently verified. Confirm the real URL at https://www.commerce.gov/rss before enabling.",
  },

  // -- White House ------------------------------------------------------
  {
    id: "whitehouse-news",
    name: "The White House — News",
    url: "https://www.whitehouse.gov/feed/",
    category: "government",
    isGovernment: true,
    enabled: false,
    note: "Unverified — whitehouse.gov appears to run WordPress, which typically supports /feed/, but this specific URL was not independently confirmed live. Verify before enabling.",
  },

  // -- Company investor-relations feeds ------------------------------------
  // Add tickers you care about here. Most IR sites publish a press-release
  // RSS/Atom feed under a "News" or "Investor Relations" section — search
  // "<company> investor relations rss" to find it, then verify it loads
  // before adding. Left empty by default since URLs vary per company and go
  // stale when companies redesign their IR sites.
];

export function enabledFeeds(): FeedConfig[] {
  return NEWS_FEEDS.filter((f) => f.enabled);
}

export function getFeed(id: string): FeedConfig | undefined {
  return NEWS_FEEDS.find((f) => f.id === id);
}
