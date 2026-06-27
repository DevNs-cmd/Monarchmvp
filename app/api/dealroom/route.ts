import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.role === "INVESTOR") {
            const investor = await prisma.investorProfile.findUnique({
                where: { userId: session.userId },
            });
            if (!investor) return NextResponse.json({ items: [] });

            const rooms = await prisma.dealRoom.findMany({
                where: { investorId: investor.id, unlocked: true },
                include: {
                    startup: { include: { founder: true } },
                },
                orderBy: { createdAt: "desc" },
            });

            const items = rooms.map((r) => ({
                id: r.id,
                startupName: r.startup.founder.companyName,
                counterparty: r.startup.founder.companyName,
            }));

            return NextResponse.json({ items });
        }

        if (session.role === "FOUNDER") {
            const founder = await prisma.founderProfile.findUnique({
                where: { userId: session.userId },
                include: { startup: true },
            });
            if (!founder?.startup) return NextResponse.json({ items: [] });

            const rooms = await prisma.dealRoom.findMany({
                where: { startupId: founder.startup.id, unlocked: true },
                include: {
                    startup: { include: { founder: true } },
                    messages: true,
                },
                orderBy: { createdAt: "desc" },
            });

            const items = await Promise.all(
                rooms.map(async (r) => {
                    const investor = await prisma.investorProfile.findUnique({
                        where: { id: r.investorId },
                        include: { user: true },
                    });
                    return {
                        id: r.id,
                        startupName: r.startup.founder.companyName,
                        counterparty: investor?.user.name || "Investor",
                    };
                })
            );

            return NextResponse.json({ items });
        }

        return NextResponse.json({ items: [] });
    } catch (error) {
        console.error("Dealroom list error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
