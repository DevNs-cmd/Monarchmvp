"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Bypassed for MVP Review
        setTimeout(() => {
            router.push("/investor/dashboard");
        }, 500);
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-6 bg-black-lux relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md z-10"
            >
                <div className="card-premium text-center">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Gatehouse</h2>
                        <p className="text-secondary text-sm">Enter your private access key</p>
                    </div>

                    <form onSubmit={handleVerifyCode} className="space-y-6">
                        <div className="relative">
                            <input
                                type="text"
                                className="input-premium text-center text-xl tracking-[0.2em] font-mono uppercase"
                                placeholder="XXXX-XXXX-XXXX"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                maxLength={12}
                                required
                            />
                            {error && <p className="text-red-500 text-xs mt-2 uppercase tracking-widest">{error}</p>}
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="btn-gold w-full text-sm font-bold tracking-widest uppercase disabled:opacity-50"
                        >
                            {loading ? "Verifying..." : "Validate Key"}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                        <p className="text-[10px] text-secondary uppercase tracking-[0.2em]">Already a member?</p>
                        <button
                            className="text-white hover:text-accent transition-colors text-xs uppercase tracking-widest font-semibold"
                            onClick={() => alert("Magic link sent to your registered email.")}
                        >
                            Enter via Magic Link
                        </button>
                    </div>

                    <Link href="/" className="block mt-6 text-[10px] text-secondary hover:text-white transition-colors uppercase tracking-widest">
                        Return to Gateway
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
