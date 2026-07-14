"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import MonarchNav from "@/components/nav/MonarchNav";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, rgba(201,162,77,0.05), transparent 60%)" }} />
      <div className="grid-overlay" />
      <MonarchNav />
      <main className="relative overflow-hidden">
        {/* Hero */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-28 pb-16" id="overview">
          <motion.div
            className="max-w-4xl w-full text-center space-y-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp} className="flex flex-col items-center gap-4">
              <LionMark />
              <p className="text-[11px] font-light uppercase tracking-widest2 text-gold">Private Opportunities</p>
              <h1 className="font-serif font-light leading-none tracking-[0.06em] text-[clamp(52px,8vw,100px)]">
                <span className="italic text-gold">Monarch</span>
              </h1>
              <p className="text-[15px] font-light text-grey-light max-w-xl">
                Private. Intelligent. Multi-Asset.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/request-access" className="group inline-flex items-center justify-center rounded-none bg-gold text-black px-10 py-4 text-[11px] uppercase tracking-widest4 transition-all duration-500 hover:bg-gold-light">
                Request Access
              </Link>
              <Link
                href="/access"
                className="group inline-flex items-center justify-center rounded-none border border-grey-dim text-grey-light px-10 py-4 text-[11px] uppercase tracking-widest4 transition-all duration-500 hover:border-gold-dim hover:text-gold"
              >
                Enter with Invite Code
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-col items-center gap-4 pt-6">
              <div className="h-10 w-px bg-gold-dim animate-pulse" />
            </motion.div>
          </motion.div>
        </section>

        {/* Manifesto */}
        <section className="py-32 px-6" id="platform">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.p
              variants={fadeUp}
              className="font-serif font-light text-[clamp(22px,3vw,36px)] leading-relaxed text-grey-light space-y-3"
            >
              Monarch is not a marketplace. It is not a directory. It is a private environment where{" "}
              <strong className="text-white font-normal">capital meets conviction</strong>, where founders are{" "}
              <strong className="text-white font-normal">evaluated before they are seen</strong>, and where investors operate with{" "}
              <em className="text-gold">intelligence, not noise.</em>
            </motion.p>
          </motion.div>
        </section>

        {/* Three interfaces */}
        <section className="py-28 px-6">
          <motion.div
            className="max-w-6xl mx-auto space-y-10"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-4 text-gold-dim text-[10px] tracking-widest2 uppercase">
              <span className="h-px w-10 bg-gold-dim" />
              Interfaces
            </motion.div>
            <motion.div variants={fadeUp} className="font-serif font-light text-[28px] sm:text-[34px]">
              Three <em className="text-gold italic">interfaces.</em> One ecosystem.
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-gold/10">
              {[
                {
                  number: "01",
                  role: "Founder",
                  title: "Dossier & readiness",
                  description:
                    "Structured onboarding, Monarch Index scoring, and controlled Boardroom visibility. Investors see only what is approved.",
                },
                {
                  number: "02",
                  role: "Investor / Executive",
                  title: "Boardroom & markets",
                  description:
                    "Vetted deal flow, Monarch Markets™ intelligence, and introductions mediated by Monarch — never direct outreach.",
                },
                {
                  number: "03",
                  role: "Admin & Core",
                  title: "Governance & security",
                  description:
                    "Audit trails, certification controls, risk overrides, and anti-circumvention monitoring across every interaction.",
                },
              ].map((item) => (
                <motion.div
                  key={item.number}
                  variants={fadeUp}
                  className="group bg-off-black p-12"
                >
                  <div className="text-[48px] font-serif font-light text-gold/15 leading-none">{item.number}</div>
                  <div className="uppercase text-[10px] tracking-widest2 text-gold-dim mt-4 mb-2">{item.role}</div>
                  <div className="text-[13px] uppercase tracking-[0.1em] text-white font-medium mb-3">{item.title}</div>
                  <p className="text-[14px] text-grey font-light leading-[1.75]">{item.description}</p>
                  <div className="mt-8 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-500 group-hover:scale-x-100" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* How it works */}
        <section className="py-28 px-6">
          <motion.div
            className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp} className="space-y-6 lg:sticky lg:top-32 lg:self-start">
              <div className="flex items-center gap-4 text-gold-dim text-[10px] tracking-widest2 uppercase">
                <span className="h-px w-10 bg-gold-dim" />
                Access Protocol
              </div>
              <h2 className="font-serif font-light text-[30px] sm:text-[36px] leading-tight">
                How <em className="italic text-gold">access</em> is earned.
              </h2>
              <p className="text-[15px] text-grey-light font-light leading-relaxed">
                Every interaction on Monarch is deliberate. Access is extended, not granted freely.
              </p>
            </motion.div>
            <div className="space-y-0">
              {[
                {
                  title: "Request or Invite",
                  description: "Submit for review or enter with a curated invite code.",
                },
                {
                  title: "Identity Verification",
                  description: "Monarch confirms legitimacy before access is extended.",
                },
                {
                  title: "Role Onboarding",
                  description: "Founders build their dossier. Investors declare their mandate.",
                },
                {
                  title: "Boardroom & Markets",
                  description: "Vetted deals surface. Intelligence flows. Introductions are made.",
                },
                {
                  title: "Deal Room & Close",
                  description: "When interest is mutual, Monarch facilitates. Securely.",
                },
              ].map((step, index) => (
                <motion.div
                  key={step.title}
                  variants={fadeUp}
                  className="grid grid-cols-[48px_1fr] gap-6 py-9 border-b border-white/10"
                >
                  <div className="font-serif text-[32px] font-light text-gold-dim">{index + 1}</div>
                  <div>
                    <div className="text-[15px] text-white font-medium mb-2">{step.title}</div>
                    <p className="text-[14px] text-grey font-light leading-[1.75]">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Monarch Certified */}
        <section className="py-28 px-6" id="certification">
          <motion.div
            className="max-w-2xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div
              variants={fadeUp}
              className="relative bg-dark-1 border border-gold/20 p-16 overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
              <div className="inline-flex items-center gap-3 border border-gold/40 px-6 py-2 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest2 text-gold">Monarch Certified™</span>
              </div>
              <h3 className="font-serif font-light text-[clamp(28px,4vw,48px)] mb-5">
                Proof of readiness, issued by Monarch.
              </h3>
              <p className="text-[15px] text-grey-light font-light leading-[1.8] max-w-lg mb-10">
                A five-stage review culminating in the Monarch Certified™ badge — time-bound, revocable, and backed by an audit trail.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-5 border border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                {[
                  "I Identity",
                  "II Fundamentals",
                  "III Index",
                  "IV Council",
                  "V Certified",
                ].map((stage) => (
                  <div key={stage} className="p-6 text-center">
                    <div className="font-serif text-[20px] font-light text-gold-dim mb-1.5">
                      {stage.split(" ")[0]}
                    </div>
                    <div className="uppercase text-[11px] tracking-[0.1em] text-grey">
                      {stage.split(" ").slice(1).join(" ")}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* App download */}
        <section className="py-32 px-6 bg-dark-1 border-y border-gold/10" id="download">
          <motion.div
            className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp} className="space-y-6">
              <div className="flex items-center gap-4 text-gold-dim text-[10px] tracking-widest2 uppercase">
                <span className="h-px w-10 bg-gold-dim" />
                Mobile
              </div>
              <h3 className="font-serif font-light text-[30px] sm:text-[36px] leading-tight">
                Available on <em className="italic text-gold">iOS</em> and Android.
              </h3>
              <p className="text-[15px] text-grey-light font-light leading-relaxed max-w-xl">
                The full Monarch experience lives in your pocket. Private. Encrypted. Always current.
              </p>
              <div className="flex flex-col gap-4">
                <StoreButton store="apple" />
                <StoreButton store="google" />
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="flex justify-center">
              <PhoneMock />
            </motion.div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-white/10 py-12 px-6">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 text-center">
            <div className="font-serif text-[22px] tracking-widest3 text-gold">MONARCH</div>
            <div className="flex items-center gap-8 text-[12px] text-grey-dim">
              <Link className="hover:text-grey transition-colors duration-300" href="#">Privacy</Link>
              <Link className="hover:text-grey transition-colors duration-300" href="#">Terms</Link>
              <Link className="hover:text-grey transition-colors duration-300" href="#">Contact</Link>
            </div>
            <div className="text-[11px] text-grey-dim/60">© 2025 Monarch. All rights reserved.</div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function LionMark() {
  return (
    <motion.svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
      className="mx-auto text-gold"
    >
      <path
        d="M24 4l6 6-6 6-6-6 6-6zm0 12l6 6-6 6-6-6 6-6zm0 12l6 6-6 6-6-6 6-6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function StoreButton({ store }: { store: "apple" | "google" }) {
  const isApple = store === "apple";
  return (
    <button className="flex items-center gap-3 bg-black border border-grey-dim px-6 py-4 w-64 transition-colors duration-400 hover:border-gold-dim">
      {isApple ? <AppleIcon /> : <GoogleIcon />}
      <div className="text-left">
        <div className="text-[10px] uppercase tracking-widest4 text-grey-dim">Download on the</div>
        <div className="text-[16px] text-white font-medium">{isApple ? "App Store" : "Google Play"}</div>
      </div>
    </button>
  );
}

function PhoneMock() {
  return (
    <div className="w-64 h-[520px] rounded-[36px] border-[1.5px] border-gold/30 bg-black mx-auto relative overflow-hidden">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black border border-gold/20 rounded-xl z-10" />
      <div className="p-4 pt-14 flex flex-col gap-3">
        <div className="h-8 rounded bg-gold/10 border border-gold/20 flex items-center justify-center">
          <span className="font-serif text-gold text-[12px]">M</span>
        </div>
        <div className="h-12 rounded bg-white/5 border border-white/10" />
        <div className="h-12 rounded bg-white/5 border border-white/10" />
        <div className="w-24 h-24 rounded-full border-4 border-gold/30 mx-auto mt-4 flex items-center justify-center">
          <span className="text-[10px] text-gold-dim">MIG</span>
        </div>
        <div className="h-12 rounded bg-white/5 border border-white/10" />
        <div className="h-12 rounded bg-white/5 border border-white/10" />
      </div>
    </div>
  );
}

function AppleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.365 1.43c0 1.14-.465 2.164-1.17 2.972-.75.86-2.016 1.52-3.087 1.432-.13-1.11.455-2.256 1.128-3.01.79-.89 2.148-1.554 3.129-1.394zM19.5 17.57c-.603 1.258-.894 1.822-1.681 2.94-1.09 1.566-2.344 3.522-4.026 3.548-1.517.026-1.907-1.05-3.99-1.04-2.082.01-2.514 1.066-4.032 1.042-1.683-.026-2.97-1.77-4.06-3.333-2.778-3.994-3.07-8.68-1.347-11.168 1.198-1.78 3.096-2.82 4.868-2.82 1.818 0 2.959 1.146 4.463 1.114 1.455-.028 2.371-1.117 4.46-1.117 1.6 0 3.29.874 4.485 2.384-3.937 2.15-3.296 7.764.84 8.45z"
        fill="currentColor"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.6 12.227c0-.68-.055-1.36-.172-2.027H12v3.84h5.4a4.62 4.62 0 0 1-2.004 3.03v2.52h3.234c1.89-1.74 2.97-4.3 2.97-7.363Z" fill="#4285F4" />
      <path d="M12 22.5c2.7 0 4.968-.885 6.624-2.41l-3.234-2.52c-.9.6-2.055.948-3.39.948-2.607 0-4.818-1.758-5.61-4.122H3.03v2.58A10.49 10.49 0 0 0 12 22.5Z" fill="#34A853" />
      <path d="M6.39 14.396c-.21-.63-.33-1.302-.33-1.996 0-.693.12-1.365.33-1.995V7.825H3.03A10.51 10.51 0 0 0 1.5 12.4c0 1.68.402 3.27 1.53 4.575l3.36-2.58Z" fill="#FBBC05" />
      <path d="M12 6.87c1.47 0 2.79.51 3.828 1.515l2.865-2.79C16.95 3.9 14.7 3 12 3 8.97 3 6.24 4.725 4.89 7.305l3.36 2.58C9.18 8.628 10.77 6.87 12 6.87Z" fill="#EA4335" />
    </svg>
  );
}
