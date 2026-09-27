import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const alertVariants = cva(
  "relative w-full rounded-xl border p-4 text-sm flex items-start gap-3 transition-all",
  {
    variants: {
      variant: {
        info: "bg-blue-50 border-blue-200 text-blue-900",
        success: "bg-emerald-50 border-emerald-200 text-emerald-900",
        warning: "bg-amber-50 border-amber-200 text-amber-900",
        error: "bg-red-50 border-red-200 text-red-900",
        dark: "bg-[#18181D] border-[#2A2A32] text-neutral-200",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  dark: Info,
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  onClose?: () => void;
}

export function Alert({
  className,
  variant = "info",
  title,
  children,
  onClose,
  ...props
}: AlertProps) {
  const Icon = icons[variant || "info"];

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <h5 className="font-bold leading-tight mb-1">{title}</h5>}
        <div className="text-xs sm:text-sm leading-relaxed opacity-90">
          {children}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current opacity-70 hover:opacity-100 p-0.5"
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
