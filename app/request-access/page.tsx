"use client";

import { useState } from "react";
import Link from "next/link";
import MonarchInput from "@/components/ui/MonarchInput";
import MonarchButton from "@/components/ui/MonarchButton";

type FormState = {
  name: string;
  email: string;
  linkedin: string;
  role: string;
};

export default function RequestAccessPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    linkedin: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "email") setEmailExists(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEmailExists(false);
    try {
      const res = await fetch("/api/auth/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          linkedinUrl: form.linkedin,
          role: form.role === "Investor / Executive" ? "INVESTOR" : "FOUNDER",
        }),
      });
      if (res.status === 409) {
        setEmailExists(true);
      }
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center px-6">
      <Link href="/" className="absolute top-8 left-8 text-gold-dim text-[12px] tracking-widest4 uppercase hover:text-gold transition-colors">
        ← Monarch
      </Link>

      <div className="max-w-sm w-full">
        {!submitted ? (
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="text-center space-y-3">
              <div className="font-serif text-2xl text-gold">M</div>
              <h1 className="font-serif font-light text-[32px]">Request Access</h1>
              <p className="text-[13px] text-grey text-center">
                Applications are reviewed. If aligned, access will be extended.
              </p>
            </div>

            <MonarchInput
              label="Full Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
            <MonarchInput
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
            {emailExists ? (
              <p className="text-[13px] text-grey mt-[-8px]">Already on our list.</p>
            ) : null}
            <MonarchInput
              label="LinkedIn URL"
              type="url"
              value={form.linkedin}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              required
            />
            <div>
              <label className="block text-[11px] uppercase tracking-widest4 text-grey-dim mb-2">Role</label>
              <select
                className="w-full bg-transparent border-b border-grey-dim focus:border-gold pb-3 text-white text-[15px] font-light outline-none"
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
                required
              >
                <option value="">— Select Role —</option>
                <option>Founder</option>
                <option>Investor / Executive</option>
              </select>
            </div>

            <MonarchButton
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={!form.name || !form.email || !form.linkedin || !form.role}
            >
              Request Access
            </MonarchButton>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <Checkmark />
            <h2 className="font-serif font-light text-[28px]">Received.</h2>
            <p className="text-[14px] text-grey-light leading-[1.8]">
              Your request has been received. If aligned, access will be extended.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Checkmark() {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gold"
    >
      <circle cx="36" cy="36" r="35" stroke="currentColor" strokeWidth="2" strokeDasharray="220" strokeDashoffset="220">
        <animate attributeName="stroke-dashoffset" from="220" to="0" dur="0.8s" fill="freeze" />
      </circle>
      <path
        d="M22 37.5L31 46L50 27"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="40"
        strokeDashoffset="40"
      >
        <animate attributeName="stroke-dashoffset" from="40" to="0" dur="0.8s" begin="0.1s" fill="freeze" />
      </path>
    </svg>
  );
}
