"use client";

import Link from "next/link";
import MonarchCard from "@/components/ui/MonarchCard";
import MonarchGauge from "@/components/ui/MonarchGauge";
import MonarchBadge from "@/components/ui/MonarchBadge";

const picks = [
  { ticker: "NVDA", company: "NVIDIA", score: 92, recommendation: "Highly Recommended" },
  { ticker: "ASML", company: "ASML", score: 88, recommendation: "Highly Recommended" },
  { ticker: "TSM", company: "TSMC", score: 85, recommendation: "Highly Recommended" },
];

const sectors = [
  { name: "AI", strength: "strong", change: "+4.2%" },
  { name: "Cloud", strength: "neutral", change: "+0.8%" },
  { name: "Energy", strength: "weak", change: "-2.1%" },
  { name: "Defense", strength: "strong", change: "+3.4%" },
  { name: "Bio", strength: "neutral", change: "+1.0%" },
  { name: "Fintech", strength: "neutral", change: "+0.2%" },
  { name: "Infra", strength: "strong", change: "+2.6%" },
  { name: "Consumer", strength: "weak", change: "-1.4%" },
  { name: "Climate", strength: "neutral", change: "+0.4%" },
  { name: "Semis", strength: "strong", change: "+3.9%" },
  { name: "Mobility", strength: "neutral", change: "+0.6%" },
  { name: "Industrial", strength: "weak", change: "-0.8%" },
  { name: "Security", strength: "strong", change: "+2.9%" },
  { name: "Logistics", strength: "neutral", change: "+0.5%" },
  { name: "Retail", strength: "weak", change: "-1.2%" },
];

export default function MarketsPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-10 space-y-12">
      <div className="space-y-2">
        <div className="text-[11px] uppercase tracking-widest4 text-grey-dim">Monarch Markets™</div>
        <h1 className="font-serif text-3xl font-light">Signals and intelligence</h1>
      </div>

      {/* MIG Top Picks */}
      <section className="space-y-4">
        <h3 className="text-[13px] uppercase tracking-widest4 text-grey-dim">MIG Top Picks</h3>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {picks.map((pick) => (
            <MonarchCard key={pick.ticker} className="w-64 flex-shrink-0 hover:border-gold/30 transition-colors">
              <div className="text-[18px] text-white font-medium">{pick.ticker}</div>
              <div className="text-[13px] text-grey mb-3">{pick.company}</div>
              <MonarchGauge score={pick.score} label="MIG Score" size="sm" />
              <MonarchBadge
                variant={pick.recommendation === "High Risk" ? "danger" : pick.recommendation === "Neutral" ? "grey" : "gold"}
                className="mt-4"
              >
                {pick.recommendation}
              </MonarchBadge>
              <Link href={`/investor/markets/${pick.ticker}`} className="mt-4 inline-block text-gold text-[12px]">
                View Detail →
              </Link>
            </MonarchCard>
          ))}
        </div>
      </section>

      {/* Sector Heatmap */}
      <section className="space-y-4">
        <h3 className="text-[13px] uppercase tracking-widest4 text-grey-dim">Sector Heatmap</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {sectors.map((sector) => (
            <div
              key={sector.name}
              className={`border border-white/10 p-4 text-center bg-dark-2`}
              style={{
                backgroundColor:
                  sector.strength === "strong"
                    ? "rgba(201,162,77,0.1)"
                    : sector.strength === "weak"
                    ? "rgba(127,29,29,0.2)"
                    : "rgba(255,255,255,0.03)",
              }}
            >
              <div className="text-[12px] text-grey-dim uppercase">{sector.name}</div>
              <div
                className={`mt-1 text-[14px] ${
                  sector.strength === "strong" ? "text-gold" : sector.strength === "weak" ? "text-red-400" : "text-grey-light"
                }`}
              >
                {sector.change}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
