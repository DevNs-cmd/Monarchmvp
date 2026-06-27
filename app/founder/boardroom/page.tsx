import BoardroomCard from "@/components/monarch/BoardroomCard";

export default function FounderBoardroomPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <BoardroomCard
        name="Vector Capital"
        sector="Growth"
        stage="Boardroom"
        ask="$24M"
        range="75-88"
      />
      <BoardroomCard
        name="Orion Ledger"
        sector="Infra"
        stage="Boardroom"
        ask="$12M"
        range="70-82"
      />
    </div>
  );
}
