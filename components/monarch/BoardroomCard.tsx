import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function BoardroomCard({
  name,
  sector,
  stage,
  ask,
  range,
}: {
  name: string;
  sector: string;
  stage: string;
  ask: string;
  range: string;
}) {
  return (
    <Card className="group space-y-4 transition-all duration-500 hover:border-accent/60">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.3em] text-secondary">{sector}</p>
        <h3 className="font-display text-2xl text-foreground">{name}</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 text-xs uppercase tracking-[0.2em] text-secondary">
        <div>
          <p>Stage</p>
          <p className="text-foreground text-sm tracking-normal">{stage}</p>
        </div>
        <div>
          <p>Capital ask</p>
          <p className="text-foreground text-sm tracking-normal">{ask}</p>
        </div>
        <div>
          <p>Monarch index</p>
          <p className="text-foreground text-sm tracking-normal">{range}</p>
        </div>
      </div>
      <Button variant="secondary" className="w-full">View Dossier</Button>
    </Card>
  );
}
