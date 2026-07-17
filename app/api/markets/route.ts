export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STATIC_DEMO_ENABLED, STATIC_MARKETS } from "@/lib/demo-static";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.role !== "INVESTOR") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (STATIC_DEMO_ENABLED) return NextResponse.json({ items: STATIC_MARKETS });

        const markets = await prisma.migMarket.findMany({
            orderBy: { migScore: "desc" },
        });

        return NextResponse.json({ items: markets });
    } catch (error) {
        console.error("Markets error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
