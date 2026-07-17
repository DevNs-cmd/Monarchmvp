export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STATIC_DEMO_ENABLED, STATIC_PAYMENTS } from "@/lib/demo-static";

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (STATIC_DEMO_ENABLED) return NextResponse.json({ items: STATIC_PAYMENTS });

    const items = await prisma.payment.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ items });
}
