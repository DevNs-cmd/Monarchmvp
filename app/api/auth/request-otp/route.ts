export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { sendOtpEmail } from "@/lib/email";
import { hashOtp } from "@/lib/otp";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        const ip = request.headers.get("x-forwarded-for") || "unknown";
        const limitKey = `otp:${ip}:${normalizedEmail}`;
        const limit = rateLimit(limitKey, 5, 15 * 60 * 1000);
        if (!limit.allowed) {
            return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
        }

        const code = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json({ success: "If the account exists, an OTP has been sent" });
        }

        await prisma.otpToken.updateMany({
            where: { email: normalizedEmail, used: false },
            data: { used: true, usedAt: new Date() },
        });

        await prisma.otpToken.create({
            data: { userId: user.id, email: normalizedEmail, hashedOtp: hashOtp(normalizedEmail, code), expiresAt },
        });

        const delivery = await sendOtpEmail({ to: normalizedEmail, code });

        const payload: Record<string, string> = { success: "OTP sent" };
        if (!delivery.configured && (process.env.NODE_ENV !== "production" || process.env.DEMO_MODE === "true")) {
            payload.devCode = code;
        }

        if (!delivery.configured && process.env.NODE_ENV === "production" && process.env.DEMO_MODE !== "true") {
            return NextResponse.json({ error: "Email delivery is not configured" }, { status: 503 });
        }

        return NextResponse.json(payload);
    } catch (error) {
        console.error("Request OTP error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
