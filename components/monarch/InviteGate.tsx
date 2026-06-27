"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import Badge from "@/components/ui/Badge";
import { INVITE_CODE_ROLE_MAP, ROLE_ROUTES } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";

export default function InviteGate() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = code.trim().toUpperCase();
    const role = INVITE_CODE_ROLE_MAP[normalized];

    if (!role) {
      setError("Invalid invite code. Access denied.");
      return;
    }

    login({ name: "Monarch Member" }, role);
    router.replace(ROLE_ROUTES[role]);
  };

  return (
    <FadeIn className="w-full max-w-lg">
      <Card className="space-y-8">
        <div className="space-y-3">
          <Badge tone="gold">Invite Gate</Badge>
          <h2 className="font-display text-3xl text-foreground">Enter with invitation</h2>
          <p className="text-sm text-secondary">
            MONARCH is restricted to verified founders, institutional investors, and platform administrators.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              if (error) setError("");
            }}
            placeholder="Invite code"
            aria-label="Invite code"
          />
          {error ? <p className="text-xs uppercase tracking-[0.3em] text-accent">{error}</p> : null}
          <Button type="submit" className="w-full">
            Enter with Invite
          </Button>
        </form>
        <div className="text-[11px] uppercase tracking-[0.3em] text-secondary">
          Access routes are encrypted and monitored.
        </div>
      </Card>
    </FadeIn>
  );
}
