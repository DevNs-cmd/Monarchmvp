export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";
import { STATIC_DEMO_ENABLED, STATIC_STARTUPS } from "@/lib/demo-static";

const profileSchema = z.object({
    companyName: z.string().trim().min(2).max(120),
    industry: z.string().trim().min(2).max(100),
    stage: z.string().trim().min(2).max(60),
    capitalAsk: z.coerce.number().positive(),
    valuation: z.coerce.number().positive().nullable().optional(),
    summary: z.string().trim().max(1200).optional(),
    metrics: z.record(z.string(), z.string()).optional(),
    financials: z.record(z.string(), z.string()).optional(),
    capTable: z.record(z.string(), z.string()).optional(),
    riskDisclosures: z.record(z.string(), z.string()).optional(),
});

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== "FOUNDER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (STATIC_DEMO_ENABLED) {
        const startup = STATIC_STARTUPS.find((item) => item.id === "demo-nebula")!;
        return NextResponse.json({ profile: { companyName: startup.name, stage: startup.stage, capitalAsk: startup.capitalAsk, valuation: startup.valuation, summary: startup.summary, metrics: startup.metrics, financials: startup.financials, capTable: startup.capTable, riskDisclosures: startup.riskDisclosures, startup: { industry: startup.industry } } });
    }
    const profile = await prisma.founderProfile.findUnique({
        where: { userId: session.userId },
        include: { startup: true },
    });
    return NextResponse.json({ profile });
}

export async function PATCH(request: Request) {
    const session = await getSession();
    if (!session || session.role !== "FOUNDER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const parsed = profileSchema.safeParse(await request.json().catch(() => ({})));
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid profile" }, { status: 400 });
    }
    if (STATIC_DEMO_ENABLED) return NextResponse.json({ success: true, profile: parsed.data, simulated: true });
    const data = parsed.data;
    const profile = await prisma.$transaction(async (tx) => {
        const updated = await tx.founderProfile.update({
            where: { userId: session.userId },
            data: {
                companyName: data.companyName,
                stage: data.stage,
                capitalAsk: data.capitalAsk,
                valuation: data.valuation ?? null,
                summary: data.summary,
                metrics: data.metrics,
                financials: data.financials,
                capTable: data.capTable,
                riskDisclosures: data.riskDisclosures,
            },
        });
        await tx.startup.update({
            where: { founderId: updated.id },
            data: { industry: data.industry, stage: data.stage, capitalAsk: data.capitalAsk },
        });
        return updated;
    });
    await logAction(session.userId, "DOSSIER_UPDATED", `FounderProfile:${profile.id}`);
    return NextResponse.json({ success: true, profile });
}
