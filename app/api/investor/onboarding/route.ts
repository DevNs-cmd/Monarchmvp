export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/auth";
import { logAction } from "@/lib/audit";
import { Prisma, Role, UserStatus } from "@prisma/client";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            name,
            email,
            investmentRange,
            sectors,
            stages,
            region = "Global",
            capitalMin,
            capitalMax,
            ndaAccepted,
            inviteCode
        } = body;

        if (!ndaAccepted) {
            return NextResponse.json({ error: "NDA required" }, { status: 400 });
        }

        // 1. Validate Invite
        const invite = await prisma.invite.findUnique({
            where: { code: inviteCode?.trim().toUpperCase() },
        });

        if (!invite || invite.used || invite.role !== Role.INVESTOR) {
            return NextResponse.json({ error: "Invalid invite session" }, { status: 400 });
        }

        // 2. Create User and Profile in Transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create User
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    role: Role.INVESTOR,
                    status: UserStatus.ACTIVE, // Investors are auto-verified in this MVP flow
                    verified: true,
                },
            });

            // Create Investor Profile
            await tx.investorProfile.create({
                data: {
                    userId: user.id,
                    investmentRange,
                    sectors,
                    stages: stages || [],
                    region: region || "Global",
                    capitalMin: capitalMin ? parseFloat(capitalMin) : 0,
                    capitalMax: capitalMax ? parseFloat(capitalMax) : 0,
                    verified: true,
                },
            });

            // Mark invite as used
            await tx.invite.update({
                where: { id: invite.id },
                data: { used: true },
            });

            // Link user to invite
            await tx.user.update({
                where: { id: user.id },
                data: { inviteId: invite.id }
            });

            return user;
        });

        // 3. Set Session
        await setSession({
            userId: result.id,
            email: result.email,
            role: result.role,
            tokenVersion: result.tokenVersion,
        });

        // 4. Audit Log
        await logAction(result.id, "COMPLETED_ONBOARDING", "INVESTOR_PROFILE");

        return NextResponse.json({ success: true, userId: result.id });

    } catch (error: unknown) {
        console.error("Investor onboarding error:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
