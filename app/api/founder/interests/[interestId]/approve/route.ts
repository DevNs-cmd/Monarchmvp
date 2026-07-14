export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";

export async function POST(
    _request: Request,
    { params }: { params: { interestId: string } }
) {
    try {
        const session = await getSession();
        if (!session || session.role !== "FOUNDER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const interest = await prisma.interest.findUnique({
            where: { id: params.interestId },
            include: { startup: true },
        });

        if (!interest) {
            return NextResponse.json({ error: "Interest not found" }, { status: 404 });
        }

        const founder = await prisma.founderProfile.findUnique({
            where: { userId: session.userId },
            include: { startup: true },
        });

        if (!founder?.startup || founder.startup.id !== interest.startupId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updated = await prisma.interest.update({
            where: { id: interest.id },
            data: {
                founderInterest: true,
                status: interest.investorInterest ? "MUTUAL" : "PENDING",
            },
        });

        let dealRoomId: string | null = null;
        if (updated.status === "MUTUAL") {
            const dealRoom = await prisma.dealRoom.upsert({
                where: {
                    startupId_investorId: {
                        startupId: updated.startupId,
                        investorId: updated.investorId,
                    },
                },
                create: {
                    startupId: updated.startupId,
                    investorId: updated.investorId,
                    unlocked: true,
                },
                update: { unlocked: true },
            });
            dealRoomId = dealRoom.id;
        }

        await logAction(session.userId, "FOUNDER_APPROVED_INTEREST", `Interest:${interest.id}`);

        return NextResponse.json({ success: true, dealRoomId });
    } catch (error) {
        console.error("Approve interest error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
