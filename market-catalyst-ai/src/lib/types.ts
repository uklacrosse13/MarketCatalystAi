export type ImpactDirection = "bullish" | "bearish" | "mixed";
export type TimeHorizon = "days" | "weeks" | "1-6 months" | "6-18 months" | "1-3 years";

export type EventCategory =
  | "Artificial Intelligence"
  | "Defense"
  | "Geopolitics"
  | "China"
  | "Energy"
  | "Healthcare"
  | "Inflation & Rates"
  | "Banking"
  | "Cybersecurity"
  | "Infrastructure"
  | "Trade & Tariffs"
  | "Climate & Disasters"
  | "Supply Chains"
  | "Corporate Earnings";

export interface CompanyImpact {
  ticker: string;
  name: string;
  direction: ImpactDirection;
  rationale: string;
}

export interface MarketEvent {
  id: string;
  headline: string;
  summary: string;
  category: EventCategory;
  subcategory: string;
  publishedAt: string; // ISO date
  source: string;
  potentialWinners: CompanyImpact[];
  potentialLosers: CompanyImpact[];
  confidence: number; // 0-100
  timeHorizon: TimeHorizon;
  reasoning: string[];
  affectedSectors: string[]; // sector slugs
  historicalComparisons: string[]; // historical event slugs
}

export interface Company {
  ticker: string;
  name: string;
  sectorSlug: string;
  industry: string;
  price: number;
  changePercent: number;
  marketCap: string;
  aiOpportunityScore: number; // 0-100
  aiSummary: string;
  recentCatalysts: string[];
  competitors: string[];
  majorCustomers: string[];
  supplyChainExposure: string[];
  riskFactors: string[];
  upcomingEarnings: string;
  governmentContracts: string[];
  sparkline: number[]; // relative price series for mini chart
}

export interface Sector {
  slug: string;
  name: string;
  overview: string;
  topCompanies: string[]; // tickers
  aiSentiment: ImpactDirection;
  sectorStrength: number; // 0-100
  historicalReturn1Y: number; // percent
  majorRisks: string[];
  currentCatalysts: string[];
  etfs: { ticker: string; name: string }[];
}

export interface NewsArticle {
  id: string;
  headline: string;
  source: string;
  publishedAt: string;
  summary: string;
  sentiment: ImpactDirection;
  affectedIndustries: string[];
  affectedTickers: string[];
  shortTermImpact: string;
  longTermImpact: string;
  confidence: number;
  historicalComparison: string;
  investmentThesis: string;
}

export interface HistoricalEvent {
  slug: string;
  name: string;
  dateRange: string;
  summary: string;
  affectedSectors: string[];
  winners: CompanyImpact[];
  losers: CompanyImpact[];
  lessonsLearned: string[];
  timeline: { date: string; label: string }[];
}

export interface Alert {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  severity: "info" | "watch" | "urgent";
}

export interface Watchlist {
  id: string;
  name: string;
  tickers: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
