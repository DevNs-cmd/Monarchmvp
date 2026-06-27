import clsx from "clsx";

export default function MonarchIndexGauge({ score, size = 160 }: { score: number; size?: number }) {
  const normalized = Math.min(100, Math.max(0, score));
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1A1A1A"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#C9A24D"
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-display text-foreground">{normalized}</p>
          <p className={clsx("text-[11px] uppercase tracking-[0.3em] text-secondary")}>MIG</p>
        </div>
      </div>
      <div className="text-xs uppercase tracking-[0.3em] text-secondary">Monarch Index</div>
    </div>
  );
}
