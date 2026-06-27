import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const logs = await prisma.auditLog.findMany({
            orderBy: { timestamp: "desc" },
            include: { user: true },
            take: 50,
        });

        return NextResponse.json({ items: logs });
    } catch (error) {
        console.error("Audit logs error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
