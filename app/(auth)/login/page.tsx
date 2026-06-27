"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Mail } from "lucide-react";

export default function Gatehouse() {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<"invite" | "otp">("invite");
    const [email, setEmail] = useState("");
    const [otpRequested, setOtpRequested] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpHint, setOtpHint] = useState("");
    const router = useRouter();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/verify-invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Validation failed");
                setLoading(false);
                return;
            }

            // Successfully validated invite
            // Store invite info in local storage for onboarding
            localStorage.setItem("monarch_invite_role", data.role);
            localStorage.setItem("monarch_invite_code", data.inviteCode);

            if (data.role === "FOUNDER") {
                router.push("/founder/onboarding");
            } else if (data.role === "INVESTOR") {
                router.push("/investor/onboarding");
            } else if (data.role === "ADMIN") {
                router.push("/admin/console");
            }
        } catch (error) {
            console.error("Invite verification failed:", error);
            setError("Connection to Gatehouse lost. Try again.");
            setLoading(false);
        }
    };

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setOtpHint("");

        try {
            const response = await fetch("/api/auth/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "OTP request failed");
                setLoading(false);
                return;
            }

            if (data.devCode) {
                setOtpHint(`Dev OTP: ${data.devCode}`);
            }

            setOtpRequested(true);
        } catch (error) {
            console.error("OTP request failed:", error);
            setError("Unable to dispatch OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: otp }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "OTP verification failed");
                setLoading(false);
                return;
            }

            if (data.role === "FOUNDER") router.push("/founder/dashboard");
            if (data.role === "INVESTOR") router.push("/investor/dashboard");
            if (data.role === "ADMIN") router.push("/admin/console");
        } catch (error) {
            console.error("OTP verification failed:", error);
            setError("Verification failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-6 bg-black-lux relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <ShieldCheck size={400} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="card-premium text-center">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold mb-2">Gatehouse</h2>
                        <p className="text-secondary text-xs uppercase tracking-[0.3em]">Identity Verification</p>
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-8">
                        <button
                            onClick={() => {
                                setMode("invite");
                                setError("");
                            }}
                            className={`text-[10px] uppercase tracking-[0.3em] font-bold ${mode === "invite" ? "text-gold" : "text-secondary"}`}
                        >
                            Invite Code
                        </button>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <button
                            onClick={() => {
                                setMode("otp");
                                setError("");
                            }}
                            className={`text-[10px] uppercase tracking-[0.3em] font-bold ${mode === "otp" ? "text-gold" : "text-secondary"}`}
                        >
                            OTP Access
                        </button>
                    </div>

                    {mode === "invite" ? (
                        <form onSubmit={handleVerify} className="space-y-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="XXXX-XXXX-XXXX"
                                    className="input-premium text-center text-xl font-mono tracking-[0.3em] placeholder:opacity-30"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    maxLength={12}
                                    required
                                />
                                <AnimatePresence>
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="text-red-500 text-[10px] mt-4 uppercase tracking-widest font-bold"
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-gold w-full flex items-center justify-center gap-3 py-5"
                            >
                                {loading ? "Authenticating..." : (
                                    <>
                                        Validate Key <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={otpRequested ? handleVerifyOtp : handleRequestOtp} className="space-y-6">
                            <div className="space-y-3">
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
                                    <input
                                        type="email"
                                        placeholder="work@firm.com"
                                        className="input-premium pl-12"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                {otpRequested && (
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        className="input-premium text-center tracking-[0.3em] font-mono"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength={6}
                                        required
                                    />
                                )}
                            </div>
                            {otpHint && (
                                <p className="text-[10px] text-gold uppercase tracking-widest font-bold">{otpHint}</p>
                            )}
                            <AnimatePresence>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-red-500 text-[10px] uppercase tracking-widest font-bold"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-gold w-full flex items-center justify-center gap-3 py-5"
                            >
                                {loading
                                    ? "Processing..."
                                    : otpRequested
                                        ? "Verify Code"
                                        : "Send OTP"}
                                <ArrowRight size={18} />
                            </button>
                        </form>
                    )}

                    <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
                        <div className="h-4" />
                        <Link href="/" className="block text-[10px] text-[#C9A24D] hover:underline uppercase tracking-[0.2em]">
                            Return to Entry
                        </Link>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
