import { cn } from "@/lib/cn";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-3xl",
};

export function Logo({ className, size = "md" }: LogoProps) {
  return (
    <span
      className={cn(
        "font-[family-name:var(--font-geist)] font-bold text-[var(--color-text)]",
        sizes[size],
        className,
      )}
    >
      Await
    </span>
  );
}