import { PrismaClient, Role, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting seed...");

    // 1. Clear existing data in foreign-key order so the seed remains
    // repeatable even after deal-room, payment, audit, and review activity.
    await prisma.$transaction(async (tx) => {
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

    // 2. Create Invite Codes
    const invites = [
        { code: "MONARCH-2026", role: Role.FOUNDER },
        { code: "INVESTOR-2026", role: Role.INVESTOR },
        { code: "ADMIN-GLOBAL", role: Role.ADMIN },
    ];

    for (const invite of invites) {
        await prisma.invite.create({
            data: invite,
        });
    }

    // 3. Create a Demo Admin
    await prisma.user.create({
        data: {
            email: "admin@monarch.xyz",
            name: "Monarch Admin",
            role: Role.ADMIN,
            verified: true,
            status: UserStatus.ACTIVE,
        },
    });

    // 4. Seed MIG Markets
    await prisma.migMarket.createMany({
        data: [
            {
                ticker: "NVDA",
                migScore: 91,
                riskIndex: 4,
                recommendation: "ACCUMULATE",
                allocationSuggestion: "3-5%",
                rationale: ["AI infrastructure demand", "Gross margin resilience", "Consensus upgrades"],
            },
            {
                ticker: "MSFT",
                migScore: 87,
                riskIndex: 3,
                recommendation: "HOLD",
                allocationSuggestion: "2-4%",
                rationale: ["Cloud growth stability", "Enterprise renewal strength", "Defensive balance sheet"],
            },
            {
                ticker: "SNOW",
                migScore: 78,
                riskIndex: 6,
                recommendation: "WATCH",
                allocationSuggestion: "1-2%",
                rationale: ["Consumption volatility", "Product expansion", "Margin compression risk"],
            },
        ],
    });

    // 5. Seed a Founder and Investor for demo flows
    const founderUser = await prisma.user.create({
        data: {
            email: "founder@monarch.xyz",
            name: "Sarah Nebula",
            role: Role.FOUNDER,
            verified: true,
            status: UserStatus.ACTIVE,
        },
    });

    const founderProfile = await prisma.founderProfile.create({
        data: {
            userId: founderUser.id,
            companyName: "Nebula AI",
            stage: "Series A",
            capitalAsk: 5000000,
            valuation: 45000000,
            monarchIndex: 92,
            status: "ACTIVE",
        },
    });

    await prisma.monarchIndexHistory.create({
        data: {
            founderProfileId: founderProfile.id,
            score: 92,
            version: 1,
            breakdown: { traction: 92, team: 92, market: 92 },
            setBy: "SEED",
        },
    });

    const startup = await prisma.startup.create({
        data: {
            founderId: founderProfile.id,
            industry: "AI Infrastructure",
            stage: "Series A",
            capitalAsk: 5000000,
            monarchIndex: 92,
            region: "North America",
        },
    });

    const investorUser = await prisma.user.create({
        data: {
            email: "investor@monarch.xyz",
            name: "John Zenith",
            role: Role.INVESTOR,
            verified: true,
            status: UserStatus.ACTIVE,
        },
    });

    const investorProfile = await prisma.investorProfile.create({
        data: {
            userId: investorUser.id,
            investmentRange: "$1M-$10M",
            sectors: ["AI Infrastructure", "FinTech"],
            stages: ["Seed", "Series A"],
            region: "North America",
            capitalMin: 1000000,
            capitalMax: 10000000,
            sectorPrefs: ["AI Infrastructure", "FinTech"],
            stagePrefs: ["Seed", "Series A"],
            ndaSigned: true,
            ndaSignedAt: new Date(),
            verified: true,
        },
    });

    await prisma.interest.create({
        data: {
            investorId: investorProfile.id,
            startupId: startup.id,
            status: "PENDING",
            investorInterest: true,
        },
    });

    console.log("Seed complete. Created demo users, MIG markets, and invite codes.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
