"use client";

import DashboardLayout from "@/components/dashboard/Layout";
import { useEffect, useState } from "react";
import { ArrowUpRight, Bookmark, ShieldCheck } from "lucide-react";
import Link from "next/link";

type WatchlistItem = {
    ticker: string;
};

type DealRoomItem = {
    id: string;
    startupName: string;
    counterparty: string;
};

export default function InvestorPortfolio() {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [dealRooms, setDealRooms] = useState<DealRoomItem[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const wl = await fetch("/api/markets/watchlist");
                if (wl.ok) {
                    const data = await wl.json();
                    setWatchlist(data.items || []);
                }
                const dr = await fetch("/api/dealroom");
                if (dr.ok) {
                    const data = await dr.json();
                    setDealRooms(data.items || []);
                }
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, []);

    return (
        <DashboardLayout role="INVESTOR">
            <div className="max-w-6xl mx-auto space-y-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Portfolio Vault</h1>
                    <p className="text-secondary text-xs uppercase tracking-[0.4em]">Watchlists and Active Mandates</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="card-premium p-10">
                        <div className="flex items-center gap-3 mb-8">
                            <Bookmark size={18} className="text-gold" />
                            <h3 className="text-sm font-bold uppercase tracking-widest">MIG Watchlist</h3>
                        </div>
                        <div className="space-y-4">
                            {watchlist.length === 0 && (
                                <div className="text-[10px] uppercase tracking-widest text-secondary">
                                    Watchlist empty. Add tickers from MIG Markets.
                                </div>
                            )}
                            {watchlist.map((item) => (
                                <div key={item.ticker} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                                    <div>
                                        <p className="text-sm font-bold">{item.ticker}</p>
                                        <p className="text-[10px] text-secondary uppercase tracking-widest">Tracked asset</p>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest text-gold">Watching</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card-premium p-10">
                        <div className="flex items-center gap-3 mb-8">
                            <ShieldCheck size={18} className="text-gold" />
                            <h3 className="text-sm font-bold uppercase tracking-widest">Active Deal Rooms</h3>
                        </div>
                        <div className="space-y-4">
                            {dealRooms.length === 0 && (
                                <div className="text-[10px] uppercase tracking-widest text-secondary">
                                    No active deal rooms yet.
                                </div>
                            )}
                            {dealRooms.map((room) => (
                                <Link key={room.id} href={`/dealroom/${room.id}`} className="block">
                                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl hover:border-gold/30 border border-transparent transition-all">
                                        <div>
                                            <p className="text-sm font-bold">{room.startupName}</p>
                                            <p className="text-[10px] text-secondary uppercase tracking-widest">Counterparty: {room.counterparty}</p>
                                        </div>
                                        <div className="p-2 rounded-xl bg-black/60 border border-white/5">
                                            <ArrowUpRight size={16} className="text-secondary" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
