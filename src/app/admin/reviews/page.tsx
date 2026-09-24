"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit3,
  X,
  RefreshCw,
  Globe,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  MessageSquareQuote,
} from "lucide-react";
import { CustomerReview } from "@/types/hospitality";
import { useMounted } from "@/lib/useMounted";

export default function AdminReviewsPage() {
  const mounted = useMounted();
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterApproved, setFilterApproved] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRev, setEditingRev] = useState<Partial<CustomerReview>>({
    authorName: "",
    authorLocation: "Kapenguria",
    rating: 5,
    category: "Hospitality & Accommodation",
    comment: "",
    source: "Direct Guest Feedback",
    isApproved: true,
    isFeatured: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRev.authorName || !editingRev.comment) {
      alert("Name and review comment are required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingRev),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        showToast("Guest review added and approved!");
        loadReviews();
      }
    } catch (err) {
      alert("Failed to submit review: " + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleApprove = async (rev: CustomerReview) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rev.id, isApproved: !rev.isApproved }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Review by ${rev.authorName} is now ${!rev.isApproved ? "Approved" : "Hidden"}`);
        loadReviews();
      }
    } catch (err) {
      alert("Error toggling approval: " + String(err));
    }
  };

  const handleToggleFeatured = async (rev: CustomerReview) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rev.id, isFeatured: !rev.isFeatured }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Review featured state updated`);
        loadReviews();
      }
    } catch (err) {
      alert("Error: " + String(err));
    }
  };

  const handleDelete = async (rev: CustomerReview) => {
    if (!confirm(`Delete review from ${rev.authorName}?`)) return;
    try {
      const res = await fetch(`/api/reviews?id=${encodeURIComponent(rev.id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Review deleted");
        loadReviews();
      }
    } catch (err) {
      alert("Error deleting: " + String(err));
    }
  };

  const filtered = reviews.filter((r) => {
    const matchSearch =
      r.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchApproved =
      filterApproved === "all" ||
      (filterApproved === "approved" && r.isApproved) ||
      (filterApproved === "pending" && !r.isApproved);
    return matchSearch && matchApproved;
  });

  if (!mounted) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-brand-maroon/20 border-t-brand-maroon rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-brand-maroon text-brand-amber px-5 py-3 rounded-2xl shadow-2xl border border-brand-amber/30 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-brand-amber" />
          <span className="text-sm font-bold text-white">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-brand-maroon/10 text-brand-maroon text-[11px] font-extrabold uppercase tracking-wider">
              CMS Module 10
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Globe className="w-3 h-3" /> Live Testimonials Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon mt-1">
            Customer Reviews &amp; Testimonials CMS
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Moderate incoming visitor feedback, approve testimonials for the homepage, and showcase verified 5-star ratings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Guest Review</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reviews by guest name, comment content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-brand-maroon bg-white"
          />
        </div>

        <select
          value={filterApproved}
          onChange={(e) => setFilterApproved(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 focus:outline-none"
        >
          <option value="all">All Reviews ({reviews.length})</option>
          <option value="approved">Approved &amp; Live ({reviews.filter((r) => r.isApproved).length})</option>
          <option value="pending">Pending / Hidden ({reviews.filter((r) => !r.isApproved).length})</option>
        </select>
      </div>

      {/* Reviews Grid */}
      {loading ? (
        <div className="p-12 text-center text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-maroon" />
          <p className="text-xs">Loading guest reviews...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
          <MessageSquareQuote className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-sm font-bold text-gray-700">No reviews found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-[10px] text-gray-400 font-mono">{rev.source}</span>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                <div>
                  <h4 className="font-bold text-brand-maroon text-sm">{rev.authorName}</h4>
                  <p className="text-[10px] text-gray-400">{rev.authorLocation} • {rev.category}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleApprove(rev)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-colors ${
                      rev.isApproved
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {rev.isApproved ? "Approved Live" : "Pending Approval"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(rev)}
                    className={`p-1.5 rounded-lg border text-xs ${
                      rev.isFeatured ? "border-amber-400 bg-amber-50 text-amber-700" : "border-gray-200 text-gray-400"
                    }`}
                    title="Featured on Homepage"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(rev)}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-red-500 hover:text-white text-gray-400 transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD REVIEW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-gray-900">
                Record Verified Guest Feedback
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Guest Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Sharon Cherono"
                    value={editingRev.authorName || ""}
                    onChange={(e) => setEditingRev({ ...editingRev, authorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Guest Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Eldoret, Kenya"
                    value={editingRev.authorLocation || ""}
                    onChange={(e) => setEditingRev({ ...editingRev, authorLocation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Rating (Stars)</label>
                  <select
                    value={editingRev.rating || 5}
                    onChange={(e) => setEditingRev({ ...editingRev, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value={5}>5 Stars - Outstanding</option>
                    <option value={4}>4 Stars - Great Experience</option>
                    <option value={3}>3 Stars - Good</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Service Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Executive Suites & Dining"
                    value={editingRev.category || ""}
                    onChange={(e) => setEditingRev({ ...editingRev, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Guest Testimonial Comment *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="The mountain views, breakfast buffet, and executive rooms were immaculate..."
                  value={editingRev.comment || ""}
                  onChange={(e) => setEditingRev({ ...editingRev, comment: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-brand-maroon text-brand-amber font-bold shadow-md"
                >
                  {saving ? "Saving..." : "Save & Approve"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
