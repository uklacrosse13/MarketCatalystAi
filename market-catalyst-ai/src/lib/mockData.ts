import type {
  MarketEvent,
  Company,
  Sector,
  NewsArticle,
  HistoricalEvent,
  Alert,
  Watchlist,
} from "./types";

// ---------------------------------------------------------------------------
// This file is the platform's built-in sample dataset. It exists so the app
// is fully explorable with `npm run dev` and no API keys configured. Once you
// wire up src/lib/newsProvider.ts, src/lib/stockProvider.ts and src/lib/openai.ts,
// swap these arrays for live Supabase queries — the shapes already match the
// types those providers return, so components don't need to change.
// ---------------------------------------------------------------------------

export const companies: Company[] = [
  {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    sectorSlug: "semiconductors",
    industry: "GPUs & AI Accelerators",
    price: 128.42,
    changePercent: 2.14,
    marketCap: "3.15T",
    aiOpportunityScore: 91,
    aiSummary:
      "Sits at the center of the AI infrastructure buildout. Data-center GPU demand continues to outstrip supply, and export-control headlines move this stock more than almost any other name on the platform.",
    recentCatalysts: ["Blackwell shipment ramp", "Hyperscaler capex raise", "Export licensing update"],
    competitors: ["AMD", "INTC", "AVGO"],
    majorCustomers: ["Microsoft", "Meta", "Amazon", "Google"],
    supplyChainExposure: ["TSMC advanced packaging (CoWoS)", "SK Hynix HBM memory"],
    riskFactors: ["China export restrictions", "Customer capex cyclicality", "Custom-silicon competition"],
    upcomingEarnings: "2026-08-20",
    governmentContracts: [],
    sparkline: [96, 101, 98, 108, 112, 109, 118, 121, 126, 128],
  },
  {
    ticker: "AMD",
    name: "Advanced Micro Devices",
    sectorSlug: "semiconductors",
    industry: "CPUs & AI Accelerators",
    price: 168.77,
    changePercent: 1.42,
    marketCap: "273B",
    aiOpportunityScore: 78,
    aiSummary:
      "The clearest alternative supplier when NVIDIA faces allocation constraints or export limits. MI300-series adoption is the swing factor for whether AMD converts share-of-wallet in AI training and inference.",
    recentCatalysts: ["MI350 roadmap update", "New hyperscaler design win"],
    competitors: ["NVDA", "INTC"],
    majorCustomers: ["Microsoft", "Oracle", "Meta"],
    supplyChainExposure: ["TSMC leading-edge nodes"],
    riskFactors: ["Software ecosystem gap vs. CUDA", "Cyclical PC/server demand"],
    upcomingEarnings: "2026-07-29",
    governmentContracts: [],
    sparkline: [140, 145, 150, 148, 155, 160, 158, 163, 166, 169],
  },
  {
    ticker: "TSM",
    name: "Taiwan Semiconductor Mfg. Co.",
    sectorSlug: "semiconductors",
    industry: "Chip Foundry",
    price: 204.11,
    changePercent: -0.62,
    marketCap: "1.06T",
    aiOpportunityScore: 88,
    aiSummary:
      "Manufactures the overwhelming majority of the world's leading-edge chips. Any Taiwan Strait tension or export-control headline runs through this name first — it's both the biggest AI beneficiary and the biggest geopolitical risk concentration on the platform.",
    recentCatalysts: ["Arizona fab yield update", "2nm process ramp"],
    competitors: ["Samsung Foundry", "Intel Foundry"],
    majorCustomers: ["Apple", "NVIDIA", "AMD", "Qualcomm"],
    supplyChainExposure: ["ASML EUV lithography tools"],
    riskFactors: ["Taiwan Strait geopolitical risk", "U.S.–China export policy", "Concentration of leading-edge capacity"],
    upcomingEarnings: "2026-07-17",
    governmentContracts: ["U.S. CHIPS Act award (Arizona fabs)"],
    sparkline: [210, 208, 205, 201, 198, 202, 206, 203, 205, 204],
  },
  {
    ticker: "ASML",
    name: "ASML Holding N.V.",
    sectorSlug: "semiconductors",
    industry: "Lithography Equipment",
    price: 981.5,
    changePercent: 0.35,
    marketCap: "395B",
    aiOpportunityScore: 80,
    aiSummary:
      "The sole supplier of EUV lithography machines needed for leading-edge chips, making it a chokepoint the Dutch and U.S. governments use directly in export-control policy toward China.",
    recentCatalysts: ["High-NA EUV order backlog", "China shipment license renewal"],
    competitors: [],
    majorCustomers: ["TSMC", "Samsung", "Intel"],
    supplyChainExposure: ["Zeiss optics", "Cymer light sources"],
    riskFactors: ["Direct export-license exposure", "China revenue concentration"],
    upcomingEarnings: "2026-07-23",
    governmentContracts: [],
    sparkline: [940, 955, 948, 960, 972, 965, 978, 970, 985, 981],
  },
  {
    ticker: "LMT",
    name: "Lockheed Martin Corp.",
    sectorSlug: "defense",
    industry: "Aerospace & Defense",
    price: 512.3,
    changePercent: 0.88,
    marketCap: "122B",
    aiOpportunityScore: 68,
    aiSummary:
      "Primary beneficiary of NATO and Indo-Pacific defense-spending increases. Backlog visibility is unusually long for the market, which makes it a common hedge against escalation-driven volatility.",
    recentCatalysts: ["F-35 multi-year order", "NATO spending commitment increase"],
    competitors: ["RTX", "NOC", "GD"],
    majorCustomers: ["U.S. Department of Defense", "NATO allies", "Japan", "Australia"],
    supplyChainExposure: ["Specialty alloys", "Semiconductor-grade electronics"],
    riskFactors: ["Budget continuing-resolution delays", "Program cost overruns"],
    upcomingEarnings: "2026-07-22",
    governmentContracts: ["F-35 Joint Strike Fighter", "PAC-3 missile production"],
    sparkline: [480, 490, 495, 500, 505, 498, 507, 510, 508, 512],
  },
  {
    ticker: "RTX",
    name: "RTX Corporation",
    sectorSlug: "defense",
    industry: "Aerospace & Defense",
    price: 132.6,
    changePercent: 0.51,
    marketCap: "196B",
    aiOpportunityScore: 66,
    aiSummary:
      "Air-defense and missile systems demand has risen sharply amid Middle East and European conflicts; commercial aerospace (Pratt & Whitney) provides a second, less cyclical growth engine.",
    recentCatalysts: ["Patriot missile replenishment order", "Commercial engine aftermarket growth"],
    competitors: ["LMT", "NOC", "GD"],
    majorCustomers: ["U.S. DoD", "Boeing", "Airbus"],
    supplyChainExposure: ["Titanium forgings", "Rare earth magnets"],
    riskFactors: ["Engine durability remediation costs", "Supply chain labor shortages"],
    upcomingEarnings: "2026-07-24",
    governmentContracts: ["Patriot missile systems", "NASAMS air defense"],
    sparkline: [120, 122, 125, 124, 128, 127, 130, 129, 131, 133],
  },
  {
    ticker: "XOM",
    name: "Exxon Mobil Corp.",
    sectorSlug: "energy",
    industry: "Integrated Oil & Gas",
    price: 118.9,
    changePercent: -1.05,
    marketCap: "486B",
    aiOpportunityScore: 54,
    aiSummary:
      "Benefits directly from oil-price spikes tied to Middle East supply disruption, though margins are increasingly offset by U.S. shale discipline and OPEC+ spare capacity.",
    recentCatalysts: ["OPEC+ production quota update", "Guyana output ramp"],
    competitors: ["CVX", "COP", "SHEL"],
    majorCustomers: ["Global refiners", "Petrochemical buyers"],
    supplyChainExposure: ["Offshore drilling services", "LNG shipping capacity"],
    riskFactors: ["Oil price volatility", "Energy transition policy risk"],
    upcomingEarnings: "2026-08-01",
    governmentContracts: [],
    sparkline: [112, 114, 116, 113, 117, 119, 116, 120, 118, 119],
  },
  {
    ticker: "MP",
    name: "MP Materials Corp.",
    sectorSlug: "rare-earths",
    industry: "Rare Earth Mining & Processing",
    price: 24.85,
    changePercent: 3.67,
    marketCap: "4.6B",
    aiOpportunityScore: 74,
    aiSummary:
      "Operates the only integrated U.S. rare-earth mine-to-magnet supply chain, making it the direct beneficiary any time China tightens rare-earth export quotas.",
    recentCatalysts: ["DoD magnet-production investment", "China export quota tightening"],
    competitors: ["Lynas Rare Earths"],
    majorCustomers: ["U.S. defense supply chain", "EV motor manufacturers"],
    supplyChainExposure: ["Domestic Mountain Pass mine"],
    riskFactors: ["China price dumping", "Processing scale-up execution risk"],
    upcomingEarnings: "2026-08-06",
    governmentContracts: ["DoD rare-earth magnet facility investment"],
    sparkline: [18, 19, 20, 19, 21, 22, 21, 23, 24, 25],
  },
  {
    ticker: "JPM",
    name: "JPMorgan Chase & Co.",
    sectorSlug: "banking",
    industry: "Diversified Banking",
    price: 214.3,
    changePercent: 0.29,
    marketCap: "615B",
    aiOpportunityScore: 60,
    aiSummary:
      "Net interest income is highly sensitive to Fed policy; a steady or steepening yield curve tends to help, while abrupt cuts compress margins even as they lift capital-markets activity.",
    recentCatalysts: ["Fed rate-path commentary", "Investment-banking fee rebound"],
    competitors: ["BAC", "WFC", "C"],
    majorCustomers: [],
    supplyChainExposure: [],
    riskFactors: ["Credit cycle deterioration", "Regulatory capital requirements"],
    upcomingEarnings: "2026-07-15",
    governmentContracts: [],
    sparkline: [205, 208, 210, 207, 211, 213, 210, 214, 212, 214],
  },
  {
    ticker: "FSLR",
    name: "First Solar, Inc.",
    sectorSlug: "renewables",
    industry: "Solar Manufacturing",
    price: 189.4,
    changePercent: 1.9,
    marketCap: "20.3B",
    aiOpportunityScore: 62,
    aiSummary:
      "U.S.-based manufacturing footprint benefits from domestic-content tax credits and tariffs on Southeast Asian panel imports, insulating it from the price pressure hitting import-reliant peers.",
    recentCatalysts: ["Anti-dumping tariff ruling", "IRA manufacturing credit guidance"],
    competitors: ["Canadian Solar", "JinkoSolar"],
    majorCustomers: ["Utility-scale solar developers"],
    supplyChainExposure: ["Domestic thin-film module lines"],
    riskFactors: ["Policy reversal risk", "Utility-scale project financing costs"],
    upcomingEarnings: "2026-07-31",
    governmentContracts: [],
    sparkline: [170, 175, 178, 174, 180, 183, 179, 186, 184, 189],
  },
  {
    ticker: "PANW",
    name: "Palo Alto Networks, Inc.",
    sectorSlug: "cybersecurity",
    industry: "Enterprise Cybersecurity",
    price: 198.6,
    changePercent: 1.12,
    marketCap: "57B",
    aiOpportunityScore: 72,
    aiSummary:
      "Nation-state cyber activity and ransomware headlines reliably drive enterprise security budget increases, and platform consolidation trends favor scaled vendors over point solutions.",
    recentCatalysts: ["Federal cybersecurity mandate", "Platform-consolidation deal wins"],
    competitors: ["CRWD", "FTNT", "ZS"],
    majorCustomers: ["Fortune 500 enterprises", "U.S. federal agencies"],
    supplyChainExposure: [],
    riskFactors: ["Intense competitive pricing", "Long enterprise sales cycles"],
    upcomingEarnings: "2026-08-18",
    governmentContracts: ["CISA-aligned federal security contracts"],
    sparkline: [180, 183, 186, 184, 189, 191, 188, 194, 196, 199],
  },
  {
    ticker: "DE",
    name: "Deere & Company",
    sectorSlug: "agriculture",
    industry: "Agricultural Machinery",
    price: 402.15,
    changePercent: -0.4,
    marketCap: "108B",
    aiOpportunityScore: 55,
    aiSummary:
      "Farm income and equipment replacement cycles move with crop prices and trade policy; new tariff regimes on agricultural exports can pressure farmer income and delay equipment purchases.",
    recentCatalysts: ["Precision-ag autonomy rollout", "Farm income outlook revision"],
    competitors: ["AGCO", "CNH Industrial"],
    majorCustomers: ["Commercial farm operators"],
    supplyChainExposure: ["Semiconductor-based precision ag electronics"],
    riskFactors: ["Trade retaliation on U.S. crop exports", "Used-equipment oversupply"],
    upcomingEarnings: "2026-08-14",
    governmentContracts: [],
    sparkline: [395, 398, 402, 397, 405, 408, 403, 406, 400, 402],
  },
  {
    ticker: "SMCI",
    name: "Super Micro Computer, Inc.",
    sectorSlug: "semiconductors",
    industry: "AI Server Infrastructure",
    price: 46.2,
    changePercent: 4.3,
    marketCap: "27B",
    aiOpportunityScore: 69,
    aiSummary:
      "High-density AI server builder that scales directly with hyperscaler GPU deployment; volatile due to thin margins and periodic supply-chain and accounting scrutiny.",
    recentCatalysts: ["New liquid-cooling server line", "Hyperscaler order backlog update"],
    competitors: ["DELL", "HPE"],
    majorCustomers: ["Cloud hyperscalers", "AI research labs"],
    supplyChainExposure: ["NVIDIA GPU allocation", "Taiwan ODM assembly"],
    riskFactors: ["Thin gross margins", "Customer concentration"],
    upcomingEarnings: "2026-08-05",
    governmentContracts: [],
    sparkline: [34, 36, 38, 35, 40, 42, 39, 44, 43, 46],
  },
];

export const sectors: Sector[] = [
  {
    slug: "semiconductors",
    name: "Semiconductors",
    overview:
      "Chip designers, foundries, and equipment makers powering the AI buildout. The most policy-sensitive sector on the platform — export controls and Taiwan Strait tension can move it faster than any earnings report.",
    topCompanies: ["NVDA", "AMD", "TSM", "ASML", "SMCI"],
    aiSentiment: "bullish",
    sectorStrength: 87,
    historicalReturn1Y: 42.6,
    majorRisks: ["Export-control escalation", "Taiwan geopolitical risk", "Capex cyclicality"],
    currentCatalysts: ["AI data-center buildout", "Sovereign AI infrastructure programs"],
    etfs: [
      { ticker: "SOXX", name: "iShares Semiconductor ETF" },
      { ticker: "SMH", name: "VanEck Semiconductor ETF" },
    ],
  },
  {
    slug: "defense",
    name: "Defense & Aerospace",
    overview:
      "Prime contractors and munitions makers benefiting from sustained NATO, Indo-Pacific, and Middle East defense-spending increases and long-cycle government backlogs.",
    topCompanies: ["LMT", "RTX"],
    aiSentiment: "bullish",
    sectorStrength: 74,
    historicalReturn1Y: 21.3,
    majorRisks: ["Budget continuing resolutions", "Program delays and cost overruns"],
    currentCatalysts: ["NATO 2%+ spending commitments", "Munitions replenishment orders"],
    etfs: [{ ticker: "ITA", name: "iShares U.S. Aerospace & Defense ETF" }],
  },
  {
    slug: "energy",
    name: "Energy",
    overview:
      "Oil, gas, and integrated majors whose margins track crude prices, OPEC+ policy, and geopolitical supply disruption in the Middle East and Russia.",
    topCompanies: ["XOM"],
    aiSentiment: "mixed",
    sectorStrength: 58,
    historicalReturn1Y: 9.4,
    majorRisks: ["Oil price volatility", "Energy transition policy"],
    currentCatalysts: ["OPEC+ quota changes", "Middle East supply risk premium"],
    etfs: [{ ticker: "XLE", name: "Energy Select Sector SPDR Fund" }],
  },
  {
    slug: "rare-earths",
    name: "Rare Earth Metals & Mining",
    overview:
      "Critical minerals producers positioned to benefit from Western efforts to reduce dependence on Chinese rare-earth export quotas, particularly for defense and EV supply chains.",
    topCompanies: ["MP"],
    aiSentiment: "bullish",
    sectorStrength: 66,
    historicalReturn1Y: 33.8,
    majorRisks: ["China price dumping", "Processing capacity constraints"],
    currentCatalysts: ["China export quota tightening", "DoD supply-chain investment"],
    etfs: [{ ticker: "REMX", name: "VanEck Rare Earth/Strategic Metals ETF" }],
  },
  {
    slug: "banking",
    name: "Banking & Financials",
    overview:
      "Money-center and regional banks whose net interest margins move with Fed policy, yield-curve shape, and credit-cycle conditions.",
    topCompanies: ["JPM"],
    aiSentiment: "mixed",
    sectorStrength: 61,
    historicalReturn1Y: 18.2,
    majorRisks: ["Credit cycle deterioration", "Regulatory capital changes"],
    currentCatalysts: ["Fed rate-path decisions", "Capital-markets fee rebound"],
    etfs: [{ ticker: "XLF", name: "Financial Select Sector SPDR Fund" }],
  },
  {
    slug: "renewables",
    name: "Renewables & Clean Energy",
    overview:
      "Solar, wind, and storage manufacturers whose economics hinge on domestic-content tax credits, import tariffs, and interest rates for project financing.",
    topCompanies: ["FSLR"],
    aiSentiment: "mixed",
    sectorStrength: 52,
    historicalReturn1Y: -4.1,
    majorRisks: ["Policy reversal risk", "Rate-sensitive project financing"],
    currentCatalysts: ["Import tariff rulings", "Domestic manufacturing credits"],
    etfs: [{ ticker: "TAN", name: "Invesco Solar ETF" }],
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    overview:
      "Enterprise and government security vendors that benefit from rising nation-state cyber activity and steadily consolidating security budgets.",
    topCompanies: ["PANW"],
    aiSentiment: "bullish",
    sectorStrength: 79,
    historicalReturn1Y: 27.5,
    majorRisks: ["Vendor price competition", "Long federal sales cycles"],
    currentCatalysts: ["Federal cybersecurity mandates", "Platform-consolidation deals"],
    etfs: [{ ticker: "CIBR", name: "First Trust NASDAQ Cybersecurity ETF" }],
  },
  {
    slug: "agriculture",
    name: "Agriculture",
    overview:
      "Machinery makers and input suppliers exposed to farm income, crop prices, and trade policy affecting agricultural exports.",
    topCompanies: ["DE"],
    aiSentiment: "mixed",
    sectorStrength: 47,
    historicalReturn1Y: 3.6,
    majorRisks: ["Trade retaliation on exports", "Farm income cyclicality"],
    currentCatalysts: ["Precision-ag autonomy adoption", "Trade negotiation outcomes"],
    etfs: [{ ticker: "MOO", name: "VanEck Agribusiness ETF" }],
  },
];

export const events: MarketEvent[] = [
  {
    id: "evt-001",
    headline: "U.S. announces new semiconductor export restrictions on advanced AI chips to China",
    summary:
      "The Commerce Department expanded licensing requirements for advanced AI accelerators and the equipment used to make them, tightening an already restrictive framework introduced in prior years.",
    category: "China",
    subcategory: "Semiconductor Export Controls",
    publishedAt: "2026-07-14T13:20:00Z",
    source: "Reuters",
    potentialWinners: [
      { ticker: "TSM", name: "Taiwan Semiconductor", direction: "bullish", rationale: "Non-China leading-edge capacity becomes relatively more valuable as allocation shifts toward allied markets." },
      { ticker: "AMD", name: "Advanced Micro Devices", direction: "bullish", rationale: "Could gain share in non-restricted markets as customers diversify away from concentrated NVIDIA allocation." },
      { ticker: "MP", name: "MP Materials", direction: "bullish", rationale: "Restrictions often trigger reciprocal Chinese rare-earth export tightening, boosting the case for domestic supply chains." },
    ],
    potentialLosers: [
      { ticker: "NVDA", name: "NVIDIA", direction: "bearish", rationale: "Loses access to a meaningful slice of China data-center demand and must write down restricted inventory." },
      { ticker: "ASML", name: "ASML Holding", direction: "bearish", rationale: "Faces tighter licensing on shipments of advanced lithography systems to Chinese fabs." },
    ],
    confidence: 84,
    timeHorizon: "6-18 months",
    reasoning: [
      "Export restrictions reduce the addressable market for the highest-margin AI chips sold into China, pressuring near-term revenue for suppliers with meaningful China exposure.",
      "Over time, restricted companies historically redirect capacity toward non-restricted markets (the U.S., EU, Gulf states, and Southeast Asia), partially offsetting the lost demand.",
      "Restrictions tend to accelerate China's domestic chip self-sufficiency push, which can pressure Western equipment makers' long-run China revenue even as it creates near-term compliance-driven order pull-forward.",
      "Historically, allied foundries and equipment makers outside the restricted perimeter (or with de-risked customer bases) see relative strength as global capacity gets reallocated.",
    ],
    affectedSectors: ["semiconductors", "rare-earths"],
    historicalComparisons: ["chips-act-2022", "china-export-controls-2023"],
  },
  {
    id: "evt-002",
    headline: "NATO members commit to raising defense spending targets amid escalating regional tensions",
    summary:
      "Several NATO members agreed to accelerate defense-spending increases, with multi-year commitments to modernize air defense, munitions stockpiles, and naval capacity.",
    category: "Defense",
    subcategory: "Alliance Spending Commitments",
    publishedAt: "2026-07-12T09:05:00Z",
    source: "Associated Press",
    potentialWinners: [
      { ticker: "LMT", name: "Lockheed Martin", direction: "bullish", rationale: "Long-cycle backlog directly benefits from multi-year procurement commitments across allied air-defense programs." },
      { ticker: "RTX", name: "RTX Corporation", direction: "bullish", rationale: "Missile and munitions replenishment orders scale directly with new spending targets." },
    ],
    potentialLosers: [],
    confidence: 76,
    timeHorizon: "1-3 years",
    reasoning: [
      "Defense budgets typically translate into contractor backlog with a lag of several quarters as procurement processes move through legislatures.",
      "Munitions and air-defense systems tend to see the fastest order flow given current battlefield attrition rates.",
      "Historically, sustained multi-year spending commitments provide unusually long revenue visibility compared to most industrial sectors, which supports valuation premiums for primes.",
    ],
    affectedSectors: ["defense"],
    historicalComparisons: ["russia-ukraine-war"],
  },
  {
    id: "evt-003",
    headline: "Federal Reserve signals it may hold rates steady through year-end amid sticky inflation",
    summary:
      "Fed officials indicated a cautious stance on further rate cuts, citing inflation readings that have not moved decisively toward the 2% target.",
    category: "Inflation & Rates",
    subcategory: "Federal Reserve Policy",
    publishedAt: "2026-07-10T18:30:00Z",
    source: "Bloomberg",
    potentialWinners: [
      { ticker: "JPM", name: "JPMorgan Chase", direction: "bullish", rationale: "A higher-for-longer rate path tends to support net interest margins for large deposit-funded banks." },
    ],
    potentialLosers: [
      { ticker: "FSLR", name: "First Solar", direction: "bearish", rationale: "Utility-scale renewable projects are financing-cost sensitive; a delayed cutting cycle raises the cost of capital for developers." },
    ],
    confidence: 66,
    timeHorizon: "6-18 months",
    reasoning: [
      "Rate-sensitive sectors (renewables, housing, small-cap growth) tend to underperform when cut expectations get pushed out.",
      "Banks generally benefit from a steady-to-steepening curve, though a hold that reflects economic strength differs from a hold that reflects credit stress — the underlying reason for the pause matters as much as the pause itself.",
      "Markets have historically overreacted to single Fed statements before reverting once subsequent data clarifies the actual policy path, so confidence here is moderate rather than high.",
    ],
    affectedSectors: ["banking", "renewables"],
    historicalComparisons: ["fed-hiking-cycle-2022-2023"],
  },
  {
    id: "evt-004",
    headline: "China tightens export quotas on rare earth elements used in defense and EV manufacturing",
    summary:
      "Beijing narrowed export quotas for several rare-earth categories, citing domestic supply-chain security, in a move widely seen as a response to Western semiconductor restrictions.",
    category: "China",
    subcategory: "Critical Minerals",
    publishedAt: "2026-07-08T07:45:00Z",
    source: "Financial Times",
    potentialWinners: [
      { ticker: "MP", name: "MP Materials", direction: "bullish", rationale: "The only vertically integrated U.S. rare-earth producer stands to gain pricing power and government support as buyers seek non-China supply." },
    ],
    potentialLosers: [
      { ticker: "DE", name: "Deere & Company", direction: "bearish", rationale: "Precision-agriculture equipment relies on rare-earth magnets for electric motors; tighter quotas can raise input costs." },
    ],
    confidence: 71,
    timeHorizon: "1-3 years",
    reasoning: [
      "China controls the large majority of global rare-earth processing capacity, giving export quota changes outsized price impact even when mined volumes are unaffected.",
      "Downstream manufacturers with magnet-dependent supply chains (EVs, defense systems, precision agriculture, wind turbines) face input-cost pressure until alternative supply scales.",
      "Government-backed domestic processing investment historically follows these episodes, which is a multi-year tailwind for non-China producers but not an immediate substitute for lost volume.",
    ],
    affectedSectors: ["rare-earths", "defense", "agriculture"],
    historicalComparisons: ["china-export-controls-2023"],
  },
  {
    id: "evt-005",
    headline: "Major U.S. cybersecurity agencies warn of coordinated state-sponsored attacks on critical infrastructure",
    summary:
      "CISA and allied agencies issued a joint advisory describing sustained intrusion attempts against utilities and telecom networks, urging immediate hardening of industrial control systems.",
    category: "Cybersecurity",
    subcategory: "Critical Infrastructure Security",
    publishedAt: "2026-07-06T15:10:00Z",
    source: "CISA / Reuters",
    potentialWinners: [
      { ticker: "PANW", name: "Palo Alto Networks", direction: "bullish", rationale: "Advisories of this kind historically accelerate enterprise and government security budget approvals for platform vendors." },
    ],
    potentialLosers: [],
    confidence: 69,
    timeHorizon: "1-6 months",
    reasoning: [
      "Government advisories naming specific threat activity tend to shorten enterprise security procurement cycles rather than create net-new budget, so the effect is more a pull-forward than a permanent re-rating.",
      "Vendors with strong federal and critical-infrastructure relationships typically see the earliest order flow from this kind of advisory.",
    ],
    affectedSectors: ["cybersecurity"],
    historicalComparisons: [],
  },
  {
    id: "evt-006",
    headline: "OPEC+ agrees to extend production cuts amid Middle East supply concerns",
    summary:
      "OPEC+ members agreed to maintain reduced output quotas through the rest of the year, citing both demand uncertainty and ongoing regional supply-route risk.",
    category: "Energy",
    subcategory: "Oil Supply Policy",
    publishedAt: "2026-07-03T11:00:00Z",
    source: "Wall Street Journal",
    potentialWinners: [
      { ticker: "XOM", name: "Exxon Mobil", direction: "bullish", rationale: "Sustained production discipline supports realized crude prices, benefiting integrated producers with existing output." },
    ],
    potentialLosers: [],
    confidence: 62,
    timeHorizon: "1-6 months",
    reasoning: [
      "Extended production cuts support near-term crude prices, though the magnitude depends heavily on compliance among member states, which has historically been inconsistent.",
      "U.S. shale producers can partially offset OPEC+ discipline by ramping output, capping the upside relative to prior supply-shock episodes.",
    ],
    affectedSectors: ["energy"],
    historicalComparisons: ["oil-price-shocks"],
  },
  {
    id: "evt-007",
    headline: "Congress passes infrastructure funding package with expanded grid modernization provisions",
    summary:
      "A bipartisan infrastructure package earmarked additional funding for grid resilience, EV charging build-out, and domestic clean-energy manufacturing incentives.",
    category: "Infrastructure",
    subcategory: "Grid Modernization",
    publishedAt: "2026-06-28T20:15:00Z",
    source: "Politico",
    potentialWinners: [
      { ticker: "FSLR", name: "First Solar", direction: "bullish", rationale: "Domestic manufacturing incentives directly support U.S.-based module producers over import-reliant competitors." },
    ],
    potentialLosers: [],
    confidence: 58,
    timeHorizon: "1-3 years",
    reasoning: [
      "Infrastructure packages typically disburse over multiple years, so the revenue impact for individual companies shows up gradually rather than immediately.",
      "Domestic-content requirements tend to favor manufacturers with existing U.S. production footprints over companies still building out local capacity.",
    ],
    affectedSectors: ["renewables", "infrastructure"],
    historicalComparisons: ["infrastructure-bill-2021"],
  },
  {
    id: "evt-008",
    headline: "Hyperscalers raise 2026 capital-expenditure guidance, citing AI infrastructure demand",
    summary:
      "Several large cloud providers raised full-year capex guidance during investor updates, pointing to sustained demand for AI training and inference capacity.",
    category: "Artificial Intelligence",
    subcategory: "Data Center Capex",
    publishedAt: "2026-06-24T14:00:00Z",
    source: "CNBC",
    potentialWinners: [
      { ticker: "NVDA", name: "NVIDIA", direction: "bullish", rationale: "Higher hyperscaler capex flows most directly into GPU and networking demand." },
      { ticker: "SMCI", name: "Super Micro Computer", direction: "bullish", rationale: "Server integrators capture incremental volume as hyperscalers expand data-center build-outs." },
    ],
    potentialLosers: [],
    confidence: 80,
    timeHorizon: "6-18 months",
    reasoning: [
      "Capex guidance raises are one of the most direct, least ambiguous positive signals for AI infrastructure suppliers, since the spending has to flow through hardware purchases within a few quarters.",
      "Historically, this kind of guidance raise has preceded strong sequential revenue growth for GPU and server suppliers, though it also raises the bar for future comparisons.",
    ],
    affectedSectors: ["semiconductors"],
    historicalComparisons: ["ai-boom-2023-2024"],
  },
];

export const newsArticles: NewsArticle[] = [
  {
    id: "news-101",
    headline: "Chipmakers rally after export-control clarity removes overhang on non-China revenue",
    source: "Reuters",
    publishedAt: "2026-07-15T10:00:00Z",
    summary:
      "Shares of major semiconductor firms rose after the Commerce Department clarified the scope of new licensing rules, resolving weeks of investor uncertainty about which product lines would be affected.",
    sentiment: "bullish",
    affectedIndustries: ["Semiconductors", "AI Infrastructure"],
    affectedTickers: ["TSM", "AMD", "ASML"],
    shortTermImpact: "Relief rally as uncertainty resolves; near-term guidance likely reaffirmed at upcoming earnings.",
    longTermImpact: "Structural shift of capacity investment toward allied markets continues over multiple years.",
    confidence: 73,
    historicalComparison: "Similar to the market reaction following the initial 2023 export-control clarifications.",
    investmentThesis: "Regulatory clarity, even when restrictive, often removes an overhang that was larger than the restriction itself.",
  },
  {
    id: "news-102",
    headline: "Defense primes see order backlog extend to multi-year highs on NATO commitments",
    source: "Associated Press",
    publishedAt: "2026-07-13T08:30:00Z",
    summary:
      "Lockheed Martin and RTX both disclosed backlog growth tied to new allied procurement agreements following the latest NATO spending commitments.",
    sentiment: "bullish",
    affectedIndustries: ["Defense", "Aerospace"],
    affectedTickers: ["LMT", "RTX"],
    shortTermImpact: "Limited immediate revenue recognition; primarily a backlog and sentiment catalyst.",
    longTermImpact: "Multi-year revenue visibility supports capacity expansion and margin stability.",
    confidence: 70,
    historicalComparison: "Consistent with backlog growth seen during the initial post-2022 defense spending cycle.",
    investmentThesis: "Backlog growth today is a leading indicator of revenue recognized two to four years out.",
  },
  {
    id: "news-103",
    headline: "Regional banks flag margin pressure as Fed holds rates longer than expected",
    source: "Bloomberg",
    publishedAt: "2026-07-11T16:45:00Z",
    summary:
      "Several regional bank executives noted deposit-cost pressure persisting longer than modeled, as the Fed's hold-steady stance delays anticipated funding-cost relief.",
    sentiment: "bearish",
    affectedIndustries: ["Banking", "Regional Financials"],
    affectedTickers: ["JPM"],
    shortTermImpact: "Modest net interest margin pressure at smaller, deposit-cost-sensitive institutions.",
    longTermImpact: "Larger, diversified banks are comparatively insulated versus regional peers.",
    confidence: 55,
    historicalComparison: "Echoes margin commentary from the 2022-2023 rate-hiking cycle, though less acute.",
    investmentThesis: "Rate-path uncertainty tends to widen the performance gap between large diversified banks and smaller regionals.",
  },
  {
    id: "news-104",
    headline: "Rare-earth prices jump on renewed China export quota tightening",
    source: "Financial Times",
    publishedAt: "2026-07-09T09:20:00Z",
    summary:
      "Prices for several rare-earth categories rose sharply following confirmation of China's tightened export quotas, extending gains for non-China producers.",
    sentiment: "bullish",
    affectedIndustries: ["Mining", "Critical Minerals", "Defense Supply Chain"],
    affectedTickers: ["MP"],
    shortTermImpact: "Higher realized prices for domestic producers already in production.",
    longTermImpact: "Accelerated government and private investment into non-China processing capacity.",
    confidence: 68,
    historicalComparison: "Mirrors the 2010-2011 rare-earth price spike following prior Chinese export restrictions.",
    investmentThesis: "Supply-constrained critical minerals with government backing tend to sustain price gains longer than typical commodity spikes.",
  },
  {
    id: "news-105",
    headline: "Cybersecurity spending forecast raised after critical-infrastructure advisory",
    source: "CNBC",
    publishedAt: "2026-07-07T13:15:00Z",
    summary:
      "Industry analysts raised near-term enterprise security spending forecasts following the joint government advisory on infrastructure-targeted intrusions.",
    sentiment: "bullish",
    affectedIndustries: ["Cybersecurity", "Enterprise Software"],
    affectedTickers: ["PANW"],
    shortTermImpact: "Accelerated budget approvals for platform security vendors.",
    longTermImpact: "Sustained elevated baseline spending as critical-infrastructure hardening becomes a standing priority.",
    confidence: 64,
    historicalComparison: "Similar pattern to spending increases following prior major ransomware campaigns.",
    investmentThesis: "Government advisories function as a demand catalyst for vendors with existing critical-infrastructure relationships.",
  },
  {
    id: "news-106",
    headline: "Oil holds near multi-month highs as OPEC+ discipline offsets shale supply growth",
    source: "Wall Street Journal",
    publishedAt: "2026-07-04T07:50:00Z",
    summary:
      "Crude prices remained elevated as OPEC+ production discipline offset incremental U.S. shale output, keeping energy equities well supported.",
    sentiment: "bullish",
    affectedIndustries: ["Energy", "Oil & Gas"],
    affectedTickers: ["XOM"],
    shortTermImpact: "Supportive pricing environment for integrated producers' near-term earnings.",
    longTermImpact: "Sustainability depends on OPEC+ compliance and demand growth trajectory.",
    confidence: 57,
    historicalComparison: "Comparable dynamic to the 2016-2018 OPEC+ cut cycle.",
    investmentThesis: "Production-discipline-driven price support tends to be less durable than demand-driven price strength.",
  },
];

export const historicalEvents: HistoricalEvent[] = [
  {
    slug: "chips-act-2022",
    name: "CHIPS and Science Act",
    dateRange: "Aug 2022 – ongoing",
    summary:
      "U.S. legislation providing subsidies and tax credits for domestic semiconductor manufacturing, aimed at reducing reliance on overseas chip production.",
    affectedSectors: ["semiconductors"],
    winners: [
      { ticker: "TSM", name: "Taiwan Semiconductor", direction: "bullish", rationale: "Received direct subsidies for U.S. fab construction." },
      { ticker: "INTC", name: "Intel", direction: "bullish", rationale: "Largest single recipient of CHIPS Act manufacturing grants." },
    ],
    losers: [],
    lessonsLearned: [
      "Subsidy-driven capacity expansion takes years to translate into production, so near-term stock reactions often outpace the actual revenue timeline.",
      "Companies with existing U.S. footprints captured disproportionate early benefit versus new entrants.",
    ],
    timeline: [
      { date: "2022-08", label: "Act signed into law" },
      { date: "2023-12", label: "First major fab construction grants awarded" },
      { date: "2025-06", label: "Initial Arizona fab production milestones reported" },
    ],
  },
  {
    slug: "china-export-controls-2023",
    name: "2023 Semiconductor Export Controls",
    dateRange: "Oct 2022 – 2023",
    summary:
      "Initial round of sweeping U.S. restrictions on advanced chip and chipmaking equipment exports to China, later expanded in scope.",
    affectedSectors: ["semiconductors", "rare-earths"],
    winners: [
      { ticker: "TSM", name: "Taiwan Semiconductor", direction: "bullish", rationale: "Non-China allocation became relatively more valuable." },
    ],
    losers: [
      { ticker: "NVDA", name: "NVIDIA", direction: "bearish", rationale: "Lost access to top-tier China data-center chip sales, requiring downgraded product variants." },
    ],
    lessonsLearned: [
      "Markets initially overreacted to headline restriction announcements before settling once actual product-line scope was clarified weeks later.",
      "Restricted companies adapted by creating compliant product variants, partially preserving revenue.",
    ],
    timeline: [
      { date: "2022-10", label: "Initial restrictions announced" },
      { date: "2023-10", label: "Rules expanded to cover additional chip categories" },
      { date: "2024-Q2", label: "Compliant product variants launched by affected suppliers" },
    ],
  },
  {
    slug: "russia-ukraine-war",
    name: "Russia–Ukraine War",
    dateRange: "Feb 2022 – ongoing",
    summary:
      "Full-scale conflict that triggered sustained increases in Western defense spending, energy-market disruption, and commodity price volatility.",
    affectedSectors: ["defense", "energy"],
    winners: [
      { ticker: "LMT", name: "Lockheed Martin", direction: "bullish", rationale: "Multi-year backlog growth from allied munitions and air-defense orders." },
    ],
    losers: [],
    lessonsLearned: [
      "Defense-spending tailwinds from geopolitical conflict tend to be multi-year rather than short-lived, given procurement and manufacturing lead times.",
      "Energy price spikes from the initial shock proved less durable than defense-spending increases once markets adapted supply routes.",
    ],
    timeline: [
      { date: "2022-02", label: "Conflict begins; energy and defense markets react sharply" },
      { date: "2022-2023", label: "NATO members begin multi-year spending increase commitments" },
      { date: "2024-2026", label: "Sustained munitions replenishment order cycle" },
    ],
  },
  {
    slug: "fed-hiking-cycle-2022-2023",
    name: "2022–2023 Fed Rate Hiking Cycle",
    dateRange: "Mar 2022 – Jul 2023",
    summary:
      "The Federal Reserve raised rates at the fastest pace in four decades to combat post-pandemic inflation, reshaping valuations across rate-sensitive sectors.",
    affectedSectors: ["banking", "renewables"],
    winners: [
      { ticker: "JPM", name: "JPMorgan Chase", direction: "bullish", rationale: "Net interest margin expansion benefited large diversified banks." },
    ],
    losers: [
      { ticker: "FSLR", name: "First Solar", direction: "bearish", rationale: "Rising financing costs pressured utility-scale renewable project economics." },
    ],
    lessonsLearned: [
      "Rate-sensitive growth sectors underperformed for most of the cycle, then re-rated sharply once the terminal rate became clear.",
      "Bank margin benefits were front-loaded early in the cycle and moderated as deposit costs caught up.",
    ],
    timeline: [
      { date: "2022-03", label: "First hike of the cycle" },
      { date: "2023-07", label: "Widely viewed as the terminal rate" },
      { date: "2024-2025", label: "Gradual rate-cut cycle begins" },
    ],
  },
  {
    slug: "ai-boom-2023-2024",
    name: "Generative AI Infrastructure Boom",
    dateRange: "2023 – ongoing",
    summary:
      "Rapid enterprise and hyperscaler adoption of generative AI drove an unprecedented data-center and GPU capex cycle.",
    affectedSectors: ["semiconductors"],
    winners: [
      { ticker: "NVDA", name: "NVIDIA", direction: "bullish", rationale: "Captured the overwhelming majority of AI training and inference GPU demand." },
    ],
    losers: [],
    lessonsLearned: [
      "Capex guidance raises from hyperscalers proved to be reliable leading indicators of GPU supplier revenue for the following one to two quarters.",
      "Supply constraints, not demand, were the binding factor for most of the cycle.",
    ],
    timeline: [
      { date: "2023-Q1", label: "Enterprise generative-AI adoption accelerates" },
      { date: "2023-Q4", label: "Hyperscaler capex guidance raised sharply" },
      { date: "2025-2026", label: "Sustained multi-year data-center buildout continues" },
    ],
  },
  {
    slug: "oil-price-shocks",
    name: "Middle East Oil Supply Shocks",
    dateRange: "Recurring, various periods",
    summary:
      "Periodic regional conflicts and OPEC+ policy shifts have repeatedly driven short-term oil-price spikes followed by partial normalization.",
    affectedSectors: ["energy"],
    winners: [
      { ticker: "XOM", name: "Exxon Mobil", direction: "bullish", rationale: "Higher realized crude prices directly lift upstream earnings." },
    ],
    losers: [],
    lessonsLearned: [
      "Supply-shock price spikes have historically normalized within two to four quarters unless accompanied by sustained production cuts.",
      "U.S. shale supply response has increasingly capped the duration and magnitude of price spikes compared to prior decades.",
    ],
    timeline: [
      { date: "Various", label: "Regional supply disruption triggers price spike" },
      { date: "+1-2 quarters", label: "Non-OPEC supply response begins" },
      { date: "+2-4 quarters", label: "Prices partially normalize absent sustained cuts" },
    ],
  },
  {
    slug: "infrastructure-bill-2021",
    name: "Bipartisan Infrastructure Law",
    dateRange: "Nov 2021 – ongoing",
    summary:
      "Landmark U.S. infrastructure legislation funding transportation, grid modernization, and broadband expansion over multiple years.",
    affectedSectors: ["renewables", "infrastructure"],
    winners: [
      { ticker: "FSLR", name: "First Solar", direction: "bullish", rationale: "Domestic manufacturing provisions supported U.S.-based solar production." },
    ],
    losers: [],
    lessonsLearned: [
      "Large infrastructure packages disburse over many years, so investors who expected immediate revenue impact were often too early.",
      "Domestic-content requirements created a durable advantage for companies with existing U.S. manufacturing footprints.",
    ],
    timeline: [
      { date: "2021-11", label: "Law signed" },
      { date: "2022-2024", label: "Funding gradually allocated to state and local projects" },
      { date: "2025-2026", label: "Manufacturing incentive provisions begin materially affecting producer economics" },
    ],
  },
];

export const alerts: Alert[] = [
  { id: "al-1", type: "Export Controls", message: "New semiconductor export restrictions announced targeting advanced AI chips to China.", createdAt: "2026-07-14T13:25:00Z", severity: "urgent" },
  { id: "al-2", type: "Defense Spending", message: "NATO members commit to accelerated defense-spending increases.", createdAt: "2026-07-12T09:10:00Z", severity: "watch" },
  { id: "al-3", type: "Federal Reserve", message: "Fed signals rates may hold steady through year-end.", createdAt: "2026-07-10T18:35:00Z", severity: "watch" },
  { id: "al-4", type: "Critical Minerals", message: "China tightens rare-earth export quotas.", createdAt: "2026-07-08T07:50:00Z", severity: "urgent" },
  { id: "al-5", type: "Cybersecurity", message: "Joint advisory warns of state-sponsored attacks on critical infrastructure.", createdAt: "2026-07-06T15:15:00Z", severity: "watch" },
  { id: "al-6", type: "Earnings", message: "TSMC earnings scheduled for July 17 — watch for capex commentary.", createdAt: "2026-07-05T12:00:00Z", severity: "info" },
];

export const watchlists: Watchlist[] = [
  { id: "wl-1", name: "AI Infrastructure", tickers: ["NVDA", "AMD", "TSM", "ASML", "SMCI"] },
  { id: "wl-2", name: "Defense", tickers: ["LMT", "RTX"] },
  { id: "wl-3", name: "Rare Earths & Critical Minerals", tickers: ["MP"] },
  { id: "wl-4", name: "Cybersecurity", tickers: ["PANW"] },
];

export function getCompany(ticker: string): Company | undefined {
  return companies.find((c) => c.ticker.toLowerCase() === ticker.toLowerCase());
}

export function getSector(slug: string): Sector | undefined {
  return sectors.find((s) => s.slug === slug);
}

export function getHistoricalEvent(slug: string): HistoricalEvent | undefined {
  return historicalEvents.find((h) => h.slug === slug);
}

export function getNewsArticle(id: string): NewsArticle | undefined {
  return newsArticles.find((n) => n.id === id);
}

export function companiesInSector(slug: string): Company[] {
  return companies.filter((c) => c.sectorSlug === slug);
}
