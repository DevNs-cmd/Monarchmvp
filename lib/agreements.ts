import crypto from "crypto";
import { AgreementType, Role } from "@prisma/client";

export const AGREEMENT_CATALOG: Record<AgreementType, {
    title: string;
    version: string;
    summary: string;
    terms: string[];
}> = {
    PLATFORM_TERMS: {
        title: "Platform Membership Terms",
        version: "2026.1",
        summary: "Membership, confidentiality, acceptable use, and audit consent.",
        terms: ["Invite-only access is personal and non-transferable.", "Confidential platform information may not be redistributed.", "Material platform actions are recorded for governance and dispute evidence."],
    },
    INVESTOR_NDA: {
        title: "Investor Mutual NDA",
        version: "2026.1",
        summary: "Confidential treatment of founder dossiers and data-room materials.",
        terms: ["Dossier information is used solely to evaluate an opportunity.", "No founder contact may bypass a Monarch introduction.", "Confidentiality survives the end of platform access."],
    },
    SUCCESS_FEE: {
        title: "Success Fee Agreement",
        version: "2026.1",
        summary: "Introductions originated through Monarch remain attributable and fee-bearing.",
        terms: ["A completed financing from a recorded introduction triggers the agreed fee.", "Deal-stage evidence and funding confirmations are retained.", "Circumvention attempts may result in suspension and enforcement review."],
    },
    ADVISORY_EQUITY: {
        title: "Advisory Equity Acknowledgment",
        version: "2026.1",
        summary: "Records any separately agreed advisory-equity arrangement.",
        terms: ["No equity is granted by this acknowledgment alone.", "Final economics require an executed company-specific instrument.", "Cap-table evidence must be supplied after execution."],
    },
    DATA_ROOM_CONFIDENTIALITY: {
        title: "Data Room Confidentiality Terms",
        version: "2026.1",
        summary: "Controls access, disclosure, and traceability for protected deal documents.",
        terms: ["Access is limited to approved deal-room participants.", "Downloads and document access may be watermarked and audited.", "Access can be revoked after a governance or security event."],
    },
};

export function agreementsForRole(role: Role): AgreementType[] {
    if (role === Role.FOUNDER) {
        return [AgreementType.PLATFORM_TERMS, AgreementType.SUCCESS_FEE, AgreementType.ADVISORY_EQUITY];
    }
    if (role === Role.INVESTOR) {
        return [AgreementType.PLATFORM_TERMS, AgreementType.INVESTOR_NDA, AgreementType.DATA_ROOM_CONFIDENTIALITY];
    }
    return [AgreementType.PLATFORM_TERMS];
}

export function agreementContentHash(type: AgreementType) {
    return crypto.createHash("sha256").update(JSON.stringify(AGREEMENT_CATALOG[type])).digest("hex");
}
