import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
    try {
        const { email, code } = await request.json();
        if (!email || !code) {
            return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
        }

        const ip = request.headers.get("x-forwarded-for") || "unknown";
        const limitKey = `otp-verify:${ip}:${email}`;
        const limit = rateLimit(limitKey, 10, 15 * 60 * 1000);
        if (!limit.allowed) {
            return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
        }

        const token = await prisma.otpToken.findFirst({
            where: {
                email: email.toLowerCase(),
                code,
                used: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: "desc" },
        });

        if (!token) {
            return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
        }

        await prisma.otpToken.update({
            where: { id: token.id },
            data: { used: true },
        });

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found. Use an invite to onboard first." }, { status: 404 });
        }

        if (user.status === "SUSPENDED") {
            return NextResponse.json({ error: "Account suspended" }, { status: 403 });
        }

        await setSession({
            userId: user.id,
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion,
        });

        return NextResponse.json({ success: true, role: user.role });
    } catch (error) {
        console.error("Verify OTP error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
