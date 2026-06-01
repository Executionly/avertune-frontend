import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant = "violet" | "teal" | "navy" | "green" | "amber";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  violet: "bg-violet-50 text-violet-600 border border-violet-200",
  teal: "bg-teal-50 text-teal-600 border border-teal-200",
  navy: "bg-navy-50 text-navy-600 border border-navy-200",
  green: "bg-green-50 text-green-700 border border-green-200",
  amber: "bg-amber-50 text-amber-800 border border-amber-200",
};

export function Badge({ children, variant = "violet", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
