"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const steps = [
    { id: 1, title: "Company Snapshot", desc: "The essence of your venture." },
    { id: 2, title: "Capital & Valuation", desc: "Funding requirements." },
    { id: 3, title: "Traction & Metrics", desc: "Growth and performance." },
    { id: 4, title: "Documentation", desc: "Submit your pitch deck." },
];

export default function FounderOnboarding() {
    const [currentStep, setCurrentStep] = useState(1);
    const router = useRouter();
    const [formData, setFormData] = useState({
        companyName: "",
        stage: "Pre-seed",
        industry: "",
        capitalAsk: "",
        valuation: "",
        traction: "",
        deckUrl: "",
    });

    const nextStep = () => setCurrentStep((s) => Math.min(s + 1, steps.length));
    const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep < steps.length) {
            nextStep();
        } else {
            console.log("Submitting Founder Onboarding:", formData);
            router.push("/founder/dashboard");
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
                                        <label className="block text-xs uppercase tracking-widest text-secondary mb-2">Company Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="input-premium"
                                            placeholder="Monarch Labs Inc."
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-secondary mb-2">Industry</label>
                                        <input
                                            required
                                            type="text"
                                            className="input-premium"
                                            placeholder="FinTech / AI / SaaS"
                                            value={formData.industry}
                                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-secondary mb-2">Current Stage</label>
                                        <select
                                            className="input-premium appearance-none"
                                            value={formData.stage}
                                            onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                                        >
                                            <option className="bg-black" value="Pre-seed">Pre-seed</option>
                                            <option className="bg-black" value="Seed">Seed</option>
                                            <option className="bg-black" value="Series A">Series A</option>
                                            <option className="bg-black" value="Series B">Series B</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-secondary mb-2">Capital Ask (USD)</label>
                                        <input
                                            required
                                            type="number"
                                            className="input-premium"
                                            placeholder="2000000"
                                            value={formData.capitalAsk}
                                            onChange={(e) => setFormData({ ...formData, capitalAsk: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-secondary mb-2">Target Valuation (USD)</label>
                                        <input
                                            required
                                            type="number"
                                            className="input-premium"
                                            placeholder="10000000"
                                            value={formData.valuation}
                                            onChange={(e) => setFormData({ ...formData, valuation: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-secondary mb-2">Key Traction Metrics</label>
                                        <textarea
                                            required
                                            className="input-premium min-h-[150px]"
                                            placeholder="e.g. $50k MRR, 20% MoM growth, 5 enterprise pilots..."
                                            value={formData.traction}
                                            onChange={(e) => setFormData({ ...formData, traction: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-accent/40 transition-colors cursor-pointer">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-semibold mb-1">Upload Pitch Deck</p>
                                        <p className="text-xs text-secondary italic">PDF format only. Maximum 10MB.</p>
                                    </div>
                                    <div className="p-4 bg-accent/5 rounded-2xl border border-accent/20">
                                        <p className="text-xs text-accent leading-relaxed">
                                            Your pitch deck will be watermarked and hosted on our secure private server. Access will only be granted to verified investors after mutual interest.
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
                            {currentStep === steps.length ? "Submit Application" : "Continue"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
