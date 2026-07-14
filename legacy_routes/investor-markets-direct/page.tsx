import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const markets = [
  { name: "Growth Capital", trend: "Stable" },
  { name: "AI Infrastructure", trend: "Rising" },
  { name: "Climate Tech", trend: "Measured" },
];

export default function InvestorMarketsPage() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {markets.map((market) => (
        <Card key={market.name} className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-secondary">Market signal</p>
          <h3 className="font-display text-2xl text-foreground">{market.name}</h3>
          <Badge tone="gold">{market.trend}</Badge>
        </Card>
      ))}
    </div>
  );
}
