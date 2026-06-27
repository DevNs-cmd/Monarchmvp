type Props = {
  className?: string;
};

export default function GoldDivider({ className }: Props) {
  return (
    <div className={`h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent ${className ?? ""}`} />
  );
}
