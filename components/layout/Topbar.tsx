"use client";

import { usePathname, useRouter } from "next/navigation";
import { PAGE_TITLES } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/ui/Button";

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, logout } = useAuthStore();

  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    logout();
    router.replace("/login");
    router.refresh();
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-black px-6 py-5">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-secondary">{role ?? "secure"}</p>
        <h1 className="font-display text-2xl text-foreground md:text-3xl">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="text-xs uppercase tracking-[0.3em] text-secondary">Authenticated</p>
          <p className="text-sm text-foreground">{user?.name ?? "Monarch Member"}</p>
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          Exit
        </Button>
      </div>
    </header>
  );
}
