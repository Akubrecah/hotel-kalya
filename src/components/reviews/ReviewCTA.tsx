"use client";

import React from "react";
import { Star, ExternalLink, MessageSquarePlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewCTAProps {
  className?: string;
  variant?: "banner" | "card";
}

export function ReviewCTA({ className, variant = "banner" }: ReviewCTAProps) {
  // Google Maps place write review intent for Hotel Kalya, Kapenguria
  const writeReviewUrl = `https://search.google.com/local/writereview?placeid=${
    process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || ""
  }` || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Hotel Kalya, Kapenguria, West Pokot County, Kenya"
  )}`;

  const viewReviewsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Hotel Kalya, Kapenguria, West Pokot County, Kenya"
  )}`;

  if (variant === "card") {
    return (
      <div className={cn("bg-brand-maroon text-white p-6 rounded-2xl shadow-xl space-y-4", className)}>
        <div className="flex items-center gap-2 text-brand-amber">
          <Star className="w-5 h-5 fill-brand-amber" />
          <span className="text-xs font-bold uppercase tracking-wider">Share Your Experience</span>
        </div>
        <h4 className="font-serif font-black text-xl leading-snug">
          Enjoyed your stay or dining at Hotel Kalya?
        </h4>
        <p className="text-xs text-white/80 leading-relaxed">
          Your authentic feedback helps travelers discover the warmth of Kapenguria hospitality and guides our team to continually raise our service standards.
        </p>
        <div className="pt-2 flex flex-col gap-2.5">
          <a
            href={writeReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-brand-amber text-brand-maroon font-bold text-xs uppercase tracking-wider hover:bg-brand-amber-dark transition-colors shadow"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Leave a Google Review</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
          <a
            href={viewReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl border border-white/20 text-white font-semibold text-xs hover:bg-white/10 transition-colors"
          >
            <span>View Reviews on Google Maps</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-gradient-to-r from-brand-maroon to-brand-maroon-dark text-white rounded-2xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6",
        className
      )}
    >
      <div className="space-y-2 text-center md:text-left max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-amber text-xs font-bold uppercase tracking-wider">
          <Star className="w-3.5 h-3.5 fill-brand-amber" />
          <span>Guest Feedback</span>
        </div>
        <h3 className="font-serif font-black text-2xl sm:text-3xl">
          Have You Visited Hotel Kalya?
        </h3>
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
          We welcome genuine guest ratings and reviews on our official Google Business Profile. Share your experience with travelers visiting West Pokot.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <a
          href={writeReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-amber text-brand-maroon font-bold text-xs uppercase tracking-wider hover:bg-brand-amber-dark transition-all shadow-lg active:scale-95"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Leave a Google Review</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>
        <a
          href={viewReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-white/30 text-white font-semibold text-xs hover:bg-white/10 transition-colors"
        >
          <span>View All on Google</span>
        </a>
      </div>
    </div>
  );
}
