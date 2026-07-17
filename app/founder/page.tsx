"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Check, Clock3, FileCheck2, Handshake, Users } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import StatusTimeline from "@/components/monarch/StatusTimeline";
import MonarchIndexGauge from "@/components/monarch/MonarchIndexGauge";
import Button from "@/components/ui/Button";

type Overview = {
  profile: {
    companyName: string;
    status: string;
    certifiedStatus: string;
    kycStatus: string;
    score: number;
    breakdown: { traction?: number; team?: number; market?: number } | null;
    stage: string;
    capitalAsk: number;
  };
  metrics: { activeDeals: number; investorInterest: number; completedPayments: number; acceptedAgreements: number };
  interests: Array<{ id: string; investorName: string; organization: string; status: string; founderInterest: boolean }>;
  latestDealId: string | null;
};

export default function FounderDashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const [approving, setApproving] = useState<string | null>(null);

  const load = useCallback(async () => {
    const response = await fetch("/api/founder/overview", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to load founder workspace");
    setOverview(data);
  }, []);

  useEffect(() => {
    load().catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load workspace"));
  }, [load]);

  const approve = async (interestId: string) => {
    setApproving(interestId);
    setError("");
    try {
      const response = await fetch(`/api/founder/interests/${interestId}/approve`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to approve interest");
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to approve interest");
    } finally {
      setApproving(null);
    }
  };

  if (!overview) {
    return <Card className="text-sm text-secondary">{error || "Opening the founder workspace..."}</Card>;
  }

  const profile = overview.profile;
  const pendingInterests = overview.interests.filter((interest) => !interest.founderInterest);
  const activeStep = profile.status === "ACTIVE" ? 3 : profile.status === "SHORTLISTED" ? 2 : 1;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="space-y-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-secondary">Founder trajectory</p>
              <h2 className="mt-2 font-display text-3xl text-foreground">{profile.companyName}</h2>
              <p className="mt-2 text-sm text-secondary">{profile.stage} · seeking ${profile.capitalAsk.toLocaleString()}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="gold">{profile.certifiedStatus.replaceAll("_", " ")}</Badge>
              <Badge tone="muted">KYC {profile.kycStatus}</Badge>
            </div>
          </div>
          <StatusTimeline active={activeStep} />
          <div className="flex flex-wrap gap-3">
            <Link href="/founder/profile"><Button>Update dossier</Button></Link>
            {overview.latestDealId ? <Link href={`/dealroom/${overview.latestDealId}`}><Button variant="secondary">Open deal room</Button></Link> : null}
          </div>
        </Card>
        <Card className="flex items-center justify-center">
          <MonarchIndexGauge score={profile.score} />
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Investor interest", value: overview.metrics.investorInterest, icon: Users },
          { label: "Active deal rooms", value: overview.metrics.activeDeals, icon: Handshake },
          { label: "Agreements accepted", value: overview.metrics.acceptedAgreements, icon: FileCheck2 },
          { label: "Payments complete", value: overview.metrics.completedPayments, icon: Check },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="space-y-3">
            <Icon className="text-accent" size={18} />
            <p className="font-display text-3xl text-foreground">{value}</p>
            <p className="text-xs uppercase tracking-[0.24em] text-secondary">{label}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-secondary">Curated interest</p>
              <h3 className="mt-2 font-display text-2xl text-foreground">Founder approvals</h3>
            </div>
            <Badge tone={pendingInterests.length ? "gold" : "muted"}>{pendingInterests.length} pending</Badge>
          </div>
          <div className="space-y-3">
            {pendingInterests.length === 0 ? (
              <p className="text-sm text-secondary">All current investor interest has been reviewed.</p>
            ) : pendingInterests.map((interest) => (
              <div key={interest.id} className="flex flex-col justify-between gap-4 border-t border-border py-4 first:border-t-0 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm text-foreground">{interest.investorName}</p>
                  <p className="mt-1 text-xs text-secondary">{interest.organization}</p>
                </div>
                <Button onClick={() => approve(interest.id)} disabled={approving === interest.id}>
                  {approving === interest.id ? "Approving" : "Approve introduction"}
                </Button>
              </div>
            ))}
          </div>
          {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
        </Card>
        <Card className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">Readiness composition</p>
            <h3 className="mt-2 font-display text-2xl text-foreground">Private score detail</h3>
          </div>
          {[
            { label: "Traction", value: profile.breakdown?.traction || profile.score },
            { label: "Team", value: profile.breakdown?.team || profile.score },
            { label: "Market", value: profile.breakdown?.market || profile.score },
          ].map((metric) => (
            <div key={metric.label}>
              <div className="mb-2 flex justify-between text-xs text-secondary"><span>{metric.label}</span><span>{metric.value}</span></div>
              <div className="h-1.5 bg-white/5"><div className="h-full bg-accent" style={{ width: `${metric.value}%` }} /></div>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-2 text-xs text-secondary"><Clock3 size={14} /> Analyst-reviewed, private and non-comparative</div>
          <Link className="inline-flex items-center gap-2 text-sm text-accent" href="/founder/profile">Review full dossier <ArrowRight size={15} /></Link>
        </Card>
      </section>
    </div>
  );
}
