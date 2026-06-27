import clsx from "clsx";
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-secondary focus:border-accent/70 focus:outline-none transition",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";

export default Input;
