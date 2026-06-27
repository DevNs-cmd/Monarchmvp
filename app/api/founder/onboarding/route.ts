import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/auth";
import { logAction } from "@/lib/audit";
import { calculateMonarchIndex } from "@/lib/scoring";
import { Role, UserStatus } from "@prisma/client";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            name,
            email,
            companyName,
            industry,
            stage,
            capitalAsk,
            valuation,
            deckKey,
            inviteCode,
            tractionScore = 50, // Mock scores for index
            teamScore = 60,
            marketScore = 70
        } = body;

        // 1. Validate Invite
        const invite = await prisma.invite.findUnique({
            where: { code: inviteCode?.trim().toUpperCase() },
        });

        if (!invite || invite.used || invite.role !== Role.FOUNDER) {
            return NextResponse.json({ error: "Invalid invite session" }, { status: 400 });
        }

        // 2. Calculate Monarch Index
        const monarchIndex = calculateMonarchIndex({
            tractionScore,
            teamScore,
            marketScore
        });

        // 3. Create User and Profiles in Transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create User
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    role: Role.FOUNDER,
                    status: UserStatus.PENDING, // Founders start as pending review
                    verified: false,
                },
            });

            // Create Founder Profile
            const profile = await tx.founderProfile.create({
                data: {
                    userId: user.id,
                    companyName,
                    stage,
                    capitalAsk: parseFloat(capitalAsk),
                    valuation: valuation ? parseFloat(valuation) : null,
                    deckUrl: deckKey || null,
                    monarchIndex,
                    status: "UNDER_REVIEW",
                },
            });

            // Create Startup
            await tx.startup.create({
                data: {
                    founderId: profile.id,
                    industry,
                    stage,
                    capitalAsk: parseFloat(capitalAsk),
                    monarchIndex,
                    region: "Global",
                },
            });

            await tx.monarchIndexHistory.create({
                data: {
                    founderProfileId: profile.id,
                    score: monarchIndex,
                    version: 1,
                },
            });

            // Mark invite as used
            await tx.invite.update({
                where: { id: invite.id },
                data: { used: true },
            });

            // Link user to invite usage (optional based on schema)
            await tx.user.update({
                where: { id: user.id },
                data: { inviteId: invite.id }
            });

            return user;
        });

        // 4. Set Session
        await setSession({
            userId: result.id,
            email: result.email,
            role: result.role,
            tokenVersion: result.tokenVersion,
        });

        // 5. Audit Log
        await logAction(result.id, "COMPLETED_ONBOARDING", "FOUNDER_PROFILE");

        return NextResponse.json({ success: true, userId: result.id });

    } catch (error: any) {
        console.error("Founder onboarding error:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
