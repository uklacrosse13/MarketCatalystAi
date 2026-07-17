// ---------------------------------------------------------------------------
// Market Catalyst AI — Sector & Ticker Mappings
//
// This is the file to edit when you want to change which sectors, tickers,
// ETFs, or keywords the rules-based market-impact engine recognizes. Nothing
// here is a recommendation — every ticker listed is a "company or fund to
// research," identified by keyword/topic association with a news story, not
// a claim that its price will move in any direction.
//
// HOW THIS FILE IS USED
// `src/lib/news/marketImpact.ts` lower-cases each article's headline+snippet
// and checks it against every sector's `keywords` array. Sectors with at
// least one keyword match are considered "affected"; the sector with the
// most keyword hits becomes the primary sector, others become "related."
// Tickers and ETFs from the matched sector are then surfaced as companies
// and funds to research.
//
// HOW TO EDIT
// - To add a keyword: add a lowercase string to a sector's `keywords` array.
//   Keywords are matched as substrings, so keep them specific enough to
//   avoid false positives (e.g. "chip export" rather than just "chip").
// - To add a company: add its ticker to `tickers`. Order doesn't matter.
// - To add a new sector: copy an existing entry and give it a unique `id`
//   (used in URLs and as a stable key — use lowercase-with-hyphens).
// - To remove something, just delete the line. Nothing else in the codebase
//   needs to change — every consumer of this file reads it at request time.
// ---------------------------------------------------------------------------

export interface SectorMapping {
  /** Stable, URL-safe identifier, e.g. "rare-earth-minerals" */
  id: string;
  /** Display name shown in the UI */
  label: string;
  /**
   * Lowercase words/phrases that indicate this sector when found in a
   * headline or snippet. Matched as substrings — keep phrases specific.
   */
  keywords: string[];
  /** Representative tickers to research — NOT a recommendation to buy. */
  tickers: string[];
  /** Representative ETFs tracking this theme. */
  etfs: string[];
  /** IDs of sectors commonly affected alongside this one. */
  relatedSectors?: string[];
}

export const SECTOR_MAPPINGS: SectorMapping[] = [
  {
    id: "artificial-intelligence",
    label: "Artificial Intelligence",
    keywords: [
      "artificial intelligence", "generative ai", " ai model", "ai chip", "ai infrastructure",
      "ai spending", "ai investment", "large language model", "machine learning", "ai data center",
    ],
    tickers: ["NVDA", "AMD", "MSFT", "GOOGL", "AVGO"],
    etfs: ["AIQ"],
    relatedSectors: ["semiconductors"],
  },
  {
    id: "semiconductors",
    label: "Semiconductors",
    keywords: [
      "semiconductor", "chipmaker", "chip export", "chip ban", "chip tariff", "chip shortage",
      "foundry", "wafer fabrication", "lithography", "chip factory", "chips act",
    ],
    tickers: ["NVDA", "AMD", "INTC", "TSM", "ASML", "AMAT", "LRCX"],
    etfs: ["SOXX", "SMH"],
    relatedSectors: ["artificial-intelligence"],
  },
  {
    id: "defense",
    label: "Defense",
    keywords: [
      "defense spending", "defense contract", "military aid", "pentagon", "department of war",
      "department of defense", "weapons system", "missile defense", "fighter jet", "arms sale",
    ],
    tickers: ["LMT", "RTX", "NOC", "GD", "LHX"],
    etfs: ["ITA"],
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    keywords: [
      "cybersecurity", "cyberattack", "data breach", "ransomware", "hacking group",
      "critical infrastructure attack", "nation-state hackers",
    ],
    tickers: ["CRWD", "PANW", "FTNT", "ZS"],
    etfs: ["CIBR"],
  },
  {
    id: "healthcare",
    label: "Healthcare",
    keywords: [
      "healthcare policy", "health insurance", "hospital system", "medicare", "medicaid",
      "healthcare spending",
    ],
    tickers: ["LLY", "JNJ", "UNH", "ABBV"],
    etfs: ["XLV", "IHI"],
    relatedSectors: ["biotechnology", "pharmaceuticals"],
  },
  {
    id: "biotechnology",
    label: "Biotechnology",
    keywords: [
      "biotech", "clinical trial", "gene therapy", "drug trial results", "biologic drug",
    ],
    tickers: ["MRNA", "REGN", "VRTX", "AMGN"],
    etfs: ["XBI"],
    relatedSectors: ["pharmaceuticals", "healthcare"],
  },
  {
    id: "pharmaceuticals",
    label: "Pharmaceuticals",
    keywords: [
      "pharmaceutical", "drug pricing", "generic drug", "fda approves", "fda approval",
      "drug recall", "new drug application",
    ],
    tickers: ["PFE", "MRK", "LLY", "JNJ"],
    etfs: ["XPH"],
    relatedSectors: ["biotechnology", "healthcare"],
  },
  {
    id: "energy",
    label: "Energy",
    keywords: ["energy policy", "energy department", "energy prices", "power grid"],
    tickers: [],
    etfs: ["XLE"],
    relatedSectors: ["oil-and-gas", "nuclear-energy", "renewable-energy"],
  },
  {
    id: "oil-and-gas",
    label: "Oil and Gas",
    keywords: [
      "oil price", "crude oil", "opec", "natural gas price", "drilling permit", "pipeline project",
      "oil production", "oil supply",
    ],
    tickers: ["XOM", "CVX", "COP", "OXY"],
    etfs: ["XLE", "XOP"],
    relatedSectors: ["energy"],
  },
  {
    id: "nuclear-energy",
    label: "Nuclear Energy",
    keywords: [
      "nuclear power", "nuclear reactor", "uranium supply", "small modular reactor", "nuclear energy",
    ],
    tickers: ["CEG", "VST", "CCJ", "LEU"],
    etfs: ["URA", "NLR"],
    relatedSectors: ["energy"],
  },
  {
    id: "renewable-energy",
    label: "Renewable Energy",
    keywords: [
      "solar power", "wind power", "renewable energy", "clean energy", "solar panel manufacturing",
      "wind farm",
    ],
    tickers: ["FSLR", "ENPH", "NEE"],
    etfs: ["TAN", "ICLN"],
    relatedSectors: ["energy"],
  },
  {
    id: "mining",
    label: "Mining",
    keywords: ["mining production", "mineral extraction", "copper mine", "mining permit"],
    tickers: ["FCX", "NEM"],
    etfs: ["XME"],
    relatedSectors: ["rare-earth-minerals"],
  },
  {
    id: "rare-earth-minerals",
    label: "Rare-Earth Minerals",
    keywords: [
      "rare earth", "critical minerals", "lithium supply", "cobalt supply", "rare earth export",
      "rare earth quota",
    ],
    tickers: ["MP", "ALB", "FCX"],
    etfs: ["REMX", "COPX"],
    relatedSectors: ["mining"],
  },
  {
    id: "banking",
    label: "Banking",
    keywords: [
      "bank earnings", "banking regulation", "bank failure", "bank stress test", "lending standards",
    ],
    tickers: ["JPM", "BAC", "WFC", "C"],
    etfs: ["XLF"],
    relatedSectors: ["interest-rates"],
  },
  {
    id: "interest-rates",
    label: "Interest Rates",
    keywords: [
      "interest rate", "rate hike", "rate cut", "federal funds rate", "fomc meeting", "fed decision",
      "federal reserve raises", "federal reserve cuts",
    ],
    tickers: [],
    etfs: ["TLT"],
    relatedSectors: ["banking", "housing"],
  },
  {
    id: "inflation",
    label: "Inflation",
    keywords: [
      "inflation report", "consumer price index", "cpi report", "core inflation", "producer price index",
    ],
    tickers: [],
    etfs: [],
    relatedSectors: ["interest-rates"],
  },
  {
    id: "housing",
    label: "Housing",
    keywords: [
      "housing market", "mortgage rate", "home sales", "housing starts", "home builder confidence",
    ],
    tickers: ["DHI", "LEN", "PHM"],
    etfs: ["XHB"],
    relatedSectors: ["interest-rates"],
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    keywords: [
      "infrastructure bill", "infrastructure spending", "bridge repair", "road construction",
      "infrastructure project",
    ],
    tickers: ["CAT", "VMC", "MLM"],
    etfs: ["PAVE"],
  },
  {
    id: "transportation",
    label: "Transportation",
    keywords: [
      "freight volume", "shipping rates", "railroad", "trucking industry", "port congestion",
    ],
    tickers: ["UNP", "CSX", "UPS", "FDX"],
    etfs: ["IYT"],
    relatedSectors: ["supply-chains"],
  },
  {
    id: "aerospace",
    label: "Aerospace",
    keywords: ["aerospace industry", "aircraft manufacturing", "commercial aviation order"],
    tickers: ["BA", "GE"],
    etfs: ["ITA"],
    relatedSectors: ["defense", "space"],
  },
  {
    id: "space",
    label: "Space",
    keywords: ["space launch", "satellite deployment", "nasa mission", "rocket launch", "space program"],
    tickers: ["RKLB"],
    etfs: ["ARKX", "UFO"],
    relatedSectors: ["aerospace", "defense"],
  },
  {
    id: "agriculture",
    label: "Agriculture",
    keywords: ["crop prices", "farm income", "farm subsidy", "agricultural export", "harvest forecast"],
    tickers: ["DE", "ADM", "BG"],
    etfs: ["MOO"],
  },
  {
    id: "consumer-spending",
    label: "Consumer Spending",
    keywords: ["consumer spending", "retail sales report", "consumer confidence index"],
    tickers: ["WMT", "TGT", "AMZN"],
    etfs: ["XLY"],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    keywords: [
      "manufacturing output", "factory activity", "ism manufacturing", "industrial production report",
    ],
    tickers: ["CAT", "HON", "MMM"],
    etfs: ["XLI"],
    relatedSectors: ["supply-chains"],
  },
  {
    id: "international-trade",
    label: "International Trade",
    keywords: ["trade deal", "trade agreement", "trade negotiation", "export controls"],
    tickers: [],
    etfs: [],
    relatedSectors: ["tariffs"],
  },
  {
    id: "tariffs",
    label: "Tariffs",
    keywords: ["tariff", "import tax", "trade war", "retaliatory tariff"],
    tickers: [],
    etfs: [],
    relatedSectors: ["international-trade", "supply-chains"],
  },
  {
    id: "supply-chains",
    label: "Supply Chains",
    keywords: [
      "supply chain disruption", "supply chain shortage", "shipping delay", "semiconductor shortage",
      "port backlog",
    ],
    tickers: [],
    etfs: [],
  },
  {
    id: "government-spending",
    label: "Government Spending",
    keywords: [
      "government funding", "federal budget", "appropriations bill", "government spending bill",
      "stimulus package", "federal grant",
    ],
    tickers: [],
    etfs: [],
  },
  {
    id: "corporate-earnings",
    label: "Corporate Earnings",
    keywords: [
      "quarterly earnings", "earnings report", "earnings beat", "earnings miss", "guidance raised",
      "guidance cut", "revenue forecast",
    ],
    tickers: [],
    etfs: [],
  },
  {
    id: "mergers-and-acquisitions",
    label: "Mergers and Acquisitions",
    keywords: ["acquisition of", "merger agreement", "buyout offer", "takeover bid", "to acquire"],
    tickers: [],
    etfs: [],
  },
  {
    id: "geopolitics",
    label: "Geopolitics",
    keywords: [
      "geopolitical tension", "sanctions on", "military conflict", "ceasefire agreement",
      "diplomatic tension", "border conflict",
    ],
    tickers: [],
    etfs: [],
  },
  {
    id: "natural-disasters",
    label: "Natural Disasters",
    keywords: ["hurricane warning", "earthquake strikes", "wildfire", "flooding", "natural disaster"],
    tickers: [],
    etfs: [],
    relatedSectors: ["supply-chains", "agriculture"],
  },
];

export function getSectorMapping(id: string): SectorMapping | undefined {
  return SECTOR_MAPPINGS.find((s) => s.id === id);
}

export function allTickers(): string[] {
  return [...new Set(SECTOR_MAPPINGS.flatMap((s) => s.tickers))];
}
