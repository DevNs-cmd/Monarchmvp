"use client";

import { useMemo } from "react";
import MonarchCard from "@/components/ui/MonarchCard";
import MonarchGauge from "@/components/ui/MonarchGauge";
import StatusTimeline from "@/components/ui/StatusTimeline";

const nextActions = [
  {
    title: "Upload Financial Documents",
    description: "Q3 financials required for Boardroom consideration.",
    actionable: true,
  },
  {
    title: "Book Prep Session",
    description: "Schedule your Monarch preparation call.",
    actionable: true,
  },
  {
    title: "Sign Success Fee Agreement",
    description: "Review and sign before proceeding.",
    actionable: false,
  },
];

const messages = [
  {
    sender: "Monarch Team",
    preview: "Your dossier is in review. Expect an update shortly.",
    time: "2h ago",
  },
  {
    sender: "Monarch Team",
    preview: "Boardroom prep checklist has been added to your actions.",
    time: "1d ago",
  },
];

export default function FounderDashboard() {
  const statusTimestamps = useMemo(
    () => ({
      SUBMITTED: "Mar 01, 08:40",
      UNDER_REVIEW: "Mar 02, 12:15",
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-64 bg-off-black border-r border-white/10 p-6 flex flex-col gap-8">
        <div className="font-serif text-2xl text-gold">M</div>
        <nav className="space-y-2 text-[13px] uppercase tracking-widest4">
          {[
            { label: "Home", active: true },
            { label: "Profile" },
            { label: "Messages" },
            { label: "Payments" },
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
          <div className="uppercase tracking-widest4">Founder</div>
          <button className="text-gold text-[11px] uppercase tracking-widest4 hover:text-gold-light transition-colors">
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 space-y-12">
        {/* Application Status */}
        <section className="space-y-4">
          <div className="text-[11px] uppercase tracking-widest2 text-grey-dim">Application Status</div>
          <MonarchCard>
            <StatusTimeline currentStatus="UNDER_REVIEW" timestamps={statusTimestamps} />
            <div className="mt-4 text-[11px] text-grey-dim">Last updated 2 hours ago</div>
          </MonarchCard>
        </section>

        {/* Monarch Index */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <MonarchCard goldAccentTop className="flex items-center justify-center">
            <MonarchGauge score={72} label="Monarch Index" />
          </MonarchCard>
          <MonarchCard tone="dark2" className="space-y-4">
            <div className="text-[15px] text-grey-light font-light">Your private readiness score.</div>
            <div className="space-y-4">
              {[
                { label: "Traction & Growth", value: 85 },
                { label: "Market Clarity", value: 72 },
                { label: "Execution Readiness", value: 65 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-[12px] text-grey mb-1">{item.label}</div>
                  <div className="h-2 bg-white/5">
                    <div className="h-full bg-gold" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-grey-dim italic">Score is private and non-comparable.</div>
          </MonarchCard>
        </section>

        {/* Next Actions */}
        <section className="space-y-4">
          <div className="text-[11px] uppercase tracking-widest2 text-grey-dim">Next Actions</div>
          <div className="space-y-4">
            {nextActions.map((action) => (
              <MonarchCard key={action.title} hover>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-[15px] text-white">{action.title}</div>
                    <div className="text-[14px] text-grey">{action.description}</div>
                  </div>
                  {action.actionable ? (
                    <span className="text-gold text-[18px]">→</span>
                  ) : (
                    <span className="text-gold">✔</span>
                  )}
                </div>
              </MonarchCard>
            ))}
          </div>
        </section>

        {/* Messages */}
        <section className="space-y-4">
          <div className="text-[11px] uppercase tracking-widest2 text-grey-dim">Messages</div>
          <MonarchCard>
            <div className="divide-y divide-white/10">
              {messages.map((msg, idx) => (
                <div key={idx} className="flex items-start gap-4 py-4">
                  <div className="h-9 w-9 rounded-full bg-dark-3 border border-gold/20 flex items-center justify-center text-gold font-serif">
                    M
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px] text-white font-medium">{msg.sender}</div>
                    <div className="text-[13px] text-grey">{msg.preview}</div>
                  </div>
                  <div className="text-[11px] text-grey-dim">{msg.time}</div>
                </div>
              ))}
            </div>
            <div className="pt-4 text-gold text-[13px]">View all messages →</div>
          </MonarchCard>
        </section>
      </main>
    </div>
  );
}
