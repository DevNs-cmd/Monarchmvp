"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import MonarchCard from "@/components/ui/MonarchCard";
import MonarchTable from "@/components/ui/MonarchTable";
import MonarchButton from "@/components/ui/MonarchButton";
import MonarchBadge from "@/components/ui/MonarchBadge";
import AdminVettingPanel from "@/components/admin/AdminVettingPanel";

const tabs = ["Vetting", "Deal Flow", "Markets", "Governance", "Revenue"] as const;
type Tab = (typeof tabs)[number];
type Operations = {
  dealFlow: { activeDeals: number; introductions: number; feesTriggered: number; rows: Array<Record<string, unknown>> };
  governance: Array<{ id: string; name: string; role: string; status: string; joined: string; lastActive: string }>;
  revenue: { byType: Record<string, number>; total: number; funnel: Array<{ name: string; count: number }> };
  markets: Array<{ id: string; ticker: string; score: number; risk: number; recommendation: string; published: boolean }>;
};

export default function AdminDashboard() {
  const [active, setActive] = useState<Tab>("Vetting");
  const [operations, setOperations] = useState<Operations | null>(null);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/operations", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to load operations");
    setOperations(data);
  }, []);
  useEffect(() => { load().catch((reason) => setNotice(reason instanceof Error ? reason.message : "Unable to load operations")); }, [load]);

  const suspend = async (userId: string) => {
    const response = await fetch("/api/admin/users/suspend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) });
    const data = await response.json();
    if (!response.ok) { setNotice(data.error || "Unable to suspend member"); return; }
    setNotice("Member suspended and active sessions revoked.");
    await load();
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div><div className="text-[11px] uppercase tracking-widest4 text-grey-dim">Monarch Core</div><h1 className="font-serif text-3xl font-light">Governance & oversight</h1></div>
        <div className="flex max-w-full gap-4 overflow-x-auto">
          {tabs.map((tab) => <button key={tab} className={`whitespace-nowrap px-2 py-2 text-[11px] uppercase tracking-widest4 ${active === tab ? "border-b border-gold text-gold" : "text-grey hover:text-white"}`} onClick={() => setActive(tab)}>{tab}</button>)}
        </div>
      </header>
      {notice ? <div className="border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-gold">{notice}</div> : null}
      {active === "Vetting" ? <AdminVettingPanel /> : null}
      {active !== "Vetting" && !operations ? <MonarchCard>Loading operations...</MonarchCard> : null}
      {operations && active === "Deal Flow" ? <DealFlowPanel data={operations.dealFlow} /> : null}
      {operations && active === "Governance" ? <GovernancePanel members={operations.governance} onSuspend={suspend} /> : null}
      {operations && active === "Revenue" ? <RevenuePanel data={operations.revenue} /> : null}
      {operations && active === "Markets" ? <MarketsPanel items={operations.markets} /> : null}
    </div>
  );
}

function DealFlowPanel({ data }: { data: Operations["dealFlow"] }) {
  const rows: Array<Record<string, unknown>> = data.rows.map((row) => ({ ...row, date: new Date(String(row.date)).toLocaleDateString(), fee: String(row.fee).replaceAll("_", " ") }));
  return <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-3">{[{ label: "Active deals", value: data.activeDeals }, { label: "Introductions", value: data.introductions }, { label: "Fees triggered", value: data.feesTriggered }].map((stat) => <MonarchCard key={stat.label}><div className="text-[11px] uppercase tracking-widest4 text-grey-dim">{stat.label}</div><div className="font-serif text-[32px] text-gold">{stat.value}</div></MonarchCard>)}</div>
    <MonarchTable columns={[{ key: "founder", header: "Founder" }, { key: "investor", header: "Investor" }, { key: "date", header: "Opened" }, { key: "stage", header: "Stage", render: (row) => <MonarchBadge variant="gold">{String(row.stage).replaceAll("_", " ")}</MonarchBadge> }, { key: "fee", header: "Success fee", render: (row) => <MonarchBadge variant={String(row.fee).includes("TRIGGERED") ? "success" : "warning"}>{String(row.fee)}</MonarchBadge> }]} rows={rows} />
  </div>;
}

function GovernancePanel({ members, onSuspend }: { members: Operations["governance"]; onSuspend: (id: string) => Promise<void> }) {
  const rows = members.map((member) => ({ ...member, joined: new Date(member.joined).toLocaleDateString(), lastActive: new Date(member.lastActive).toLocaleDateString() }));
  return <MonarchTable columns={[{ key: "name", header: "Member" }, { key: "role", header: "Role" }, { key: "status", header: "Status", render: (row) => <MonarchBadge variant={row.status === "ACTIVE" ? "success" : "warning"}>{row.status}</MonarchBadge> }, { key: "joined", header: "Joined" }, { key: "lastActive", header: "Updated" }, { key: "actions", header: "Action", render: (row) => row.status === "ACTIVE" && row.role !== "ADMIN" ? <MonarchButton variant="danger" size="sm" onClick={() => onSuspend(String(row.id))}>Suspend</MonarchButton> : <span className="text-grey-dim">Governed</span> }]} rows={rows} />;
}

function RevenuePanel({ data }: { data: Operations["revenue"] }) {
  const streams = useMemo(() => Object.entries(data.byType).map(([label, value]) => ({ label: label.replaceAll("_", " "), value })), [data.byType]);
  return <div className="space-y-8">
    <div className="grid gap-4 md:grid-cols-3"><MonarchCard><div className="text-[11px] uppercase tracking-widest4 text-grey-dim">Recorded revenue</div><div className="font-serif text-[30px] text-gold">${data.total.toLocaleString()}</div></MonarchCard>{streams.slice(0, 2).map((stream) => <MonarchCard key={stream.label}><div className="text-[11px] uppercase tracking-widest4 text-grey-dim">{stream.label}</div><div className="font-serif text-[30px] text-gold">${stream.value.toLocaleString()}</div></MonarchCard>)}</div>
    <MonarchCard><div className="mb-5 text-[13px] uppercase tracking-widest4 text-grey-dim">Commercial funnel</div><div className="space-y-4">{data.funnel.map((step, index) => <div key={step.name} className="grid grid-cols-[1fr_auto] items-center gap-4 border-t border-white/5 pt-3 first:border-t-0"><span className="text-sm text-grey-light">{step.name}</span><span className="text-gold">{step.count}</span>{index < data.funnel.length - 1 ? <div className="col-span-2 h-1 bg-white/5"><div className="h-full bg-gold" style={{ width: `${Math.min(100, Math.max(4, step.count ? (data.funnel[index + 1].count / step.count) * 100 : 4))}%` }} /></div> : null}</div>)}</div></MonarchCard>
  </div>;
}

function MarketsPanel({ items }: { items: Operations["markets"] }) {
  return <MonarchTable columns={[{ key: "ticker", header: "Ticker" }, { key: "score", header: "MIG score" }, { key: "risk", header: "Risk" }, { key: "recommendation", header: "Recommendation" }, { key: "published", header: "State", render: (row) => <MonarchBadge variant={row.published ? "success" : "warning"}>{row.published ? "Published" : "Council review"}</MonarchBadge> }]} rows={items} />;
}
