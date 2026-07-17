export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { STATIC_DEMO_ENABLED, STATIC_DEMO_USERS } from "@/lib/demo-static";

const DEMO_USERS: Record<Role, string> = {
    FOUNDER: "founder@monarch.xyz",
    INVESTOR: "investor@monarch.xyz",
    ADMIN: "admin@monarch.xyz",
};

export async function POST(request: Request) {
    if (process.env.DEMO_MODE !== "true" && process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Demo access is disabled" }, { status: 404 });
    }

    const ip = request.headers.get("x-forwarded-for") || "local";
    const limit = rateLimit(`demo-login:${ip}`, 30, 15 * 60 * 1000);
    if (!limit.allowed) {
        return NextResponse.json({ error: "Too many demo sign-ins" }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const role = String(body.role || "").toUpperCase() as Role;
    const email = DEMO_USERS[role];
    if (!email) {
        return NextResponse.json({ error: "Invalid demo role" }, { status: 400 });
    }

    const staticUser = STATIC_DEMO_ENABLED ? STATIC_DEMO_USERS[role] : null;
    if (staticUser) {
        await setSession({ userId: staticUser.id, email: staticUser.email, role: staticUser.role, tokenVersion: staticUser.tokenVersion });
        return NextResponse.json({ success: true, role: staticUser.role });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.status !== "ACTIVE") {
        return NextResponse.json({ error: "Demo data is not seeded" }, { status: 503 });
    }

    await setSession({
        userId: user.id,
        email: user.email,
        role: user.role,
        tokenVersion: user.tokenVersion,
    });

    await prisma.activityLog.create({
        data: { userId: user.id, action: "DEMO_LOGIN", ipAddress: ip },
    });

    return NextResponse.json({ success: true, role: user.role });
}
