import { ImageIcon } from "lucide-react";

export default function PhotoPlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 border border-gold/20 bg-maroon-dark text-warm-grey ${className}`}
    >
      <ImageIcon size={28} className="text-gold/40" />
      <p className="text-[10px] tracking-[0.2em]">{label}</p>
    </div>
  );
}
