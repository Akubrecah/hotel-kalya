import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-amber text-brand-maroon-dark hover:bg-brand-amber-dark font-bold shadow-sm hover:shadow-md",
        maroon:
          "bg-brand-maroon text-white hover:bg-brand-maroon-dark font-bold shadow-sm hover:shadow-md",
        secondary:
          "bg-brand-cream border border-brand-maroon/20 text-brand-maroon hover:bg-brand-maroon hover:text-white font-semibold",
        outline:
          "border border-brand-maroon/30 text-brand-maroon hover:bg-brand-cream font-semibold",
        ghost:
          "text-brand-dark/80 hover:text-brand-maroon hover:bg-brand-cream font-semibold",
        dark:
          "bg-neutral-900 text-white border border-neutral-800 hover:bg-neutral-800 font-semibold shadow-sm",
        gold:
          "bg-brand-amber text-brand-maroon-dark hover:bg-brand-amber-dark font-extrabold shadow-md",
        success:
          "bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-sm",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-lg",
        md: "h-10 px-4 py-2 text-sm rounded-xl",
        lg: "h-12 px-6 py-3 text-base rounded-xl",
        icon: "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
