import Card from "@/components/ui/Card";

export default function AdminMembersPage() {
  return (
    <Card className="space-y-4">
      <h2 className="font-display text-2xl text-foreground">Members</h2>
      <p className="text-sm text-secondary">
        Manage founder, investor, and admin access tiers.
      </p>
    </Card>
  );
}
