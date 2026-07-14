export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import type { JWTPayload } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/crypto";
import { logAction } from "@/lib/audit";

async function authorize(session: JWTPayload, dealId: string) {
    const dealRoom = await prisma.dealRoom.findUnique({
        where: { id: dealId },
        include: { startup: true },
    });

    if (!dealRoom) return { error: "Deal room not found" };
    if (!dealRoom.unlocked) return { error: "Deal room locked" };

    if (session.role === "INVESTOR") {
        const investor = await prisma.investorProfile.findUnique({
            where: { userId: session.userId },
        });
        if (!investor || investor.id !== dealRoom.investorId) {
            return { error: "Forbidden" };
        }
    }

    if (session.role === "FOUNDER") {
        const founder = await prisma.founderProfile.findUnique({
            where: { userId: session.userId },
            include: { startup: true },
        });
        if (!founder?.startup || founder.startup.id !== dealRoom.startupId) {
            return { error: "Forbidden" };
        }
    }

    if (session.role === "ADMIN") return { error: "Forbidden" };

    return { dealRoom };
}

export async function GET(
    _request: Request,
    { params }: { params: { dealId: string } }
) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const result = await authorize(session, params.dealId);
        if ("error" in result) {
            return NextResponse.json({ error: result.error }, { status: 403 });
        }

        const messages = await prisma.message.findMany({
            where: { dealRoomId: params.dealId },
            include: { sender: true },
            orderBy: { createdAt: "asc" },
        });

        await logAction(session.userId, "DEALROOM_ENTRY", `DealRoom:${params.dealId}`);

        const items = messages.map((m) => ({
            id: m.id,
            senderId: m.senderId,
            senderRole: m.sender.role,
            content: decrypt(m.encryptedContent),
            createdAt: m.createdAt,
        }));

        return NextResponse.json({ items });
    } catch (error) {
        console.error("Dealroom messages error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { dealId: string } }
) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const result = await authorize(session, params.dealId);
        if ("error" in result) {
            return NextResponse.json({ error: result.error }, { status: 403 });
        }

        const { content } = await request.json();
        if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });

        const encryptedContent = encrypt(content);
        const message = await prisma.message.create({
            data: {
                dealRoomId: params.dealId,
                senderId: session.userId,
                encryptedContent,
            },
        });

        await logAction(session.userId, "DEALROOM_MESSAGE", `DealRoom:${params.dealId}`);

        return NextResponse.json({ id: message.id });
    } catch (error) {
        console.error("Dealroom send error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
