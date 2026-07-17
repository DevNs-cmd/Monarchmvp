export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateMatchScore } from "@/lib/matching";
import { STATIC_DEMO_ENABLED, STATIC_INVESTOR_OVERVIEW } from "@/lib/demo-static";

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== "INVESTOR") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (STATIC_DEMO_ENABLED) return NextResponse.json(STATIC_INVESTOR_OVERVIEW);

    const investor = await prisma.investorProfile.findUnique({
        where: { userId: session.userId },
        include: { user: true },
    });
    if (!investor) return NextResponse.json({ error: "Investor profile missing" }, { status: 404 });

    const [startups, markets, dealCount, introCount, watchlistCount] = await Promise.all([
        prisma.startup.findMany({ where: { founder: { status: "ACTIVE" } }, include: { founder: true } }),
        prisma.migMarket.findMany({ orderBy: { migScore: "desc" }, take: 4 }),
        prisma.dealRoom.count({ where: { investorId: investor.id, unlocked: true } }),
        prisma.introductionRequest.count({ where: { investorId: investor.id } }),
        prisma.watchlist.count({ where: { userId: session.userId } }),
    ]);

    const matches = startups
        .map((startup) => ({
            id: startup.id,
            name: startup.founder.companyName,
            industry: startup.industry,
            stage: startup.stage,
            capitalAsk: startup.capitalAsk,
            monarchIndex: startup.monarchIndex || 0,
            matchScore: calculateMatchScore(
                {
                    investorSectors: investor.sectors,
                    investorStages: investor.stages,
                    investorCapitalRange: { min: investor.capitalMin, max: investor.capitalMax },
                    investorRegion: investor.region,
                },
                {
                    id: startup.id,
                    industry: startup.industry,
                    stage: startup.stage,
                    capitalAsk: startup.capitalAsk,
                    region: startup.region,
                },
            ),
        }))
        .filter((startup) => startup.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);

    return NextResponse.json({
        investor: {
            name: investor.user.name,
            organization: investor.organization,
            verified: investor.verified,
            kycStatus: investor.kycStatus,
            accreditationStatus: investor.accreditationStatus,
        },
        metrics: { activeDeals: dealCount, introductions: introCount, watchlist: watchlistCount, curatedMatches: matches.length },
        markets,
        matches,
    });
}
