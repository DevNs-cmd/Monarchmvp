export type Role = "FOUNDER" | "INVESTOR" | "ADMIN";

export const PERMISSIONS = {
    ADMIN: [
        "board:override",
        "user:approve",
        "user:suspend",
        "audit:view",
        "system:settings"
    ],
    INVESTOR: [
        "boardroom:view",
        "markets:view",
        "dealroom:access",
        "dossier:request"
    ],
    FOUNDER: [
        "dashboard:view",
        "onboarding:complete",
        "dealroom:access",
        "stats:view"
    ],
};

export function hasPermission(role: Role, permission: string): boolean {
    const allowed = PERMISSIONS[role] || [];
    return allowed.includes(permission);
}
