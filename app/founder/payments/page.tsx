"use client";

import MonarchTable from "@/components/ui/MonarchTable";
import MonarchCard from "@/components/ui/MonarchCard";
import MonarchBadge from "@/components/ui/MonarchBadge";
import MonarchButton from "@/components/ui/MonarchButton";

const paymentRows = [
  { date: "Mar 02, 2026", description: "Screening Fee", amount: "$499", status: "Succeeded", receipt: "Download" },
  { date: "Mar 10, 2026", description: "Boardroom Access", amount: "$1,200", status: "Pending", receipt: "Pending" },
];

const services = [
  { title: "Boardroom Prep", description: "Executive-led prep for Boardroom sessions.", price: "$750" },
  { title: "Metrics Review", description: "Analyst review of traction metrics.", price: "$520" },
  { title: "Term Sheet Coaching", description: "Scenario walk-throughs and negotiation framing.", price: "$680" },
  { title: "Market Pulse", description: "Custom Monarch Markets™ snapshot for your sector.", price: "$450" },
];

export default function FounderPaymentsPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-10 space-y-10">
      <div className="text-[22px] font-serif text-gold">Payments</div>

      <section className="space-y-4">
        <h3 className="text-[13px] uppercase tracking-widest4 text-grey-dim">Payment History</h3>
        <MonarchTable
          columns={[
            { key: "date", header: "Date" },
            { key: "description", header: "Description" },
            { key: "amount", header: "Amount" },
            {
              key: "status",
              header: "Status",
              render: (row) => (
                <MonarchBadge variant={row.status === "Succeeded" ? "success" : "warning"}>{row.status}</MonarchBadge>
              ),
            },
            {
              key: "receipt",
              header: "Receipt",
              render: (row) =>
                row.receipt === "Download" ? (
                  <a className="text-gold hover:text-gold-light" href="#">
                    Download
                  </a>
                ) : (
                  <span className="text-grey">{row.receipt}</span>
                ),
            },
          ]}
          rows={paymentRows}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-[13px] uppercase tracking-widest4 text-grey-dim">Advisory Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc) => (
            <MonarchCard key={svc.title} hover>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="text-[15px] text-white">{svc.title}</div>
                  <p className="text-[14px] text-grey">{svc.description}</p>
                </div>
                <div className="text-gold font-medium">{svc.price}</div>
              </div>
              <MonarchButton className="mt-4" variant="ghost" size="sm">
                Request
              </MonarchButton>
            </MonarchCard>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-[13px] uppercase tracking-widest4 text-grey-dim">Agreements</h3>
        <div className="space-y-3">
          {[
            { title: "Success Fee Agreement", status: "Signed" },
            { title: "Advisory Equity Acknowledgment", status: "Pending" },
          ].map((agreement) => (
            <MonarchCard key={agreement.title} tone="dark2" className="flex items-center justify-between">
              <div className="text-[14px] text-white">{agreement.title}</div>
              <MonarchBadge variant={agreement.status === "Signed" ? "success" : "warning"}>{agreement.status}</MonarchBadge>
            </MonarchCard>
          ))}
        </div>
      </section>
    </div>
  );
}
