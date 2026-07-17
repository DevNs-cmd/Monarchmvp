"use client";

import { useEffect, useState } from "react";
import MonarchInput from "@/components/ui/MonarchInput";
import MonarchButton from "@/components/ui/MonarchButton";
import MonarchBadge from "@/components/ui/MonarchBadge";
import GoldDivider from "@/components/ui/GoldDivider";

const tabs = ["Overview", "Metrics", "Financials", "Cap Table", "Risk Disclosures"] as const;
type Tab = (typeof tabs)[number];
type Values = {
  companyName: string;
  industry: string;
  stage: string;
  capitalAsk: string;
  valuation: string;
  summary: string;
  metrics: Record<string, string>;
  financials: Record<string, string>;
  capTable: Record<string, string>;
  riskDisclosures: Record<string, string>;
};

const empty: Values = {
  companyName: "", industry: "", stage: "", capitalAsk: "", valuation: "", summary: "",
  metrics: {}, financials: {}, capTable: {}, riskDisclosures: {},
};

export default function FounderProfilePage() {
  const [active, setActive] = useState<Tab>("Overview");
  const [values, setValues] = useState<Values>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/founder/profile", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load dossier");
        const profile = data.profile;
        setValues({
          companyName: profile.companyName || "",
          industry: profile.startup?.industry || "",
          stage: profile.stage || "",
          capitalAsk: String(profile.capitalAsk || ""),
          valuation: String(profile.valuation || ""),
          summary: profile.summary || "",
          metrics: profile.metrics || {},
          financials: profile.financials || {},
          capTable: profile.capTable || {},
          riskDisclosures: profile.riskDisclosures || {},
        });
      })
      .catch((reason) => setMessage(reason instanceof Error ? reason.message : "Unable to load dossier"))
      .finally(() => setLoading(false));
  }, []);

  const setRoot = (key: keyof Omit<Values, "metrics" | "financials" | "capTable" | "riskDisclosures">, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };
  const setGroup = (group: "metrics" | "financials" | "capTable" | "riskDisclosures", key: string, value: string) => {
    setValues((current) => ({ ...current, [group]: { ...current[group], [key]: value } }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/founder/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, capitalAsk: Number(values.capitalAsk), valuation: values.valuation ? Number(values.valuation) : null }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save dossier");
      setMessage("Dossier saved and audit event recorded.");
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Unable to save dossier");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-sm text-secondary">Loading verified dossier...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-xs uppercase tracking-[0.3em] text-secondary">Founder data room</p><h2 className="mt-2 font-display text-3xl text-foreground">Verified dossier</h2></div>
        <MonarchBadge variant="gold">Private · Versioned</MonarchBadge>
      </div>

      <div className="flex gap-6 overflow-x-auto border-b border-white/10 pb-2">
        {tabs.map((tab) => (
          <button key={tab} type="button" className={`whitespace-nowrap pb-3 text-[13px] ${active === tab ? "border-b-2 border-gold text-white" : "text-grey-dim hover:text-grey"}`} onClick={() => setActive(tab)}>{tab}</button>
        ))}
      </div>

      <form onSubmit={handleSave} className="max-w-4xl space-y-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {active === "Overview" ? <>
              <MonarchInput label="Company Name" value={values.companyName} onChange={(e) => setRoot("companyName", e.target.value)} required />
              <MonarchInput label="Industry" value={values.industry} onChange={(e) => setRoot("industry", e.target.value)} required />
              <MonarchInput label="Stage" value={values.stage} onChange={(e) => setRoot("stage", e.target.value)} required />
              <MonarchInput label="Capital Ask (USD)" type="number" value={values.capitalAsk} onChange={(e) => setRoot("capitalAsk", e.target.value)} required />
              <MonarchInput label="Pre-money Valuation (USD)" type="number" value={values.valuation} onChange={(e) => setRoot("valuation", e.target.value)} />
              <MonarchInput className="sm:col-span-2" label="Executive Summary" as="textarea" rows={5} value={values.summary} onChange={(e) => setRoot("summary", e.target.value)} />
            </> : null}
            {active === "Metrics" ? <>
              <MonarchInput label="ARR" value={values.metrics.arr || ""} onChange={(e) => setGroup("metrics", "arr", e.target.value)} />
              <MonarchInput label="Growth" value={values.metrics.growth || ""} onChange={(e) => setGroup("metrics", "growth", e.target.value)} />
              <MonarchInput label="Customers / Sites" value={values.metrics.customers || values.metrics.sites || ""} onChange={(e) => setGroup("metrics", "customers", e.target.value)} />
              <MonarchInput label="Retention" value={values.metrics.retention || ""} onChange={(e) => setGroup("metrics", "retention", e.target.value)} />
            </> : null}
            {active === "Financials" ? <>
              <MonarchInput label="Monthly Burn" value={values.financials.burn || ""} onChange={(e) => setGroup("financials", "burn", e.target.value)} />
              <MonarchInput label="Runway" value={values.financials.runway || ""} onChange={(e) => setGroup("financials", "runway", e.target.value)} />
              <MonarchInput label="Gross Margin" value={values.financials.grossMargin || ""} onChange={(e) => setGroup("financials", "grossMargin", e.target.value)} />
              <MonarchInput label="Cash" value={values.financials.cash || ""} onChange={(e) => setGroup("financials", "cash", e.target.value)} />
            </> : null}
            {active === "Cap Table" ? <>
              <MonarchInput label="Founder Ownership" value={values.capTable.founders || ""} onChange={(e) => setGroup("capTable", "founders", e.target.value)} />
              <MonarchInput label="Investor Ownership" value={values.capTable.investors || ""} onChange={(e) => setGroup("capTable", "investors", e.target.value)} />
              <MonarchInput label="ESOP" value={values.capTable.esop || ""} onChange={(e) => setGroup("capTable", "esop", e.target.value)} />
            </> : null}
            {active === "Risk Disclosures" ? <>
              <MonarchInput label="Principal Risk" as="textarea" rows={5} value={values.riskDisclosures.concentration || values.riskDisclosures.regulation || values.riskDisclosures.salesCycle || values.riskDisclosures.compliance || ""} onChange={(e) => setGroup("riskDisclosures", "principalRisk", e.target.value)} />
              <MonarchInput label="Mitigation" as="textarea" rows={5} value={values.riskDisclosures.mitigation || ""} onChange={(e) => setGroup("riskDisclosures", "mitigation", e.target.value)} />
            </> : null}
          </div>
          <GoldDivider />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <MonarchButton type="submit" loading={saving}>Save verified dossier</MonarchButton>
          {message ? <p className={`text-sm ${message.includes("saved") ? "text-gold" : "text-red-400"}`}>{message}</p> : null}
        </div>
      </form>
    </div>
  );
}
