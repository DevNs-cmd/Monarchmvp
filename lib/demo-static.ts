import { AgreementStatus, AgreementType, PaymentType, Role } from "@prisma/client";
import { AGREEMENT_CATALOG } from "@/lib/agreements";

export const STATIC_DEMO_ENABLED = process.env.DEMO_STATIC_MODE === "true";

export const STATIC_DEMO_USERS = {
    FOUNDER: { id: "demo-founder", name: "Sarah Nebula", email: "founder@monarch.xyz", role: Role.FOUNDER, status: "ACTIVE", tokenVersion: 0 },
    INVESTOR: { id: "demo-investor", name: "Noah Mercer", email: "investor@monarch.xyz", role: Role.INVESTOR, status: "ACTIVE", tokenVersion: 0 },
    ADMIN: { id: "demo-admin", name: "Monarch Core", email: "admin@monarch.xyz", role: Role.ADMIN, status: "ACTIVE", tokenVersion: 0 },
} as const;

export const STATIC_STARTUPS = [
    { id: "demo-carbon", name: "CarbonLayer", industry: "Climate Tech", stage: "Seed", capitalAsk: 2_500_000, monarchIndex: 84, valuation: 14_000_000, score: 100, summary: "Industrial carbon-accounting rails with auditable supplier-level emissions evidence.", metrics: { arr: "$780k", growth: "19% MoM", customers: "14 industrial", retention: "118% NRR" }, financials: { burn: "$145k / month", runway: "13 months" }, riskDisclosures: { regulation: "Reporting standards remain fragmented", mitigation: "Multi-standard evidence graph" } },
    { id: "demo-flux", name: "FluxGrid Energy", industry: "Energy Infrastructure", stage: "Series A", capitalAsk: 8_000_000, monarchIndex: 88, valuation: 62_000_000, score: 100, summary: "Grid orchestration software for commercial battery fleets and distributed energy assets.", metrics: { arr: "$5.1M", contracted: "$12.6M", sites: "247", uptime: "99.96%" }, financials: { burn: "$420k / month", runway: "14 months" }, riskDisclosures: { salesCycle: "Utility procurement cycles exceed nine months", mitigation: "Channel-led commercial microgrid motion" } },
    { id: "demo-nebula", name: "Nebula AI", industry: "AI Infrastructure", stage: "Series A", capitalAsk: 5_000_000, monarchIndex: 92, valuation: 45_000_000, score: 100, summary: "Inference infrastructure that reduces enterprise AI serving costs while preserving private-cloud controls.", metrics: { arr: "$3.4M", growth: "14% MoM", customers: "38 enterprise", retention: "126% NRR" }, financials: { burn: "$310k / month", runway: "17 months", grossMargin: "72%", cash: "$5.2M" }, capTable: { founders: "61%", investors: "29%", esop: "10%" }, riskDisclosures: { concentration: "Top three clients are 31% of ARR", mitigation: "Pipeline diversification and annual prepay conversion" } },
];

export const STATIC_MARKETS = [
    { id: "market-nvda", ticker: "NVDA", migScore: 91, riskIndex: 4, recommendation: "ACCUMULATE", allocationSuggestion: "3-5%", rationale: ["AI infrastructure demand", "Gross margin resilience", "Consensus upgrades"] },
    { id: "market-msft", ticker: "MSFT", migScore: 87, riskIndex: 3, recommendation: "HOLD", allocationSuggestion: "2-4%", rationale: ["Cloud growth stability", "Enterprise renewal strength", "Defensive balance sheet"] },
    { id: "market-asml", ticker: "ASML", migScore: 85, riskIndex: 4, recommendation: "ACCUMULATE", allocationSuggestion: "2-3%", rationale: ["Lithography moat", "Backlog visibility", "Export-control sensitivity"] },
    { id: "market-snow", ticker: "SNOW", migScore: 78, riskIndex: 6, recommendation: "WATCH", allocationSuggestion: "1-2%", rationale: ["Consumption volatility", "Product expansion", "Margin compression risk"] },
];

export const STATIC_FOUNDER_OVERVIEW = {
    profile: { companyName: "Nebula AI", status: "ACTIVE", certifiedStatus: "STAGE_3", kycStatus: "VERIFIED", score: 92, breakdown: { traction: 92, team: 89, market: 94 }, stage: "Series A", capitalAsk: 5_000_000 },
    interests: [
        { id: "interest-northpeak", investorName: "Noah Mercer", organization: "Northpeak Capital", status: "MUTUAL", founderInterest: true },
        { id: "interest-aurelius", investorName: "Elena Rossi", organization: "Aurelius Family Office", status: "PENDING", founderInterest: false },
    ],
    metrics: { activeDeals: 1, investorInterest: 2, completedPayments: 2, acceptedAgreements: 2 },
    latestDealId: "demo-deal-nebula",
    payments: [],
};

export const STATIC_INVESTOR_OVERVIEW = {
    investor: { name: "Noah Mercer", organization: "Northpeak Capital", verified: true, kycStatus: "VERIFIED", accreditationStatus: "VERIFIED" },
    metrics: { activeDeals: 1, introductions: 2, watchlist: 3, curatedMatches: 3 },
    markets: STATIC_MARKETS,
    matches: STATIC_STARTUPS.map((startup) => ({ ...startup, matchScore: startup.score })),
};

export const STATIC_PAYMENTS = [
    { id: "payment-boardroom", createdAt: "2026-07-10T10:00:00.000Z", type: PaymentType.BOARDROOM_ACCESS, amount: 1200, currency: "USD", status: "SUCCEEDED", receiptUrl: null },
    { id: "payment-screening", createdAt: "2026-07-02T10:00:00.000Z", type: PaymentType.SCREENING_FEE, amount: 499, currency: "USD", status: "SUCCEEDED", receiptUrl: null },
];

export function staticAgreements(role: Role) {
    const types = role === Role.FOUNDER
        ? [AgreementType.PLATFORM_TERMS, AgreementType.SUCCESS_FEE, AgreementType.ADVISORY_EQUITY]
        : role === Role.INVESTOR
            ? [AgreementType.PLATFORM_TERMS, AgreementType.INVESTOR_NDA, AgreementType.DATA_ROOM_CONFIDENTIALITY]
            : [AgreementType.PLATFORM_TERMS];
    return types.map((type) => ({
        type,
        ...AGREEMENT_CATALOG[type],
        status: type === AgreementType.ADVISORY_EQUITY ? AgreementStatus.PENDING : AgreementStatus.ACCEPTED,
        signerName: role === Role.FOUNDER ? "Sarah Nebula" : role === Role.INVESTOR ? "Noah Mercer" : "Monarch Core",
        acceptedAt: type === AgreementType.ADVISORY_EQUITY ? null : "2026-07-09T10:00:00.000Z",
    }));
}

export const STATIC_DEAL_MESSAGES = [
    { id: "message-1", senderId: "demo-investor", senderRole: "INVESTOR", content: "The infrastructure thesis is aligned. Please share the enterprise cohort analysis before our partner review.", createdAt: "2026-07-14T11:20:00.000Z" },
    { id: "message-2", senderId: "demo-founder", senderRole: "FOUNDER", content: "The cohort pack is prepared with retention by deployment model and contract duration.", createdAt: "2026-07-14T11:42:00.000Z" },
    { id: "message-3", senderId: "demo-investor", senderRole: "INVESTOR", content: "Received. Let us hold a diligence session on Thursday at 16:00 UTC.", createdAt: "2026-07-14T12:05:00.000Z" },
];

export const STATIC_ACCESS_REQUESTS = [
    { id: "request-amelia", name: "Amelia Grant", email: "amelia@citadelgrove.example", linkedin: "https://linkedin.com/in/amelia-grant", role: "INVESTOR", status: "PENDING", createdAt: "2026-07-16T09:00:00.000Z" },
    { id: "request-dev", name: "Dev Malik", email: "dev@ionharbor.example", linkedin: "https://linkedin.com/in/dev-malik", role: "FOUNDER", status: "PENDING", createdAt: "2026-07-16T08:00:00.000Z" },
];

export const STATIC_ADMIN_OPERATIONS = {
    dealFlow: { activeDeals: 1, introductions: 2, feesTriggered: 0, rows: [{ id: "demo-deal-nebula", founder: "Nebula AI", investor: "Northpeak Capital", date: "2026-07-12T10:00:00.000Z", stage: "DOCUMENTS_EXCHANGED", fee: "NOT_TRIGGERED", feeAmount: null }] },
    governance: Object.values(STATIC_DEMO_USERS).map((user) => ({ id: user.id, name: user.name, role: user.role, status: user.status, joined: "2026-07-01T10:00:00.000Z", lastActive: "2026-07-16T10:00:00.000Z" })),
    revenue: { byType: { SCREENING_FEE: 499, BOARDROOM_ACCESS: 1200, ALGO_ACCESS: 990 }, total: 2689, funnel: [{ name: "Requests", count: 14 }, { name: "Verified members", count: 7 }, { name: "Founder dossiers", count: 4 }, { name: "Boardroom active", count: 4 }, { name: "Investors", count: 2 }, { name: "Funded", count: 0 }] },
    markets: [{ id: "signal-asml", ticker: "ASML", score: 85, risk: 4, recommendation: "ACCUMULATE", published: true }, { id: "signal-pltr", ticker: "PLTR", score: 74, risk: 7, recommendation: "WATCH", published: false }],
};
