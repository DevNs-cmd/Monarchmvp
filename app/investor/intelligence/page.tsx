"use client";

import DashboardLayout from "@/components/dashboard/Layout";
import { useEffect, useState } from "react";
import { Target, Zap } from "lucide-react";

type MarketItem = {
    ticker: string;
    recommendation: string;
    migScore: number;
    riskIndex: number;
};

type MatchItem = {
    id: string;
    name: string;
    industry: string;
    stage: string;
    monarchIndex: number | null;
    capitalAsk: number;
};

export default function IntelligenceBrief() {
    const [markets, setMarkets] = useState<MarketItem[]>([]);
    const [matches, setMatches] = useState<MatchItem[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const m = await fetch("/api/markets");
                if (m.ok) {
                    const data = await m.json();
                    setMarkets(data.items || []);
                }
                const b = await fetch("/api/boardroom");
                if (b.ok) {
                    const data = await b.json();
                    setMatches(data.items || []);
                }
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, []);

    return (
        <DashboardLayout role="INVESTOR">
            <div className="max-w-6xl mx-auto space-y-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Intelligence Desk</h1>
                    <p className="text-secondary text-xs uppercase tracking-[0.4em]">Market Signals and Venture Alignment</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="card-premium p-10">
                        <div className="flex items-center gap-3 mb-8">
                            <Zap size={18} className="text-gold" />
                            <h3 className="text-sm font-bold uppercase tracking-widest">MIG Signal Strip</h3>
                        </div>
                        <div className="space-y-4">
                            {markets.length === 0 && (
                                <div className="text-[10px] uppercase tracking-widest text-secondary">No market intelligence available.</div>
                            )}
                            {markets.map((m) => (
                                <div key={m.ticker} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                                    <div>
                                        <p className="text-sm font-bold">{m.ticker}</p>
                                        <p className="text-[10px] text-secondary uppercase tracking-widest">{m.recommendation}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-mono text-gold">{m.migScore}</p>
                                        <p className="text-[10px] text-secondary uppercase tracking-widest">Risk {m.riskIndex}/10</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card-premium p-10">
                        <div className="flex items-center gap-3 mb-8">
                            <Target size={18} className="text-gold" />
                            <h3 className="text-sm font-bold uppercase tracking-widest">Venture Match Radar</h3>
                        </div>
                        <div className="space-y-4">
                            {matches.length === 0 && (
                                <div className="text-[10px] uppercase tracking-widest text-secondary">No matches available yet.</div>
                            )}
                            {matches.map((m) => (
                                <div key={m.id} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                                    <div>
                                        <p className="text-sm font-bold">{m.name}</p>
                                        <p className="text-[10px] text-secondary uppercase tracking-widest">{m.industry} • {m.stage}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-mono text-gold">{m.monarchIndex}</p>
                                        <p className="text-[10px] text-secondary uppercase tracking-widest">${Number(m.capitalAsk).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
