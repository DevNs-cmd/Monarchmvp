import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.role !== "FOUNDER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const founder = await prisma.founderProfile.findUnique({
            where: { userId: session.userId },
            include: { startup: true },
        });

        if (!founder?.startup) {
            return NextResponse.json({ items: [] });
        }

        const interests = await prisma.interest.findMany({
            where: {
                startupId: founder.startup.id,
                investorInterest: true,
                founderInterest: false,
            },
            include: {
                investor: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        const items = interests.map((i) => ({
            id: i.id,
            investorName: i.investor.user.name || "Investor",
            investorEntity: i.investor.investmentRange,
        }));

        return NextResponse.json({ items });
    } catch (error) {
        console.error("Founder interests error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
