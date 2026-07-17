export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { AgreementStatus, AgreementType } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AGREEMENT_CATALOG, agreementContentHash, agreementsForRole } from "@/lib/agreements";
import { logAction } from "@/lib/audit";
import { STATIC_DEMO_ENABLED, staticAgreements } from "@/lib/demo-static";

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (STATIC_DEMO_ENABLED) return NextResponse.json({ items: staticAgreements(session.role) });

    const required = agreementsForRole(session.role);
    const records = await prisma.agreement.findMany({
        where: { userId: session.userId, type: { in: required } },
    });

    return NextResponse.json({
        items: required.map((type) => ({
            type,
            ...AGREEMENT_CATALOG[type],
            status: records.find((record) => record.type === type)?.status || AgreementStatus.PENDING,
            signerName: records.find((record) => record.type === type)?.signerName || null,
            acceptedAt: records.find((record) => record.type === type)?.acceptedAt || null,
        })),
    });
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const type = String(body.type || "") as AgreementType;
    const signerName = String(body.signerName || "").trim();
    if (!agreementsForRole(session.role).includes(type)) {
        return NextResponse.json({ error: "Agreement is not available for this role" }, { status: 400 });
    }
    if (body.accepted !== true || signerName.length < 2) {
        return NextResponse.json({ error: "Typed legal name and acceptance are required" }, { status: 400 });
    }
    if (STATIC_DEMO_ENABLED) {
        return NextResponse.json({ success: true, agreement: { type, status: AgreementStatus.ACCEPTED, signerName, acceptedAt: new Date().toISOString() }, simulated: true });
    }

    const catalog = AGREEMENT_CATALOG[type];
    const acceptedAt = new Date();
    const acceptedIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const agreement = await prisma.agreement.upsert({
        where: { userId_type_version: { userId: session.userId, type, version: catalog.version } },
        create: {
            userId: session.userId,
            type,
            version: catalog.version,
            status: AgreementStatus.ACCEPTED,
            signerName,
            acceptedAt,
            acceptedIp,
            contentHash: agreementContentHash(type),
        },
        update: {
            status: AgreementStatus.ACCEPTED,
            signerName,
            acceptedAt,
            acceptedIp,
            contentHash: agreementContentHash(type),
        },
    });

    if (type === AgreementType.INVESTOR_NDA) {
        await prisma.investorProfile.updateMany({
            where: { userId: session.userId },
            data: { ndaSigned: true, ndaSignedAt: acceptedAt },
        });
    }
    if (type === AgreementType.SUCCESS_FEE) {
        await prisma.founderProfile.updateMany({
            where: { userId: session.userId },
            data: { successFeeAgreedAt: acceptedAt },
        });
    }
    if (type === AgreementType.ADVISORY_EQUITY) {
        await prisma.founderProfile.updateMany({
            where: { userId: session.userId },
            data: { advisoryEquityAcknowledgedAt: acceptedAt },
        });
    }

    await logAction(session.userId, "AGREEMENT_ACCEPTED", `${type}:${catalog.version}`);
    return NextResponse.json({ success: true, agreement });
}
