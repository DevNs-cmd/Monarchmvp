import clsx from "clsx";

type Status =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "SHORTLISTED"
  | "BOARDROOM"
  | "IN_DISCUSSION"
  | "FUNDED";

type Props = {
  currentStatus: Status;
  timestamps?: Record<string, string>;
};

const steps: Status[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "BOARDROOM",
  "IN_DISCUSSION",
  "FUNDED",
];

export default function StatusTimeline({ currentStatus, timestamps = {} }: Props) {
  const currentIndex = steps.indexOf(currentStatus);

  return (
    <div className="w-full">
      <div className="hidden md:flex items-center gap-6">
        {steps.map((step, index) => {
          const complete = index < currentIndex;
          const active = index === currentIndex;
          return (
            <div key={step} className="flex-1 flex items-center">
              <div className="flex flex-col items-center w-full">
                <div
                  className={clsx(
                    "h-3 w-3 rounded-full",
                    complete && "bg-gold shadow-[0_0_12px_rgba(201,162,77,0.6)]",
                    active && "bg-gold",
                    !complete && !active && "bg-grey-dim",
                  )}
                />
                <div className="mt-3 text-[11px] uppercase tracking-widest4 text-center text-grey-light">
                  {labelFor(step)}
                </div>
                {timestamps[step] ? (
                  <div className="mt-1 text-[11px] text-grey-dim">{timestamps[step]}</div>
                ) : null}
              </div>
              {index < steps.length - 1 ? (
                <div
                  className={clsx(
                    "flex-1 h-px mx-4",
                    complete || active ? "bg-gold" : "bg-grey-dim",
                    complete && "shadow-[0_0_10px_rgba(201,162,77,0.3)]",
                  )}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Mobile vertical */}
      <div className="md:hidden space-y-6">
        {steps.map((step, index) => {
          const complete = index < currentIndex;
          const active = index === currentIndex;
          return (
            <div key={step} className="flex gap-4">
              <div
                className={clsx(
                  "h-3 w-3 rounded-full mt-1",
                  complete && "bg-gold shadow-[0_0_12px_rgba(201,162,77,0.6)]",
                  active && "bg-gold",
                  !complete && !active && "bg-grey-dim",
                )}
              />
              <div>
                <div className="text-[11px] uppercase tracking-widest4 text-grey-light">
                  {labelFor(step)}
                </div>
                {timestamps[step] ? (
                  <div className="text-[11px] text-grey-dim">{timestamps[step]}</div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function labelFor(status: Status) {
  switch (status) {
    case "SUBMITTED":
      return "Submitted";
    case "UNDER_REVIEW":
      return "Under Review";
    case "SHORTLISTED":
      return "Shortlisted";
    case "BOARDROOM":
      return "Boardroom";
    case "IN_DISCUSSION":
      return "In Discussion";
    case "FUNDED":
      return "Funded";
    default:
      return status;
  }
}
