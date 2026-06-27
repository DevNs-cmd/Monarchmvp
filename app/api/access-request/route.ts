import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { name, email, linkedin, role } = await request.json();
        if (!name || !email || !linkedin || !role) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        if (!["FOUNDER", "INVESTOR"].includes(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        await prisma.accessRequest.create({
            data: {
                name,
                email: email.toLowerCase(),
                linkedin,
                role,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Access request error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
