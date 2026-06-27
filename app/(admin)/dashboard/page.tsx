"use client";

import { useState } from "react";
import MonarchCard from "@/components/ui/MonarchCard";
import MonarchTable from "@/components/ui/MonarchTable";
import MonarchButton from "@/components/ui/MonarchButton";
import MonarchBadge from "@/components/ui/MonarchBadge";
import MonarchInput from "@/components/ui/MonarchInput";

const tabs = ["Vetting", "Deal Flow", "Markets", "Governance", "Revenue"] as const;

export default function AdminDashboard() {
  const [active, setActive] = useState<(typeof tabs)[number]>("Vetting");

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-10 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-widest4 text-grey-dim">Admin Console</div>
          <h1 className="font-serif text-3xl font-light">Governance & Oversight</h1>
        </div>
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-3 py-2 text-[12px] uppercase tracking-widest4 ${
                active === tab ? "text-gold border-b border-gold" : "text-grey hover:text-white"
              }`}
              onClick={() => setActive(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {active === "Vetting" && <VettingPanel />}
      {active === "Deal Flow" && <DealFlowPanel />}
      {active === "Governance" && <GovernancePanel />}
      {active === "Revenue" && <RevenuePanel />}
      {active === "Markets" && <MarketsPanel />}
    </div>
  );
}

function VettingPanel() {
  const queue = [
    { name: "Alice Warren", role: "FOUNDER", submitted: "Mar 02", status: "PENDING" },
    { name: "Leo Park", role: "INVESTOR", submitted: "Mar 01", status: "PENDING" },
  ];
  const detail = queue[0];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
      <MonarchCard>
        <div className="text-[13px] uppercase tracking-widest4 text-grey-dim mb-4">Queue</div>
        <div className="space-y-3">
          {queue.map((item) => (
            <div
              key={item.name}
              className="p-3 border border-white/10 hover:border-gold/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="text-[14px] text-white">{item.name}</div>
                <MonarchBadge variant="gold">{item.role}</MonarchBadge>
              </div>
              <div className="text-[12px] text-grey-dim">{item.submitted}</div>
            </div>
          ))}
        </div>
      </MonarchCard>
      <MonarchCard padding="lg" tone="dark2" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[14px] text-white">{detail.name}</div>
            <div className="text-[12px] text-grey-dim uppercase tracking-widest4">{detail.role}</div>
          </div>
          <MonarchBadge variant="warning">{detail.status}</MonarchBadge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["Traction", "Market", "Founder", "Financial", "Execution", "Risk"].map((field) => (
            <MonarchInput key={field} label={field} placeholder="0-100" />
          ))}
        </div>
        <MonarchInput label="Monarch Index" placeholder="Set score" />
        <MonarchInput label="Internal Notes" as="textarea" rows={3} />

        <div className="flex gap-3">
          <MonarchButton variant="primary">Approve</MonarchButton>
          <MonarchButton variant="ghost">Request Clarification</MonarchButton>
          <MonarchButton variant="danger">Reject</MonarchButton>
        </div>

        <div className="space-y-2 text-[12px] text-grey-dim">
          <div>History</div>
          <div>Mar 02 — Application received</div>
          <div>Mar 02 — Assigned to reviewer</div>
        </div>
      </MonarchCard>
    </div>
  );
}

function DealFlowPanel() {
  const rows = [
    { founder: "Atlas Rail", investor: "Helios Capital", date: "Mar 02", stage: "BOARDROOM", fee: "Pending" },
    { founder: "CarbonLayer", investor: "Northpeak", date: "Mar 01", stage: "TERM_SHEET", fee: "Triggered" },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Active Deals", value: 12 },
          { label: "Intros Made", value: 34 },
          { label: "Fees Triggered", value: 5 },
        ].map((stat) => (
          <MonarchCard key={stat.label}>
            <div className="text-[11px] text-grey-dim uppercase tracking-widest4">{stat.label}</div>
            <div className="text-[32px] text-gold font-serif">{stat.value}</div>
          </MonarchCard>
        ))}
      </div>
      <MonarchTable
        columns={[
          { key: "founder", header: "Founder" },
          { key: "investor", header: "Investor" },
          { key: "date", header: "Date" },
          { key: "stage", header: "Stage", render: (row) => <MonarchBadge variant="gold">{row.stage}</MonarchBadge> },
          { key: "fee", header: "Success Fee", render: (row) => <MonarchBadge variant={row.fee === "Triggered" ? "success" : "warning"}>{row.fee}</MonarchBadge> },
        ]}
        rows={rows}
      />
    </div>
  );
}

function GovernancePanel() {
  const members = [
    { name: "Alice Warren", role: "FOUNDER", status: "ACTIVE", joined: "Feb 12", lastActive: "Mar 2" },
    { name: "Leo Park", role: "INVESTOR", status: "ACTIVE", joined: "Jan 28", lastActive: "Mar 1" },
  ];
  const blacklist = [{ name: "Evan Shaw", reason: "Circumvention", date: "Feb 14" }];
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4">
        <MonarchInput label="Search" placeholder="Name or email" />
        <MonarchInput label="Role" placeholder="Any" />
        <MonarchInput label="Status" placeholder="Any" />
      </div>
      <MonarchTable
        columns={[
          { key: "name", header: "Name" },
          { key: "role", header: "Role" },
          { key: "status", header: "Status", render: (row) => <MonarchBadge variant="gold">{row.status}</MonarchBadge> },
          { key: "joined", header: "Joined" },
          { key: "lastActive", header: "Last Active" },
          {
            key: "actions",
            header: "Actions",
            render: () => (
              <div className="flex gap-2">
                <MonarchButton variant="danger" size="sm">
                  Suspend
                </MonarchButton>
                <MonarchButton variant="ghost" size="sm">
                  Blacklist
                </MonarchButton>
              </div>
            ),
          },
        ]}
        rows={members}
      />

      <div>
        <div className="text-[13px] uppercase tracking-widest4 text-grey-dim mb-3">Blacklist</div>
        <MonarchTable
          columns={[
            { key: "name", header: "Name" },
            { key: "reason", header: "Reason" },
            { key: "date", header: "Date" },
          ]}
          rows={blacklist}
        />
      </div>
    </div>
  );
}

function RevenuePanel() {
  const streams = [
    { label: "Screening Fees", value: 120000 },
    { label: "Boardroom Access", value: 84000 },
    { label: "Reports", value: 42000 },
    { label: "Algo Access", value: 36000 },
  ];
  const total = streams.reduce((sum, s) => sum + s.value, 0);
  const funnel = [
    { name: "Requests", count: 420 },
    { name: "Verified", count: 260 },
    { name: "Founder Dossiers", count: 180 },
    { name: "Shortlisted", count: 90 },
    { name: "Boardroom", count: 55 },
    { name: "Funded", count: 18 },
  ];
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {streams.map((s) => (
          <MonarchCard key={s.label}>
            <div className="text-[11px] text-grey-dim uppercase tracking-widest4">{s.label}</div>
            <div className="text-[24px] text-gold font-medium">${(s.value / 1000).toFixed(1)}k</div>
          </MonarchCard>
        ))}
      </div>
      <MonarchCard>
        <div className="text-[13px] uppercase tracking-widest4 text-grey-dim mb-4">Revenue by Stream</div>
        <div className="space-y-3">
          {streams.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="w-40 text-[13px] text-grey-light">{s.label}</div>
              <div className="flex-1 h-2 bg-white/5">
                <div className="h-full bg-gold" style={{ width: `${(s.value / total) * 100}%` }} />
              </div>
              <div className="text-[13px] text-grey-light">${(s.value / 1000).toFixed(1)}k</div>
            </div>
          ))}
        </div>
      </MonarchCard>

      <MonarchCard>
        <div className="text-[13px] uppercase tracking-widest4 text-grey-dim mb-4">Funnel</div>
        <div className="space-y-3">
          {funnel.map((step, idx) => (
            <div key={step.name} className="flex items-center justify-between">
              <div className="text-[13px] text-grey-light">{step.name}</div>
              <div className="text-[13px] text-white">{step.count}</div>
              {idx < funnel.length - 1 ? (
                <div className="text-[12px] text-grey-dim">
                  {(100 - (funnel[idx + 1].count / step.count) * 100).toFixed(0)}% drop
                </div>
              ) : (
                <div className="text-[12px] text-grey-dim">Conversion</div>
              )}
            </div>
          ))}
        </div>
      </MonarchCard>
    </div>
  );
}

function MarketsPanel() {
  const pending = [
    { ticker: "MDB", score: 78, rec: "Neutral" },
    { ticker: "PLTR", score: 64, rec: "High Risk" },
  ];
  return (
    <div className="space-y-4">
      <div className="text-[13px] uppercase tracking-widest4 text-grey-dim">Pending MIG signals</div>
      <MonarchTable
        columns={[
          { key: "ticker", header: "Ticker" },
          { key: "score", header: "Score" },
          { key: "rec", header: "Recommendation" },
          {
            key: "actions",
            header: "Actions",
            render: () => (
              <div className="flex gap-2">
                <MonarchButton size="sm" variant="primary">
                  Approve
                </MonarchButton>
                <MonarchButton size="sm" variant="ghost">
                  Override
                </MonarchButton>
              </div>
            ),
          },
        ]}
        rows={pending}
      />
    </div>
  );
}
