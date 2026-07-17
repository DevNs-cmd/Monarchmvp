"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, FileSignature, ReceiptText } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type Payment = { id: string; createdAt: string; type: string; amount: number; currency: string; status: string; receiptUrl: string | null };
type Agreement = { type: string; title: string; version: string; summary: string; terms: string[]; status: string; signerName: string | null; acceptedAt: string | null };

const products = [
  { type: "BOARDROOM_ACCESS", title: "Boardroom access", detail: "Curated investor distribution and governed introductions.", price: "$1,200" },
  { type: "CUSTOM_REPORT", title: "Custom intelligence brief", detail: "Analyst-reviewed sector and competitive intelligence.", price: "$450" },
  { type: "SCREENING_FEE", title: "Dossier re-screening", detail: "Material update review and score-version audit.", price: "$499" },
];

export default function FounderPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [signerName, setSignerName] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const [paymentResponse, agreementResponse] = await Promise.all([fetch("/api/payments", { cache: "no-store" }), fetch("/api/agreements", { cache: "no-store" })]);
    const paymentData = await paymentResponse.json();
    const agreementData = await agreementResponse.json();
    if (!paymentResponse.ok || !agreementResponse.ok) throw new Error(paymentData.error || agreementData.error || "Unable to load commercial records");
    setPayments(paymentData.items || []);
    setAgreements(agreementData.items || []);
  }, []);

  useEffect(() => { load().catch((reason) => setMessage(reason instanceof Error ? reason.message : "Unable to load records")); }, [load]);

  const purchase = async (type: string) => {
    setBusy(type);
    setMessage("");
    try {
      const response = await fetch("/api/stripe/create-checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to begin checkout");
      if (data.url) window.location.assign(data.url);
      else { setMessage("Demo payment recorded successfully."); await load(); }
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Unable to begin checkout"); }
    finally { setBusy(null); }
  };

  const sign = async (type: string) => {
    setBusy(type);
    setMessage("");
    try {
      const response = await fetch("/api/agreements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, signerName, accepted: true }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to accept agreement");
      setMessage("Electronic acceptance recorded with version, timestamp, IP evidence, and content hash.");
      await load();
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Unable to accept agreement"); }
    finally { setBusy(null); }
  };

  return (
    <div className="space-y-8">
      <div><p className="text-xs uppercase tracking-[0.3em] text-secondary">Commercial workspace</p><h2 className="mt-2 font-display text-3xl text-foreground">Payments & agreements</h2></div>
      {message ? <div className="border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">{message}</div> : null}

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="mb-5 flex items-center gap-3"><ReceiptText className="text-accent" size={19} /><h3 className="font-display text-2xl">Payment ledger</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="text-[10px] uppercase tracking-[0.25em] text-secondary"><tr><th className="pb-3">Date</th><th className="pb-3">Description</th><th className="pb-3">Amount</th><th className="pb-3">Status</th></tr></thead>
              <tbody>{payments.map((payment) => <tr key={payment.id} className="border-t border-border"><td className="py-4 text-secondary">{new Date(payment.createdAt).toLocaleDateString()}</td><td className="py-4">{payment.type.replaceAll("_", " ")}</td><td className="py-4">${payment.amount.toLocaleString()} {payment.currency}</td><td className="py-4"><Badge tone={payment.status.toUpperCase() === "SUCCEEDED" ? "gold" : "muted"}>{payment.status}</Badge></td></tr>)}</tbody>
            </table>
          </div>
        </Card>

        <Card>
          <div className="mb-5 flex items-center gap-3"><FileSignature className="text-accent" size={19} /><h3 className="font-display text-2xl">Electronic agreements</h3></div>
          <div className="space-y-4">
            {agreements.map((agreement) => (
              <div key={agreement.type} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
                <div className="flex items-start justify-between gap-4"><div><p className="text-sm text-foreground">{agreement.title}</p><p className="mt-1 text-xs leading-5 text-secondary">{agreement.summary}</p></div><Badge tone={agreement.status === "ACCEPTED" ? "gold" : "muted"}>{agreement.status}</Badge></div>
                {agreement.status === "ACCEPTED" ? <p className="mt-3 flex items-center gap-2 text-xs text-secondary"><CheckCircle2 size={14} className="text-accent" /> {agreement.signerName} · {agreement.acceptedAt ? new Date(agreement.acceptedAt).toLocaleDateString() : "Accepted"} · v{agreement.version}</p> : (
                  <div className="mt-4 space-y-3"><ul className="space-y-1 text-xs text-secondary">{agreement.terms.map((term) => <li key={term}>· {term}</li>)}</ul><Input placeholder="Type legal name" value={signerName} onChange={(event) => setSignerName(event.target.value)} /><Button disabled={!signerName.trim() || busy === agreement.type} onClick={() => sign(agreement.type)}>{busy === agreement.type ? "Recording" : "Accept and sign"}</Button></div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <h3 className="mb-4 text-xs uppercase tracking-[0.3em] text-secondary">Advisory and access services</h3>
        <div className="grid gap-4 md:grid-cols-3">{products.map((product) => <Card key={product.type} className="flex flex-col"><div className="flex items-start justify-between gap-3"><p className="text-base text-foreground">{product.title}</p><p className="text-accent">{product.price}</p></div><p className="mt-3 flex-1 text-sm leading-6 text-secondary">{product.detail}</p><Button className="mt-5" variant="secondary" disabled={busy === product.type} onClick={() => purchase(product.type)}>{busy === product.type ? "Processing" : "Request service"}</Button></Card>)}</div>
      </section>
    </div>
  );
}
