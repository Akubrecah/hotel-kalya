"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Gift,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit3,
  X,
  RefreshCw,
  Globe,
  Tag,
  Calendar,
  Sparkles,
  Percent,
} from "lucide-react";
import { HospitalityOffer } from "@/types/hospitality";
import { useMounted } from "@/lib/useMounted";

export default function AdminOffersPage() {
  const mounted = useMounted();
  const [offers, setOffers] = useState<HospitalityOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Partial<HospitalityOffer> | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadOffers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/offers");
      const data = await res.json();
      if (data.success) {
        setOffers(data.offers || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleOpenAdd = () => {
    setEditingOffer({
      title: "",
      slug: "",
      description: "",
      category: "accommodation",
      discountBadge: "Save 25%",
      originalPrice: 12000,
      offerPrice: 8900,
      validUntil: "2026-12-31",
      images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200"],
      featuredImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200",
      inclusions: ["Full Farm Breakfast for 2", "Late 2:00 PM Check-Out", "Welcome Highlands Tea"],
      isFeatured: true,
      publishStatus: "published",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (offer: HospitalityOffer) => {
    setEditingOffer({ ...offer });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer || !editingOffer.title || !editingOffer.offerPrice) {
      alert("Offer title and price are required");
      return;
    }

    setSaving(true);
    try {
      const isNew = !editingOffer.id;
      const method = isNew ? "POST" : "PATCH";
      const slug = editingOffer.slug || editingOffer.title.toLowerCase().replace(/[^a-z0-9]/g, "-");

      const res = await fetch("/api/offers", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingOffer, slug }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        showToast(isNew ? "Special offer created & published!" : "Offer updated!");
        loadOffers();
      } else {
        alert("Failed to save: " + data.error);
      }
    } catch (err) {
      alert("Error: " + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (offer: HospitalityOffer) => {
    if (!confirm(`Delete package "${offer.title}"?`)) return;
    try {
      const res = await fetch(`/api/offers?id=${encodeURIComponent(offer.id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`Offer deleted.`);
        loadOffers();
      }
    } catch (err) {
      alert("Error: " + String(err));
    }
  };

  const handleTogglePublish = async (offer: HospitalityOffer) => {
    const next = offer.publishStatus === "published" ? "draft" : "published";
    try {
      const res = await fetch("/api/offers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: offer.id, publishStatus: next }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`${offer.title} status: ${next.toUpperCase()}`);
        loadOffers();
      }
    } catch (err) {
      alert("Error: " + String(err));
    }
  };

  const filtered = offers.filter((o) =>
    o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.description || o.subtitle || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              CMS Module 07
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Globe className="w-3 h-3" /> Live Packages Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon mt-1">
            Packages &amp; Special Offers CMS
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Create weekend getaways, conference delegate discounts, wedding honeymoon specials, and promotional coupons.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search special offers by title, category, inclusions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-brand-maroon bg-white"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-12 text-center text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-maroon" />
          <p className="text-xs">Loading offers registry...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
          <Gift className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-sm font-bold text-gray-700">No active offers found</p>
          <button onClick={handleOpenAdd} className="text-xs text-brand-maroon font-bold underline">
            Create a special offer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((offer) => {
            const isLive = offer.publishStatus === "published";
            return (
              <div
                key={offer.id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all"
              >
                <div className="relative h-44 w-full bg-gray-100">
                  <Image
                    src={offer.featuredImage || offer.image || (offer.images && offer.images[0]) || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200"}
                    alt={offer.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-red-600 text-white font-black text-[10px] uppercase shadow">
                      {offer.discountBadge}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(offer)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold backdrop-blur-sm shadow ${
                        isLive ? "bg-emerald-600/90 text-white" : "bg-black/60 text-gray-300"
                      }`}
                    >
                      {isLive ? "Published" : "Draft"}
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="font-mono">
                      <span className="text-lg font-black text-brand-amber">KES {offer.offerPrice.toLocaleString()}</span>
                      {offer.originalPrice && (
                        <span className="text-xs text-white/60 line-through ml-2">KES {offer.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-base leading-snug">{offer.title}</h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {offer.description}
                    </p>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Package Inclusions:</span>
                      <div className="flex flex-wrap gap-1">
                        {offer.inclusions.map((inc, idx) => (
                          <span key={idx} className="text-[10px] bg-brand-cream/80 text-brand-maroon px-2 py-0.5 rounded-full font-medium">
                            ✓ {inc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-mono">Valid until: {offer.validUntil}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(offer)}
                        className="p-2 rounded-xl border border-gray-200 hover:bg-brand-maroon hover:text-white text-gray-600 transition-colors"
                        title="Edit Offer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(offer)}
                        className="p-2 rounded-xl border border-gray-200 hover:bg-red-500 hover:text-white text-gray-400 transition-colors"
                        title="Delete Offer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && editingOffer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-xl font-bold text-gray-900">
                {editingOffer.id ? "Edit Special Offer" : "Create New Special Offer"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Offer Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kapenguria Weekend Escape Package"
                    value={editingOffer.title || ""}
                    onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Badge (e.g. Save 20%, Popular)</label>
                  <input
                    type="text"
                    placeholder="e.g. Save 30%"
                    value={editingOffer.discountBadge || ""}
                    onChange={(e) => setEditingOffer({ ...editingOffer, discountBadge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none font-bold text-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Highlights of this promotion..."
                  value={editingOffer.description || ""}
                  onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Offer Price (KES) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingOffer.offerPrice || 0}
                    onChange={(e) => setEditingOffer({ ...editingOffer, offerPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono font-bold text-brand-maroon focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Original Price (KES)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingOffer.originalPrice || 0}
                    onChange={(e) => setEditingOffer({ ...editingOffer, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Valid Until Date</label>
                  <input
                    type="date"
                    value={editingOffer.validUntil || ""}
                    onChange={(e) => setEditingOffer({ ...editingOffer, validUntil: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Featured Photo URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={editingOffer.featuredImage || ""}
                  onChange={(e) =>
                    setEditingOffer({
                      ...editingOffer,
                      featuredImage: e.target.value,
                      images: [e.target.value],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="font-bold text-gray-700">Publish to Public Website</span>
                <select
                  value={editingOffer.publishStatus || "published"}
                  onChange={(e) => setEditingOffer({ ...editingOffer, publishStatus: e.target.value as any })}
                  className="px-3 py-1.5 rounded-xl border border-gray-300 bg-white font-bold text-brand-maroon"
                >
                  <option value="published">Published (Live)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
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
                  {saving ? "Saving..." : "Save Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
