"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const steps = [
    { id: 1, title: "Investor Profile", desc: "Your background and experience." },
    { id: 2, title: "Investment Strategy", desc: "Sectors and capital range." },
    { id: 3, title: "Verification", desc: "Legal compliance." },
];

export default function InvestorOnboarding() {
    const [currentStep, setCurrentStep] = useState(1);
    const router = useRouter();
    const [formData, setFormData] = useState({
        firm: "",
        region: "North America",
        sectors: [] as string[],
        capitalRange: "$50k - $250k",
        nda: false,
    });

    const sectorsList = ["FinTech", "SaaS", "AI/ML", "HealthTech", "Web3", "GreenTech", "PropTech"];

    const toggleSector = (sector: string) => {
        setFormData(prev => ({
            ...prev,
            sectors: prev.sectors.includes(sector)
                ? prev.sectors.filter(s => s !== sector)
                : [...prev.sectors, sector]
        }));
    };

    const nextStep = () => setCurrentStep((s) => Math.min(s + 1, steps.length));
    const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep < steps.length) {
            nextStep();
        } else {
            if (!formData.nda) return alert("You must accept the NDA to proceed.");
            console.log("Submitting Investor Onboarding:", formData);
            router.push("/investor/dashboard");
        }
    };

    return (
        <main className="min-h-screen bg-black text-white p-6 md:p-12 bg-black-lux">
            <div className="max-w-4xl mx-auto">
                {/* Progress Bar */}
                <div className="flex justify-between mb-12">
                    {steps.map((s) => (
                        <div key={s.id} className="flex flex-col items-center flex-1">
                            <div
                                className={`h-1 w-full rounded-full transition-all duration-500 ${currentStep >= s.id ? "bg-accent" : "bg-white/10"
                                    }`}
                            />
                            <span className={`text-[10px] mt-2 uppercase tracking-widest ${currentStep >= s.id ? "text-accent" : "text-secondary"
                                }`}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="card-premium min-h-[500px] flex flex-col">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="flex-1"
                        >
                            <h2 className="text-3xl font-bold mb-1">{steps[currentStep - 1].title}</h2>
                            <p className="text-secondary mb-12">{steps[currentStep - 1].desc}</p>

                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-secondary mb-2">Firm Name / Individual</label>
                                        <input
                                            required
                                            type="text"
                                            className="input-premium"
                                            placeholder="Monarch Capital Group"
                                            value={formData.firm}
                                            onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-secondary mb-2">Primary Region</label>
                                        <select
                                            className="input-premium appearance-none"
                                            value={formData.region}
                                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                        >
                                            <option className="bg-black">North America</option>
                                            <option className="bg-black">Europe</option>
                                            <option className="bg-black">Asia</option>
                                            <option className="bg-black">MENA</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-secondary mb-4">Sector Interests</label>
                                        <div className="flex flex-wrap gap-3">
                                            {sectorsList.map(sector => (
                                                <button
                                                    key={sector}
                                                    type="button"
                                                    onClick={() => toggleSector(sector)}
                                                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 ${formData.sectors.includes(sector)
                                                            ? "bg-accent text-black border-accent"
                                                            : "bg-white/5 text-secondary border-white/10 hover:border-white/30"
                                                        }`}
                                                >
                                                    {sector}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-secondary mb-2">Typical Check Size</label>
                                        <select
                                            className="input-premium appearance-none"
                                            value={formData.capitalRange}
                                            onChange={(e) => setFormData({ ...formData, capitalRange: e.target.value })}
                                        >
                                            <option className="bg-black">$50k - $250k</option>
                                            <option className="bg-black">$250k - $1M</option>
                                            <option className="bg-black">$1M - $5M</option>
                                            <option className="bg-black">$5M+</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-8">
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Master Non-Disclosure Agreement</h3>
                                        <div className="h-48 overflow-y-auto text-xs text-secondary leading-relaxed pr-2 space-y-4">
                                            <p>This Non-Disclosure Agreement (the "Agreement") is entered into to prevent the unauthorized disclosure of Confidential Information as defined below.</p>
                                            <p>1. Definition of Confidential Information. For purposes of this Agreement, "Confidential Information" shall include all information or material that has or could have commercial value or other utility in the business in which Disclosing Party is engaged.</p>
                                            <p>2. Obligations of Receiving Party. Receiving Party shall hold and maintain the Confidential Information in strictest confidence for the sole and exclusive benefit of the Disclosing Party.</p>
                                            <p>3. Term. The non-disclosure provisions of this Agreement shall survive the termination of this Agreement...</p>
                                        </div>
                                        <div className="mt-6 flex items-center gap-3">
                                            <input
                                                id="nda"
                                                type="checkbox"
                                                className="w-5 h-5 accent-accent bg-black border-white/10 rounded"
                                                checked={formData.nda}
                                                onChange={(e) => setFormData({ ...formData, nda: e.target.checked })}
                                            />
                                            <label htmlFor="nda" className="text-xs text-white cursor-pointer select-none">
                                                I agree to the Master NDA and recognize the private nature of all dossiers.
                                            </label>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-accent/5 rounded-2xl border border-accent/20">
                                        <p className="text-xs text-accent leading-relaxed">
                                            Verification normally takes 2-4 hours. Once verified, you will have immediate access to the Boardroom.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex gap-4 mt-12">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="btn-outline flex-1"
                            >
                                Back
                            </button>
                        )}
                        <button
                            type="submit"
                            className="btn-gold flex-[2] text-sm font-bold tracking-widest uppercase"
                        >
                            {currentStep === steps.length ? "Complete Setup" : "Continue"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
