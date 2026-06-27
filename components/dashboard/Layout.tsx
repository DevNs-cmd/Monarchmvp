"use client";

import { motion } from "framer-motion";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: "FOUNDER" | "INVESTOR" | "ADMIN";
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-black flex">
            <Sidebar role={role} />

            <main className="flex-1 ml-72 p-12 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
