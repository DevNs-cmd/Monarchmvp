import clsx from "clsx";
import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "gold" | "muted";
};

export default function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em]",
        tone === "gold" && "bg-accent/15 text-accent border border-accent/40",
        tone === "muted" && "bg-white/5 text-secondary border border-border",
        tone === "neutral" && "bg-white/5 text-foreground border border-border",
        className
      )}
      {...props}
    />
  );
}
