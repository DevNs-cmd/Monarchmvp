import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const ip = request.headers.get("x-forwarded-for") || "unknown";
        const limitKey = `otp:${ip}:${email}`;
        const limit = rateLimit(limitKey, 5, 15 * 60 * 1000);
        if (!limit.allowed) {
            return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
        }

        const code = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.otpToken.create({
            data: { email: email.toLowerCase(), code, expiresAt },
        });

        const payload: Record<string, string> = { success: "OTP sent" };
        if (process.env.NODE_ENV !== "production") {
            payload.devCode = code;
        }

        return NextResponse.json(payload);
    } catch (error) {
        console.error("Request OTP error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
