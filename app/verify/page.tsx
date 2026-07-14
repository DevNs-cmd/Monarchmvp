"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Verify() {
    const router = useRouter();

    useEffect(() => {
        const validate = async () => {
            try {
                const res = await fetch("/api/user/me");
                if (!res.ok) {
                    router.push("/login");
                    return;
                }
                const data = await res.json();
                const role = data?.user?.role;
                if (role === "FOUNDER") router.push("/founder/dashboard");
                if (role === "INVESTOR") router.push("/investor/dashboard");
                if (role === "ADMIN") router.push("/admin/dashboard");
            } catch (error) {
                console.error("Verification check failed:", error);
                router.push("/login");
            }
        };
        validate();
    }, [router]);

    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 bg-black-lux">
            <div className="text-center space-y-8">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 border border-gold rounded-full flex items-center justify-center mx-auto"
                >
                    <ShieldCheck size={40} className="text-gold" />
                </motion.div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-widest text-[#C9A24D]">VERIFYING PROTOCOL</h2>
                    <p className="text-secondary text-[10px] uppercase tracking-[0.4em]">Authenticating digital signature...</p>
                </div>
            </div>
        </main>
    );
}
