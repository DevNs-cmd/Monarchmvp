"use client";

import DashboardLayout from "@/components/dashboard/Layout";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, AlertCircle, ArrowUpRight, MessageCircle } from "lucide-react";

export default function FounderDashboard() {
    const monarchIndex = 82; // Mock score

    return (
        <DashboardLayout role="FOUNDER">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Portfolio Overview</h1>
                        <p className="text-secondary tracking-widest uppercase text-xs">Venture: Monarch Labs Inc.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Status</p>
                        <div className="flex items-center gap-2 text-accent">
                            <Clock size={16} />
                            <span className="text-sm font-bold uppercase tracking-tighter">Under Review</span>
                        </div>
                    </div>
                </div>

                {/* Top Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Gauge Card */}
                    <div className="card-premium md:col-span-1 flex flex-col items-center justify-center text-center p-12">
                        <p className="text-xs uppercase tracking-[0.2em] text-secondary mb-8">Monarch Index</p>
                        <div className="relative w-48 h-48 mb-8">
                            {/* SVG Gauge */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    fill="transparent"
                                    className="text-white/5"
                                />
                                <motion.circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    fill="transparent"
                                    strokeDasharray={553}
                                    initial={{ strokeDashoffset: 553 }}
                                    animate={{ strokeDashoffset: 553 - (553 * monarchIndex) / 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="text-accent"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-bold text-white tracking-tighter">{monarchIndex}</span>
                                <span className="text-[10px] text-secondary uppercase tracking-widest mt-1">Prime Value</span>
                            </div>
                        </div>
                        <p className="text-xs text-secondary leading-relaxed px-4">
                            Your score is in the top 5% of this cohort. Review traction updates for +5 bias.
                        </p>
                    </div>

                    {/* Stats & Actions */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="card-premium p-8">
                                <p className="text-xs uppercase tracking-widest text-secondary mb-4">Investor Interest</p>
                                <div className="flex items-end gap-3">
                                    <span className="text-4xl font-bold">12</span>
                                    <span className="text-accent text-xs font-bold mb-1 flex items-center gap-1">
                                        +3 <ArrowUpRight size={12} />
                                    </span>
                                </div>
                            </div>
                            <div className="card-premium p-8">
                                <p className="text-xs uppercase tracking-widest text-secondary mb-4">Data Room Views</p>
                                <div className="flex items-end gap-3">
                                    <span className="text-4xl font-bold">48</span>
                                    <span className="text-accent text-xs font-bold mb-1 flex items-center gap-1">
                                        +12 <ArrowUpRight size={12} />
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Application Tracker */}
                        <div className="card-premium p-8">
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Board Intake Status</h3>
                            <div className="space-y-6">
                                {[
                                    { name: "Compliance Check", status: "completed", date: "Feb 18" },
                                    { name: "Verification (Stage 1)", status: "completed", date: "Feb 20" },
                                    { name: "Algorithm Scoring (MIG)", status: "active", date: "In Progress" },
                                    { name: "Final Board Approval", status: "pending", date: "TBD" },
                                ].map((step, i) => (
                                    <div key={step.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2 h-2 rounded-full ${step.status === "completed" ? "bg-accent" :
                                                    step.status === "active" ? "bg-accent animate-pulse" : "bg-white/10"
                                                }`} />
                                            <span className={`text-sm ${step.status === "pending" ? "text-secondary" : "text-white"}`}>
                                                {step.name}
                                            </span>
                                        </div>
                                        <span className="text-[10px] uppercase tracking-widest text-secondary">{step.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="card-premium p-8">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Priority Tasks</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all cursor-pointer">
                                <AlertCircle className="text-accent mt-0.5" size={18} />
                                <div>
                                    <p className="text-sm font-semibold">Update Q1 Traction Metrics</p>
                                    <p className="text-xs text-secondary mt-1">Required for investor updates.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all cursor-pointer">
                                <CheckCircle2 className="text-secondary mt-0.5" size={18} />
                                <div>
                                    <p className="text-sm font-semibold text-secondary">Verify LinkedIn Profile</p>
                                    <p className="text-xs text-secondary/60 mt-1">Completed Feb 20.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-premium p-8">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Board Communication</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-black font-bold">A</div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">Admin (Monarch Board)</p>
                                    <p className="text-xs text-secondary truncate">Your deck has been flagged for 'SaaS' sector interest...</p>
                                </div>
                                <span className="text-[10px] text-secondary">2h ago</span>
                            </div>
                            <button className="w-full btn-outline text-xs tracking-widest uppercase py-3">Open Inbox</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
