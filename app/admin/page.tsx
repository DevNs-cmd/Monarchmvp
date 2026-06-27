import Card from "@/components/ui/Card";

const stats = [
  { label: "Total founders", value: "128" },
  { label: "Total investors", value: "64" },
  { label: "Active deals", value: "22" },
  { label: "Revenue", value: "$4.2M" },
];

const queue = [
  { name: "Aurelia Systems", status: "Under Review", submitted: "2 days" },
  { name: "Nocturne Labs", status: "Shortlisted", submitted: "5 days" },
  { name: "Helios Grid", status: "Boardroom", submitted: "7 days" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">{stat.label}</p>
            <p className="font-display text-3xl text-foreground">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-secondary">Application queue</p>
          <h2 className="font-display text-2xl text-foreground">Verification pipeline</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="text-xs uppercase tracking-[0.3em] text-secondary">
              <tr>
                <th className="pb-3">Entity</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((item) => (
                <tr key={item.name} className="border-t border-border">
                  <td className="py-3">{item.name}</td>
                  <td className="py-3">{item.status}</td>
                  <td className="py-3">{item.submitted} ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
