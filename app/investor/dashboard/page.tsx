"use client";

import DashboardLayout from "@/components/dashboard/Layout";
import { motion } from "framer-motion";
import {
    TrendingUp,
    ShieldAlert,
    Target,
    ArrowRight,
    BarChart3,
    Dna,
    Cpu
} from "lucide-react";
import Link from "next/link";

export default function InvestorDashboard() {
    const recommendations = [
        { name: "Nebula AI", industry: "AI Infrastructure", stage: "Series A", score: 94, ask: "$5.0M" },
        { name: "QuantVault", industry: "FinTech", stage: "Seed", score: 88, ask: "$1.2M" },
        { name: "BioStream", industry: "HealthTech", stage: "Series B", score: 91, ask: "$12.0M" },
    ];

    return (
        <DashboardLayout role="INVESTOR">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Market Hero */}
                <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/20 to-black border border-accent/20 p-12">
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <p className="text-secondary text-[10px] uppercase tracking-[0.3em] mb-4">Market Intelligence</p>
                            <h1 className="text-5xl font-bold mb-6 tracking-tight">Monarch Markets</h1>
                            <p className="text-secondary text-lg leading-relaxed mb-8 max-w-md">
                                Algorithmic tracking of private equity flow and public market signals.
                                <span className="text-accent"> +12.4%</span> bias on AI-centric portfolios.
                            </p>
                            <div className="flex gap-4">
                                <button className="btn-gold px-8 py-3 text-sm">Review Intelligence</button>
                                <button className="btn-outline px-8 py-3 text-sm">Portfolio Beta</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-secondary uppercase tracking-widest mb-1">MIG Alpha</p>
                                <div className="text-2xl font-bold text-accent">+8.2%</div>
                            </div>
                            <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-secondary uppercase tracking-widest mb-1">Risk Index</p>
                                <div className="text-2xl font-bold text-white">4.2<span className="text-xs text-secondary font-normal">/10</span></div>
                            </div>
                            <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 col-span-2">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-[10px] text-secondary uppercase tracking-widest">Sector Momentum</p>
                                    <TrendingUp size={14} className="text-accent" />
                                </div>
                                <div className="flex gap-2">
                                    {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ delay: i * 0.1, duration: 0.8 }}
                                            className="flex-1 bg-accent/20 rounded-t-sm"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recommended Startups */}
                <section>
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Boardroom Shortlist</h2>
                            <p className="text-xs text-secondary uppercase tracking-widest">Recommended for your strategy</p>
                        </div>
                        <Link href="/boardroom" className="text-accent text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:gap-3 transition-all">
                            Enter Boardroom <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recommendations.map((startup, i) => (
                            <motion.div
                                key={startup.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="card-premium group cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all">
                                        {i === 0 ? <Cpu size={24} /> : i === 1 ? <BarChart3 size={24} /> : <Dna size={24} />}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-secondary uppercase tracking-widest">MIG Score</p>
                                        <p className="text-xl font-bold text-accent">{startup.score}</p>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-1">{startup.name}</h3>
                                <p className="text-xs text-secondary mb-6">{startup.industry} • {startup.stage}</p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-secondary uppercase tracking-widest">Target Ask</span>
                                        <span className="font-bold text-white">{startup.ask}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-secondary uppercase tracking-widest">Matching Bias</span>
                                        <span className="font-bold text-accent">High Flow</span>
                                    </div>
                                </div>

                                <Link href={`/boardroom/${startup.name.toLowerCase().replace(" ", "-")}`}>
                                    <button className="w-full btn-outline py-3 text-xs tracking-widest uppercase">View Dossier</button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Intelligence Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card-premium p-8 md:col-span-1">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                            <ShieldAlert size={18} className="text-accent" /> Risk Radar
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-xs font-semibold mb-1">Macro Volatility</p>
                                <div className="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-yellow-500 h-full w-[45%]" />
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-xs font-semibold mb-1">Regulatory Shift</p>
                                <div className="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-red-500 h-full w-[12%]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-premium p-8 md:col-span-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Target size={18} className="text-accent" /> Portfolio Intelligence
                        </h3>
                        <div className="h-48 flex items-center justify-center border border-white/5 rounded-2xl bg-white/[0.02]">
                            <p className="text-secondary text-xs italic">Asset allocation visualizer loading...</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
