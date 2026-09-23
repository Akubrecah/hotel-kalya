"use client";

import React from "react";
import { Navigation, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface DirectionsButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  mode?: "driving" | "transit" | "walking";
  children?: React.ReactNode;
}

export function DirectionsButton({
  className,
  variant = "primary",
  size = "md",
  mode = "driving",
  children,
}: DirectionsButtonProps) {
  // Official Google Maps Directions URL API
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    "Hotel Kalya, Kapenguria, West Pokot County, Kenya"
  )}&travelmode=${mode}`;

  const baseStyles =
    "inline-flex items-center justify-center font-bold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber active:scale-95 shadow-sm";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-xs uppercase tracking-wider gap-2",
    lg: "px-6 py-3.5 text-sm uppercase tracking-wider gap-2.5 shadow-md",
  };

  const variantStyles = {
    primary: "bg-brand-maroon text-white hover:bg-brand-maroon-dark hover:shadow-md",
    secondary: "bg-brand-amber text-brand-maroon hover:bg-brand-amber-dark hover:shadow-md",
    outline: "bg-white text-brand-maroon border border-brand-maroon/20 hover:bg-brand-cream hover:border-brand-maroon",
  };

  return (
    <a
      href={directionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      aria-label="Get Directions to Hotel Kalya on Google Maps"
    >
      <Navigation className={cn(size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4", "text-brand-amber")} />
      <span>{children || "Get Directions"}</span>
      <ExternalLink className="w-3 h-3 opacity-70 ml-0.5" />
    </a>
  );
}
