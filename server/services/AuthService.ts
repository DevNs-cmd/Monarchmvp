import { prisma } from "@/lib/prisma";

/**
 * Monarch Authentication Service
 * Isolated business logic for identity management.
 */
export class AuthService {
    static async verifyInviteCode(code: string) {
        const invite = await prisma.invite.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (!invite || invite.used) {
            throw new Error("Invalid or expired invite protocol.");
        }

        return invite;
    }

    static async registerUser(email: string, role: string) {
        // Logic for creating user and profiles
        return await prisma.user.create({
            data: {
                email,
                role: role as any,
                status: "PENDING",
            },
        });
    }
}
