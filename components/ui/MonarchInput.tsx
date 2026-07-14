import clsx from "clsx";
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseProps = {
  label?: string;
  hint?: string;
  error?: string;
  fullBorder?: boolean;
};

type InputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    as?: "input";
  };

type TextAreaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: "textarea";
  };

type Props = InputProps | TextAreaProps;

export default function MonarchInput(props: Props) {
  const { label, hint, error, fullBorder, className, as = "input", ...rest } = props;

  const shared =
    "w-full bg-transparent text-white text-[15px] font-light placeholder:text-grey-dim/40 transition-colors duration-400 focus:outline-none";

  const border = fullBorder
    ? "border border-grey-dim focus:border-gold px-3 py-3 rounded-none"
    : "border-b border-grey-dim focus:border-gold pb-3";

  return (
    <div className="space-y-2">
      {label ? (
        <label className="block text-[11px] uppercase tracking-widest4 text-grey-dim">{label}</label>
      ) : null}
      {as === "textarea" ? (
        <textarea
          className={clsx(shared, border, "resize-none", className)}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={clsx(shared, border, className)}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {hint && !error ? <p className="text-[12px] text-grey-dim">{hint}</p> : null}
      {error ? <p className="text-[12px] text-red-400">{error}</p> : null}
    </div>
  );
}
