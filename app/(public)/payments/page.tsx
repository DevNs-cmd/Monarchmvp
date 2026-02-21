"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, CreditCard, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePayment = () => {
        setLoading(true);
        setTimeout(() => {
            setSuccess(true);
            setLoading(false);
        }, 2000);
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-6 bg-black-lux">
            <AnimatePresence mode="wait">
                {!success ? (
                    <motion.div
                        key="checkout"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="w-full max-w-md"
                    >
                        <div className="card-premium">
                            <div className="mb-8">
                                <p className="text-[10px] text-accent font-bold uppercase tracking-[0.3em] mb-2">Monarch Intelligence</p>
                                <h2 className="text-3xl font-bold">Custom Report</h2>
                                <p className="text-secondary text-sm mt-2">Diligence synthesis for Nebula AI</p>
                            </div>

                            <div className="space-y-6 mb-8">
                                <div className="flex justify-between items-center py-4 border-b border-white/5">
                                    <span className="text-secondary text-sm uppercase tracking-widest">Report Fee</span>
                                    <span className="text-xl font-bold font-mono">$499.00</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-xs text-secondary">
                                        <ShieldCheck size={16} className="text-accent" />
                                        <span>Secure Stripe Integration (Test Mode)</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-secondary">
                                        <CheckCircle size={16} className="text-accent" />
                                        <span>Immediate digital delivery</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                className="w-full btn-gold py-4 text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2"
                            >
                                {loading ? "Processing Encryption..." : (
                                    <>
                                        Confirm Purchase <CreditCard size={18} />
                                    </>
                                )}
                            </button>

                            <p className="mt-6 text-center text-[10px] text-secondary uppercase tracking-widest leading-relaxed">
                                By purchasing, you agree to the Monarch Terms of Intelligence Dissemination.
                            </p>
                        </div>
                        <Link href="/investor/dashboard" className="block text-center mt-6 text-[10px] text-secondary hover:text-white uppercase tracking-widest transition-colors">
                            Cancel and return
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="w-24 h-24 border-2 border-accent rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle size={48} className="text-accent" />
                        </div>
                        <h2 className="text-4xl font-bold mb-4">Transaction Confirmed</h2>
                        <p className="text-secondary mb-12 max-w-sm mx-auto leading-relaxed">
                            Your custom intelligence report has been dispatched to your secure vault.
                        </p>
                        <div className="space-y-4">
                            <button className="w-full btn-gold px-12 py-4 text-xs font-bold uppercase tracking-widest">Download Report</button>
                            <Link href="/investor/dashboard" className="block text-xs uppercase tracking-widest text-secondary hover:text-white transition-colors">Return to Dashboard</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
