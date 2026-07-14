export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import type { JWTPayload } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scanBuffer } from "@/lib/virus-scan";
import { uploadToS3, getPresignedUrl } from "@/lib/s3";
import { logAction } from "@/lib/audit";

async function authorize(session: JWTPayload, dealId: string) {
    const dealRoom = await prisma.dealRoom.findUnique({
        where: { id: dealId },
    });
    if (!dealRoom || !dealRoom.unlocked) return { error: "Deal room locked" };

    if (session.role === "INVESTOR") {
        const investor = await prisma.investorProfile.findUnique({
            where: { userId: session.userId },
        });
        if (!investor || investor.id !== dealRoom.investorId) return { error: "Forbidden" };
    }

    if (session.role === "FOUNDER") {
        const founder = await prisma.founderProfile.findUnique({
            where: { userId: session.userId },
            include: { startup: true },
        });
        if (!founder?.startup || founder.startup.id !== dealRoom.startupId) return { error: "Forbidden" };
    }

    if (session.role === "ADMIN") return { error: "Forbidden" };
    return { dealRoom };
}

export async function POST(
    request: Request,
    { params }: { params: { dealId: string } }
) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const auth = await authorize(session, params.dealId);
        if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 403 });

        const formData = await request.formData();
        const file = formData.get("file");
        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: "File required" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        if (buffer.byteLength > 20 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large. Max 20MB." }, { status: 400 });
        }

        const scan = scanBuffer(buffer);
        if (!scan.clean) {
            return NextResponse.json({ error: "File failed security scan" }, { status: 400 });
        }

        const fileName = (file as File).name || "attachment";
        const key = `dealrooms/${params.dealId}/${Date.now()}-${fileName.replace(/\\s+/g, "_")}`;
        await uploadToS3(buffer, key, (file as File).type || "application/octet-stream");
        const url = await getPresignedUrl(key);

        await logAction(session.userId, "DEALROOM_UPLOAD", `DealRoom:${params.dealId}`);

        return NextResponse.json({ key, url });
    } catch (error) {
        console.error("Dealroom upload error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
