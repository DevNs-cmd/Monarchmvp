export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";
import { STATIC_DEMO_ENABLED } from "@/lib/demo-static";

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { startupId } = await request.json();
        if (!startupId) {
            return NextResponse.json({ error: "Startup required" }, { status: 400 });
        }

        if (session.role !== "INVESTOR") {
            return NextResponse.json({ error: "Only investors can indicate interest" }, { status: 403 });
        }
        if (STATIC_DEMO_ENABLED) return NextResponse.json({ success: true, dealRoomId: null, simulated: true });

        const investor = await prisma.investorProfile.findUnique({
            where: { userId: session.userId },
        });

        if (!investor) {
            return NextResponse.json({ error: "Investor profile missing" }, { status: 400 });
        }

        const startup = await prisma.startup.findUnique({
            where: { id: startupId },
        });

        if (!startup) {
            return NextResponse.json({ error: "Startup not found" }, { status: 404 });
        }

        const interest = await prisma.interest.upsert({
            where: {
                investorId_startupId: {
                    investorId: investor.id,
                    startupId,
                },
            },
            create: {
                investorId: investor.id,
                startupId,
                investorInterest: true,
                status: "PENDING",
            },
            update: {
                investorInterest: true,
            },
        });

        let dealRoomId: string | null = null;
        if (interest.founderInterest) {
            const dealRoom = await prisma.dealRoom.upsert({
                where: {
                    startupId_investorId: {
                        startupId,
                        investorId: investor.id,
                    },
                },
                create: {
                    startupId,
                    investorId: investor.id,
                    unlocked: true,
                },
                update: { unlocked: true },
            });
            dealRoomId = dealRoom.id;

            await prisma.interest.update({
                where: { id: interest.id },
                data: { status: "MUTUAL" },
            });
        }

        await logAction(session.userId, "INVESTOR_INTEREST", `Startup:${startupId}`);

        return NextResponse.json({ success: true, dealRoomId });
    } catch (error) {
        console.error("Interest error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
