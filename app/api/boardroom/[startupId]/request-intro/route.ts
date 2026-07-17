export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";
import { calculateMatchScore } from "@/lib/matching";
import { STATIC_DEMO_ENABLED } from "@/lib/demo-static";

export async function POST(
    _request: Request,
    { params }: { params: Promise<{ startupId: string }> }
) {
    try {
        const { startupId } = await params;
        const session = await getSession();
        if (!session || session.role !== "INVESTOR") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (STATIC_DEMO_ENABLED) return NextResponse.json({ success: true, status: "PENDING", simulated: true });

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

        const target = top.find((s) => s.startup.id === startupId);
        if (!target) {
            return NextResponse.json({ error: "Startup unavailable" }, { status: 404 });
        }

        const startup = target.startup;

        const request = await prisma.introductionRequest.upsert({
            where: {
                investorId_startupId: {
                    investorId: investor.id,
                    startupId: startup.id,
                },
            },
            create: {
                investorId: investor.id,
                startupId: startup.id,
                status: "PENDING",
            },
            update: {
                status: "PENDING",
            },
        });

        await logAction(session.userId, "REQUEST_INTRO", `Startup:${startup.id}`);

        return NextResponse.json({ success: true, status: request.status });
    } catch (error) {
        console.error("Request introduction error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
