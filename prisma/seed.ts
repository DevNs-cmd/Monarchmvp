import {
    AgreementStatus,
    AgreementType,
    CertifiedStatus,
    DealStage,
    InterestStatus,
    PaymentType,
    PrismaClient,
    Role,
    UserStatus,
} from "@prisma/client";
import { encrypt } from "../lib/crypto";
import { agreementContentHash } from "../lib/agreements";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting pitch-ready seed...");

    await prisma.$transaction(async (tx) => {
        await tx.dealEvent.deleteMany({});
        await tx.message.deleteMany({});
        await tx.dealDocument.deleteMany({});
        await tx.meeting.deleteMany({});
        await tx.dealRoom.deleteMany({});
        await tx.interest.deleteMany({});
        await tx.introductionRequest.deleteMany({});
        await tx.certificationRecord.deleteMany({});
        await tx.monarchIndexHistory.deleteMany({});
        await tx.watchlist.deleteMany({});
        await tx.activityLog.deleteMany({});
        await tx.auditLog.deleteMany({});
        await tx.payment.deleteMany({});
        await tx.agreement.deleteMany({});
        await tx.otpToken.deleteMany({});
        await tx.startup.deleteMany({});
        await tx.founderProfile.deleteMany({});
        await tx.investorProfile.deleteMany({});
        await tx.user.deleteMany({});
        await tx.invite.deleteMany({});
        await tx.accessRequest.deleteMany({});
        await tx.migMarket.deleteMany({});
        await tx.mIGSignal.deleteMany({});
    });

    await prisma.invite.createMany({
        data: [
            { code: "MONARCH-2026", role: Role.FOUNDER },
            { code: "INVESTOR-2026", role: Role.INVESTOR },
            { code: "ADMIN-GLOBAL", role: Role.ADMIN },
        ],
    });

    const admin = await prisma.user.create({
        data: {
            email: "admin@monarch.xyz",
            name: "Monarch Core",
            role: Role.ADMIN,
            verified: true,
            status: UserStatus.ACTIVE,
        },
    });

    const founderDefinitions = [
        {
            email: "founder@monarch.xyz",
            name: "Sarah Nebula",
            companyName: "Nebula AI",
            industry: "AI Infrastructure",
            stage: "Series A",
            capitalAsk: 5_000_000,
            valuation: 45_000_000,
            score: 92,
            region: "North America",
            summary: "Inference infrastructure that reduces enterprise AI serving costs while preserving private-cloud controls.",
            metrics: { arr: "$3.4M", growth: "14% MoM", customers: "38 enterprise", retention: "126% NRR" },
            financials: { burn: "$310k / month", runway: "17 months", grossMargin: "72%", cash: "$5.2M" },
            capTable: { founders: "61%", investors: "29%", esop: "10%" },
            risks: { concentration: "Top three clients are 31% of ARR", mitigation: "Pipeline diversification and annual prepay conversion" },
        },
        {
            email: "maya@carbonlayer.io",
            name: "Maya Chen",
            companyName: "CarbonLayer",
            industry: "Climate Tech",
            stage: "Seed",
            capitalAsk: 2_500_000,
            valuation: 14_000_000,
            score: 84,
            region: "Europe",
            summary: "Industrial carbon-accounting rails with auditable supplier-level emissions evidence.",
            metrics: { arr: "$780k", growth: "19% MoM", customers: "14 industrial", retention: "118% NRR" },
            financials: { burn: "$145k / month", runway: "13 months" },
            capTable: { founders: "74%", investors: "18%", esop: "8%" },
            risks: { regulation: "Reporting standards remain fragmented", mitigation: "Multi-standard evidence graph" },
        },
        {
            email: "arjun@fluxgrid.energy",
            name: "Arjun Mehta",
            companyName: "FluxGrid Energy",
            industry: "Energy Infrastructure",
            stage: "Series A",
            capitalAsk: 8_000_000,
            valuation: 62_000_000,
            score: 88,
            region: "India & Southeast Asia",
            summary: "Grid orchestration software for commercial battery fleets and distributed energy assets.",
            metrics: { arr: "$5.1M", contracted: "$12.6M", sites: "247", uptime: "99.96%" },
            financials: { burn: "$420k / month", runway: "14 months" },
            capTable: { founders: "56%", investors: "35%", esop: "9%" },
            risks: { salesCycle: "Utility procurement cycles exceed nine months", mitigation: "Channel-led commercial microgrid motion" },
        },
        {
            email: "lina@sablehealth.co",
            name: "Lina Okafor",
            companyName: "Sable Health",
            industry: "Digital Health",
            stage: "Seed",
            capitalAsk: 3_000_000,
            valuation: 18_000_000,
            score: 79,
            region: "North America",
            summary: "Clinical workflow infrastructure for specialist practices managing high-complexity care pathways.",
            metrics: { arr: "$1.2M", growth: "11% MoM", practices: "31", retention: "97% logo" },
            financials: { burn: "$190k / month", runway: "11 months" },
            capTable: { founders: "70%", investors: "22%", esop: "8%" },
            risks: { compliance: "Multi-state clinical data requirements", mitigation: "Regionalized data and policy controls" },
        },
    ];

    const founders: Array<{ userId: string; profileId: string; startupId: string }> = [];
    for (const definition of founderDefinitions) {
        const user = await prisma.user.create({
            data: { email: definition.email, name: definition.name, role: Role.FOUNDER, verified: true, status: UserStatus.ACTIVE },
        });
        const profile = await prisma.founderProfile.create({
            data: {
                userId: user.id,
                companyName: definition.companyName,
                stage: definition.stage,
                capitalAsk: definition.capitalAsk,
                valuation: definition.valuation,
                monarchIndex: definition.score,
                certifiedStatus: definition.email === "founder@monarch.xyz" ? CertifiedStatus.STAGE_3 : CertifiedStatus.STAGE_2,
                status: "ACTIVE",
                summary: definition.summary,
                metrics: definition.metrics,
                financials: definition.financials,
                capTable: definition.capTable,
                riskDisclosures: definition.risks,
                kycStatus: "VERIFIED",
            },
        });
        const startup = await prisma.startup.create({
            data: {
                founderId: profile.id,
                industry: definition.industry,
                stage: definition.stage,
                capitalAsk: definition.capitalAsk,
                monarchIndex: definition.score,
                region: definition.region,
            },
        });
        await prisma.monarchIndexHistory.create({
            data: {
                founderProfileId: profile.id,
                score: definition.score,
                version: 1,
                breakdown: { traction: definition.score, team: Math.max(70, definition.score - 3), market: Math.min(96, definition.score + 2) },
                setBy: "MONARCH_ANALYST",
            },
        });
        await prisma.certificationRecord.createMany({
            data: [
                { founderProfileId: profile.id, stage: 1, status: "APPROVED", reviewedBy: admin.id, notes: "Identity and entity verified" },
                { founderProfileId: profile.id, stage: 2, status: "APPROVED", reviewedBy: admin.id, notes: "Business evidence reviewed" },
            ],
        });
        founders.push({ userId: user.id, profileId: profile.id, startupId: startup.id });
    }

    const investorUser = await prisma.user.create({
        data: { email: "investor@monarch.xyz", name: "Noah Mercer", role: Role.INVESTOR, verified: true, status: UserStatus.ACTIVE },
    });
    const investor = await prisma.investorProfile.create({
        data: {
            userId: investorUser.id,
            organization: "Northpeak Capital",
            investorType: "Venture Fund",
            investmentRange: "$1M-$10M",
            sectors: ["AI Infrastructure", "Climate Tech", "Energy Infrastructure"],
            stages: ["Seed", "Series A"],
            region: "Global",
            capitalMin: 1_000_000,
            capitalMax: 10_000_000,
            sectorPrefs: ["AI Infrastructure", "Climate Tech", "Energy Infrastructure"],
            stagePrefs: ["Seed", "Series A"],
            ndaSigned: true,
            ndaSignedAt: new Date(),
            verified: true,
            kycStatus: "VERIFIED",
            accreditationStatus: "VERIFIED",
            accreditationVerifiedAt: new Date(),
        },
    });

    const partnerUser = await prisma.user.create({
        data: { email: "partner@monarch.xyz", name: "Elena Rossi", role: Role.INVESTOR, verified: true, status: UserStatus.ACTIVE },
    });
    const partner = await prisma.investorProfile.create({
        data: {
            userId: partnerUser.id,
            organization: "Aurelius Family Office",
            investorType: "Family Office",
            investmentRange: "$2M-$15M",
            sectors: ["AI Infrastructure", "Digital Health"],
            stages: ["Seed", "Series A"],
            region: "Global",
            capitalMin: 2_000_000,
            capitalMax: 15_000_000,
            verified: true,
            kycStatus: "VERIFIED",
            accreditationStatus: "VERIFIED",
            accreditationVerifiedAt: new Date(),
        },
    });

    const [nebula, carbon, flux] = founders;
    const mutualInterest = await prisma.interest.create({
        data: { investorId: investor.id, startupId: nebula.startupId, investorInterest: true, founderInterest: true, status: InterestStatus.MUTUAL, mutualConfirmedAt: new Date() },
    });
    await prisma.interest.createMany({
        data: [
            { investorId: investor.id, startupId: carbon.startupId, investorInterest: true, status: InterestStatus.PENDING },
            { investorId: investor.id, startupId: flux.startupId, investorInterest: true, status: InterestStatus.PENDING },
            { investorId: partner.id, startupId: nebula.startupId, investorInterest: true, status: InterestStatus.PENDING },
        ],
    });
    await prisma.introductionRequest.createMany({
        data: [
            { investorId: investor.id, startupId: nebula.startupId, status: "APPROVED" },
            { investorId: investor.id, startupId: carbon.startupId, status: "PENDING" },
        ],
    });

    const dealRoom = await prisma.dealRoom.create({
        data: {
            startupId: nebula.startupId,
            investorId: investor.id,
            unlocked: true,
            stage: DealStage.DOCUMENTS_EXCHANGED,
            ndaConfirmed: true,
            lastActivityAt: new Date(),
            successFeeRate: 0.025,
        },
    });
    await prisma.message.createMany({
        data: [
            { dealRoomId: dealRoom.id, senderId: investorUser.id, encryptedContent: encrypt("The infrastructure thesis is aligned. Please share the enterprise cohort analysis before our partner review.") },
            { dealRoomId: dealRoom.id, senderId: nebula.userId, encryptedContent: encrypt("The cohort pack is prepared. We have included retention by deployment model and contract duration.") },
            { dealRoomId: dealRoom.id, senderId: investorUser.id, encryptedContent: encrypt("Received. Let us hold a diligence session on Thursday at 16:00 UTC.") },
        ],
    });
    await prisma.dealEvent.createMany({
        data: [
            { dealRoomId: dealRoom.id, type: "INTRODUCTION_APPROVED", actorId: admin.id, toStage: DealStage.INTRODUCTION },
            { dealRoomId: dealRoom.id, type: "NDA_CONFIRMED", actorId: investorUser.id, fromStage: DealStage.INTRODUCTION, toStage: DealStage.NDA_SIGNED },
            { dealRoomId: dealRoom.id, type: "DOCUMENTS_EXCHANGED", actorId: nebula.userId, fromStage: DealStage.NDA_SIGNED, toStage: DealStage.DOCUMENTS_EXCHANGED },
        ],
    });
    await prisma.meeting.create({
        data: { dealRoomId: dealRoom.id, scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), format: "Video diligence", monarchHosted: true },
    });

    await prisma.migMarket.createMany({
        data: [
            { ticker: "NVDA", migScore: 91, riskIndex: 4, recommendation: "ACCUMULATE", allocationSuggestion: "3-5%", rationale: ["AI infrastructure demand", "Gross margin resilience", "Consensus upgrades"] },
            { ticker: "MSFT", migScore: 87, riskIndex: 3, recommendation: "HOLD", allocationSuggestion: "2-4%", rationale: ["Cloud growth stability", "Enterprise renewal strength", "Defensive balance sheet"] },
            { ticker: "ASML", migScore: 85, riskIndex: 4, recommendation: "ACCUMULATE", allocationSuggestion: "2-3%", rationale: ["Lithography moat", "Backlog visibility", "Export-control sensitivity"] },
            { ticker: "SNOW", migScore: 78, riskIndex: 6, recommendation: "WATCH", allocationSuggestion: "1-2%", rationale: ["Consumption volatility", "Product expansion", "Margin compression risk"] },
            { ticker: "TSLA", migScore: 61, riskIndex: 8, recommendation: "REDUCE", allocationSuggestion: "0-1%", rationale: ["Delivery volatility", "Pricing pressure", "Optionality remains high"] },
            { ticker: "PLTR", migScore: 74, riskIndex: 7, recommendation: "WATCH", allocationSuggestion: "1-2%", rationale: ["Commercial acceleration", "Valuation sensitivity", "Government concentration"] },
        ],
    });
    await prisma.mIGSignal.createMany({
        data: [
            { ticker: "ASML", companyName: "ASML Holding", sector: "Semiconductors", migScore: 85, riskIndex: 4, recommendation: "ACCUMULATE", timeHorizon: "18 months", rationale: ["Structural capacity demand", "Technology moat"], suggestedAlloc: 3, approvedAt: new Date(), approvedBy: admin.id, publishedAt: new Date(), isPublished: true },
            { ticker: "PLTR", companyName: "Palantir Technologies", sector: "Software", migScore: 74, riskIndex: 7, recommendation: "WATCH", timeHorizon: "12 months", rationale: ["Commercial momentum", "Multiple risk"], suggestedAlloc: 1.5 },
        ],
    });
    await prisma.watchlist.createMany({ data: [{ userId: investorUser.id, ticker: "NVDA" }, { userId: investorUser.id, ticker: "ASML" }, { userId: investorUser.id, ticker: "PLTR" }] });

    const acceptedAt = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const agreements = [
        { userId: nebula.userId, type: AgreementType.PLATFORM_TERMS, signerName: "Sarah Nebula" },
        { userId: nebula.userId, type: AgreementType.SUCCESS_FEE, signerName: "Sarah Nebula" },
        { userId: investorUser.id, type: AgreementType.PLATFORM_TERMS, signerName: "Noah Mercer" },
        { userId: investorUser.id, type: AgreementType.INVESTOR_NDA, signerName: "Noah Mercer" },
        { userId: investorUser.id, type: AgreementType.DATA_ROOM_CONFIDENTIALITY, signerName: "Noah Mercer" },
        { userId: admin.id, type: AgreementType.PLATFORM_TERMS, signerName: "Monarch Core" },
    ];
    for (const agreement of agreements) {
        await prisma.agreement.create({
            data: { ...agreement, version: "2026.1", status: AgreementStatus.ACCEPTED, acceptedAt, acceptedIp: "seed", contentHash: agreementContentHash(agreement.type) },
        });
    }
    await prisma.agreement.create({ data: { userId: nebula.userId, type: AgreementType.ADVISORY_EQUITY, version: "2026.1", status: AgreementStatus.PENDING } });
    await prisma.founderProfile.update({ where: { id: nebula.profileId }, data: { successFeeAgreedAt: acceptedAt } });

    await prisma.payment.createMany({
        data: [
            { userId: nebula.userId, amount: 499, currency: "USD", type: PaymentType.SCREENING_FEE, status: "SUCCEEDED" },
            { userId: nebula.userId, amount: 1200, currency: "USD", type: PaymentType.BOARDROOM_ACCESS, status: "SUCCEEDED" },
            { userId: investorUser.id, amount: 990, currency: "USD", type: PaymentType.ALGO_ACCESS, status: "SUCCEEDED" },
        ],
    });

    await prisma.accessRequest.createMany({
        data: [
            { name: "Amelia Grant", email: "amelia@citadelgrove.example", linkedin: "https://linkedin.com/in/amelia-grant", role: Role.INVESTOR, status: "PENDING" },
            { name: "Dev Malik", email: "dev@ionharbor.example", linkedin: "https://linkedin.com/in/dev-malik", role: Role.FOUNDER, status: "PENDING" },
        ],
    });
    await prisma.auditLog.createMany({
        data: [
            { userId: admin.id, action: "FOUNDER_SCORE_REVIEWED", entity: `FounderProfile:${nebula.profileId}` },
            { userId: investorUser.id, action: "VIEW_DOSSIER", entity: `Startup:${nebula.startupId}` },
            { userId: nebula.userId, action: "AGREEMENT_ACCEPTED", entity: "SUCCESS_FEE:2026.1" },
        ],
    });
    await prisma.activityLog.createMany({
        data: [
            { userId: investorUser.id, action: "BOARDROOM_VIEW", metadata: { startupId: nebula.startupId } },
            { userId: nebula.userId, action: "DEALROOM_ENTRY", metadata: { dealRoomId: dealRoom.id } },
        ],
    });

    console.log(`Seed complete: ${founders.length} startups, 2 investors, 1 active deal, and ${agreements.length} accepted agreements.`);
    void mutualInterest;
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
