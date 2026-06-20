import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-(--color-text)">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            "w-full px-3 py-2 rounded-lg text-sm bg-(--color-bg-subtle) border border-(--color-border) text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-all appearance-none",
            error && "border-red-500 focus:ring-red-500",
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" className="text-(--color-text-muted)">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);
Select.displayName = "Select";