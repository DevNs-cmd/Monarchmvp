import FadeIn from "@/components/ui/FadeIn";
import Card from "@/components/ui/Card";
import StatusTimeline from "@/components/monarch/StatusTimeline";
import MonarchIndexGauge from "@/components/monarch/MonarchIndexGauge";
import BoardroomCard from "@/components/monarch/BoardroomCard";

export default function FounderDashboard() {
  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-secondary">Application Status</p>
              <h2 className="font-display text-3xl text-foreground">Founder Trajectory</h2>
            </div>
            <StatusTimeline />
          </Card>
          <Card className="flex items-center justify-center">
            <MonarchIndexGauge score={78} />
          </Card>
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">Next actions</p>
            <p className="text-lg text-foreground">Submit updated cap table.</p>
          </Card>
          <Card className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">Messages</p>
            <p className="text-lg text-foreground">2 boardroom notes pending.</p>
          </Card>
          <Card className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">Certification</p>
            <p className="text-lg text-foreground">KYC verified, data room sealed.</p>
          </Card>
        </div>
      </FadeIn>

      <FadeIn delay={0.25}>
        <div className="grid gap-6 md:grid-cols-2">
          <BoardroomCard
            name="Aurelia Systems"
            sector="Fintech"
            stage="Series A"
            ask="$18M"
            range="72-84"
          />
          <BoardroomCard
            name="Nocturne Labs"
            sector="Deep Tech"
            stage="Seed"
            ask="$6M"
            range="68-76"
          />
        </div>
      </FadeIn>
    </div>
  );
}
