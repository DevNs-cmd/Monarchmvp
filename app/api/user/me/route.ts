export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
