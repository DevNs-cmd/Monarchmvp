import type { ReactNode } from "react";
import AppShell from "@/components/layout/AppShell";

export default function InvestorLayout({ children }: { children: ReactNode }) {
  return <AppShell role="investor">{children}</AppShell>;
}
