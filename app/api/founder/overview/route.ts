export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STATIC_DEMO_ENABLED, STATIC_FOUNDER_OVERVIEW } from "@/lib/demo-static";

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== "FOUNDER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (STATIC_DEMO_ENABLED) return NextResponse.json(STATIC_FOUNDER_OVERVIEW);

    const profile = await prisma.founderProfile.findUnique({
        where: { userId: session.userId },
        include: {
            startup: true,
            indexHistory: { orderBy: { createdAt: "desc" }, take: 1 },
            certifications: { orderBy: { updatedAt: "desc" } },
        },
    });
    if (!profile?.startup) {
        return NextResponse.json({ error: "Founder profile missing" }, { status: 404 });
    }

    const [interests, deals, payments, agreements] = await Promise.all([
        prisma.interest.findMany({
            where: { startupId: profile.startup.id, investorInterest: true },
            include: { investor: { include: { user: true } } },
            orderBy: { createdAt: "desc" },
        }),
        prisma.dealRoom.findMany({
            where: { startupId: profile.startup.id, unlocked: true },
            include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
            orderBy: { lastActivityAt: "desc" },
        }),
        prisma.payment.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "desc" }, take: 5 }),
        prisma.agreement.findMany({ where: { userId: session.userId } }),
    ]);

    return NextResponse.json({
        profile: {
            companyName: profile.companyName,
            status: profile.status,
            certifiedStatus: profile.certifiedStatus,
            kycStatus: profile.kycStatus,
            score: profile.monarchIndex || 0,
            breakdown: profile.indexHistory[0]?.breakdown || null,
            stage: profile.stage,
            capitalAsk: profile.capitalAsk,
        },
        interests: interests.map((interest) => ({
            id: interest.id,
            investorName: interest.investor.user.name || "Private investor",
            organization: interest.investor.organization || interest.investor.investmentRange,
            status: interest.status,
            founderInterest: interest.founderInterest,
        })),
        metrics: {
            activeDeals: deals.length,
            investorInterest: interests.length,
            completedPayments: payments.filter((payment) => payment.status.toUpperCase() === "SUCCEEDED").length,
            acceptedAgreements: agreements.filter((agreement) => agreement.status === "ACCEPTED").length,
        },
        latestDealId: deals[0]?.id || null,
        payments,
    });
}
