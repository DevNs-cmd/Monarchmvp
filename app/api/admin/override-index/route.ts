import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { founderProfileId, score } = await request.json();
        if (!founderProfileId || typeof score !== "number") {
            return NextResponse.json({ error: "Founder profile and score required" }, { status: 400 });
        }

        const profile = await prisma.founderProfile.findUnique({
            where: { id: founderProfileId },
        });

        if (!profile) {
            return NextResponse.json({ error: "Founder profile not found" }, { status: 404 });
        }

        const latest = await prisma.monarchIndexHistory.findFirst({
            where: { founderProfileId },
            orderBy: { version: "desc" },
        });

        const nextVersion = (latest?.version || 0) + 1;

        await prisma.founderProfile.update({
            where: { id: founderProfileId },
            data: { monarchIndex: score },
        });

        await prisma.monarchIndexHistory.create({
            data: {
                founderProfileId,
                score,
                version: nextVersion,
            },
        });

        await logAction(session.userId, "OVERRIDE_MIG", `FounderProfile:${founderProfileId}`);

        return NextResponse.json({ success: true, version: nextVersion });
    } catch (error) {
        console.error("Override index error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
