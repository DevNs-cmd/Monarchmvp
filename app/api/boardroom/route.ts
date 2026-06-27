import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateMatchScore } from "@/lib/matching";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.role !== "INVESTOR") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const investor = await prisma.investorProfile.findUnique({
            where: { userId: session.userId },
        });

        if (!investor) {
            return NextResponse.json({ items: [] });
        }

        const startups = await prisma.startup.findMany({
            include: {
                founder: true,
            },
            where: {
                founder: {
                    status: "ACTIVE",
                },
            },
        });

        const scored = startups.map((s) => ({
            id: s.id,
            name: s.founder.companyName,
            industry: s.industry,
            stage: s.stage,
            capitalAsk: s.capitalAsk,
            monarchIndex: s.monarchIndex,
            valuation: s.founder.valuation || null,
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

        return NextResponse.json({ items: top });
    } catch (error) {
        console.error("Boardroom list error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
