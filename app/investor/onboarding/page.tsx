"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Shield, Sparkles, Target, CheckCircle } from "lucide-react";

type InvestorOnboardingData = {
    name: string;
    email: string;
    entity: string;
    investmentRange: string;
    sectors: string[];
    stages: string[];
    region: string;
    capitalMin: string;
    capitalMax: string;
    ndaAccepted: boolean;
};

export default function InvestorOnboarding() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<InvestorOnboardingData>({
        name: "",
        email: "",
        entity: "",
        investmentRange: "",
        sectors: [],
        stages: [],
        region: "",
        capitalMin: "",
        capitalMax: "",
        ndaAccepted: false
    });

    const updateFormData = <Key extends keyof InvestorOnboardingData>(
        field: Key,
        value: InvestorOnboardingData[Key],
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleSector = (sector: string) => {
        setFormData(prev => {
            if (prev.sectors.includes(sector)) {
                return { ...prev, sectors: prev.sectors.filter(s => s !== sector) };
            }
            return { ...prev, sectors: [...prev.sectors, sector] };
        });
    };

    const toggleStage = (stage: string) => {
        setFormData(prev => {
            if (prev.stages.includes(stage)) {
                return { ...prev, stages: prev.stages.filter(s => s !== stage) };
            }
            return { ...prev, stages: [...prev.stages, stage] };
        });
    };

    const handleFinish = async () => {
        if (!formData.ndaAccepted) {
            alert("Please accept the NDA to proceed.");
            return;
        }

        const inviteCode = localStorage.getItem("monarch_invite_code");
        if (!inviteCode) {
            alert("Session expired. Please start over.");
            router.push("/login");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/investor/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, inviteCode }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Onboarding failed");
                setLoading(false);
                return;
            }

            // Clear invite info
            localStorage.removeItem("monarch_invite_code");
            localStorage.removeItem("monarch_invite_role");

            router.push("/investor/dashboard");
        } catch {
            alert("Connection error. Try again.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 bg-black-lux relative overflow-hidden">
            <div className="w-full max-w-xl z-10">
                <div className="card-premium">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-12">
                                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Sparkles className="text-gold" size={28} />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-2">Portfolio Mandate</h2>
                                    <p className="text-secondary text-sm">Define your investment thesis to align with the desk.</p>
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Principal Investor Name"
                                        className="input-premium"
                                        value={formData.name}
                                        onChange={(e) => updateFormData("name", e.target.value)}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Professional Email"
                                        className="input-premium"
                                        value={formData.email}
                                        onChange={(e) => updateFormData("email", e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Entity (Venture Fund / Family Office / Personal)"
                                        className="input-premium"
                                        value={formData.entity}
                                        onChange={(e) => updateFormData("entity", e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Typical Check Size ($500k - $5M)"
                                        className="input-premium"
                                        value={formData.investmentRange}
                                        onChange={(e) => updateFormData("investmentRange", e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Region Focus (e.g., North America)"
                                        className="input-premium"
                                        value={formData.region}
                                        onChange={(e) => updateFormData("region", e.target.value)}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="number"
                                            placeholder="Min Check (USD)"
                                            className="input-premium"
                                            value={formData.capitalMin}
                                            onChange={(e) => updateFormData("capitalMin", e.target.value)}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max Check (USD)"
                                            className="input-premium"
                                            value={formData.capitalMax}
                                            onChange={(e) => updateFormData("capitalMax", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button onClick={() => setStep(2)} className="btn-gold w-full py-5 text-sm uppercase tracking-widest">
                                    Next Protocol
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-12">
                                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Target className="text-gold" size={28} />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-2">Alpha Targets</h2>
                                    <p className="text-secondary text-sm">Select sectors for the boardroom matching engine.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {["AI / ML", "FinTech", "SaaS", "BioTech", "Energy", "Web3"].map(sector => (
                                        <div
                                            key={sector}
                                            onClick={() => toggleSector(sector)}
                                            className={`p-4 border rounded-2xl transition-colors cursor-pointer flex items-center gap-3 group ${formData.sectors.includes(sector) ? "border-gold bg-gold/5" : "border-white/10 hover:border-gold/30"
                                                }`}
                                        >
                                            <div className={`w-4 h-4 border rounded transition-colors ${formData.sectors.includes(sector) ? "bg-gold border-gold" : "border-white/20 group-hover:bg-gold/20"
                                                }`} />
                                            <span className="text-sm font-semibold">{sector}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <p className="text-[10px] text-secondary uppercase tracking-widest mb-4">Preferred Stages</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {["Pre-Seed", "Seed", "Series A", "Series B"].map(stage => (
                                            <div
                                                key={stage}
                                                onClick={() => toggleStage(stage)}
                                                className={`p-4 border rounded-2xl transition-colors cursor-pointer flex items-center gap-3 group ${formData.stages.includes(stage) ? "border-gold bg-gold/5" : "border-white/10 hover:border-gold/30"
                                                    }`}
                                            >
                                                <div className={`w-4 h-4 border rounded transition-colors ${formData.stages.includes(stage) ? "bg-gold border-gold" : "border-white/20 group-hover:bg-gold/20"
                                                    }`} />
                                                <span className="text-sm font-semibold">{stage}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} className="btn-outline flex-1 py-5">Back</button>
                                    <button onClick={() => setStep(3)} className="btn-gold flex-[2] py-5 uppercase tracking-widest">Secure Access</button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-12">
                                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Shield className="text-gold" size={28} />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-2">Digital NDA</h2>
                                    <p className="text-secondary text-sm leading-relaxed">
                                        Access to the Monarch boardroom is legally protected. All data shared by founders is strictly confidential.
                                    </p>
                                </div>

                                <div className="p-6 bg-black border border-white/5 rounded-2xl max-h-48 overflow-y-auto text-[10px] text-secondary leading-loose font-mono uppercase tracking-widest">
                                    This Non-Disclosure Agreement (the &quot;Agreement&quot;) is made effective...
                                    1. Confidential Information includes all pitch decks, metrics...
                                    2. Misuse of data leads to immediate board suspension...
                                    3. Unauthorized disclosure triggers legal remediation.
                                </div>

                                <div className="flex items-center gap-4 py-4">
                                    <input
                                        type="checkbox"
                                        className="w-6 h-6 rounded border-white/10 bg-black text-gold focus:ring-gold"
                                        checked={formData.ndaAccepted}
                                        onChange={(e) => updateFormData("ndaAccepted", e.target.checked)}
                                    />
                                    <span className="text-xs text-secondary mb-0.5">I acknowledge and accept the Monarch Master NDA terms.</span>
                                </div>

                                {loading ? (
                                    <button disabled className="btn-gold w-full py-5 flex items-center justify-center gap-3 opacity-50">
                                        Initializing Ledger...
                                    </button>
                                ) : (
                                    <button onClick={handleFinish} className="btn-gold w-full py-5 flex items-center justify-center gap-3">
                                        Confirm & Unlock <CheckCircle size={20} />
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
