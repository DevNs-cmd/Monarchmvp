export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STATIC_ADMIN_OPERATIONS, STATIC_DEMO_ENABLED } from "@/lib/demo-static";

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (STATIC_DEMO_ENABLED) return NextResponse.json(STATIC_ADMIN_OPERATIONS);

    const [deals, payments, members, marketSignals, accessRequests, founderCount, activeFounderCount, investorCount, fundedCount] = await Promise.all([
        prisma.dealRoom.findMany({ include: { startup: { include: { founder: true } } }, orderBy: { lastActivityAt: "desc" }, take: 20 }),
        prisma.payment.findMany({ orderBy: { createdAt: "desc" } }),
        prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
        prisma.mIGSignal.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
        prisma.accessRequest.count(),
        prisma.founderProfile.count(),
        prisma.founderProfile.count({ where: { status: "ACTIVE" } }),
        prisma.investorProfile.count(),
        prisma.dealRoom.count({ where: { stage: "FUNDED" } }),
    ]);

    const dealRows = await Promise.all(deals.map(async (deal) => {
        const investor = await prisma.investorProfile.findUnique({ where: { id: deal.investorId }, include: { user: true } });
        return {
            id: deal.id,
            founder: deal.startup.founder.companyName,
            investor: investor?.organization || investor?.user.name || "Private investor",
            date: deal.createdAt.toISOString(),
            stage: deal.stage,
            fee: deal.successFeeStatus,
            feeAmount: deal.successFeeAmount,
        };
    }));

    const revenueByType = payments
        .filter((payment) => payment.status.toUpperCase() === "SUCCEEDED")
        .reduce<Record<string, number>>((totals, payment) => {
            totals[payment.type] = (totals[payment.type] || 0) + payment.amount;
            return totals;
        }, {});

    return NextResponse.json({
        dealFlow: {
            activeDeals: deals.filter((deal) => deal.stage !== "FUNDED").length,
            introductions: await prisma.introductionRequest.count(),
            feesTriggered: deals.filter((deal) => deal.successFeeTriggered).length,
            rows: dealRows,
        },
        governance: members.map((member) => ({
            id: member.id,
            name: member.name || member.email,
            role: member.role,
            status: member.status,
            joined: member.createdAt.toISOString(),
            lastActive: member.updatedAt.toISOString(),
        })),
        revenue: {
            byType: revenueByType,
            total: Object.values(revenueByType).reduce((sum, value) => sum + value, 0),
            funnel: [
                { name: "Requests", count: accessRequests },
                { name: "Verified members", count: members.filter((member) => member.verified).length },
                { name: "Founder dossiers", count: founderCount },
                { name: "Boardroom active", count: activeFounderCount },
                { name: "Investors", count: investorCount },
                { name: "Funded", count: fundedCount },
            ],
        },
        markets: marketSignals.map((signal) => ({
            id: signal.id,
            ticker: signal.ticker,
            score: signal.migScore,
            risk: signal.riskIndex,
            recommendation: signal.recommendation,
            published: signal.isPublished,
        })),
    });
}
