import type { ReactNode } from "react";
import AppShell from "@/components/layout/AppShell";

export default function FounderLayout({ children }: { children: ReactNode }) {
  return <AppShell role="founder">{children}</AppShell>;
}
