export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { code } = await request.json();

        if (!code) {
            return NextResponse.json({ error: "Invite code is required" }, { status: 400 });
        }

        // 1. Find the invite
        const invite = await prisma.invite.findUnique({
            where: { code: code.trim().toUpperCase() },
        });

        if (!invite) {
            return NextResponse.json({ error: "Invalid or expired invite code" }, { status: 401 });
        }

        if (invite.used) {
            return NextResponse.json({ error: "This invite code has already been used" }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            role: invite.role,
            inviteCode: invite.code
        });

    } catch (error) {
        console.error("Invite verification error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
