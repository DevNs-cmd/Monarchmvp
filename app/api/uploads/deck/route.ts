export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/lib/s3";
import { scanBuffer } from "@/lib/virus-scan";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const inviteCode = formData.get("inviteCode")?.toString();

        if (!file || !(file instanceof Blob) || !inviteCode) {
            return NextResponse.json({ error: "File and invite code are required" }, { status: 400 });
        }

        const invite = await prisma.invite.findUnique({
            where: { code: inviteCode },
        });

        if (!invite || invite.used || invite.role !== "FOUNDER") {
            return NextResponse.json({ error: "Invalid invite" }, { status: 401 });
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

        const fileName = (file as File).name || "deck.pdf";
        const key = `decks/${inviteCode}/${Date.now()}-${fileName.replace(/\s+/g, "_")}`;
        await uploadToS3(buffer, key, (file as File).type || "application/pdf");

        return NextResponse.json({ key });
    } catch (error) {
        console.error("Deck upload error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
