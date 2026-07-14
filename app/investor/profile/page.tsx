"use client";

import DashboardLayout from "@/components/dashboard/Layout";
import { useEffect, useState } from "react";
import { ShieldCheck, UserCircle } from "lucide-react";

type InvestorProfile = {
    investmentRange: string;
    region: string;
    capitalMin: number;
    capitalMax: number;
    sectors: string[];
    stages: string[];
};

type InvestorUser = {
    name: string | null;
    email: string;
    verified: boolean;
    investorProfile: InvestorProfile | null;
};

export default function InvestorProfilePage() {
    const [user, setUser] = useState<InvestorUser | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/user/me");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, []);

    const investor = user?.investorProfile;

    return (
        <DashboardLayout role="INVESTOR">
            <div className="max-w-5xl mx-auto space-y-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Profile Ledger</h1>
                    <p className="text-secondary text-xs uppercase tracking-[0.4em]">Mandate and Identity</p>
                </div>

                <div className="card-premium p-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                            <UserCircle size={24} className="text-gold" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">{user?.name || "Investor"}</h3>
                            <p className="text-[10px] text-secondary uppercase tracking-widest">{user?.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-secondary">Investment Range</p>
                                <p className="text-sm font-bold">{investor?.investmentRange || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-secondary">Region Focus</p>
                                <p className="text-sm font-bold">{investor?.region || "Global"}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-secondary">Capital Range</p>
                                <p className="text-sm font-bold">
                                    ${Number(investor?.capitalMin || 0).toLocaleString()} - ${Number(investor?.capitalMax || 0).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-secondary">Verification</p>
                                <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-widest">
                                    <ShieldCheck size={14} /> {user?.verified ? "Verified" : "Pending"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-premium p-10">
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Sector Mandate</h4>
                    <div className="flex flex-wrap gap-3">
                        {(investor?.sectors || []).length === 0 && (
                            <span className="text-[10px] uppercase tracking-widest text-secondary">No sectors defined.</span>
                        )}
                        {(investor?.sectors || []).map((sector: string) => (
                            <span key={sector} className="px-4 py-2 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-secondary">
                                {sector}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="card-premium p-10">
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Stage Focus</h4>
                    <div className="flex flex-wrap gap-3">
                        {(investor?.stages || []).length === 0 && (
                            <span className="text-[10px] uppercase tracking-widest text-secondary">No stages defined.</span>
                        )}
                        {(investor?.stages || []).map((stage: string) => (
                            <span key={stage} className="px-4 py-2 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-secondary">
                                {stage}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
