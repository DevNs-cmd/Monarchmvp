"use client";

import { useState } from "react";
import MonarchInput from "@/components/ui/MonarchInput";
import MonarchCard from "@/components/ui/MonarchCard";
import MonarchButton from "@/components/ui/MonarchButton";

export default function CustomReportPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-10">
      <div className="max-w-xl mx-auto space-y-8">
        <div>
          <div className="text-[11px] uppercase tracking-widest4 text-grey-dim">Custom Report</div>
          <h1 className="font-serif text-3xl font-light">Request Monarch Intelligence</h1>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <MonarchInput label="Investment Goals" as="textarea" rows={4} required />
            <div>
              <label className="block text-[11px] uppercase tracking-widest4 text-grey-dim mb-2">
                Risk Tolerance (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                defaultValue="6"
                className="w-full accent-gold"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest4 text-grey-dim mb-2">
                Time Horizon
              </label>
              <select className="w-full bg-transparent border border-grey-dim py-3 px-3 text-[14px] text-white">
                <option>Short-term</option>
                <option selected>Medium-term</option>
                <option>Long-term</option>
              </select>
            </div>

            <MonarchCard tone="dark2" className="flex items-center justify-between">
              <div>
                <div className="text-[13px] text-grey-light">One-time payment</div>
                <div className="text-gold text-[20px] font-medium">$499</div>
              </div>
              <div className="text-[12px] text-grey-dim">Processed securely via Stripe.</div>
            </MonarchCard>

            <MonarchButton type="submit" variant="primary" fullWidth>
              Request Report
            </MonarchButton>
          </form>
        ) : (
          <div className="space-y-3 text-center">
            <div className="text-gold text-[28px]">✓</div>
            <div className="font-serif text-2xl">Request received</div>
            <p className="text-grey-light">
              Your report is being prepared. It will appear in Intelligence when ready.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
