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

        const { requestId } = await request.json();
        if (!requestId) {
            return NextResponse.json({ error: "Request ID required" }, { status: 400 });
        }

        await prisma.accessRequest.update({
            where: { id: requestId },
            data: { status: "REJECTED" },
        });

        await logAction(session.userId, "ACCESS_REQUEST_REJECTED", `Request:${requestId}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Reject access request error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
