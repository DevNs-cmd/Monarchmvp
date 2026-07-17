export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STATIC_DEMO_ENABLED, STATIC_DEMO_USERS } from "@/lib/demo-static";

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (STATIC_DEMO_ENABLED) {
            const user = STATIC_DEMO_USERS[session.role];
            return NextResponse.json({ user: { ...user, verified: true, founderProfile: session.role === "FOUNDER" ? { companyName: "Nebula AI" } : null, investorProfile: session.role === "INVESTOR" ? { organization: "Northpeak Capital" } : null } });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            include: {
                founderProfile: {
                    include: {
                        startup: true
                    }
                },
                investorProfile: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.status === "SUSPENDED" || user.tokenVersion !== session.tokenVersion) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Fetch me error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
