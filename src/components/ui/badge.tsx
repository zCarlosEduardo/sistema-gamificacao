import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

const variants = {
  default:
    "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] border border-[var(--color-border)]",
  success: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
  danger: "bg-red-500/10 text-red-500 border border-red-500/20",
  primary:
    "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
