"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    ShieldCheck,
    Settings,
    LogOut,
    Briefcase
} from "lucide-react";

const founderLinks = [
    { name: "Overview", href: "/founder/dashboard", icon: LayoutDashboard },
    { name: "ApplicationStatus", href: "#", icon: ShieldCheck },
    { name: "Documents", href: "#", icon: Briefcase },
    { name: "Messages", href: "#", icon: MessageSquare },
];

const investorLinks = [
    { name: "Markets", href: "/investor/dashboard", icon: LayoutDashboard },
    { name: "Boardroom", href: "/boardroom", icon: Users },
    { name: "Portfolio", href: "#", icon: Briefcase },
    { name: "Intelligence", href: "#", icon: ShieldCheck },
];

export default function Sidebar({ role }: { role: "FOUNDER" | "INVESTOR" | "ADMIN" }) {
    const pathname = usePathname();
    const links = role === "FOUNDER" ? founderLinks : investorLinks;

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-black border-r border-white/5 flex flex-col z-50">
            <div className="p-8">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 border border-accent rounded-full flex items-center justify-center group-hover:bg-accent transition-all duration-300">
                        <span className="text-xs font-bold text-accent group-hover:text-black">M</span>
                    </div>
                    <span className="font-bold tracking-[0.2em] text-sm">MONARCH</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-secondary px-4 mb-4">Navigation</p>
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive
                                    ? "bg-accent text-black"
                                    : "text-secondary hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <Icon size={20} className={isActive ? "text-black" : "text-secondary group-hover:text-accent"} />
                            <span className="text-sm font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-white/5 space-y-2">
                <button className="w-full flex items-center gap-4 px-4 py-3 text-secondary text-sm hover:text-white transition-colors">
                    <Settings size={20} />
                    <span>Settings</span>
                </button>
                <Link href="/" className="w-full flex items-center gap-4 px-4 py-3 text-red-500/70 text-sm hover:text-red-500 transition-colors">
                    <LogOut size={20} />
                    <span>Exit Gate</span>
                </Link>
            </div>
        </aside>
    );
}
