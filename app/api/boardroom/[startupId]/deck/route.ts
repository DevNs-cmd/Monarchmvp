export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPresignedUrl } from "@/lib/s3";
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
        if (!investor) return NextResponse.json({ error: "Investor profile missing" }, { status: 400 });

        const startup = await prisma.startup.findUnique({
            where: { id: params.startupId },
            include: { founder: true },
        });
        if (!startup?.founder.deckUrl) {
            return NextResponse.json({ error: "Deck not available" }, { status: 404 });
        }

        const interest = await prisma.interest.findUnique({
            where: {
                investorId_startupId: {
                    investorId: investor.id,
                    startupId: startup.id,
                },
            },
        });

        if (!interest || interest.status !== "MUTUAL") {
            return NextResponse.json({ error: "Deck locked" }, { status: 403 });
        }

        const url = await getPresignedUrl(startup.founder.deckUrl);
        await logAction(session.userId, "VIEW_DECK", `Startup:${startup.id}`);

        return NextResponse.json({ url });
    } catch (error) {
        console.error("Deck access error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
