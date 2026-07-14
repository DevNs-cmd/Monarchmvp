"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import MonarchBadge from "@/components/ui/MonarchBadge";
import MonarchButton from "@/components/ui/MonarchButton";
import MonarchCard from "@/components/ui/MonarchCard";
import MonarchInput from "@/components/ui/MonarchInput";

type Role = "FOUNDER" | "INVESTOR" | "ADMIN";

type AccessRequest = {
  id: string;
  name: string;
  email: string;
  linkedin: string;
  role: Role;
  status: string;
  createdAt: string;
};

type FounderProfile = {
  id: string;
  companyName: string;
  stage: string;
  capitalAsk: number;
  valuation: number | null;
  monarchIndex: number | null;
  status: string;
};

type InvestorProfile = {
  id: string;
  investmentRange: string;
  sectors: string[];
  stages: string[];
  region: string;
  verified: boolean;
};

type PendingUser = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  status: string;
  createdAt: string;
  founderProfile?: FounderProfile | null;
  investorProfile?: InvestorProfile | null;
};

type AdminOverview = {
  accessRequests: AccessRequest[];
  pendingFounders: PendingUser[];
  pendingInvestors: PendingUser[];
};

type QueueItem =
  | { kind: "access"; id: string; request: AccessRequest }
  | { kind: "user"; id: string; user: PendingUser };

async function readResponse(response: Response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || "The request could not be completed.");
  }
  return body;
}

function submittedLabel(value: string) {
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(value),
  );
}

export default function AdminVettingPanel() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [score, setScore] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    setError(null);
    const response = await fetch("/api/admin/overview", { cache: "no-store" });
    const data = (await readResponse(response)) as AdminOverview;
    setOverview(data);
  }, []);

  useEffect(() => {
    loadOverview().catch((loadError) => {
      setError(loadError instanceof Error ? loadError.message : "Unable to load the vetting queue.");
    });
  }, [loadOverview]);

  const queue = useMemo<QueueItem[]>(() => {
    if (!overview) return [];
    return [
      ...overview.accessRequests.map((request) => ({
        kind: "access" as const,
        id: `access:${request.id}`,
        request,
      })),
      ...overview.pendingFounders.map((user) => ({
        kind: "user" as const,
        id: `user:${user.id}`,
        user,
      })),
      ...overview.pendingInvestors.map((user) => ({
        kind: "user" as const,
        id: `user:${user.id}`,
        user,
      })),
    ];
  }, [overview]);

  useEffect(() => {
    if (queue.length === 0) {
      setSelectedKey(null);
      return;
    }
    if (!selectedKey || !queue.some((item) => item.id === selectedKey)) {
      setSelectedKey(queue[0].id);
    }
  }, [queue, selectedKey]);

  const selected = queue.find((item) => item.id === selectedKey) ?? null;

  useEffect(() => {
    const currentScore =
      selected?.kind === "user" ? selected.user.founderProfile?.monarchIndex : null;
    setScore(currentScore == null ? "" : String(currentScore));
  }, [selectedKey, selected]);

  const perform = async (
    actionKey: string,
    endpoint: string,
    body: Record<string, unknown>,
    successMessage: string,
  ) => {
    setBusy(actionKey);
    setError(null);
    setNotice(null);
    try {
      const result = await readResponse(
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
      );
      setNotice(result.inviteCode ? `${successMessage} Invite: ${result.inviteCode}` : successMessage);
      await loadOverview();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "The action failed.");
    } finally {
      setBusy(null);
    }
  };

  if (!overview && !error) {
    return (
      <MonarchCard className="flex min-h-72 items-center justify-center">
        <div className="text-[12px] uppercase tracking-widest4 text-grey-dim">Loading live review queue…</div>
      </MonarchCard>
    );
  }

  return (
    <div className="space-y-4">
      {error ? (
        <div className="border border-red-900/50 bg-red-950/20 px-4 py-3 text-[13px] text-red-300">{error}</div>
      ) : null}
      {notice ? (
        <div className="border border-green-800/40 bg-green-950/20 px-4 py-3 text-[13px] text-green-300">
          {notice}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        <MonarchCard>
          <div className="mb-1 text-[13px] uppercase tracking-widest4 text-grey-dim">Live queue</div>
          <div className="mb-5 text-[12px] text-grey-dim">
            {queue.length} item{queue.length === 1 ? "" : "s"} awaiting a decision
          </div>

          <div className="space-y-3">
            {queue.length === 0 ? (
              <div className="border border-white/10 p-5 text-[13px] text-grey">The review queue is clear.</div>
            ) : null}
            {queue.map((item) => {
              const isAccess = item.kind === "access";
              const name = isAccess ? item.request.name : item.user.name || item.user.email;
              const role = isAccess ? item.request.role : item.user.role;
              const createdAt = isAccess ? item.request.createdAt : item.user.createdAt;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedKey(item.id)}
                  className={`w-full border p-3 text-left transition-colors ${
                    selectedKey === item.id
                      ? "border-gold/50 bg-gold/[0.05]"
                      : "border-white/10 hover:border-gold/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="truncate text-[14px] text-white">{name}</div>
                    <MonarchBadge variant={isAccess ? "warning" : "gold"}>{role}</MonarchBadge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-widest4 text-grey-dim">
                    <span>{isAccess ? "Access request" : "Member review"}</span>
                    <span>{submittedLabel(createdAt)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </MonarchCard>

        <MonarchCard padding="lg" tone="dark2" className="space-y-6">
          {!selected ? (
            <div className="flex min-h-64 items-center justify-center text-[13px] text-grey-dim">
              Select a queue item to review it.
            </div>
          ) : selected.kind === "access" ? (
            <AccessRequestReview request={selected.request} busy={busy} perform={perform} />
          ) : (
            <PendingUserReview
              user={selected.user}
              busy={busy}
              score={score}
              setScore={setScore}
              perform={perform}
            />
          )}
        </MonarchCard>
      </div>
    </div>
  );
}

type Perform = (
  actionKey: string,
  endpoint: string,
  body: Record<string, unknown>,
  successMessage: string,
) => Promise<void>;

function AccessRequestReview({
  request,
  busy,
  perform,
}: {
  request: AccessRequest;
  busy: string | null;
  perform: Perform;
}) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[20px] text-white">{request.name}</div>
          <div className="text-[12px] uppercase tracking-widest4 text-grey-dim">Access application</div>
        </div>
        <MonarchBadge variant="warning">Pending</MonarchBadge>
      </div>

      <div className="grid grid-cols-1 gap-5 border-y border-white/10 py-6 md:grid-cols-2">
        <ReviewField label="Role" value={request.role} />
        <ReviewField label="Email" value={request.email} />
        <ReviewField label="Submitted" value={submittedLabel(request.createdAt)} />
        <div>
          <div className="mb-2 text-[11px] uppercase tracking-widest4 text-grey-dim">LinkedIn</div>
          <a
            className="break-all text-[14px] text-gold hover:text-gold-light"
            href={request.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            {request.linkedin}
          </a>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <MonarchButton
          loading={busy === "approve-access"}
          onClick={() =>
            perform(
              "approve-access",
              "/api/admin/access-requests/approve",
              { requestId: request.id },
              "Access approved.",
            )
          }
        >
          Approve & issue invite
        </MonarchButton>
        <MonarchButton
          variant="danger"
          loading={busy === "reject-access"}
          onClick={() =>
            perform(
              "reject-access",
              "/api/admin/access-requests/reject",
              { requestId: request.id },
              "Access request rejected.",
            )
          }
        >
          Reject
        </MonarchButton>
      </div>
    </>
  );
}

function PendingUserReview({
  user,
  busy,
  score,
  setScore,
  perform,
}: {
  user: PendingUser;
  busy: string | null;
  score: string;
  setScore: (value: string) => void;
  perform: Perform;
}) {
  const founder = user.founderProfile;
  const investor = user.investorProfile;
  const parsedScore = Number(score);

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[20px] text-white">{user.name || user.email}</div>
          <div className="text-[12px] uppercase tracking-widest4 text-grey-dim">{user.role} review</div>
        </div>
        <MonarchBadge variant="warning">{user.status}</MonarchBadge>
      </div>

      <div className="grid grid-cols-1 gap-5 border-y border-white/10 py-6 md:grid-cols-2">
        <ReviewField label="Email" value={user.email} />
        <ReviewField label="Submitted" value={submittedLabel(user.createdAt)} />
        {founder ? (
          <>
            <ReviewField label="Company" value={founder.companyName} />
            <ReviewField label="Stage" value={founder.stage} />
            <ReviewField label="Capital ask" value={`$${founder.capitalAsk.toLocaleString()}`} />
            <ReviewField
              label="Valuation"
              value={founder.valuation ? `$${founder.valuation.toLocaleString()}` : "Not provided"}
            />
          </>
        ) : null}
        {investor ? (
          <>
            <ReviewField label="Mandate" value={investor.investmentRange} />
            <ReviewField label="Region" value={investor.region} />
            <ReviewField label="Sectors" value={investor.sectors.join(", ") || "Open"} />
            <ReviewField label="Stages" value={investor.stages.join(", ") || "Open"} />
          </>
        ) : null}
      </div>

      {founder ? (
        <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_auto]">
          <MonarchInput
            label="Monarch Index override"
            type="number"
            min={0}
            max={100}
            value={score}
            onChange={(event) => setScore(event.target.value)}
            hint="Creates a versioned score-history record before the approval decision."
          />
          <MonarchButton
            variant="gold-outline"
            disabled={!Number.isFinite(parsedScore) || parsedScore < 0 || parsedScore > 100}
            loading={busy === "override-index"}
            onClick={() =>
              perform(
                "override-index",
                "/api/admin/override-index",
                { founderProfileId: founder.id, score: parsedScore },
                "Monarch Index updated.",
              )
            }
          >
            Save score
          </MonarchButton>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <MonarchButton
          loading={busy === "approve-user"}
          onClick={() =>
            perform(
              "approve-user",
              "/api/admin/users/approve",
              { userId: user.id },
              "Member approved and activated.",
            )
          }
        >
          Approve member
        </MonarchButton>
        <MonarchButton
          variant="danger"
          loading={busy === "reject-user"}
          onClick={() =>
            perform(
              "reject-user",
              "/api/admin/users/reject",
              { userId: user.id },
              "Member application rejected.",
            )
          }
        >
          Reject
        </MonarchButton>
      </div>
    </>
  );
}

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-2 text-[11px] uppercase tracking-widest4 text-grey-dim">{label}</div>
      <div className="text-[14px] text-grey-light">{value}</div>
    </div>
  );
}
