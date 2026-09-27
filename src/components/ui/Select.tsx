import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  dark?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, dark, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "flex h-11 w-full appearance-none rounded-xl border px-3.5 py-2 pr-9 text-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
            dark
              ? "bg-[#18181D] border-[#2A2A32] text-white focus-visible:ring-brand-amber focus:border-brand-amber"
              : "bg-white border-gray-300 text-brand-dark focus-visible:ring-brand-amber focus:border-brand-amber",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-3 top-3.5 h-4 w-4",
            dark ? "text-neutral-400" : "text-gray-500"
          )}
        />
      </div>
    );
  }
);
Select.displayName = "Select";
