import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-dev-only";

export interface JWTPayload {
    userId: string;
    email: string;
    role: Role;
    tokenVersion: number;
}

export function signToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
        return null;
    }
}

export async function getSession(): Promise<JWTPayload | null> {
    const cookieStore = cookies();
    const token = cookieStore.get("monarch_token")?.value;

    if (!token) return null;

    return verifyToken(token);
}

export async function setSession(payload: JWTPayload) {
    const token = signToken(payload);
    const cookieStore = cookies();

    cookieStore.set("monarch_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });
}

export async function clearSession() {
    const cookieStore = cookies();
    cookieStore.delete("monarch_token");
}
