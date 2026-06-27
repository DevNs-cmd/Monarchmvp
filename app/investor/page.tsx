import FadeIn from "@/components/ui/FadeIn";
import MIGPanel from "@/components/monarch/MIGPanel";
import BoardroomCard from "@/components/monarch/BoardroomCard";

export default function InvestorDashboard() {
  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="grid gap-6 md:grid-cols-2">
          <MIGPanel name="Aurelia Systems" score={82} risk="Moderate" horizon="18 months" />
          <MIGPanel name="Nocturne Labs" score={76} risk="Measured" horizon="12 months" />
        </div>
      </FadeIn>
      <FadeIn delay={0.2}>
        <div className="grid gap-6 md:grid-cols-2">
          <BoardroomCard
            name="Helios Grid"
            sector="Energy"
            stage="Series B"
            ask="$32M"
            range="79-90"
          />
          <BoardroomCard
            name="Sable Health"
            sector="Health"
            stage="Series A"
            ask="$16M"
            range="71-83"
          />
        </div>
      </FadeIn>
    </div>
  );
}
