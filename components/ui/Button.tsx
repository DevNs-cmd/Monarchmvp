import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

const base = "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-300";

const variants: Record<string, string> = {
  primary: "bg-accent text-black hover:opacity-90",
  secondary: "border border-accent text-accent hover:bg-accent/10",
  ghost: "border border-border text-foreground hover:border-accent/60",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export default function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button className={clsx(base, variants[variant], className)} {...props} />
  );
}
