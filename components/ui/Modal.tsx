import clsx from "clsx";
import type { ReactNode } from "react";

export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className={clsx("w-full max-w-lg rounded-xl border border-border bg-card p-6")}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-6">
          {title ? (
            <h3 className="font-display text-2xl text-foreground">{title}</h3>
          ) : null}
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-[0.3em] text-secondary hover:text-foreground"
          >
            Close
          </button>
        </div>
        <div className="mt-6 text-sm text-secondary">{children}</div>
      </div>
    </div>
  );
}
