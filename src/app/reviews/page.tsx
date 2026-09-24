"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Star,
  CheckCircle2,
  Send,
  Loader2,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewSummary } from "@/components/reviews/ReviewSummary";
import { ReviewCTA } from "@/components/reviews/ReviewCTA";
import { ReviewItem } from "@/types";
import { CustomerReview } from "@/types/hospitality";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    service: "Executive Accommodation",
    feedback: "",
  });

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        const res = await fetch("/api/reviews?approved=true");
        if (res.ok) {
          const data = await res.json();
          if (data.reviews && Array.isArray(data.reviews)) {
            const mapped: ReviewItem[] = data.reviews.map((r: CustomerReview) => ({
              id: r.id,
              author: r.authorName || "Guest",
              rating: r.rating || 5,
              date: r.stayDate || (r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recent Stay"),
              text: r.comment || "",
              source: r.source === "Google Reviews" || r.source === "Google" ? "Google" : "Verified Guest",
              service: r.serviceType || "Hospitality Services",
              verified: r.isApproved ?? true,
            }));
            setReviews(mapped);
          }
        }
      } catch {
        // Fallback gracefully
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    if (selectedFilter === "all") return reviews;
    return reviews.filter((r) => r.service?.toLowerCase().includes(selectedFilter.toLowerCase()));
  }, [reviews, selectedFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.feedback) return;

    try {
      setSubmitting(true);
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: formData.name,
          email: formData.email,
          rating: formData.rating,
          serviceType: formData.service,
          comment: formData.feedback,
          source: "Verified Guest",
          isApproved: false, // Queue in admin moderation desk
        }),
      });
      setFormSubmitted(true);
      setFormData({
        name: "",
        email: "",
        rating: 5,
        service: "Executive Accommodation",
        feedback: "",
      });
    } catch {
      setFormSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Guest Reviews & Ratings" },
        ]}
      />

      {/* Page Header */}
      <section className="bg-brand-cream/80 py-12 lg:py-16 border-b border-brand-maroon/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/20 text-brand-maroon text-xs font-bold uppercase tracking-wider mb-3">
              <Star className="w-3.5 h-3.5 fill-brand-amber-dark text-brand-amber-dark" />
              <span>Authentic Guest Testimonials</span>
            </div>
            <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-brand-maroon leading-tight">
              Guest Reviews &amp; Ratings
            </h1>
            <p className="mt-4 text-base sm:text-lg text-brand-dark/80 leading-relaxed">
              Read transparent experiences from visitors who have stayed in our suites, dined in our restaurant, conducted summits in our halls, and celebrated in Kalya Gardens.
            </p>
          </div>
        </div>
      </section>

      {/* Main Reviews Container */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Transparency & Google Business Overview */}
          <ReviewSummary />

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 border-b border-brand-cream pb-4">
            <span className="text-xs font-bold text-brand-dark/60 mr-2">Filter By Experience:</span>
            {[
              { id: "all", label: "All Reviews" },
              { id: "accommodation", label: "Accommodation" },
              { id: "dining", label: "Dining & Food" },
              { id: "conference", label: "Conferences" },
              { id: "catering", label: "Outside Catering" },
              { id: "garden", label: "Kalya Gardens" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedFilter === tab.id
                    ? "bg-brand-maroon text-white shadow-sm"
                    : "bg-brand-cream/80 text-brand-dark/70 hover:bg-brand-cream hover:text-brand-maroon"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Reviews Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-brand-cream/60 h-48 rounded-2xl border border-brand-amber-light" />
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-16 bg-brand-cream/40 rounded-2xl border border-brand-maroon/10 p-8">
              <Star className="w-10 h-10 text-brand-dark/40 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-lg text-brand-maroon">No reviews found in this category</h3>
              <p className="text-xs text-brand-dark/60 mt-1">
                Choose another category above to browse testimonials from our verified guests.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}

          {/* Review Call To Action Banner */}
          <ReviewCTA />

          {/* Direct Guest Desk Review Form */}
          <div className="bg-brand-cream/40 rounded-2xl border border-brand-maroon/15 p-8 lg:p-10 max-w-3xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-amber font-sans">
                Direct Guest Desk
              </span>
              <h3 className="font-serif font-black text-2xl text-brand-maroon mt-1">
                Share Direct Feedback with Management
              </h3>
              <p className="text-xs text-brand-dark/70 mt-2">
                Have specific recommendations or compliments regarding your recent stay? Our management reviews every submission directly.
              </p>
            </div>

            {formSubmitted ? (
              <div className="bg-white rounded-xl p-8 text-center space-y-3 shadow-sm border border-emerald-200">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-lg text-brand-maroon">
                  Thank You for Your Feedback!
                </h4>
                <p className="text-xs text-brand-dark/75 max-w-md mx-auto">
                  Your review has been received by our guest relations desk. Feedback helps us continually uphold our promise of Hospitality Redefined.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="inline-flex px-4 py-2 rounded-lg bg-brand-maroon text-white text-xs font-bold hover:bg-brand-maroon-dark transition-colors"
                >
                  Submit Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-maroon mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Samuel Rotich"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-brand-maroon/20 text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-maroon mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. samuel@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-brand-maroon/20 text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-maroon mb-1">
                      Service Experienced
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-brand-maroon/20 text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber bg-white"
                    >
                      <option value="Executive Accommodation">Executive Accommodation</option>
                      <option value="Restaurant & Food Service">Restaurant &amp; Dining</option>
                      <option value="Conference & Meeting Halls">Conference Facilities</option>
                      <option value="Outside Event Catering">Outside Catering</option>
                      <option value="AirBnB Short-Stays">AirBnB Serviced Apartment</option>
                      <option value="Kalya Gardens Experience">Kalya Gardens</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-maroon mb-1">
                      Overall Rating (1 to 5 Stars)
                    </label>
                    <div className="flex items-center gap-2 pt-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              star <= formData.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-brand-maroon ml-2">
                        {formData.rating} of 5 Stars
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-maroon mb-1">
                    Your Comments &amp; Review *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.feedback}
                    onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                    placeholder="Describe your dining, accommodation, or conference experience..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-brand-maroon/20 text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber bg-white"
                  />
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5 text-brand-amber" />
                    )}
                    <span>{submitting ? "Submitting..." : "Submit Guest Feedback"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
