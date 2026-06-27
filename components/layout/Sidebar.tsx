"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import type { MonarchRole } from "@/lib/constants";
import {
  Home,
  FileText,
  Users,
  MessageSquare,
  Settings,
  Activity,
  Eye,
  Briefcase,
  Inbox,
  Shield,
  LineChart,
} from "lucide-react";
import clsx from "clsx";

const iconMap = {
  home: Home,
  file: FileText,
  users: Users,
  chat: MessageSquare,
  settings: Settings,
  pulse: Activity,
  watch: Eye,
  briefcase: Briefcase,
  inbox: Inbox,
  shield: Shield,
  chart: LineChart,
};

type SidebarProps = {
  role: MonarchRole;
};

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const items = NAV_ITEMS[role];

  return (
    <aside className="flex h-screen w-16 flex-col border-r border-border bg-black px-3 py-6 md:w-64">
      <div className="flex items-center gap-3 px-2">
        <div className="h-10 w-10 rounded-full border border-accent/60 flex items-center justify-center text-accent font-display text-lg">
          M
        </div>
        <div className="hidden md:block">
          <p className="text-xs uppercase tracking-[0.4em] text-secondary">MONARCH</p>
          <p className="text-sm text-foreground">Private Platform</p>
        </div>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-2">
        {items.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all",
                active ? "border border-accent/60 text-accent" : "border border-transparent text-secondary hover:text-foreground"
              )}
            >
              <Icon size={18} />
              <span className="hidden md:inline tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden md:block text-[10px] uppercase tracking-[0.3em] text-secondary">
        Invite-only access
      </div>
    </aside>
  );
}
