import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";

function generateInviteCode(role: string) {
    const prefix = role === "FOUNDER" ? "MONARCH" : role === "INVESTOR" ? "INVESTOR" : "ADMIN";
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `${prefix}-${random}`;
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { requestId } = await request.json();
        if (!requestId) {
            return NextResponse.json({ error: "Request ID required" }, { status: 400 });
        }

        const accessRequest = await prisma.accessRequest.findUnique({
            where: { id: requestId },
        });

        if (!accessRequest || accessRequest.status !== "PENDING") {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        const inviteCode = generateInviteCode(accessRequest.role);
        const invite = await prisma.invite.create({
            data: {
                code: inviteCode,
                role: accessRequest.role,
            },
        });

        await prisma.accessRequest.update({
            where: { id: requestId },
            data: { status: "APPROVED" },
        });

        await logAction(session.userId, "ACCESS_REQUEST_APPROVED", `Invite:${invite.id}`);

        return NextResponse.json({ success: true, inviteCode });
    } catch (error) {
        console.error("Approve access request error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
