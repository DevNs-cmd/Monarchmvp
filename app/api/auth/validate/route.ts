import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const cookie = request.headers.get("cookie") || "";
        const tokenMatch = cookie.match(/monarch_token=([^;]+)/);
        const token = tokenMatch?.[1];

        if (!token) {
            return NextResponse.json({ valid: false }, { status: 401 });
        }

        const session = verifyToken(token);
        if (!session) {
            return NextResponse.json({ valid: false }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { status: true, tokenVersion: true, role: true },
        });

        if (!user || user.status === "SUSPENDED" || user.tokenVersion !== session.tokenVersion) {
            return NextResponse.json({ valid: false }, { status: 401 });
        }

        return NextResponse.json({ valid: true, role: user.role });
    } catch (error) {
        console.error("Validate session error:", error);
        return NextResponse.json({ valid: false }, { status: 500 });
    }
}
