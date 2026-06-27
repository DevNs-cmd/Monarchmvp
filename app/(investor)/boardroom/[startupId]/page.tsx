"use client";

import { useState } from "react";
import MonarchCard from "@/components/ui/MonarchCard";
import MonarchBadge from "@/components/ui/MonarchBadge";
import MonarchButton from "@/components/ui/MonarchButton";
import MonarchGauge from "@/components/ui/MonarchGauge";

const tabs = ["Overview", "Metrics", "Deck", "Risk Notes", "Interest"] as const;

export default function StartupDossierPage() {
  const [active, setActive] = useState<(typeof tabs)[number]>("Overview");

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-10 space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <MonarchBadge variant="grey">Fintech</MonarchBadge>
          <MonarchBadge variant="grey">Series A</MonarchBadge>
          <MonarchBadge variant="gold">Capital Ask: $6.5M</MonarchBadge>
        </div>
        <div className="font-serif text-3xl font-light">Atlas Rail — Private capital orchestration</div>
      </header>

      <div className="flex gap-6 overflow-x-auto border-b border-white/10 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-3 text-[13px] ${
              active === tab ? "text-white border-b-2 border-gold" : "text-grey-dim hover:text-grey"
            }`}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === "Overview" && <OverviewTab />}
      {active === "Metrics" && <MetricsTab />}
      {active === "Deck" && <DeckTab />}
      {active === "Risk Notes" && <RiskTab />}
      {active === "Interest" && <InterestTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
      <MonarchCard tone="dark2">
        <p className="font-serif font-light text-grey-light text-[16px] leading-relaxed space-y-4">
          Atlas Rail builds the infrastructure layer for private capital workflows. The platform synchronizes
          fund mandates, LP reporting, and secure deal rooms in one environment, reducing cycle time from
          interest to close.
        </p>
      </MonarchCard>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Industry", value: "Fintech / Infra" },
          { label: "Founded", value: "2022" },
          { label: "Stage", value: "Series A" },
          { label: "Capital Ask", value: "$6.5M" },
        ].map((stat) => (
          <MonarchCard key={stat.label} tone="dark2">
            <div className="text-[11px] text-grey-dim uppercase tracking-widest4 mb-1">{stat.label}</div>
            <div className="text-[18px] text-white font-light">{stat.value}</div>
          </MonarchCard>
        ))}
      </div>
    </div>
  );
}

function MetricsTab() {
  const metrics = [
    { label: "MRR", value: "$120k" },
    { label: "Growth", value: "12% MoM" },
    { label: "Users", value: "3,200" },
    { label: "Runway", value: "12 months" },
  ];
  const milestones = [
    { date: "Q3 2025", note: "Launched boardroom module" },
    { date: "Q4 2025", note: "Signed 3 enterprise funds" },
    { date: "Q1 2026", note: "Expanded to markets intelligence" },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <MonarchCard key={m.label}>
            <div className="text-[11px] text-grey-dim uppercase tracking-widest4 mb-1">{m.label}</div>
            <div className="text-[28px] text-white font-light">{m.value}</div>
          </MonarchCard>
        ))}
      </div>
      <div className="space-y-3">
        {milestones.map((m) => (
          <div key={m.date} className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-gold mt-1.5" />
            <div>
              <div className="text-[12px] text-grey-dim uppercase tracking-widest4">{m.date}</div>
              <div className="text-[14px] text-grey-light">{m.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeckTab() {
  return (
    <div className="space-y-4">
      <div className="border border-grey-dim/30 bg-white/[0.03] text-grey-light text-[13px] p-4 flex items-center gap-3">
        <span className="text-gold">ℹ</span>
        This deck is watermarked with your identity and access timestamp.
      </div>
      <div className="h-[480px] border border-white/10 bg-dark-2 flex items-center justify-center text-grey">
        Deck loading...
      </div>
    </div>
  );
}

function RiskTab() {
  const risks = [
    { title: "Customer concentration", level: "warning", detail: "Top 2 customers = 48% of ARR." },
    { title: "Regulatory exposure", level: "danger", detail: "Cross-border data residency pending audit." },
  ];
  return (
    <div className="space-y-4">
      {risks.map((risk) => (
        <MonarchCard key={risk.title} tone="dark2" className="flex items-start gap-3">
          <span className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: risk.level === "danger" ? "#f87171" : "#fbbf24" }} />
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="text-[14px] text-white">{risk.title}</div>
              <MonarchBadge variant={risk.level === "danger" ? "danger" : "warning"}>
                {risk.level === "danger" ? "High" : "Moderate"}
              </MonarchBadge>
            </div>
            <div className="text-[14px] text-grey">{risk.detail}</div>
          </div>
        </MonarchCard>
      ))}
      <div className="text-[12px] text-grey-dim italic">Risk notes are authored by Monarch. Not investment advice.</div>
    </div>
  );
}

function InterestTab() {
  return (
    <div className="max-w-md space-y-4">
      <MonarchButton variant="primary" fullWidth>
        Mark Interested
      </MonarchButton>
      <MonarchButton variant="ghost" fullWidth>
        Request Introduction
      </MonarchButton>
      <div className="text-[13px] text-grey-dim">
        Introductions are facilitated by Monarch. Contact details are not shared.
      </div>
    </div>
  );
}
