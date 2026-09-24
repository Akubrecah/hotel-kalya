"use client";

import { Loader2, ChevronRight } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream p-8">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-16 h-16 text-brand-maroon animate-spin" />
        <span className="text-xs font-bold text-brand-maroon uppercase tracking-wider">
          Loading Hotel Kalya
        </span>
        <p className="text-brand-dark/60 text-sm">
          Please wait while we prepare your hospitality experience
        </p>
        <ChevronRight className="w-4 h-4 text-brand-amber" />
      </div>
    </div>
  );
}