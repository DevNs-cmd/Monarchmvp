import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "danger" | "gold-outline";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

export default function MonarchButton({
  variant = "primary",
  size = "md",
  fullWidth,
  loading,
  iconLeft,
  iconRight,
  className,
  children,
  disabled,
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center uppercase tracking-widest4 text-[11px] font-medium transition-all duration-400 select-none rounded-none focus:outline-none focus-visible:ring-1 focus-visible:ring-gold/60";

  const variants: Record<Variant, string> = {
    primary: "bg-gold text-black hover:bg-gold-light border border-gold/60",
    ghost: "border border-grey-dim text-grey-light hover:border-gold-dim hover:text-gold",
    danger: "border border-red-900/50 text-red-400 hover:border-red-500",
    "gold-outline": "border border-gold/40 text-gold hover:bg-gold hover:text-black",
  };

  const sizes: Record<Size, string> = {
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-8 py-4",
  };

  return (
    <button
      className={clsx(
        base,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        (disabled || loading) && "opacity-60 cursor-not-allowed",
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="relative flex h-4 w-4 items-center justify-center">
          <span className="absolute h-4 w-4 rounded-full border border-gold/40 animate-spin" style={{ animationDuration: "1.2s" }} />
          <span className="absolute h-2 w-2 rounded-full bg-gold" />
        </span>
      ) : (
        <>
          {iconLeft ? <span className="mr-2">{iconLeft}</span> : null}
          {children}
          {iconRight ? <span className="ml-2">{iconRight}</span> : null}
        </>
      )}
    </button>
  );
}
