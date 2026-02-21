"use client";

import DashboardLayout from "@/components/dashboard/Layout";
import {
    TrendingUp,
    TrendingDown,
    LineChart,
    ShieldCheck,
    Eye,
    Search,
    ArrowUpRight,
    Target
} from "lucide-react";
import { motion } from "framer-motion";

const marketStocks = [
    { ticker: "M-AIA", name: "Monarch AI Aggregate", migScore: 92, risk: 3, trend: "up", suggestion: "Strong Buy", allocation: "15%" },
    { ticker: "P-SEC", name: "Private Security Composite", migScore: 84, risk: 5, trend: "down", suggestion: "Neutral", allocation: "8%" },
    { ticker: "G-TEN", name: "Green Tech Venture Index", migScore: 78, risk: 2, trend: "up", suggestion: "Buy", allocation: "12%" },
    { ticker: "L-BIO", name: "LifeSciences Alpha", migScore: 95, risk: 7, trend: "up", suggestion: "Aggressive Buy", allocation: "5%" },
];

export default function MarketsPage() {
    return (
        <DashboardLayout role="INVESTOR">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Market Intelligence</h1>
                        <p className="text-secondary text-xs uppercase tracking-[0.2em]">Public Signals for Private Strategy</p>
                    </div>

                    <div className="relative w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                        <input type="text" placeholder="Search indexes..." className="input-premium pl-12 text-xs" />
                    </div>
                </div>

                {/* Global Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { label: "MIG Composite", val: "88.4", delta: "+1.2%", color: "text-accent" },
                        { label: "Liquidity Index", val: "72.1", delta: "-0.5%", color: "text-red-400" },
                        { label: "Venture Velocity", val: "High", delta: "Steady", color: "text-white" },
                        { label: "Risk Baseline", val: "4.2", delta: "Low", color: "text-accent" },
                    ].map(stat => (
                        <div key={stat.label} className="card-premium p-6">
                            <p className="text-[10px] text-secondary uppercase tracking-widest mb-1">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold">{stat.val}</span>
                                <span className={`text-[10px] font-bold ${stat.color}`}>{stat.delta}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Intelligence Table */}
                <div className="card-premium p-0 overflow-hidden">
                    <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                        <h3 className="text-sm font-bold uppercase tracking-widest">Index Analysis</h3>
                        <div className="flex gap-4">
                            <button className="text-xs text-accent uppercase tracking-widest font-bold">Export PDF</button>
                        </div>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-[10px] text-secondary uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-4">Index / Ticker</th>
                                <th className="px-8 py-4">MIG Score</th>
                                <th className="px-8 py-4">Risk Profile</th>
                                <th className="px-8 py-4">Recommendation</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {marketStocks.map((stock, i) => (
                                <tr key={stock.ticker} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold">{stock.name}</p>
                                        <p className="text-[10px] text-accent font-mono">{stock.ticker}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${stock.migScore}%` }}
                                                    className="h-full bg-accent"
                                                />
                                            </div>
                                            <span className="text-sm font-bold">{stock.migScore}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            {Array.from({ length: 10 }).map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`h-3 w-1.5 rounded-sm ${idx < stock.risk ? (stock.risk > 6 ? "bg-red-500" : "bg-accent") : "bg-white/10"}`}
                                                />
                                            ))}
                                            <span className="text-[10px] text-secondary ml-2">{stock.risk}/10</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            {stock.trend === "up" ? <TrendingUp size={14} className="text-accent" /> : <TrendingDown size={14} className="text-red-400" />}
                                            <span className="text-xs font-semibold">{stock.suggestion}</span>
                                        </div>
                                        <p className="text-[10px] text-secondary">Sug. Allocation: {stock.allocation}</p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button className="p-2 hover:bg-white/5 rounded-lg text-secondary hover:text-white transition-colors">
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-white/5 rounded-lg text-accent">
                                                <Target size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Market Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="card-premium p-8">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                            <LineChart size={18} className="text-accent" /> Algorithmic Rationale
                        </h3>
                        <div className="space-y-4 text-xs text-secondary leading-relaxed">
                            <p>• Cross-border fintech signals are showing strong resilience despite public market volatility.</p>
                            <p>• Institutional demand for private equity exposure in AI infrastructure is at a 3-year high.</p>
                            <p>• Monarch Index bias shifted +4% towards Series A liquidity this quarter.</p>
                        </div>
                    </div>

                    <div className="card-premium p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8">
                            <ShieldCheck size={48} className="text-white/5" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Strategic Focus</h3>
                        <p className="text-lg font-bold text-white mb-4">Capital Preservation</p>
                        <p className="text-xs text-secondary leading-relaxed">
                            Current market conditions suggest a conservative approach to late-stage series. Alpha is concentrated in Seed and Series A liquidity.
                        </p>
                        <button className="mt-8 btn-outline w-full py-3 text-[10px] font-bold tracking-widest uppercase">Request Full Audit</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
