import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function FounderSettingsPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="space-y-4">
        <h2 className="font-display text-2xl text-foreground">Profile Control</h2>
        <Input placeholder="Legal entity" />
        <Input placeholder="Primary contact" />
        <Button>Update Profile</Button>
      </Card>
      <Card className="space-y-4">
        <h2 className="font-display text-2xl text-foreground">Security</h2>
        <p className="text-sm text-secondary">
          Rotate credentials and update authorized signatories.
        </p>
        <Button variant="secondary">Rotate Keys</Button>
      </Card>
    </div>
  );
}
