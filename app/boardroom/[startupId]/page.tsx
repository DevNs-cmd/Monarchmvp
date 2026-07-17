"use client";

import DashboardLayout from "@/components/dashboard/Layout";
import {
    TrendingUp,
    ShieldCheck,
    ChevronLeft,
    Mail,
    ExternalLink,
    Lock
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type StartupDetail = {
    id: string;
    name: string;
    industry: string;
    stage: string;
    capitalAsk: number;
    monarchIndex: number;
    valuation: number | null;
    deckKey?: string | null;
    summary?: string | null;
    metrics?: Record<string, string> | null;
    financials?: Record<string, string> | null;
    capTable?: Record<string, string> | null;
    riskDisclosures?: Record<string, string> | null;
};

type InterestState = {
    investorInterest: boolean;
    founderInterest: boolean;
    status?: "PENDING" | "MUTUAL" | string;
} | null;

export default function StartupDossier() {
    const params = useParams<{ startupId: string }>();
    const [loading, setLoading] = useState(true);
    const [startup, setStartup] = useState<StartupDetail | null>(null);
    const [interest, setInterest] = useState<InterestState>(null);
    const [deckUrl, setDeckUrl] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"overview" | "metrics" | "deck" | "risk">("overview");
    const [introStatus, setIntroStatus] = useState<string | null>(null);
    const [deckLoading, setDeckLoading] = useState(false);
    const [watermark, setWatermark] = useState("Monarch Confidential");

    useEffect(() => {
        const load = async () => {
            try {
                const me = await fetch("/api/user/me");
                if (me.ok) {
                    const data = await me.json();
                    const email = data?.user?.email || "monarch";
                    setWatermark(`${email} - ${new Date().toLocaleDateString()}`);
                }
                const res = await fetch(`/api/boardroom/${params.startupId}`);
                if (res.ok) {
                    const data = await res.json();
                    setStartup(data.startup);
                    setInterest(data.interest);
                    setIntroStatus(data.introduction?.status || null);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [params.startupId]);

    const handleInterest = async () => {
        try {
            const res = await fetch("/api/interest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ startupId: params.startupId }),
            });
            if (res.ok) {
                const data = await res.json();
                setInterest({ investorInterest: true, founderInterest: false, status: data.dealRoomId ? "MUTUAL" : "PENDING" });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRequestIntro = async () => {
        try {
            const res = await fetch(`/api/boardroom/${params.startupId}/request-intro`, {
                method: "POST",
            });
            const data = await res.json();
            if (res.ok) {
                setIntroStatus(data.status || "PENDING");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeck = useCallback(async () => {
        if (deckLoading) return;
        try {
            setDeckLoading(true);
            const res = await fetch(`/api/boardroom/${params.startupId}/deck`);
            const data = await res.json();
            if (res.ok && data.url) {
                setDeckUrl(data.url);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setDeckLoading(false);
        }
    }, [deckLoading, params.startupId]);

    const canAccessDeck = interest?.status === "MUTUAL" && Boolean(startup?.deckKey);
    const capitalAsk = Number(startup?.capitalAsk ?? 0);
    const stageLabel = startup?.stage ?? "Unknown stage";
    const industryLabel = startup?.industry ?? "Unknown sector";
    const disclosedRisks = Object.entries(startup?.riskDisclosures || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, " $1")}: ${value}`);
    const riskNotes = disclosedRisks.length ? disclosedRisks : [
        `Stage exposure: ${stageLabel} liquidity assumptions remain sensitive to macro cycles.`,
        `Capital ask of $${capitalAsk.toLocaleString()} implies extended runway expectations for institutional checkpoints.`,
        `Sector concentration risk flagged for ${industryLabel}; diversification path recommended.`,
    ];

    useEffect(() => {
        if (activeTab !== "deck" || !canAccessDeck || deckUrl || deckLoading) return;
        void handleDeck();
    }, [activeTab, canAccessDeck, deckUrl, deckLoading, handleDeck]);

    if (loading) {
        return (
            <DashboardLayout role="INVESTOR">
                <div className="flex items-center justify-center h-[60vh] text-secondary uppercase tracking-[0.3em]">
                    Loading dossier...
                </div>
            </DashboardLayout>
        );
    }

    if (!startup) {
        return (
            <DashboardLayout role="INVESTOR">
                <div className="flex items-center justify-center h-[60vh] text-secondary uppercase tracking-[0.3em]">
                    Dossier unavailable.
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="INVESTOR">
            <div className="max-w-6xl mx-auto space-y-12">
                <Link href="/boardroom" className="flex items-center gap-2 text-secondary hover:text-white transition-colors uppercase text-[10px] font-bold tracking-[0.2em]">
                    <ChevronLeft size={16} /> Back to Boardroom
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="flex gap-8 items-center">
                        <div className="w-24 h-24 bg-gold rounded-[32px] flex items-center justify-center text-4xl font-bold text-black border-4 border-white/5">
                            {startup.name?.[0] || "S"}
                        </div>
                        <div>
                            <h1 className="text-5xl font-bold mb-3 tracking-tight">{startup.name}</h1>
                            <p className="text-secondary text-sm uppercase tracking-[0.4em] font-medium flex items-center gap-2">
                                <TrendingUp size={14} className="text-gold" /> {startup.stage} - {startup.industry}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        {!interest?.investorInterest ? (
                            <button
                                onClick={handleInterest}
                                className="btn-gold flex-1 md:flex-none flex items-center justify-center gap-3 px-12"
                            >
                                Indicate Interest <Mail size={18} />
                            </button>
                        ) : (
                            <div className="flex-1 md:flex-none flex items-center gap-3 px-8 py-4 bg-gold/10 text-gold rounded-2xl border border-gold/20 text-xs font-bold uppercase tracking-widest">
                                Interest Logged <ShieldCheck size={18} />
                            </div>
                        )}
                        <button
                            onClick={handleRequestIntro}
                            disabled={!!introStatus}
                            className="btn-outline px-6 flex items-center gap-2 text-xs uppercase tracking-widest disabled:opacity-60"
                        >
                            {introStatus ? "Intro Requested" : "Request Intro"} <ExternalLink size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {[
                        { id: "overview", label: "Overview" },
                        { id: "metrics", label: "Metrics" },
                        { id: "deck", label: "Deck" },
                        { id: "risk", label: "Risk Notes" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === tab.id
                                    ? "bg-gold text-black"
                                    : "bg-white/5 text-secondary hover:text-white"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="card-premium p-10">
                                <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-gold mb-8">Executive Summary</h4>
                                <p className="text-secondary leading-relaxed mb-6">
                                    {startup.summary || `${startup.name} is building mission-critical infrastructure with a focus on institutional-grade execution and capital efficiency.`}
                                </p>
                                <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
                                    <div>
                                        <p className="text-[10px] text-secondary uppercase tracking-widest mb-1">Monarch Index</p>
                                        <p className="text-sm font-bold">{startup.monarchIndex}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-secondary uppercase tracking-widest mb-1">Sector</p>
                                        <p className="text-sm font-bold">{startup.industry}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="card-premium p-10">
                                <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-gold mb-8">Deal Details</h4>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] text-secondary uppercase tracking-widest mb-1">Total Raise</p>
                                        <p className="text-2xl font-bold font-mono">${Number(startup.capitalAsk).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-secondary uppercase tracking-widest mb-1">Valuation (Pre-Money)</p>
                                        <p className="text-xl font-bold font-mono text-secondary/60">
                                            {startup.valuation ? `$${Number(startup.valuation).toLocaleString()}` : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "metrics" && (
                    <div className="card-premium p-10">
                        <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-gold mb-8">Metrics Pulse</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {Object.entries({ ...(startup.metrics || {}), ...(startup.financials || {}) }).map(([label, value]) => (
                                <div key={label} className="border-b border-white/5 pb-5 text-center">
                                    <p className="text-xl font-bold font-mono">{value}</p>
                                    <p className="text-[10px] text-secondary uppercase tracking-widest mt-1">{label.replace(/([A-Z])/g, " $1")}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "deck" && (
                    <div className="card-premium p-10 border-gold/20">
                        <div className="flex items-center gap-3 mb-6">
                            <Lock size={16} className="text-gold" />
                            <h4 className="text-[10px] font-bold uppercase tracking-widest">Secure Data Room</h4>
                        </div>
                        {interest?.status !== "MUTUAL" && (
                            <div className="text-[10px] uppercase tracking-[0.2em] text-secondary">
                                Pitch deck access is available after mutual interest approval.
                            </div>
                        )}
                        {interest?.status === "MUTUAL" && !startup.deckKey && (
                            <div className="text-[10px] uppercase tracking-[0.2em] text-secondary">
                                The founder is preparing the latest verified deck for this data room.
                            </div>
                        )}
                        {canAccessDeck && (
                            <div className="space-y-6">
                                {deckLoading && (
                                    <div className="text-[10px] uppercase tracking-widest text-secondary">
                                        Issuing secure link...
                                    </div>
                                )}
                                {deckUrl && (
                                    <div className="relative border border-white/5 rounded-2xl overflow-hidden">
                                        <iframe
                                            src={deckUrl}
                                            className="w-full h-[480px]"
                                            title="Pitch Deck"
                                        />
                                        <div className="absolute inset-0 pointer-events-none flex flex-wrap items-center justify-center text-gold/10 text-[10px] font-bold tracking-[0.4em]">
                                            {Array.from({ length: 12 }).map((_, i) => (
                                                <span key={i} className="m-6 rotate-[-20deg]">{watermark}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {!deckUrl && !deckLoading && (
                                    <button
                                        onClick={handleDeck}
                                        className="w-full py-4 border rounded-xl text-xs font-bold uppercase tracking-widest transition-all border-gold/40 hover:border-gold"
                                    >
                                        Access Documents
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "risk" && (
                    <div className="card-premium p-10">
                        <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-gold mb-8">Risk Notes</h4>
                        <ul className="space-y-4 text-[10px] uppercase tracking-widest text-secondary">
                            {riskNotes.map((note) => (
                                <li key={note} className="flex items-start gap-3">
                                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gold/60" />
                                    <span className="leading-relaxed">{note}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
