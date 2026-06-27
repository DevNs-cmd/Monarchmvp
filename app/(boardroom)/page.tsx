"use client";

import DashboardLayout from "@/components/dashboard/Layout";
import { motion } from "framer-motion";
import { Search, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type StartupSummary = {
    id: string;
    name: string;
    industry: string;
    stage: string;
    capitalAsk: number;
    monarchIndex: number;
    valuation: number | null;
};

export default function Boardroom() {
    const [startups, setStartups] = useState<StartupSummary[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/boardroom");
                if (res.ok) {
                    const data = await res.json();
                    setStartups(data.items || []);
                }
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, []);

    const filtered = useMemo(() => {
        if (!query) return startups;
        return startups.filter((s) =>
            `${s.name} ${s.industry} ${s.stage}`.toLowerCase().includes(query.toLowerCase())
        );
    }, [startups, query]);

    return (
        <DashboardLayout role="INVESTOR">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">The Boardroom</h1>
                        <p className="text-secondary text-xs uppercase tracking-[0.4em]">Proprietary Venture Registry</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                            <input
                                type="text"
                                placeholder="Filter Dossiers..."
                                className="input-premium pl-12 py-3 text-xs w-full"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {filtered.length === 0 && (
                        <div className="card-premium p-8 text-[10px] uppercase tracking-widest text-secondary">
                            No dossiers available yet.
                        </div>
                    )}
                    {filtered.map((s) => (
                        <Link key={s.id} href={`/boardroom/${s.id}`}>
                            <motion.div
                                whileHover={{ x: 10, borderColor: "rgba(201, 162, 77, 0.3)" }}
                                className="bg-[#050505] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 transition-all cursor-pointer group"
                            >
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center font-bold text-gold group-hover:bg-gold group-hover:text-black transition-all">
                                    {s.name?.[0] || "S"}
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <h4 className="text-lg font-bold mb-1">{s.name}</h4>
                                    <p className="text-secondary text-[10px] uppercase tracking-widest">{s.industry} - {s.stage}</p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 w-full md:w-auto">
                                    <div className="text-center md:text-left">
                                        <p className="text-[10px] text-secondary uppercase tracking-widest mb-1">Monarch Index</p>
                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                            <Zap size={14} className="text-gold" />
                                            <span className="font-mono font-bold text-xl">{s.monarchIndex}</span>
                                        </div>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <p className="text-[10px] text-secondary uppercase tracking-widest mb-1">Capital Ask</p>
                                        <p className="text-xl font-bold font-mono">${Number(s.capitalAsk).toLocaleString()}</p>
                                    </div>
                                    <div className="text-center md:text-left hidden md:block">
                                        <p className="text-[10px] text-secondary uppercase tracking-widest mb-1">Post-Money</p>
                                        <p className="text-xl font-bold font-mono text-secondary/40">
                                            {s.valuation ? `$${Number(s.valuation).toLocaleString()}` : "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/5 rounded-full text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight size={20} />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col items-center py-12 opacity-30">
                    <ShieldCheck size={32} className="mb-4 text-gold" />
                    <p className="text-[10px] uppercase tracking-[0.5em] text-center">Global Privacy Protocols in Effect</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
