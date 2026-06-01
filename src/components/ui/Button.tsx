import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark" | "cta" | "cta-outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-violet-500 text-white hover:bg-violet-600 hover:-translate-y-px shadow-violet",
  secondary: "bg-white text-navy-800 border border-navy-200 hover:border-violet-500 hover:text-violet-500",
  ghost: "bg-transparent text-navy-500 hover:bg-violet-50 hover:text-violet-500",
  dark: "bg-navy-800 text-white hover:bg-navy-900 hover:-translate-y-px",
  cta: "bg-white text-navy-900 font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(255,255,255,0.25)]",
  "cta-outline": "bg-transparent text-white border border-white/30 font-medium hover:border-white/70 hover:bg-white/10",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3.5 text-[13px] rounded-md",
  md: "h-10 px-5 text-sm rounded-lg",
  lg: "h-[52px] px-9 text-base rounded-2xl",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-150 cursor-pointer whitespace-nowrap",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
