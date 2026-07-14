"use client";

import DashboardLayout from "@/components/dashboard/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

type DealRoomSummary = {
    id: string;
    startupName: string;
    counterparty: string;
};

export default function DealRoomIndex() {
    const [rooms, setRooms] = useState<DealRoomSummary[]>([]);
    const [role, setRole] = useState<"FOUNDER" | "INVESTOR" | "ADMIN">("INVESTOR");

    useEffect(() => {
        const load = async () => {
            try {
                const me = await fetch("/api/user/me");
                if (me.ok) {
                    const data = await me.json();
                    setRole(data.user?.role || "INVESTOR");
                }
                const res = await fetch("/api/dealroom");
                if (res.ok) {
                    const data = await res.json();
                    setRooms(data.items || []);
                }
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, []);

    return (
        <DashboardLayout role={role}>
            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Deal Rooms</h1>
                    <p className="text-secondary text-xs uppercase tracking-[0.4em]">Mutual Interest Channels</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {rooms.length === 0 && (
                        <div className="card-premium p-8 text-[10px] uppercase tracking-widest text-secondary">
                            No active deal rooms yet.
                        </div>
                    )}
                    {rooms.map((room) => (
                        <Link key={room.id} href={`/dealroom/${room.id}`}>
                            <div className="card-premium p-6 flex items-center justify-between hover:border-gold/30 transition-all">
                                <div>
                                    <p className="text-sm font-bold">{room.startupName}</p>
                                    <p className="text-[10px] text-secondary uppercase tracking-widest">Counterparty: {room.counterparty}</p>
                                </div>
                                <div className="p-2 rounded-xl bg-white/5">
                                    <ArrowUpRight size={18} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
