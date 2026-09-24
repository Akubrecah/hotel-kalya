"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ChefHat,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit3,
  X,
  RefreshCw,
  Globe,
  Users,
  Utensils,
  Truck,
  Sparkles,
} from "lucide-react";
import { CateringPackage } from "@/types/hospitality";
import { useMounted } from "@/lib/useMounted";

export default function AdminCateringPage() {
  const mounted = useMounted();
  const [packages, setPackages] = useState<CateringPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<Partial<CateringPackage> | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/catering-packages");
      const data = await res.json();
      if (data.success) {
        setPackages(data.packages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleOpenAdd = () => {
    setEditingPkg({
      name: "",
      slug: "",
      description: "",
      pricePerPerson: 1600,
      minGuests: 30,
      maxGuests: 600,
      images: ["https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200"],
      featuredImage: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200",
      includedServices: ["On-site executive chefs", "Chafing dishes & hot buffet stations", "Melamine tableware & cutleries"],
      menuSelections: ["Kienyeji Chicken", "Goat Stew", "Pilau / Steamed Rice", "Vegetable Salads", "Tropical Fruit Cuts"],
      staffProvided: ["1 Chef per 50 guests", "Uniformed service waitstaff", "Clean-up team"],
      equipmentProvided: ["Insulated food warmers", "Linen-lined buffet tables"],
      deliveryTerms: "Complimentary transport within 25km of Kapenguria.",
      publishStatus: "published",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: CateringPackage) => {
    setEditingPkg({ ...pkg });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg || !editingPkg.name || !editingPkg.pricePerPerson) {
      alert("Name and price per person are required.");
      return;
    }

    setSaving(true);
    try {
      const isNew = !editingPkg.id;
      const method = isNew ? "POST" : "PATCH";
      const slug = editingPkg.slug || editingPkg.name.toLowerCase().replace(/[^a-z0-9]/g, "-");

      const res = await fetch("/api/catering-packages", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingPkg, slug }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        showToast(isNew ? "Catering package created & published!" : "Package updated!");
        loadPackages();
      } else {
        alert("Failed to save: " + data.error);
      }
    } catch (err) {
      alert("Error: " + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (pkg: CateringPackage) => {
    if (!confirm(`Delete package "${pkg.name}"?`)) return;
    try {
      const res = await fetch(`/api/catering-packages?id=${encodeURIComponent(pkg.id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`Catering package deleted.`);
        loadPackages();
      }
    } catch (err) {
      alert("Error: " + String(err));
    }
  };

  const handleTogglePublish = async (pkg: CateringPackage) => {
    const next = pkg.publishStatus === "published" ? "draft" : "published";
    try {
      const res = await fetch("/api/catering-packages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pkg.id, publishStatus: next }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`${pkg.name} status: ${next.toUpperCase()}`);
        loadPackages();
      }
    } catch (err) {
      alert("Error: " + String(err));
    }
  };

  const filtered = packages.filter((p) =>
    (p.name || p.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description || "").toLowerCase().includes(searchTerm.toLowerCase())
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
              CMS Module 05
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Globe className="w-3 h-3" /> Live Catering Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon mt-1">
            Outside Catering Packages CMS
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Define corporate buffet tiers, wedding feast menus, equipment setups, and per-guest pricing.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Catering Package</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search catering packages by title, dish items, terms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-brand-maroon bg-white"
        />
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div className="p-12 text-center text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-maroon" />
          <p className="text-xs">Loading catering packages...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
          <ChefHat className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-sm font-bold text-gray-700">No catering packages found</p>
          <button onClick={handleOpenAdd} className="text-xs text-brand-maroon font-bold underline">
            Create a catering package
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pkg) => {
            const isLive = pkg.publishStatus === "published";
            return (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all"
              >
                <div className="relative h-44 w-full bg-gray-100">
                  <Image
                    src={pkg.featuredImage || pkg.images[0]}
                    alt={pkg.name || pkg.title || "Catering Package"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(pkg)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold backdrop-blur-sm shadow ${
                        isLive ? "bg-emerald-600/90 text-white" : "bg-black/60 text-gray-300"
                      }`}
                    >
                      {isLive ? "Published" : "Draft"}
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-lg font-black text-brand-amber font-mono">
                      KES {pkg.pricePerPerson.toLocaleString()} <span className="text-xs font-sans text-white/80 font-normal">/ guest</span>
                    </span>
                    <h3 className="font-bold text-base leading-snug">{pkg.name}</h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {pkg.description}
                    </p>

                    <div className="text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-gray-600 flex items-center justify-between">
                      <span>Guest Scope:</span>
                      <span className="font-bold font-mono text-gray-800">{pkg.minGuests}–{pkg.maxGuests} Guests</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Sample Menu:</span>
                      <div className="flex flex-wrap gap-1">
                        {pkg.menuSelections.slice(0, 3).map((item, idx) => (
                          <span key={idx} className="text-[10px] bg-brand-cream/80 text-brand-maroon px-2 py-0.5 rounded-full font-medium">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 truncate max-w-[170px]">{pkg.deliveryTerms}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(pkg)}
                        className="p-2 rounded-xl border border-gray-200 hover:bg-brand-maroon hover:text-white text-gray-600 transition-colors"
                        title="Edit Package"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(pkg)}
                        className="p-2 rounded-xl border border-gray-200 hover:bg-red-500 hover:text-white text-gray-400 transition-colors"
                        title="Delete Package"
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
      {isModalOpen && editingPkg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-xl font-bold text-gray-900">
                {editingPkg.id ? "Edit Catering Package" : "Create Catering Package"}
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
                  <label className="font-bold text-gray-700 block mb-1">Package Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kapenguria Signature Feast"
                    value={editingPkg.name || ""}
                    onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Price Per Person (KES) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingPkg.pricePerPerson || 0}
                    onChange={(e) => setEditingPkg({ ...editingPkg, pricePerPerson: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono font-bold text-brand-maroon focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Package Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Overview of dishes, dining style, suitable event types..."
                  value={editingPkg.description || ""}
                  onChange={(e) => setEditingPkg({ ...editingPkg, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Min Guests</label>
                  <input
                    type="number"
                    min={1}
                    value={editingPkg.minGuests || 30}
                    onChange={(e) => setEditingPkg({ ...editingPkg, minGuests: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Max Guests</label>
                  <input
                    type="number"
                    min={1}
                    value={editingPkg.maxGuests || 500}
                    onChange={(e) => setEditingPkg({ ...editingPkg, maxGuests: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Featured Photo URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={editingPkg.featuredImage || ""}
                  onChange={(e) =>
                    setEditingPkg({
                      ...editingPkg,
                      featuredImage: e.target.value,
                      images: [e.target.value],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Delivery / Distance Terms</label>
                <input
                  type="text"
                  placeholder="e.g. Free transport within 30km of Kapenguria"
                  value={editingPkg.deliveryTerms || ""}
                  onChange={(e) => setEditingPkg({ ...editingPkg, deliveryTerms: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="font-bold text-gray-700">Publish to Public Website</span>
                <select
                  value={editingPkg.publishStatus || "published"}
                  onChange={(e) => setEditingPkg({ ...editingPkg, publishStatus: e.target.value as any })}
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
                  {saving ? "Saving..." : "Save Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
