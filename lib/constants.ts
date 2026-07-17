export type MonarchRole = "founder" | "investor" | "admin";

export type MonarchUser = {
  name: string;
  email?: string;
};

export const ROLE_ROUTES: Record<MonarchRole, string> = {
  founder: "/founder",
  investor: "/investor",
  admin: "/admin/dashboard",
};

export const INVITE_CODE_ROLE_MAP: Record<string, MonarchRole> = {
  FOUNDER123: "founder",
  INVESTOR123: "investor",
  ADMIN123: "admin",
};

export const NAV_ITEMS: Record<MonarchRole, { label: string; href: string; icon: string }[]> = {
  founder: [
    { label: "Dashboard", href: "/founder", icon: "home" },
    { label: "Dossier", href: "/founder/profile", icon: "file" },
    { label: "Deal Room", href: "/dealroom", icon: "chat" },
    { label: "Payments", href: "/founder/payments", icon: "briefcase" },
  ],
  investor: [
    { label: "Dashboard", href: "/investor", icon: "home" },
    { label: "Boardroom", href: "/boardroom", icon: "users" },
    { label: "Markets", href: "/investor/markets", icon: "pulse" },
    { label: "Intelligence", href: "/investor/intelligence", icon: "chart" },
    { label: "Portfolio", href: "/investor/portfolio", icon: "briefcase" },
    { label: "Deal Room", href: "/dealroom", icon: "chat" },
  ],
  admin: [
    { label: "Control Center", href: "/admin/dashboard", icon: "shield" },
  ],
};

export const PAGE_TITLES: Record<string, string> = {
  "/founder": "Founder Dashboard",
  "/founder/dossier": "Founder Dossier",
  "/founder/profile": "Verified Dossier",
  "/founder/payments": "Payments & Agreements",
  "/founder/boardroom": "Founder Boardroom",
  "/founder/dealroom": "Founder Deal Room",
  "/founder/settings": "Founder Settings",
  "/investor": "Investor Dashboard",
  "/investor/boardroom": "Investor Boardroom",
  "/investor/markets": "Markets",
  "/investor/intelligence": "Intelligence",
  "/investor/portfolio": "Portfolio",
  "/investor/dealroom": "Deal Room",
  "/investor/watchlist": "Watchlist",
  "/admin": "Admin Dashboard",
  "/admin/dashboard": "Control Center",
  "/admin/applications": "Applications",
  "/admin/deals": "Deals",
  "/admin/members": "Members",
  "/admin/analytics": "Analytics",
};
