import type { ReactNode } from "react";
import type { MonarchRole } from "@/lib/constants";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function AppShell({ role, children }: { role: MonarchRole; children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black text-foreground">
      <Sidebar role={role} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="flex-1 space-y-8 px-6 py-8 md:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
