import { prisma } from "./prisma";

/**
 * Global Audit Logging System
 */
export async function logAction(
    userId: string,
    action: string,
    entity: string
) {
    try {
        // Note: Ensuring prisma is initialized and user exists
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                entity,
            },
        });
        console.log(`[AUDIT] User ${userId} performed ${action} on ${entity}`);
    } catch (error) {
        console.error("[AUDIT_ERROR] Failed to shadow-log action:", error);
    }
}
