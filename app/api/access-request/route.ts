export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function POST(request: Request) {
    try {
        const { name, email, linkedin, linkedinUrl, role } = await request.json();
        const linkedinValue = linkedin || linkedinUrl;
        const normalizedEmail = email?.toLowerCase();

        if (!name || !normalizedEmail || !linkedinValue || !role) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        if (![Role.FOUNDER, Role.INVESTOR].includes(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        const existing = await prisma.$transaction([
            prisma.user.findUnique({ where: { email: normalizedEmail }, select: { id: true } }),
            prisma.accessRequest.findFirst({ where: { email: normalizedEmail }, select: { id: true } }),
        ]);

        if (existing.some(Boolean)) {
            return NextResponse.json({ error: "Email already registered or requested" }, { status: 409 });
        }

        await prisma.accessRequest.create({
            data: {
                name,
                email: normalizedEmail,
                linkedin: linkedinValue,
                role,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Access request error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
