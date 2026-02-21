"use client";

import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

export default function DashboardLayout({
    children,
    role
}: {
    children: React.ReactNode;
    role: "FOUNDER" | "INVESTOR" | "ADMIN";
}) {
    return (
        <div className="min-h-screen bg-black text-white">
            <Sidebar role={role} />
            <main className="ml-64 p-12">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
