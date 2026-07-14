export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId } = await request.json();
        if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

        await prisma.user.update({
            where: { id: userId },
            data: { status: "SUSPENDED", tokenVersion: { increment: 1 }, suspendedAt: new Date() },
        });

        await prisma.founderProfile.updateMany({
            where: { userId },
            data: { status: "SUSPENDED" },
        });

        await logAction(session.userId, "USER_SUSPENDED", `User:${userId}`);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Suspend user error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
