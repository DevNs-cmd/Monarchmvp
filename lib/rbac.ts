import { Role } from "@prisma/client";

export const PERMISSIONS = {
    ADMIN: [
        "admin:console",
        "user:approve",
        "user:suspend",
        "index:override",
        "audit:view",
    ],
    INVESTOR: [
        "boardroom:view",
        "dealroom:access",
        "startup:dossier",
        "market:intelligence",
    ],
    FOUNDER: [
        "founder:dashboard",
        "startup:update",
        "deck:upload",
        "dealroom:access",
    ],
};

export function hasPermission(role: Role, permission: string) {
    const rolePermissions = PERMISSIONS[role] || [];
    return rolePermissions.includes(permission);
}

export function canAccessRoute(role: Role, pathname: string) {
    if (role === "ADMIN") return true;
    if (pathname.startsWith("/founder") && role !== "FOUNDER") return false;
    if (pathname.startsWith("/investor") && role !== "INVESTOR") return false;
    if (pathname.startsWith("/boardroom") && role !== "INVESTOR") return false;
    return true;
}
