import clsx from "clsx";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  tone?: "dark1" | "dark2";
  padding?: "md" | "lg";
  hover?: boolean;
  goldAccentTop?: boolean;
  className?: string;
}>;

export default function MonarchCard({
  tone = "dark1",
  padding = "md",
  hover,
  goldAccentTop,
  className,
  children,
}: Props) {
  return (
    <div
      className={clsx(
        "relative border border-white/10 transition-colors duration-400",
        tone === "dark1" ? "bg-dark-1" : "bg-dark-2",
        padding === "md" ? "p-6" : "p-10",
        hover && "hover:border-gold/20",
        className,
      )}
    >
      {goldAccentTop ? (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      ) : null}
      {children}
    </div>
  );
}
