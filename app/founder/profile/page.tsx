"use client";

import { useState } from "react";
import MonarchInput from "@/components/ui/MonarchInput";
import MonarchButton from "@/components/ui/MonarchButton";
import MonarchBadge from "@/components/ui/MonarchBadge";
import GoldDivider from "@/components/ui/GoldDivider";

const tabs = ["Overview", "Metrics", "Financials", "Cap Table", "Deck", "Risk Disclosures"] as const;

export default function FounderProfilePage() {
  const [active, setActive] = useState<(typeof tabs)[number]>("Overview");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-10 space-y-8">
      <div className="text-[22px] font-serif text-gold">Founder Profile</div>

      <div className="flex gap-6 overflow-x-auto border-b border-white/10 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-3 text-[13px] ${
              active === tab
                ? "text-white border-b-2 border-gold"
                : "text-grey-dim hover:text-grey"
            }`}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
        <Panel title={active}>
          {renderFields(active)}
        </Panel>

        <div className="flex items-center gap-3">
          <MonarchButton type="submit">Save Changes</MonarchButton>
          {saved ? (
            <div className="flex items-center gap-2 text-gold text-[13px]">
              <span>✔</span>
              <span>Changes saved</span>
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="text-[14px] text-grey-light">{title}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{children}</div>
      <GoldDivider className="mt-2" />
    </div>
  );
}

function renderFields(tab: (typeof tabs)[number]) {
  switch (tab) {
    case "Overview":
      return (
        <>
          <MonarchInput label="Company Name" placeholder="Monarch Labs" />
          <MonarchInput label="Industry" placeholder="Capital Infrastructure" />
          <MonarchInput label="Stage" placeholder="Series A" />
          <MonarchInput label="One-line Description" placeholder="Private boardroom for vetted capital" />
        </>
      );
    case "Metrics":
      return (
        <>
          <MonarchInput label="MRR" placeholder="$120,000" />
          <MonarchInput label="Growth %" placeholder="12% MoM" />
          <MonarchInput label="User Count" placeholder="3,200" />
          <MonarchInput label="Key Milestones" as="textarea" rows={3} />
        </>
      );
    case "Financials":
      return (
        <>
          <MonarchInput label="Revenue (TTM)" placeholder="$1.4M" />
          <MonarchInput label="Burn" placeholder="$160k / month" />
          <MonarchInput label="Runway" placeholder="12 months" />
          <MonarchInput label="Notes" as="textarea" rows={3} />
        </>
      );
    case "Cap Table":
      return (
        <>
          <MonarchInput label="Founder Ownership %" placeholder="62%" />
          <MonarchInput label="Investor Ownership %" placeholder="30%" />
          <MonarchInput label="ESOP %" placeholder="8%" />
          <MonarchInput label="Notes" as="textarea" rows={3} />
        </>
      );
    case "Deck":
      return (
        <>
          <MonarchBadge variant="grey">Current Version: v3</MonarchBadge>
          <MonarchInput label="Deck URL" placeholder="Uploaded / managed by Monarch" fullBorder />
          <MonarchInput label="Notes to Monarch" as="textarea" rows={3} />
        </>
      );
    case "Risk Disclosures":
      return (
        <>
          <MonarchInput label="Key Risks" as="textarea" rows={4} />
          <MonarchInput label="Mitigations" as="textarea" rows={4} />
        </>
      );
    default:
      return null;
  }
}
