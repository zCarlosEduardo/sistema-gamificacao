import { cn } from "@/lib/cn";

interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const heights = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function Progress({ value, max = 100, size = "md", showLabel, className }: ProgressProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-(--color-text-muted)">{value}/{max}</span>
          <span className="text-xs font-medium">{percentage}%</span>
        </div>
      )}
      <div className={cn("w-full rounded-full bg-(--color-bg-subtle) border border-(--color-border)", heights[size])}>
        <div
          className={cn("rounded-full bg-(--color-primary) transition-all duration-500", heights[size])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}