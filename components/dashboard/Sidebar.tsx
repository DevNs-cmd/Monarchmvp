"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquare,
    ShieldCheck,
    LineChart,
    LogOut,
    Users,
} from "lucide-react";

interface SidebarProps {
    role: "FOUNDER" | "INVESTOR" | "ADMIN";
}

export default function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();

    const links = {
        FOUNDER: [
            { name: "Executive Suite", icon: LayoutDashboard, href: "/founder/dashboard" },
            { name: "Deal Room", icon: MessageSquare, href: "/dealroom" },
        ],
        INVESTOR: [
            { name: "Alpha Pulse", icon: LayoutDashboard, href: "/investor/dashboard" },
            { name: "Boardroom", icon: Users, href: "/boardroom" },
            { name: "MIG Markets", icon: LineChart, href: "/investor/markets" },
            { name: "Portfolio", icon: LineChart, href: "/investor/portfolio" },
            { name: "Intelligence", icon: ShieldCheck, href: "/investor/intelligence" },
            { name: "Profile", icon: Users, href: "/investor/profile" },
            { name: "Deal Room", icon: MessageSquare, href: "/dealroom" },
        ],
        ADMIN: [
            { name: "Control Center", icon: ShieldCheck, href: "/admin/dashboard" },
        ],
    };

    const currentLinks = links[role] || [];

    return (
        <aside className="w-72 bg-[#050505] border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-50">
            <div className="p-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border border-gold rounded-full flex items-center justify-center">
                        <span className="text-gold font-bold text-xs">M</span>
                    </div>
                    <span className="font-bold tracking-[0.2em] text-sm uppercase">Monarch</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2">
                {currentLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group ${isActive
                                    ? "bg-gold/10 text-gold"
                                    : "text-secondary hover:bg-white/[0.02] hover:text-white"
                                }`}
                        >
                            <Icon size={18} className={isActive ? "text-gold" : "text-secondary group-hover:text-white"} />
                            <span className="text-xs font-bold uppercase tracking-widest">{link.name}</span>
                            {isActive && (
                                <div className="w-1.5 h-1.5 rounded-full bg-gold ml-auto" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 mt-auto">
                <Link
                    href="/"
                    className="flex items-center gap-4 px-6 py-4 text-red-500/60 hover:text-red-500 transition-colors uppercase tracking-widest font-bold text-[10px]"
                >
                    <LogOut size={16} />
                    Sign Out Desk
                </Link>
            </div>
        </aside>
    );
}
