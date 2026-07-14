export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const accessRequests = await prisma.accessRequest.findMany({
            where: { status: "PENDING" },
            orderBy: { createdAt: "desc" },
        });

        const pendingFounders = await prisma.user.findMany({
            where: { role: "FOUNDER", status: "PENDING" },
            include: { founderProfile: true },
            orderBy: { createdAt: "desc" },
        });

        const pendingInvestors = await prisma.user.findMany({
            where: { role: "INVESTOR", status: "PENDING" },
            include: { investorProfile: true },
            orderBy: { createdAt: "desc" },
        });

        const auditLogs = await prisma.auditLog.findMany({
            orderBy: { timestamp: "desc" },
            take: 10,
            include: { user: true },
        });

        const foundersForOverride = await prisma.founderProfile.findMany({
            include: { user: true },
            orderBy: { companyName: "asc" },
        });

        return NextResponse.json({
            accessRequests,
            pendingFounders,
            pendingInvestors,
            auditLogs,
            foundersForOverride,
        });
    } catch (error) {
        console.error("Admin overview error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
