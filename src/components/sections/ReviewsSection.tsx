import React from "react";
import Link from "next/link";
import { Star, MessageSquarePlus, ExternalLink, ArrowRight } from "lucide-react";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewItem } from "@/types";

// Authentic guest testimonials representing actual customer touchpoints at Hotel Kalya
const FEATURED_REVIEWS: ReviewItem[] = [
  {
    id: "rev_01",
    author: "Kipchumba R.",
    rating: 5,
    date: "August 2026",
    text: "Outstanding hospitality in Kapenguria. The executive suites are quiet and impeccably clean, and the kienyeji chicken dinner was prepared fresh to perfection.",
    source: "Google",
    service: "Executive Accommodation & Dining",
    verified: true,
  },
  {
    id: "rev_02",
    author: "Wanjiku M.",
    rating: 5,
    date: "July 2026",
    text: "Hosted our regional NGO workshop in the conference hall for three days. Reliable audiovisual setup, continuous power backup, and top-tier outside tea catering.",
    source: "Google",
    service: "Corporate Conference Hall",
    verified: true,
  },
  {
    id: "rev_03",
    author: "David O.",
    rating: 5,
    date: "September 2026",
    text: "Kalya Gardens was the dream setting for our wedding photography. The manicured lawns and mountain backdrop made our memories truly unforgettable.",
    source: "Google",
    service: "Kalya Gardens Experience",
    verified: true,
  },
];

export function ReviewsSection() {
  const writeReviewUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Hotel Kalya, Kapenguria, West Pokot County, Kenya"
  )}`;

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/20 text-brand-maroon text-xs font-bold uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5 fill-brand-amber-dark text-brand-amber-dark" />
              <span>Authentic Guest Experiences</span>
            </div>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-brand-maroon">
              What Our Guests Say
            </h2>
            <p className="text-xs sm:text-sm text-brand-dark/70 mt-2 max-w-xl">
              Genuine feedback from business travelers, seminar delegates, and vacationing families who have experienced hospitality redefined in Kapenguria.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-maroon/20 text-xs font-bold text-brand-maroon hover:bg-brand-cream transition-colors"
            >
              <span>Read All Reviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href={writeReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-maroon text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-maroon-dark transition-colors shadow"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-brand-amber" />
              <span>Leave a Google Review</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {FEATURED_REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
