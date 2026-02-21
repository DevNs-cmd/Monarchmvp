"use client";

import DashboardLayout from "@/components/dashboard/Layout";
import { useState } from "react";
import {
    Users,
    UserCheck,
    Trash2,
    Activity,
    ShieldAlert,
    Search,
    MoreHorizontal,
    Briefcase,
    TrendingUp,
    Ban
} from "lucide-react";
import { motion } from "framer-motion";

const users = [
    { id: 1, name: "Alice Chen", email: "alice@nebula.ai", role: "FOUNDER", status: "PENDING", company: "Nebula AI", index: 94 },
    { id: 2, name: "Bob Smith", email: "bob@cap.com", role: "INVESTOR", status: "VERIFIED", firm: "CapVentures", range: "$1M-$5M" },
    { id: 3, name: "Charlie Day", email: "charlie@veritas.io", role: "FOUNDER", status: "UNDER_REVIEW", company: "Veritas", index: 82 },
    { id: 4, name: "Diana Prince", email: "diana@amazon.com", role: "INVESTOR", status: "PENDING", firm: "Amazonia Capital", range: "$5M+" },
];

export default function AdminConsole() {
    const [activeTab, setActiveTab] = useState("approvals");

    return (
        <DashboardLayout role="ADMIN">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Gatekeeper Control</h1>
                        <p className="text-secondary text-xs uppercase tracking-[0.2em]">Monarch System Administration</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="text-center px-6 border-r border-white/10">
                            <p className="text-[10px] text-secondary uppercase tracking-widest mb-1">Queue Size</p>
                            <p className="text-xl font-bold">12</p>
                        </div>
                        <div className="text-center px-6 border-r border-white/10">
                            <p className="text-[10px] text-secondary uppercase tracking-widest mb-1">System Health</p>
                            <p className="text-xl font-bold text-accent">Optimal</p>
                        </div>
                    </div>
                </div>

                {/* Admin Tabs */}
                <div className="flex gap-8 border-b border-white/10">
                    {[
                        { id: "approvals", label: "Pending Approvals", icon: UserCheck },
                        { id: "users", label: "User Management", icon: Users },
                        { id: "audit", label: "Audit Logs", icon: Activity },
                        { id: "security", label: "Security", icon: ShieldAlert },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all relative ${activeTab === tab.id ? "text-accent" : "text-secondary hover:text-white"
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                {activeTab === "approvals" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="relative w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                                <input type="text" placeholder="Search queue..." className="input-premium pl-12 text-sm" />
                            </div>
                        </div>

                        <div className="card-premium p-0 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/5 border-b border-white/10 uppercase tracking-[0.2em] text-[10px] text-secondary">
                                    <tr>
                                        <th className="px-8 py-4">Identity</th>
                                        <th className="px-8 py-4">Entity / Role</th>
                                        <th className="px-8 py-4">Metrics</th>
                                        <th className="px-8 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.filter(u => u.status === "PENDING" || u.status === "UNDER_REVIEW").map(user => (
                                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold">{user.name}</p>
                                                <p className="text-xs text-secondary">{user.email}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold">{user.company || user.firm}</span>
                                                    <span className={`text-[10px] uppercase tracking-widest ${user.role === "FOUNDER" ? "text-accent" : "text-blue-400"}`}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {user.role === "FOUNDER" ? (
                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp size={14} className="text-accent" />
                                                        <span className="text-xs font-bold">{user.index}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] border border-white/20 px-2 py-0.5 rounded text-secondary italic">
                                                        {user.range} check
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button className="p-2 bg-accent/10 text-accent rounded-lg border border-accent/20 hover:bg-accent hover:text-black transition-all">
                                                        <UserCheck size={16} />
                                                    </button>
                                                    <button className="p-2 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
                                                        <Ban size={16} />
                                                    </button>
                                                    <button className="p-2 hover:bg-white/5 rounded-lg text-secondary">
                                                        <MoreHorizontal size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "audit" && (
                    <div className="space-y-6">
                        <div className="card-premium p-8 h-[600px] overflow-y-auto">
                            <div className="space-y-6">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className="flex gap-4 items-start pb-6 border-b border-white/5">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-secondary">
                                            <Activity size={14} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm">
                                                <span className="font-bold text-white">Admin</span> authorized access for <span className="text-accent">Dossier: Nebula-AI</span>
                                            </p>
                                            <p className="text-[10px] text-secondary uppercase tracking-[0.2em] mt-1">21 Feb 2026, 10:45:12 • IP: 192.168.1.1</p>
                                        </div>
                                        <button className="text-[10px] uppercase font-bold text-secondary hover:text-white transition-colors">Details</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
