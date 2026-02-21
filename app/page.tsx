"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center px-4">
        {/* Logo Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="w-24 h-24 mb-6 relative group">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl group-hover:bg-accent/30 transition-all duration-500" />
            <div className="relative w-full h-full border-2 border-accent rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-accent tracking-tighter">M</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-[0.2em] mb-4 text-white">
            MONARCH
          </h1>
          <p className="text-secondary text-lg md:text-xl tracking-widest uppercase mb-12">
            Private Opportunities
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-col sm:flex-row gap-6 w-full max-w-md px-4"
        >
          <Link href="/access" className="flex-1">
            <button className="btn-gold w-full text-sm font-bold tracking-widest uppercase">
              Request Access
            </button>
          </Link>
          <Link href="/login" className="flex-1">
            <button className="btn-outline w-full text-sm font-bold tracking-widest uppercase">
              Enter Invite Code
            </button>
          </Link>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 text-xs tracking-widest text-secondary uppercase"
        >
          Exclusivity as a Standard
        </motion.p>
      </div>
    </main>
  );
}
