"use client";

import MonarchBadge from "@/components/ui/MonarchBadge";
import MonarchCard from "@/components/ui/MonarchCard";
import MonarchGauge from "@/components/ui/MonarchGauge";
import MonarchButton from "@/components/ui/MonarchButton";

const dots = Array.from({ length: 10 });

export default function StockDetailPage() {
  const ticker = "NVDA";
  const company = "NVIDIA Corporation";
  const recommendation = "Highly Recommended";
  const migScore = 92;
  const riskIndex = 4;
  const timeHorizon = "Medium";
  const allocation = 18;
  const rationale = [
    "Leadership in accelerated compute and AI infrastructure.",
    "Demand visibility through hyperscalers and enterprise AI ramps.",
    "Margins supported by software and ecosystem lock-in.",
    "Supply chain capacity expanding; risk moderated.",
  ];

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-10 space-y-10">
      <header className="space-y-2">
        <div className="font-serif text-[36px] font-light">{ticker}</div>
        <div className="text-[16px] text-grey-light">{company}</div>
        <MonarchBadge variant="gold" className="mt-2">
          {recommendation}
        </MonarchBadge>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MonarchCard>
          <div className="text-[11px] text-grey-dim uppercase tracking-widest4 mb-2">MIG Score</div>
          <MonarchGauge score={migScore} label="Public" size="sm" />
        </MonarchCard>
        <MonarchCard>
          <div className="text-[11px] text-grey-dim uppercase tracking-widest4 mb-2">Risk Index</div>
          <div className="flex items-center gap-2">
            {dots.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 w-2 rounded-full ${idx < riskIndex ? "bg-gold" : "bg-grey-dim"}`}
              />
            ))}
          </div>
        </MonarchCard>
        <MonarchCard>
          <div className="text-[11px] text-grey-dim uppercase tracking-widest4 mb-2">Time Horizon</div>
          <div className="flex rounded-none overflow-hidden border border-white/10">
            {["Short", "Medium", "Long"].map((h) => (
              <div
                key={h}
                className={`flex-1 text-center py-2 text-[12px] ${
                  h === timeHorizon ? "bg-gold text-black" : "bg-dark-2 text-grey-light"
                }`}
              >
                {h}
              </div>
            ))}
          </div>
        </MonarchCard>
        <MonarchCard>
          <div className="text-[11px] text-grey-dim uppercase tracking-widest4 mb-2">Suggested Allocation</div>
          <div className="h-2 bg-white/5">
            <div className="h-full bg-gold" style={{ width: `${allocation}%` }} />
          </div>
          <div className="mt-2 text-[13px] text-grey-light">{allocation}%</div>
        </MonarchCard>
      </div>

      <section className="space-y-3">
        <div className="text-[13px] uppercase tracking-widest4 text-grey-dim">Key Rationale</div>
        <div className="space-y-2">
          {rationale.map((item) => (
            <div key={item} className="flex items-start gap-3 text-[14px] text-grey-light">
              <span className="w-4 h-[2px] bg-gold mt-2" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-4">
        <MonarchButton variant="gold-outline" fullWidth>
          Add to Watchlist
        </MonarchButton>
        <MonarchButton variant="ghost" fullWidth>
          Request Custom Report
        </MonarchButton>
      </div>
    </div>
  );
}
