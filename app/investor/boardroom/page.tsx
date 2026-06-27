import BoardroomCard from "@/components/monarch/BoardroomCard";

export default function InvestorBoardroomPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <BoardroomCard
        name="Verdant Motion"
        sector="Mobility"
        stage="Series A"
        ask="$14M"
        range="74-86"
      />
      <BoardroomCard
        name="Orion Ledger"
        sector="Infra"
        stage="Series B"
        ask="$28M"
        range="80-92"
      />
    </div>
  );
}
