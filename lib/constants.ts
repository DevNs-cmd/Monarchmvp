export type MonarchRole = "founder" | "investor" | "admin";

export type MonarchUser = {
  name: string;
  email?: string;
};

export const ROLE_ROUTES: Record<MonarchRole, string> = {
  founder: "/founder",
  investor: "/investor",
  admin: "/admin",
};

export const INVITE_CODE_ROLE_MAP: Record<string, MonarchRole> = {
  FOUNDER123: "founder",
  INVESTOR123: "investor",
  ADMIN123: "admin",
};

export const NAV_ITEMS: Record<MonarchRole, { label: string; href: string; icon: string }[]> = {
  founder: [
    { label: "Dashboard", href: "/founder", icon: "home" },
    { label: "Dossier", href: "/founder/dossier", icon: "file" },
    { label: "Boardroom", href: "/founder/boardroom", icon: "users" },
    { label: "Deal Room", href: "/founder/dealroom", icon: "chat" },
    { label: "Settings", href: "/founder/settings", icon: "settings" },
  ],
  investor: [
    { label: "Dashboard", href: "/investor", icon: "home" },
    { label: "Boardroom", href: "/investor/boardroom", icon: "users" },
    { label: "Markets", href: "/investor/markets", icon: "pulse" },
    { label: "Deal Room", href: "/investor/dealroom", icon: "chat" },
    { label: "Watchlist", href: "/investor/watchlist", icon: "watch" },
  ],
  admin: [
    { label: "Dashboard", href: "/admin", icon: "home" },
    { label: "Applications", href: "/admin/applications", icon: "inbox" },
    { label: "Deals", href: "/admin/deals", icon: "briefcase" },
    { label: "Members", href: "/admin/members", icon: "shield" },
    { label: "Analytics", href: "/admin/analytics", icon: "chart" },
  ],
};

export const PAGE_TITLES: Record<string, string> = {
  "/founder": "Founder Dashboard",
  "/founder/dossier": "Founder Dossier",
  "/founder/boardroom": "Founder Boardroom",
  "/founder/dealroom": "Founder Deal Room",
  "/founder/settings": "Founder Settings",
  "/investor": "Investor Dashboard",
  "/investor/boardroom": "Investor Boardroom",
  "/investor/markets": "Markets",
  "/investor/dealroom": "Deal Room",
  "/investor/watchlist": "Watchlist",
  "/admin": "Admin Dashboard",
  "/admin/applications": "Applications",
  "/admin/deals": "Deals",
  "/admin/members": "Members",
  "/admin/analytics": "Analytics",
};
