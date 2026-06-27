import Card from "@/components/ui/Card";
import StatusTimeline from "@/components/monarch/StatusTimeline";

export default function FounderDossierPage() {
  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h2 className="font-display text-3xl text-foreground">Founder Dossier</h2>
        <p className="text-sm text-secondary">
          Capital structure, governance, and diligence checkpoints are consolidated here.
        </p>
      </Card>
      <Card>
        <StatusTimeline />
      </Card>
    </div>
  );
}
