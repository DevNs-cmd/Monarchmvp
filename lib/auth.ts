import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { STATIC_DEMO_ENABLED } from "@/lib/demo-static";

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret && process.env.NODE_ENV === "production") {
        throw new Error("JWT_SECRET is required in production");
    }
    return secret || "fallback-secret-for-local-development-only";
}

export interface JWTPayload {
    userId: string;
    email: string;
    role: Role;
    tokenVersion: number;
}

export function signToken(payload: JWTPayload): string {
    return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, getJwtSecret()) as JWTPayload;
    } catch {
        return null;
    }
}

export async function getSession(): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("monarch_token")?.value;

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    if (STATIC_DEMO_ENABLED && payload.userId.startsWith("demo-")) {
        return payload;
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
            email: true,
            role: true,
            status: true,
            tokenVersion: true,
        },
    });

    if (
        !user ||
        user.email !== payload.email ||
        user.role !== payload.role ||
        user.tokenVersion !== payload.tokenVersion ||
        user.status === "SUSPENDED" ||
        user.status === "BLACKLISTED"
    ) {
        return null;
    }

    return payload;
}

export async function setSession(payload: JWTPayload) {
    const token = signToken(payload);
    const cookieStore = await cookies();

    cookieStore.set("monarch_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });
    cookieStore.set("monarch_auth", "1", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });
    cookieStore.set("monarch_role", payload.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete("monarch_token");
    cookieStore.delete("monarch_auth");
    cookieStore.delete("monarch_role");
}
