import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "raised" | "dark" | "violet";
  hoverable?: boolean;
}

const variantStyles = {
  default: "bg-white border border-navy-100/80",
  raised: "bg-white border border-navy-100/80 shadow-sm",
  dark: "bg-white/[0.04] border border-white/[0.08]",
  violet: "bg-violet-50 border border-violet-200",
};

export function Card({
  children,
  variant = "default",
  hoverable = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-200",
        variantStyles[variant],
        hoverable && "hover:shadow-md hover:-translate-y-1 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Compound sub-components
Card.Header = function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("p-6 pb-0", className)}>{children}</div>;
};

Card.Body = function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("p-6", className)}>{children}</div>;
};
