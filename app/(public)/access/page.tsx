"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AccessRequest() {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        linkedin: "",
        role: "INVESTOR",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        console.log("Submitting access request:", formData);
        setSubmitted(true);
    };

    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 bg-black-lux relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />

            <AnimatePresence mode="wait">
                {!submitted ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-lg z-10"
                    >
                        <div className="card-premium">
                            <h2 className="text-3xl font-bold mb-2 text-white">Join the Monarch</h2>
                            <p className="text-secondary mb-8">Request access to our exclusive network.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-secondary mb-2">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="input-premium"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-secondary mb-2">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        className="input-premium"
                                        placeholder="name@firm.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-secondary mb-2">LinkedIn Profile</label>
                                    <input
                                        required
                                        type="url"
                                        className="input-premium"
                                        placeholder="https://linkedin.com/in/..."
                                        value={formData.linkedin}
                                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-secondary mb-2">Proposed Role</label>
                                    <select
                                        className="input-premium appearance-none"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="INVESTOR" className="bg-black">Investor</option>
                                        <option value="FOUNDER" className="bg-black">Founder</option>
                                    </select>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="btn-gold w-full text-sm font-bold tracking-widest uppercase">
                                        Submit Request
                                    </button>
                                </div>
                            </form>

                            <button className="mt-6 w-full text-xs text-secondary hover:text-white transition-colors uppercase tracking-widest">
                                <Link href="/">Back to Home</Link>
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center z-10 max-w-md"
                    >
                        <div className="w-20 h-20 border-2 border-accent rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-white">Application Received</h2>
                        <p className="text-secondary mb-8 leading-relaxed">
                            Your credentials are being reviewed by our board. You will receive an invitation link if your profile aligns with our current intake requirements.
                        </p>
                        <Link href="/">
                            <button className="btn-outline text-xs tracking-widest uppercase">Return to Gateway</button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
