"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, Eye, Handshake, ShieldCheck, Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

type Overview = {
  investor: { name: string; organization: string | null; verified: boolean; kycStatus: string; accreditationStatus: string };
  metrics: { activeDeals: number; introductions: number; watchlist: number; curatedMatches: number };
  markets: Array<{ id: string; ticker: string; migScore: number; riskIndex: number; recommendation: string; allocationSuggestion: string }>;
  matches: Array<{ id: string; name: string; industry: string; stage: string; capitalAsk: number; monarchIndex: number; matchScore: number }>;
};

export default function InvestorDashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/investor/overview", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load investor workspace");
        setOverview(data);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load workspace"));
  }, []);

  if (!overview) return <Card className="text-sm text-secondary">{error || "Opening the investor workspace..."}</Card>;

  return (
    <div className="space-y-8">
      <Card className="border-accent/30 bg-[linear-gradient(110deg,rgba(201,162,77,0.08),rgba(17,17,17,0.92)_45%)]">
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="gold">Verified investor</Badge>
              <Badge tone="muted">KYC {overview.investor.kycStatus}</Badge>
              <Badge tone="muted">Accreditation {overview.investor.accreditationStatus}</Badge>
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.32em] text-secondary">Private capital command center</p>
            <h2 className="mt-2 font-display text-4xl text-foreground">{overview.investor.organization || overview.investor.name}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-secondary">Curated venture opportunities, governed introductions, secure diligence, and public-market intelligence in one mandate-aware workspace.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/boardroom"><Button>Enter boardroom</Button></Link>
            <Link href="/investor/intelligence"><Button variant="secondary">Open intelligence</Button></Link>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Curated matches", value: overview.metrics.curatedMatches, icon: Sparkles },
          { label: "Introductions", value: overview.metrics.introductions, icon: Handshake },
          { label: "Active deals", value: overview.metrics.activeDeals, icon: BriefcaseBusiness },
          { label: "Watchlist", value: overview.metrics.watchlist, icon: Eye },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="space-y-3">
            <Icon className="text-accent" size={18} />
            <p className="font-display text-3xl text-foreground">{value}</p>
            <p className="text-xs uppercase tracking-[0.24em] text-secondary">{label}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-secondary">Mandate alignment</p>
              <h3 className="mt-2 font-display text-2xl text-foreground">Curated opportunities</h3>
            </div>
            <Link className="text-sm text-accent" href="/boardroom">View all</Link>
          </div>
          <div className="space-y-3">
            {overview.matches.map((match) => (
              <Link key={match.id} href={`/boardroom/${match.id}`} className="group grid gap-4 border-t border-border py-5 first:border-t-0 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2"><p className="text-base text-foreground">{match.name}</p><Badge tone="gold">{match.matchScore}% match</Badge></div>
                  <p className="mt-2 text-xs text-secondary">{match.industry} · {match.stage} · ${match.capitalAsk.toLocaleString()} raise</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-secondary group-hover:text-accent"><span>MIG {match.monarchIndex}</span><ArrowUpRight size={16} /></div>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-secondary">Monarch Markets</p>
              <h3 className="mt-2 font-display text-2xl text-foreground">MIG signal board</h3>
            </div>
            <ShieldCheck className="text-accent" size={20} />
          </div>
          <div className="space-y-3">
            {overview.markets.map((market) => (
              <div key={market.id} className="grid grid-cols-[1fr_auto] items-center gap-3 border-t border-border py-4 first:border-t-0">
                <div><p className="text-sm text-foreground">{market.ticker}</p><p className="mt-1 text-xs text-secondary">{market.recommendation} · {market.allocationSuggestion}</p></div>
                <div className="text-right"><p className="font-display text-xl text-accent">{market.migScore}</p><p className="text-[10px] uppercase tracking-[0.2em] text-secondary">Risk {market.riskIndex}</p></div>
              </div>
            ))}
          </div>
          <Link className="mt-4 inline-flex" href="/investor/markets"><Button variant="secondary">Open market desk</Button></Link>
        </Card>
      </section>
    </div>
  );
}
