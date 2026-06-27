import { useMemo } from "react";
import { motion } from "framer-motion";

type Size = "sm" | "md" | "lg";

type Props = {
  score: number;
  label?: string;
  size?: Size;
  invertedForInvestor?: boolean;
};

export default function MonarchGauge({ score, label, size = "md", invertedForInvestor }: Props) {
  const normalized = Math.max(0, Math.min(100, score));
  const { dimension, stroke } = useMemo(() => {
    switch (size) {
      case "sm":
        return { dimension: 120, stroke: 8 };
      case "lg":
        return { dimension: 220, stroke: 12 };
      default:
        return { dimension: 160, stroke: 10 };
    }
  }, [size]);

  const radius = (dimension - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - normalized / 100);

  const band =
    normalized < 40 ? "Developing" : normalized < 65 ? "Selective" : "Strong";

  return (
    <div className="inline-flex flex-col items-center gap-3">
      <svg width={dimension} height={dimension} className="-rotate-90">
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke="#C9A24D"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="text-center -mt-[calc(0.5*var(--gauge-overlap,16px))]">
        <div className="text-[28px] font-serif font-light leading-none">
          {invertedForInvestor ? band : Math.round(normalized)}
        </div>
        {label ? <div className="text-[12px] text-grey uppercase tracking-widest4 mt-1">{label}</div> : null}
        {invertedForInvestor ? (
          <div className="text-[11px] text-grey-dim uppercase tracking-widest4">
            Monarch Signal
          </div>
        ) : null}
      </div>
    </div>
  );
}
