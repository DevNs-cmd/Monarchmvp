import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateMatchScore } from "@/lib/matching";
import { logAction } from "@/lib/audit";

export async function GET(
    _request: Request,
    { params }: { params: { startupId: string } }
) {
    try {
        const session = await getSession();
        if (!session || session.role !== "INVESTOR") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const investor = await prisma.investorProfile.findUnique({
            where: { userId: session.userId },
        });

        if (!investor) {
            return NextResponse.json({ error: "Investor profile missing" }, { status: 400 });
        }

        const startups = await prisma.startup.findMany({
            include: { founder: true },
            where: {
                founder: {
                    status: "ACTIVE",
                },
            },
        });

        const scored = startups.map((s) => ({
            startup: s,
            score: calculateMatchScore(
                {
                    investorSectors: investor.sectors,
                    investorStages: investor.stages,
                    investorCapitalRange: { min: investor.capitalMin, max: investor.capitalMax },
                    investorRegion: investor.region,
                },
                {
                    id: s.id,
                    industry: s.industry,
                    stage: s.stage,
                    capitalAsk: s.capitalAsk,
                    region: s.region,
                }
            ),
        }));

        const top = scored
            .filter((s) => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        const target = top.find((s) => s.startup.id === params.startupId);
        if (!target) {
            return NextResponse.json({ error: "Access restricted" }, { status: 403 });
        }

        const startup = target.startup;

        const interest = await prisma.interest.findUnique({
            where: {
                investorId_startupId: {
                    investorId: investor.id,
                    startupId: startup.id,
                },
            },
        });

        const intro = await prisma.introductionRequest.findUnique({
            where: {
                investorId_startupId: {
                    investorId: investor.id,
                    startupId: startup.id,
                },
            },
        });

        await logAction(session.userId, "VIEW_DOSSIER", `Startup:${startup.id}`);

        return NextResponse.json({
            startup: {
                id: startup.id,
                name: startup.founder.companyName,
                industry: startup.industry,
                stage: startup.stage,
                capitalAsk: startup.capitalAsk,
                monarchIndex: startup.monarchIndex,
                valuation: startup.founder.valuation || null,
                deckKey: startup.founder.deckUrl || null,
            },
            interest: interest
                ? {
                    investorInterest: interest.investorInterest,
                    founderInterest: interest.founderInterest,
                    status: interest.status,
                }
                : null,
            introduction: intro
                ? {
                    status: intro.status,
                }
                : null,
        });
    } catch (error) {
        console.error("Boardroom detail error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
