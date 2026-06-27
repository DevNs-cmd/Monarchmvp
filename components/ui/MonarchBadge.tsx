import clsx from "clsx";
import { PropsWithChildren } from "react";

type Variant = "gold" | "grey" | "success" | "warning" | "danger";

type Props = PropsWithChildren<{
  variant?: Variant;
  className?: string;
}>;

export default function MonarchBadge({ variant = "gold", className, children }: Props) {
  const variants: Record<Variant, string> = {
    gold: "border border-gold/40 text-gold bg-gold/5",
    grey: "border border-grey-dim/40 text-grey bg-white/[0.03]",
    success: "border border-green-800/40 text-green-400 bg-green-900/10",
    warning: "border border-amber-800/40 text-amber-400 bg-amber-900/10",
    danger: "border border-red-800/40 text-red-400 bg-red-900/10",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center px-3 py-1 text-[10px] uppercase tracking-widest4 rounded-none",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
