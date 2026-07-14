"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Upload, ArrowRight, ArrowLeft, Check } from "lucide-react";

const steps = [
    { id: 1, title: "Venture Essence", desc: "The core identity of your startup." },
    { id: 2, title: "Traction", desc: "Hard numbers and market proof." },
    { id: 3, title: "Capitalization", desc: "Your roadmap for growth." },
    { id: 4, title: "Dossier", desc: "Executive summary and deck." },
];

export default function FounderOnboarding() {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        companyName: "",
        pitch: "",
        industry: "",
        mrr: "",
        growth: "",
        partnerships: "",
        capitalAsk: "",
        valuation: "",
        stage: "Seed",
        deckKey: ""
    });

    const updateFormData = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleComplete = async () => {
        const inviteCode = localStorage.getItem("monarch_invite_code");
        if (!inviteCode) {
            alert("Session expired. Please start over.");
            router.push("/login");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/founder/onboarding", {
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

            router.push("/founder/dashboard");
        } catch (error) {
            console.error("Founder onboarding submission failed:", error);
            alert("Connection error. Try again.");
            setLoading(false);
        }
    };

    const handleDeckUpload = async (file: File) => {
        const inviteCode = localStorage.getItem("monarch_invite_code");
        if (!inviteCode) {
            alert("Session expired. Please start over.");
            router.push("/login");
            return;
        }

        setUploading(true);
        try {
            const body = new FormData();
            body.append("file", file);
            body.append("inviteCode", inviteCode);

            const response = await fetch("/api/uploads/deck", {
                method: "POST",
                body,
            });

            const data = await response.json();
            if (!response.ok) {
                alert(data.error || "Upload failed");
                return;
            }

            updateFormData("deckKey", data.key);
        } catch (error) {
            console.error("Deck upload failed:", error);
            alert("Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 bg-black-lux relative overflow-hidden">
            <div className="w-full max-w-2xl z-10">
                {/* Progress Bar */}
                <div className="flex justify-between items-center mb-16 px-4">
                    {steps.map((s) => (
                        <div key={s.id} className="flex-1 flex flex-col items-center relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${currentStep >= s.id ? "border-gold bg-gold text-black" : "border-white/10 text-secondary"
                                }`}>
                                {currentStep > s.id ? <Check size={20} /> : s.id}
                            </div>
                            <p className={`absolute top-14 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-colors ${currentStep === s.id ? "text-gold" : "text-secondary/40"
                                }`}>
                                {s.title}
                            </p>
                            {s.id !== steps.length && (
                                <div className={`absolute left-[calc(50%+25px)] right-[-50%] top-5 h-[2px] ${currentStep > s.id ? "bg-gold" : "bg-white/5"
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="card-premium">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                            className="min-h-[400px]"
                        >
                            <div className="mb-12">
                                <h2 className="text-3xl font-bold mb-2">{steps[currentStep - 1].title}</h2>
                                <p className="text-secondary text-sm">{steps[currentStep - 1].desc}</p>
                            </div>

                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <input
                                        type="text"
                                        placeholder="Your Full Name"
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
                                        placeholder="Company Name"
                                        className="input-premium"
                                        value={formData.companyName}
                                        onChange={(e) => updateFormData("companyName", e.target.value)}
                                    />
                                    <textarea
                                        placeholder="The one-sentence elevator pitch"
                                        className="input-premium min-h-[120px]"
                                        value={formData.pitch}
                                        onChange={(e) => updateFormData("pitch", e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Industry/Sector"
                                        className="input-premium"
                                        value={formData.industry}
                                        onChange={(e) => updateFormData("industry", e.target.value)}
                                    />
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <input
                                        type="text"
                                        placeholder="Revenue (MRR)"
                                        className="input-premium"
                                        value={formData.mrr}
                                        onChange={(e) => updateFormData("mrr", e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="User Growth (%)"
                                        className="input-premium"
                                        value={formData.growth}
                                        onChange={(e) => updateFormData("growth", e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Major Partnerships"
                                        className="input-premium"
                                        value={formData.partnerships}
                                        onChange={(e) => updateFormData("partnerships", e.target.value)}
                                    />
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <input
                                        type="number"
                                        placeholder="Capital Ask (USD)"
                                        className="input-premium"
                                        value={formData.capitalAsk}
                                        onChange={(e) => updateFormData("capitalAsk", e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Pre-money Valuation"
                                        className="input-premium"
                                        value={formData.valuation}
                                        onChange={(e) => updateFormData("valuation", e.target.value)}
                                    />
                                    <select
                                        className="input-premium appearance-none text-secondary"
                                        value={formData.stage}
                                        onChange={(e) => updateFormData("stage", e.target.value)}
                                    >
                                        <option value="Seed">Seed</option>
                                        <option value="Series A">Series A</option>
                                        <option value="Series B">Series B</option>
                                    </select>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-12 hover:border-gold/50 transition-colors cursor-pointer group">
                                    <Upload size={48} className="text-secondary group-hover:text-gold transition-colors mb-4" />
                                    <p className="text-sm font-bold uppercase tracking-widest">
                                        {formData.deckKey ? "Deck Uploaded" : "Upload Pitch Deck"}
                                    </p>
                                    <p className="text-xs text-secondary mt-2">PDF format preferred (max 20MB)</p>
                                    <p className="text-[10px] text-accent mt-4">
                                        {uploading ? "Scanning + Encrypting..." : "S3 secured storage with virus scan"}
                                    </p>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleDeckUpload(file);
                                        }}
                                    />
                                </label>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between mt-12 pt-8 border-t border-white/5">
                        <button
                            onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
                            disabled={currentStep === 1}
                            className="flex items-center gap-2 text-secondary hover:text-white transition-colors disabled:opacity-0"
                        >
                            <ArrowLeft size={18} /> Previous
                        </button>

                        {currentStep < steps.length ? (
                            <button
                                onClick={() => setCurrentStep(s => Math.min(steps.length, s + 1))}
                                className="btn-gold flex items-center gap-2"
                            >
                                Continue <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={handleComplete}
                                disabled={loading}
                                className="btn-gold flex items-center gap-2"
                            >
                                {loading ? "Verifying..." : "Submit for Approval"} <Check size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
