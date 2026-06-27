import Badge from "@/components/ui/Badge";

const steps = [
  "Submitted",
  "Under Review",
  "Shortlisted",
  "Boardroom",
  "Funded",
];

export default function StatusTimeline({ active = 2 }: { active?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {steps.map((step, index) => (
          <Badge key={step} tone={index <= active ? "gold" : "muted"}>
            {step}
          </Badge>
        ))}
      </div>
      <p className="text-sm text-secondary">
        Current position: <span className="text-foreground">{steps[active]}</span>
      </p>
    </div>
  );
}
