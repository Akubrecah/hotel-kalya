import React from "react";
import { Star, CheckCircle2 } from "lucide-react";
import { ReviewItem } from "@/types";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: ReviewItem;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-brand-maroon/10 flex flex-col justify-between hover:shadow-lg transition-all duration-200">
      <div>
        {/* Rating and Source Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                )}
              />
            ))}
            <span className="ml-1 text-xs font-bold text-brand-dark">{review.rating}.0</span>
          </div>

          <span
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full",
              review.source === "Google"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-brand-cream text-brand-maroon border border-brand-maroon/15"
            )}
          >
            {review.source === "Google" ? (
              <span>Google Review</span>
            ) : (
              <span>Verified Guest</span>
            )}
          </span>
        </div>

        {/* Review Content */}
        <blockquote className="text-xs sm:text-sm text-brand-dark/80 leading-relaxed italic mb-4">
          &ldquo;{review.text}&rdquo;
        </blockquote>
      </div>

      {/* Author & Service Meta */}
      <div className="pt-4 border-t border-brand-cream flex items-center justify-between text-xs">
        <div>
          <p className="font-bold text-brand-maroon flex items-center gap-1.5">
            <span>{review.author}</span>
            {review.verified && (
              <span title="Verified Stay">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </span>
            )}
          </p>
          {review.service && (
            <p className="text-[11px] text-brand-dark/60 mt-0.5">{review.service}</p>
          )}
        </div>
        <span className="text-[11px] text-brand-dark/50">{review.date}</span>
      </div>
    </div>
  );
}
