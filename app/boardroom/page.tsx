"use client";

import DashboardLayout from "@/components/dashboard/Layout";
import { Search, Filter, Cpu, BarChart3, Dna, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const startups = [
    { id: "nebula-ai", name: "Nebula AI", industry: "AI Infrastructure", stage: "Series A", score: 94, ask: "$5.0M", growth: "+22%" },
    { id: "quantvault", name: "QuantVault", industry: "FinTech", stage: "Seed", score: 88, ask: "$1.2M", growth: "+15%" },
    { id: "biostream", name: "BioStream", industry: "HealthTech", stage: "Series B", score: 91, ask: "$12.0M", growth: "+40%" },
    { id: "ecosync", name: "EcoSync", industry: "GreenTech", stage: "Pre-seed", score: 76, ask: "$500k", growth: "+8%" },
    { id: "veritas", name: "Veritas", industry: "Web3", stage: "Seed", score: 82, ask: "$2.0M", growth: "+25%" },
    { id: "omnicart", name: "OmniCart", industry: "E-commerce", stage: "Series A", score: 79, ask: "$3.5M", growth: "+12%" },
];

export default function BoardroomPage() {
    return (
        <DashboardLayout role="INVESTOR">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">The Boardroom</h1>
                        <p className="text-secondary text-xs uppercase tracking-[0.2em]">Verified Private Opportunities</p>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                            <input
                                type="text"
                                placeholder="Search ventures..."
                                className="input-premium pl-12 text-sm"
                            />
                        </div>
                        <button className="btn-outline flex items-center gap-2 py-2 px-4 text-sm">
                            <Filter size={18} /> Filters
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {startups.map((startup, i) => (
                        <motion.div
                            key={startup.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="card-premium group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-accent">
                                    {i % 3 === 0 ? <Cpu size={20} /> : i % 3 === 1 ? <BarChart3 size={20} /> : <Dna size={20} />}
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-secondary uppercase tracking-widest">MIG Index</p>
                                    <p className="text-lg font-bold text-accent">{startup.score}</p>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold mb-1">{startup.name}</h3>
                            <p className="text-xs text-secondary mb-6">{startup.industry} • {startup.stage}</p>

                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-[11px] uppercase tracking-widest">
                                    <span className="text-secondary">Capital Required</span>
                                    <span className="text-white font-bold">{startup.ask}</span>
                                </div>
                                <div className="flex justify-between text-[11px] uppercase tracking-widest">
                                    <span className="text-secondary">MoM Growth</span>
                                    <span className="text-accent font-bold">{startup.growth}</span>
                                </div>
                            </div>

                            <Link href={`/boardroom/${startup.id}`}>
                                <button className="w-full btn-outline py-3 text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 group-hover:bg-accent group-hover:text-black transition-all">
                                    Open Dossier <ArrowUpRight size={14} />
                                </button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
