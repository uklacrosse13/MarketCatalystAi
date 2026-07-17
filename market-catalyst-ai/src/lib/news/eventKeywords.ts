// ---------------------------------------------------------------------------
// Keyword sets that power event-type classification and catalyst-direction
// detection in src/lib/news/marketImpact.ts. Edit freely — every string
// should be lowercase, since matching is done against lower-cased text.
// ---------------------------------------------------------------------------

export interface EventTypeRule {
  id: string;
  label: string;
  keywords: string[];
}

export const EVENT_TYPES: EventTypeRule[] = [
  {
    id: "government-spending",
    label: "Government Spending",
    keywords: [
      "funding for", "government funding", "federal investment", "spending bill",
      "appropriations", "stimulus package", "grant program", "federal subsidy",
    ],
  },
  {
    id: "government-contract",
    label: "Government Contract",
    keywords: ["awarded a contract", "contract award", "defense contract", "government contract"],
  },
  {
    id: "regulatory-action",
    label: "Regulatory Action",
    keywords: [
      "regulatory approval", "fda approves", "sec charges", "antitrust", "compliance rule",
      "ban on", "restriction on", "new regulation",
    ],
  },
  {
    id: "monetary-policy",
    label: "Monetary Policy",
    keywords: ["interest rate", "rate hike", "rate cut", "fomc", "monetary policy", "federal reserve raises", "federal reserve cuts"],
  },
  {
    id: "trade-policy",
    label: "Trade Policy",
    keywords: ["tariff", "trade deal", "trade agreement", "export control", "import ban", "trade war"],
  },
  {
    id: "geopolitical-event",
    label: "Geopolitical Event",
    keywords: ["sanctions", "military conflict", "ceasefire", "invasion", "diplomatic tension"],
  },
  {
    id: "corporate-earnings",
    label: "Corporate Earnings",
    keywords: ["quarterly earnings", "earnings report", "earnings beat", "earnings miss", "guidance raised", "guidance cut"],
  },
  {
    id: "merger-acquisition",
    label: "Merger or Acquisition",
    keywords: ["acquisition of", "merger agreement", "buyout offer", "takeover bid", "to acquire"],
  },
  {
    id: "natural-disaster",
    label: "Natural Disaster",
    keywords: ["hurricane", "earthquake", "wildfire", "flooding", "natural disaster"],
  },
  {
    id: "supply-chain-disruption",
    label: "Supply Chain Disruption",
    keywords: ["supply chain disruption", "shipping delay", "shortage of", "port congestion"],
  },
  {
    id: "cybersecurity-incident",
    label: "Cybersecurity Incident",
    keywords: ["cyberattack", "data breach", "ransomware attack", "hacked", "hacking group"],
  },
  {
    id: "general-news",
    label: "General News",
    keywords: [],
  },
];

/** Phrases suggesting a story leans favorably for the companies/sectors it names. */
export const POSITIVE_CATALYST_PHRASES: string[] = [
  "announces additional funding", "approves", "awarded a contract", "raises guidance",
  "beats expectations", "expands production", "receives approval", "signs agreement",
  "reports record", "increases investment", "grants approval", "secures funding",
  "wins contract", "strengthens partnership", "announces expansion",
];

/** Phrases suggesting a story leans unfavorably for the companies/sectors it names. */
export const NEGATIVE_CATALYST_PHRASES: string[] = [
  "cuts guidance", "misses expectations", "recall", "investigation into",
  "files for bankruptcy", "halts production", "layoffs", "faces lawsuit",
  "warns of", "downgrades", "restricts", "bans", "sanctions imposed",
  "shortage of", "disruption to", "declines sharply", "closes plant",
];
