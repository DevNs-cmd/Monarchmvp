import { prisma } from "./prisma";

export async function logAction(userId: string, action: string, entity: string) {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                entity,
            },
        });
        console.log(`[Audit] ${userId} performed ${action} on ${entity}`);
    } catch (error) {
        console.error("[Audit Error]", error);
    }
}

export async function getAuditLogs(limit = 50) {
    return await prisma.auditLog.findMany({
        take: limit,
        orderBy: {
            timestamp: "desc",
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });
}
