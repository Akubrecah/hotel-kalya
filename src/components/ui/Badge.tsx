import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full transition-colors select-none",
  {
    variants: {
      variant: {
        default: "bg-brand-amber-light text-brand-maroon border border-brand-amber/30",
        maroon: "bg-brand-maroon text-brand-amber-light",
        amber: "bg-brand-amber text-brand-maroon-dark",
        sage: "bg-emerald-50 text-emerald-800 border border-emerald-200",
        dark: "bg-neutral-900 text-neutral-200 border border-neutral-700",
        blackGold: "bg-black text-brand-amber border border-brand-amber/40 shadow-sm",
        success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
        warning: "bg-amber-100 text-amber-900 border border-amber-300",
        error: "bg-red-100 text-red-800 border border-red-200",
        outline: "border border-current text-brand-maroon bg-transparent",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5",
        md: "text-xs px-2.5 py-1",
        lg: "text-xs px-3.5 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}
