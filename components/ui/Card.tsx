import clsx from "clsx";
import type { HTMLAttributes } from "react";

export default function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "bg-card border border-border rounded-xl p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
        className
      )}
      {...props}
    />
  );
}
