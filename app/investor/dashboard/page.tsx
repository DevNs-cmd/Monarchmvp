"use client";

import MonarchCard from "@/components/ui/MonarchCard";
import MonarchBadge from "@/components/ui/MonarchBadge";
import MonarchButton from "@/components/ui/MonarchButton";

const migHighlights = [
  { ticker: "NVDA", score: 92, direction: "up" },
  { ticker: "ASML", score: 88, direction: "up" },
  { ticker: "TSLA", score: 61, direction: "down" },
];

export default function InvestorDashboard() {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-64 bg-off-black border-r border-white/10 p-6 flex flex-col gap-8">
        <div className="font-serif text-2xl text-gold">M</div>
        <nav className="space-y-2 text-[13px] uppercase tracking-widest4">
          {[
            { label: "Home", active: true },
            { label: "Boardroom" },
            { label: "Markets" },
            { label: "Intelligence" },
            { label: "Portfolio" },
            { label: "Profile" },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-3 py-2 border-l ${
                item.active ? "border-gold text-gold" : "border-transparent text-grey hover:text-white"
              } transition-colors`}
            >
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="mt-auto text-[12px] text-grey-dim space-y-1">
          <div>Monarch Member</div>
          <div className="uppercase tracking-widest4">Investor</div>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 space-y-12">
        <HeroCard />
        {/* Additional sections placeholder */}
      </main>
    </div>
  );
}

function HeroCard() {
  const today = new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  return (
    <MonarchCard padding="lg" goldAccentTop className="space-y-8">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest2 text-gold">
        <span>Monarch Markets™ Snapshot</span>
        <span className="text-gold-dim text-[12px]">{today}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {migHighlights.map((item) => (
          <div key={item.ticker} className="flex items-center justify-between p-4 border border-white/10 bg-dark-2">
            <div>
              <div className="text-white text-[16px] font-medium">{item.ticker}</div>
              <MonarchBadge variant="gold">MIG {item.score}</MonarchBadge>
            </div>
            <div className={`text-[18px] ${item.direction === "up" ? "text-green-400" : "text-red-400"}`}>
              {item.direction === "up" ? "↑" : "↓"}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gold/10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-[14px] text-grey-light">2 new vetted startups added this week</div>
        <MonarchButton variant="ghost" size="sm">
          View Boardroom →
        </MonarchButton>
      </div>
    </MonarchCard>
  );
}
