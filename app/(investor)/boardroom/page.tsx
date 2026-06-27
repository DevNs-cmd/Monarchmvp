"use client";

import MonarchBadge from "@/components/ui/MonarchBadge";
import MonarchButton from "@/components/ui/MonarchButton";
import MonarchCard from "@/components/ui/MonarchCard";
import MonarchInput from "@/components/ui/MonarchInput";

const startups = [
  {
    id: "founder-1",
    sector: "Infra",
    stage: "Series A",
    ask: "$6.5M",
    thesis: "Infrastructure rails for private capital orchestration.",
    signal: "Strong",
  },
  {
    id: "founder-2",
    sector: "AI",
    stage: "Seed",
    ask: "$2.1M",
    thesis: "Agentic underwriting for emerging markets credit.",
    signal: "Selective",
  },
  {
    id: "founder-3",
    sector: "Climate",
    stage: "Series B",
    ask: "$12M",
    thesis: "Grid analytics reducing industrial energy variance.",
    signal: "Developing",
  },
];

export default function BoardroomPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-10 space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-widest4 text-grey-dim">Boardroom</div>
          <h1 className="font-serif text-3xl">Vetted startups</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full lg:w-auto">
          <MonarchInput label="Sector" placeholder="Any" />
          <MonarchInput label="Stage" placeholder="Any" />
          <MonarchInput label="Capital Ask" placeholder="0 - 15M" />
        </div>
      </div>

      <div className="space-y-6">
        {startups.map((startup) => (
          <MonarchCard key={startup.id} hover>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <MonarchBadge variant="grey">{startup.sector}</MonarchBadge>
                <MonarchBadge variant="grey">{startup.stage}</MonarchBadge>
              </div>
              <div className="text-gold font-medium">{startup.ask}</div>
            </div>
            <div className="mt-4 font-serif italic font-light text-grey-light text-[17px]">
              {startup.thesis}
            </div>
            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[11px] text-grey-dim uppercase tracking-widest4">Monarch Signal</div>
                <MonarchBadge variant="gold">{startup.signal}</MonarchBadge>
              </div>
              <div className="flex-1" />
              <MonarchButton variant="ghost" fullWidth>
                View Dossier →
              </MonarchButton>
            </div>
            <div className="mt-4 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-500 group-hover:scale-x-100" />
          </MonarchCard>
        ))}
      </div>
    </div>
  );
}
