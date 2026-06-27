import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function MIGPanel({
  name,
  score,
  risk,
  horizon,
}: {
  name: string;
  score: number;
  risk: string;
  horizon: string;
}) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-secondary">MIG Panel</p>
          <h3 className="font-display text-2xl text-foreground">{name}</h3>
        </div>
        <Badge tone="gold">{score}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm text-secondary">
        <div>
          <p className="text-xs uppercase tracking-[0.3em]">Risk</p>
          <p className="text-foreground">{risk}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em]">Horizon</p>
          <p className="text-foreground">{horizon}</p>
        </div>
      </div>
    </Card>
  );
}
