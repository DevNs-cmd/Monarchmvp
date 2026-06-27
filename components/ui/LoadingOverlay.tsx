type Props = {
  show: boolean;
};

export default function LoadingOverlay({ show }: Props) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-500">
      <div className="text-gold font-serif text-3xl animate-pulse">M</div>
    </div>
  );
}
