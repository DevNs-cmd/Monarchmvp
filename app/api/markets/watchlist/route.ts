export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STATIC_DEMO_ENABLED } from "@/lib/demo-static";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.role !== "INVESTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if (STATIC_DEMO_ENABLED) return NextResponse.json({ items: [{ id: "watch-nvda", ticker: "NVDA" }, { id: "watch-asml", ticker: "ASML" }, { id: "watch-pltr", ticker: "PLTR" }] });

        const items = await prisma.watchlist.findMany({
            where: { userId: session.userId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ items });
    } catch (error) {
        console.error("Watchlist fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== "INVESTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { ticker } = await request.json();
        if (!ticker) return NextResponse.json({ error: "Ticker required" }, { status: 400 });
        if (STATIC_DEMO_ENABLED) return NextResponse.json({ success: true, item: { id: `watch-${ticker}`, ticker }, simulated: true });

        const item = await prisma.watchlist.upsert({
            where: {
                userId_ticker: {
                    userId: session.userId,
                    ticker,
                },
            },
            create: {
                userId: session.userId,
                ticker,
            },
            update: {},
        });

        return NextResponse.json({ success: true, item });
    } catch (error) {
        console.error("Watchlist add error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
