import Card from "@/components/ui/Card";

const watchlist = [
  "Aurelia Systems",
  "Sable Health",
  "Nocturne Labs",
  "Helios Grid",
];

export default function InvestorWatchlistPage() {
  return (
    <Card className="space-y-4">
      <h2 className="font-display text-2xl text-foreground">Watchlist</h2>
      <ul className="space-y-3 text-sm text-foreground">
        {watchlist.map((item) => (
          <li key={item} className="flex items-center justify-between border-b border-border pb-3 last:border-b-0">
            <span>{item}</span>
            <span className="text-xs uppercase tracking-[0.3em] text-secondary">Monitoring</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
