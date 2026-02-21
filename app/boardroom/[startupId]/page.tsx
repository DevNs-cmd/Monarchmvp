"use client";

import DashboardLayout from "@/components/dashboard/Layout";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    BarChart,
    ShieldCheck,
    Info,
    ArrowLeft,
    CheckCircle,
    Download,
    Lock
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DossierPage({ params }: { params: { startupId: string } }) {
    const [activeTab, setActiveTab] = useState("overview");
    const [interestMarked, setInterestMarked] = useState(false);
    const router = useRouter();

    const tabs = [
        { id: "overview", label: "Overview", icon: Info },
        { id: "metrics", label: "Metrics", icon: BarChart },
        { id: "deck", label: "Pitch Deck", icon: FileText },
        { id: "risk", label: "Risk Notes", icon: ShieldCheck },
    ];

    const startupName = params.startupId.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");

    return (
        <DashboardLayout role="INVESTOR">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-secondary hover:text-white transition-colors mb-8 text-xs uppercase tracking-widest"
                >
                    <ArrowLeft size={16} /> Back to Boardroom
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-5xl font-bold mb-4">{startupName}</h1>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-secondary uppercase tracking-widest">FinTech</span>
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-secondary uppercase tracking-widest">Series A</span>
                                    <span className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] text-accent uppercase tracking-widest">Verified by Monarch</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-secondary uppercase tracking-widest mb-1">MIG Index</p>
                                <p className="text-4xl font-bold text-accent">94</p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-white/5 gap-8">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`pb-4 text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all relative ${activeTab === tab.id ? "text-accent" : "text-secondary hover:text-white"
                                            }`}
                                    >
                                        <Icon size={16} />
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Panels */}
                        <div className="min-h-[400px]">
                            <AnimatePresence mode="wait">
                                {activeTab === "overview" && (
                                    <motion.div
                                        key="overview"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold">Executive Summary</h3>
                                            <p className="text-secondary leading-relaxed">
                                                {startupName} is redefining the global finance infrastructure with its proprietary liquidity-routing engine.
                                                Targeting institutional grade efficiency for mid-market cross-border settlements.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="card-premium p-6">
                                                <p className="text-[10px] text-secondary uppercase tracking-widest mb-4">Capital Ask</p>
                                                <p className="text-2xl font-bold text-white">$5,000,000</p>
                                            </div>
                                            <div className="card-premium p-6">
                                                <p className="text-[10px] text-secondary uppercase tracking-widest mb-4">Target Valuation</p>
                                                <p className="text-2xl font-bold text-white">$25,000,000</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "metrics" && (
                                    <motion.div key="metrics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                        <div className="card-premium h-64 flex items-center justify-center border-dashed">
                                            <p className="text-secondary text-xs uppercase tracking-widest italic">Live Traction Data Loading...</p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-6">
                                            {[
                                                { label: "MRR", val: "$240k" },
                                                { label: "CAC", val: "$1,200" },
                                                { label: "LTV/CAC", val: "4.8x" },
                                            ].map(m => (
                                                <div key={m.label} className="text-center">
                                                    <p className="text-[10px] text-secondary uppercase tracking-widest mb-1">{m.label}</p>
                                                    <p className="text-xl font-bold">{m.val}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "deck" && (
                                    <motion.div key="deck" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                        <div className="aspect-video bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-white/10 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                <Lock className="text-accent mb-4" size={32} />
                                                <p className="text-sm font-bold uppercase tracking-widest text-white mb-2">Restricted Access</p>
                                                <p className="text-[10px] text-secondary uppercase px-12 text-center leading-relaxed">
                                                    Pitch deck viewer is watermarked. Mark interest to unlock full deck interaction.
                                                </p>
                                            </div>
                                            <FileText size={48} className="text-white/10" />
                                            <p className="text-xs text-secondary mt-4 uppercase tracking-widest font-bold">Encrypted Dossier.pdf</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <button className="flex-1 btn-outline py-3 text-[10px] tracking-widest uppercase flex items-center justify-center gap-2">
                                                <Download size={14} /> Download Sample
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "risk" && (
                                    <motion.div key="risk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-sm text-secondary leading-relaxed">
                                        <p>Monarch Board has identified the following risk profiles for {startupName}:</p>
                                        <ul className="space-y-4 list-disc list-inside">
                                            <li>Competitive density in the European settlement market is high.</li>
                                            <li>Regulatory overhead for new liquidity providers is increasing in UAE.</li>
                                            <li>Heavy reliance on top-tier engineering talent for core engine maintenance.</li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="card-premium p-8 sticky top-12">
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Actions</h3>

                            <div className="space-y-4">
                                <button
                                    onClick={() => setInterestMarked(!interestMarked)}
                                    className={`w-full py-4 rounded-2xl text-[11px] font-bold tracking-widest uppercase transition-all duration-500 flex items-center justify-center gap-2 ${interestMarked
                                            ? "bg-accent/10 text-accent border border-accent/30"
                                            : "bg-accent text-black hover:bg-accent-light"
                                        }`}
                                >
                                    {interestMarked ? (
                                        <>
                                            <CheckCircle size={16} /> Interest Logged
                                        </>
                                    ) : (
                                        "Mark Interested"
                                    )}
                                </button>

                                <button className="w-full btn-outline py-4 text-[11px] tracking-widest uppercase">
                                    Request Introduction
                                </button>

                                <div className="pt-6 border-t border-white/5 text-center">
                                    <p className="text-[10px] text-secondary uppercase tracking-[0.2em] leading-relaxed">
                                        Marking interest will notify the founder and allow them to review your profile for mutual interest unlock.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card-premium p-8">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-accent">Board Intelligence</h3>
                            <p className="text-xs text-secondary leading-relaxed italic">
                                "We find this venture particularly aligned with current cross-border fintech trends. Traction metrics are verified."
                            </p>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/10" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Board Member #04</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
