"use client";

import DashboardLayout from "@/components/dashboard/Layout";
import {
    ShieldCheck,
    Send,
    Paperclip,
    Lock,
    EyeOff,
    Calendar
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Message = {
    id: string;
    senderId: string;
    senderRole: string;
    content: string;
    createdAt: string;
};

export default function DealRoom() {
    const params = useParams<{ dealId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<"FOUNDER" | "INVESTOR" | "ADMIN">("INVESTOR");
    const [uploading, setUploading] = useState(false);
    const [uploadUrl, setUploadUrl] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const me = await fetch("/api/user/me");
                if (me.ok) {
                    const data = await me.json();
                    setRole(data.user?.role || "INVESTOR");
                }
                const res = await fetch(`/api/dealroom/${params.dealId}/messages`);
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data.items || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [params.dealId]);

    const handleSend = async () => {
        if (!input.trim()) return;
        try {
            const res = await fetch(`/api/dealroom/${params.dealId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: input }),
            });
            if (res.ok) {
                setInput("");
                const reload = await fetch(`/api/dealroom/${params.dealId}/messages`);
                if (reload.ok) {
                    const data = await reload.json();
                    setMessages(data.items || []);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpload = async (file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch(`/api/dealroom/${params.dealId}/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok && data.url) {
                setUploadUrl(data.url);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <DashboardLayout role={role}>
            <div className="max-w-7xl mx-auto h-[calc(100vh-160px)] flex gap-8">
                <div className="flex-1 flex flex-col card-premium p-0 overflow-hidden relative">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm tracking-tight text-white">Secure Deal Room</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] text-secondary uppercase tracking-widest font-bold">End-to-End Encrypted</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 text-[10px] text-secondary font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-2"><Lock size={12} /> AES-256</span>
                            <span className="flex items-center gap-2"><EyeOff size={12} /> Admin Blind</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-12 space-y-8">
                        {loading ? (
                            <div className="text-secondary uppercase tracking-[0.3em]">Loading messages...</div>
                        ) : messages.length === 0 ? (
                            <div className="text-secondary uppercase tracking-[0.3em]">No messages yet.</div>
                        ) : (
                            messages.map((m) => {
                                const isMe = m.senderRole === role;
                                return (
                                    <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-md ${isMe ? "bg-gold text-black rounded-tr-none" : "bg-white/5 text-white rounded-tl-none"} p-6 rounded-3xl relative shadow-xl`}>
                                            <p className="text-sm leading-relaxed">{m.content}</p>
                                            <span className={`text-[10px] block mt-4 opacity-40 font-bold ${isMe ? "text-black" : "text-secondary"}`}>
                                                {new Date(m.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="p-8 border-t border-white/5">
                        <div className="relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Transmit secure message..."
                                className="input-premium pr-32 py-5"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-4">
                                <label className="p-2 text-secondary hover:text-gold transition-colors cursor-pointer">
                                    <Paperclip size={20} />
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleUpload(file);
                                        }}
                                    />
                                </label>
                                <button onClick={handleSend} className="btn-gold p-3 rounded-xl">
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                        {uploadUrl && (
                            <p className="text-[10px] text-secondary uppercase tracking-widest mt-3">
                                File uploaded. Secure link issued.
                            </p>
                        )}
                        {uploading && (
                            <p className="text-[10px] text-secondary uppercase tracking-widest mt-3">
                                Uploading file...
                            </p>
                        )}
                    </div>
                </div>

                <div className="w-80 space-y-6">
                    <div className="card-premium p-8">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gold mb-6">Protocol Status</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-secondary">NDA Status</span>
                                <span className="text-green-500">Active</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-secondary">Dossier Locked</span>
                                <span className="text-red-500">No</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-secondary">Funds Verified</span>
                                <span className="text-gold">Pending</span>
                            </div>
                        </div>
                    </div>

                    <button className="w-full card-premium p-6 flex flex-col items-center gap-4 group hover:border-gold/30 transition-all">
                        <Calendar size={24} className="text-secondary group-hover:text-gold" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Schedule Sync</span>
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
