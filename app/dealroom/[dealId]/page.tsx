"use client";

import DashboardLayout from "@/components/dashboard/Layout";
import { useState, useRef, useEffect } from "react";
import {
    Send,
    Paperclip,
    Calendar,
    MoreVertical,
    ShieldCheck,
    ArrowLeft,
    Clock,
    User,
    ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const initialMessages = [
    { id: 1, sender: "founder", content: "Welcome to the Deal Room. I've uploaded our latest cap table for your perusal.", time: "10:15 AM" },
    { id: 2, sender: "system", content: "Nebula_AI_CapTable_Q4.pdf uploaded by founder.", time: "10:16 AM", type: "system" },
    { id: 3, sender: "investor", content: "Thank you. The numbers look promising. I'd like to dive deeper into the burn rate.", time: "11:20 AM" },
];

export default function DealRoomPage({ params }: { params: { dealId: string } }) {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: "investor",
            content: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setInput("");
    };

    return (
        <DashboardLayout role="INVESTOR">
            <div className="max-w-6xl mx-auto h-[calc(100vh-160px)] flex gap-8">
                {/* Chat Area */}
                <div className="flex-1 flex flex-col card-premium p-0 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <Link href="/boardroom" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <ArrowLeft size={20} className="text-secondary" />
                            </Link>
                            <div>
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    Monarch_Deal_082 <ShieldCheck size={16} className="text-accent" />
                                </h2>
                                <p className="text-[10px] text-accent uppercase tracking-widest font-bold">Mutual Interest Unlocked</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right mr-4 hidden md:block">
                                <p className="text-[10px] text-secondary uppercase tracking-widest">Venture</p>
                                <p className="text-xs font-bold">Nebula AI</p>
                            </div>
                            <button className="p-2 hover:bg-white/5 rounded-full">
                                <MoreVertical size={20} className="text-secondary" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                        <AnimatePresence>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className={`flex ${msg.type === "system" ? "justify-center" : msg.sender === "investor" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.type === "system" ? (
                                        <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-full text-[10px] text-secondary uppercase tracking-widest flex items-center gap-2">
                                            <Clock size={12} /> {msg.content}
                                        </div>
                                    ) : (
                                        <div className="max-w-[70%] space-y-2">
                                            <div className={`flex items-center gap-2 mb-1 ${msg.sender === "investor" ? "flex-row-reverse" : ""}`}>
                                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                                    <User size={12} />
                                                </div>
                                                <span className="text-[10px] text-secondary uppercase tracking-widest">{msg.sender}</span>
                                                <span className="text-[10px] text-secondary/40 tracking-widest">{msg.time}</span>
                                            </div>
                                            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === "investor"
                                                    ? "bg-accent text-black font-medium"
                                                    : "bg-white/5 border border-white/10 text-white"
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-6 bg-white/[0.02] border-t border-white/5">
                        <div className="flex gap-4">
                            <button type="button" className="p-3 bg-white/5 rounded-xl text-secondary hover:text-white transition-colors">
                                <Paperclip size={20} />
                            </button>
                            <input
                                type="text"
                                placeholder="Type an encrypted message..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-accent/40"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button type="submit" className="p-3 bg-accent text-black rounded-xl hover:bg-accent-light transition-all">
                                <Send size={20} />
                            </button>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-[10px] text-secondary uppercase tracking-widest">
                            <ShieldCheck size={12} className="text-accent" /> AES-256 Gated Encryption Active
                        </div>
                    </form>
                </div>

                {/* Sidebar */}
                <div className="w-80 space-y-8 h-full overflow-y-auto pr-2">
                    <div className="card-premium p-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Actions</h3>
                        <div className="space-y-4">
                            <button className="w-full btn-outline py-3 text-[10px] tracking-widest uppercase flex items-center justify-center gap-2">
                                <Calendar size={14} /> Schedule Sync
                            </button>
                            <button className="w-full btn-outline py-3 text-[10px] tracking-widest uppercase flex items-center justify-center gap-2">
                                <ExternalLink size={14} /> Propose Term Sheet
                            </button>
                        </div>
                    </div>

                    <div className="card-premium p-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Shared Assets</h3>
                        <div className="space-y-4">
                            {[
                                { name: "Nebula_AI_CapTable_Q4.pdf", size: "2.4MB" },
                                { name: "Monarch_Legal_Terms.pdf", size: "1.1MB" },
                                { name: "Financial_Forecast_2026.xlsx", size: "4.8MB" },
                            ].map(file => (
                                <div key={file.name} className="group p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-white/10">
                                    <p className="text-xs font-semibold truncate group-hover:text-accent transition-colors">{file.name}</p>
                                    <p className="text-[10px] text-secondary uppercase mt-1">{file.size}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card-premium p-6 bg-accent/5 border-accent/20">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 text-accent">Deal Intelligence</h3>
                        <p className="text-[10px] text-secondary leading-relaxed uppercase tracking-widest">
                            Standard diligence cycle remaining: <br />
                            <span className="text-white font-bold">14 Days</span>
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
