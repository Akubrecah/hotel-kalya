"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Trees,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit3,
  X,
  RefreshCw,
  Globe,
  Users,
  DollarSign,
  Clock,
  Sparkles,
  MapPin,
  Camera,
} from "lucide-react";
import { GardenExperience } from "@/types/hospitality";
import { useMounted } from "@/lib/useMounted";

export default function AdminGardensPage() {
  const mounted = useMounted();
  const [gardens, setGardens] = useState<GardenExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGarden, setEditingGarden] = useState<Partial<GardenExperience> | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadGardens = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gardens");
      const data = await res.json();
      if (data.success) {
        setGardens(data.gardens || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGardens();
  }, []);

  const handleOpenAdd = () => {
    setEditingGarden({
      name: "",
      slug: "",
      description: "",
      capacity: { minGuests: 50, maxGuests: 300 },
      pricing: { perDay: 35000, halfDay: 20000, photographySession: 10000 },
      images: ["https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200"],
      featuredImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
      facilities: ["Dedicated Power Hookups", "Clean Restrooms", "Water Supply", "Vehicle Access"],
      eventSuitability: ["Weddings", "Banquets", "Photoshoots", "Corporate Picnics"],
      features: ["Manicured Kikuyu Grass Lawns", "Mountain Breeze", "Perimeter Lighting"],
      openingHours: "6:00 AM – 7:00 PM Daily",
      bookingRequirements: "50% deposit required upon confirmation",
      location: "Main Grounds, Hotel Kalya",
      publishStatus: "published",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (garden: GardenExperience) => {
    setEditingGarden({ ...garden });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGarden || !editingGarden.name) {
      alert("Please provide garden name");
      return;
    }

    setSaving(true);
    try {
      const isNew = !editingGarden.id;
      const method = isNew ? "POST" : "PATCH";
      const slug = editingGarden.slug || editingGarden.name.toLowerCase().replace(/[^a-z0-9]/g, "-");

      const res = await fetch("/api/gardens", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingGarden, slug }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        showToast(isNew ? "Garden space created and published!" : "Garden details updated!");
        loadGardens();
      } else {
        alert("Failed to save: " + data.error);
      }
    } catch (err) {
      alert("Error: " + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (garden: GardenExperience) => {
    if (!confirm(`Delete garden "${garden.name}"?`)) return;
    try {
      const res = await fetch(`/api/gardens?id=${encodeURIComponent(garden.id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`Garden "${garden.name}" deleted`);
        loadGardens();
      }
    } catch (err) {
      alert("Error deleting: " + String(err));
    }
  };

  const handleTogglePublish = async (garden: GardenExperience) => {
    const next = garden.publishStatus === "published" ? "draft" : "published";
    try {
      const res = await fetch("/api/gardens", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: garden.id, publishStatus: next }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`${garden.name} status: ${next.toUpperCase()}`);
        loadGardens();
      }
    } catch (err) {
      alert("Failed to toggle publish: " + String(err));
    }
  };

  const filtered = gardens.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.description.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* Toast Notification */}
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
              CMS Module 03
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Globe className="w-3 h-3" /> Live Garden Experience Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon mt-1">
            Gardens &amp; Outdoor Spaces CMS
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Manage manicured wedding lawns, sunset cocktail terraces, family picnic grounds, and photography packages.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Garden Venue</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search gardens by name, suitability, location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-brand-maroon bg-white"
        />
      </div>

      {/* Gardens List */}
      {loading ? (
        <div className="p-12 text-center text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-maroon" />
          <p className="text-xs">Loading garden experiences...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
          <Trees className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-sm font-bold text-gray-700">No garden experiences found</p>
          <button onClick={handleOpenAdd} className="text-xs text-brand-maroon font-bold underline">
            Add a new garden venue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((garden) => {
            const isLive = garden.publishStatus === "published";
            return (
              <div
                key={garden.id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all"
              >
                <div className="relative h-48 w-full bg-gray-100">
                  <Image
                    src={garden.featuredImage || garden.images[0]}
                    alt={garden.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(garden)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold backdrop-blur-sm shadow ${
                        isLive ? "bg-emerald-600/90 text-white" : "bg-black/60 text-gray-300"
                      }`}
                    >
                      {isLive ? "Published" : "Draft"}
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-amber block">
                      {garden.location}
                    </span>
                    <h3 className="font-bold text-base leading-snug">{garden.name}</h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {garden.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-2xl border border-gray-100 font-mono">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-sans font-bold">Capacity</span>
                        <span className="font-bold text-gray-800">{garden.capacity.minGuests}–{garden.capacity.maxGuests} Guests</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-sans font-bold">Full Day</span>
                        <span className="font-bold text-brand-maroon">KES {garden.pricing.perDay.toLocaleString()}</span>
                      </div>
                    </div>

                    {garden.eventSuitability && (
                      <div className="flex flex-wrap gap-1">
                        {garden.eventSuitability.slice(0, 3).map((item, idx) => (
                          <span key={idx} className="text-[10px] bg-brand-cream/80 text-brand-maroon px-2 py-0.5 rounded-full font-medium">
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 font-mono">{garden.openingHours}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(garden)}
                        className="p-2 rounded-xl border border-gray-200 hover:bg-brand-maroon hover:text-white text-gray-600 transition-colors"
                        title="Edit Garden"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(garden)}
                        className="p-2 rounded-xl border border-gray-200 hover:bg-red-500 hover:text-white text-gray-400 transition-colors"
                        title="Delete Garden"
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
      {isModalOpen && editingGarden && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-xl font-bold text-gray-900">
                {editingGarden.id ? "Edit Garden Space" : "Add New Garden Experience"}
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
              <div>
                <label className="font-bold text-gray-700 block mb-1">Garden Venue Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Highland Botanical Garden"
                  value={editingGarden.name || ""}
                  onChange={(e) => setEditingGarden({ ...editingGarden, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Atmosphere, scenery, grass type, ideal for..."
                  value={editingGarden.description || ""}
                  onChange={(e) => setEditingGarden({ ...editingGarden, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Min Guests</label>
                  <input
                    type="number"
                    min={1}
                    value={editingGarden.capacity?.minGuests || 10}
                    onChange={(e) =>
                      setEditingGarden({
                        ...editingGarden,
                        capacity: { ...(editingGarden.capacity as any), minGuests: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Max Guests</label>
                  <input
                    type="number"
                    min={1}
                    value={editingGarden.capacity?.maxGuests || 500}
                    onChange={(e) =>
                      setEditingGarden({
                        ...editingGarden,
                        capacity: { ...(editingGarden.capacity as any), maxGuests: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Full Day Price (KES) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingGarden.pricing?.perDay || 0}
                    onChange={(e) =>
                      setEditingGarden({
                        ...editingGarden,
                        pricing: { ...(editingGarden.pricing as any), perDay: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none font-mono font-bold text-brand-maroon"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Featured Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={editingGarden.featuredImage || ""}
                  onChange={(e) =>
                    setEditingGarden({
                      ...editingGarden,
                      featuredImage: e.target.value,
                      images: [e.target.value],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Opening Hours</label>
                  <input
                    type="text"
                    placeholder="e.g. 6:00 AM – 7:00 PM Daily"
                    value={editingGarden.openingHours || ""}
                    onChange={(e) => setEditingGarden({ ...editingGarden, openingHours: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Location on Compound</label>
                  <input
                    type="text"
                    placeholder="e.g. West Wing Lawns"
                    value={editingGarden.location || ""}
                    onChange={(e) => setEditingGarden({ ...editingGarden, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="font-bold text-gray-700">Publish to Public Website</span>
                <select
                  value={editingGarden.publishStatus || "published"}
                  onChange={(e) => setEditingGarden({ ...editingGarden, publishStatus: e.target.value as any })}
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
                  {saving ? "Saving..." : "Save Garden"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
