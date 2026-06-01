import { cn } from "@/lib/utils";

type ColorVariant = "violet" | "teal" | "navy" | "amber";

interface MetricBarProps {
  label: string;
  value: number; // 0–100
  displayValue?: string;
  color?: ColorVariant;
  className?: string;
}

const colorStyles: Record<ColorVariant, string> = {
  violet: "from-violet-400 to-violet-500",
  teal: "from-teal-400 to-teal-500",
  navy: "from-navy-400 to-navy-500",
  amber: "from-amber-400 to-amber-500",
};

export function MetricBar({
  label,
  value,
  displayValue,
  color = "violet",
  className,
}: MetricBarProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-[13px] text-navy-500 w-[130px] flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-cream-200 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-700",
            colorStyles[color]
          )}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <span className="text-[13px] font-semibold text-navy-800 min-w-[32px] text-right">
        {displayValue ?? value}
      </span>
    </div>
  );
}
