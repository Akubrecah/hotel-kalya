"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit3,
  X,
  RefreshCw,
  Globe,
  Users,
  Maximize2,
  Mic,
  Monitor,
  Wifi,
  Sparkles,
  Layers,
} from "lucide-react";
import { ConferenceHall } from "@/types/hospitality";
import { useMounted } from "@/lib/useMounted";

export default function AdminConferencesPage() {
  const mounted = useMounted();
  const [halls, setHalls] = useState<ConferenceHall[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHall, setEditingHall] = useState<Partial<ConferenceHall> | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadHalls = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/conference-halls");
      const data = await res.json();
      if (data.success) {
        setHalls(data.halls || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHalls();
  }, []);

  const handleOpenAdd = () => {
    setEditingHall({
      name: "",
      slug: "",
      description: "",
      capacity: { minGuests: 20, maxGuests: 200 },
      dimensions: "18m x 10m (180 m²)",
      pricing: { fullDay: 35000, halfDay: 22000, hourly: 4500, perDelegatePackage: 2500 },
      images: ["https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1200"],
      featuredImage: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1200",
      equipment: ["Dual Laser Projectors", "Cordless Lavalier Mics", "PA Sound System", "High-Speed Wi-Fi", "Flipcharts & Markers"],
      seatingLayouts: [
        { layoutName: "Theatre", maxCapacity: 200 },
        { layoutName: "Classroom", maxCapacity: 120 },
        { layoutName: "U-Shape", maxCapacity: 45 },
        { layoutName: "Boardroom", maxCapacity: 35 },
        { layoutName: "Banquet", maxCapacity: 140 },
      ],
      publishStatus: "published",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (hall: ConferenceHall) => {
    setEditingHall({ ...hall });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHall || !editingHall.name) {
      alert("Hall name is required");
      return;
    }

    setSaving(true);
    try {
      const isNew = !editingHall.id;
      const method = isNew ? "POST" : "PATCH";
      const slug = editingHall.slug || editingHall.name.toLowerCase().replace(/[^a-z0-9]/g, "-");

      const res = await fetch("/api/conference-halls", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingHall, slug }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        showToast(isNew ? "Conference hall created & published!" : "Hall updated successfully!");
        loadHalls();
      } else {
        alert("Failed to save: " + data.error);
      }
    } catch (err) {
      alert("Error: " + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (hall: ConferenceHall) => {
    if (!confirm(`Permanently delete "${hall.name}"?`)) return;
    try {
      const res = await fetch(`/api/conference-halls?id=${encodeURIComponent(hall.id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`Hall "${hall.name}" deleted.`);
        loadHalls();
      }
    } catch (err) {
      alert("Error: " + String(err));
    }
  };

  const handleTogglePublish = async (hall: ConferenceHall) => {
    const next = hall.publishStatus === "published" ? "draft" : "published";
    try {
      const res = await fetch("/api/conference-halls", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: hall.id, publishStatus: next }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`${hall.name} publish state: ${next.toUpperCase()}`);
        loadHalls();
      }
    } catch (err) {
      alert("Error: " + String(err));
    }
  };

  const filtered = halls.filter((h) =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.description.toLowerCase().includes(searchTerm.toLowerCase())
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
              CMS Module 04
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Globe className="w-3 h-3" /> Live Public Conferences Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon mt-1">
            Conference Halls &amp; Seminars CMS
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Manage executive boardrooms, international convention halls, audio-visual gear, and layout capacities.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Conference Hall</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search conference halls by name, capacity, equipment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-brand-maroon bg-white"
        />
      </div>

      {/* Halls Grid */}
      {loading ? (
        <div className="p-12 text-center text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-maroon" />
          <p className="text-xs">Loading conference hall registry...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-sm font-bold text-gray-700">No conference halls found</p>
          <button onClick={handleOpenAdd} className="text-xs text-brand-maroon font-bold underline">
            Create a hall now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((hall) => {
            const isLive = hall.publishStatus === "published";
            return (
              <div
                key={hall.id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all"
              >
                <div className="relative h-48 w-full bg-gray-100">
                  <Image
                    src={hall.featuredImage || hall.images[0]}
                    alt={hall.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(hall)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold backdrop-blur-sm shadow ${
                        isLive ? "bg-emerald-600/90 text-white" : "bg-black/60 text-gray-300"
                      }`}
                    >
                      {isLive ? "Published" : "Draft"}
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-mono text-brand-amber font-bold block">{hall.dimensions}</span>
                    <h3 className="font-bold text-base leading-snug">{hall.name}</h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {hall.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-2xl border border-gray-100 font-mono">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-sans font-bold">Capacity</span>
                        <span className="font-bold text-gray-800">{hall.capacity.minGuests}–{hall.capacity.maxGuests} Pax</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-sans font-bold">Full Day</span>
                        <span className="font-bold text-brand-maroon">KES {hall.pricing.fullDay.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Seating Layouts */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400">Layout Capacities:</span>
                      <div className="flex flex-wrap gap-1">
                        {hall.seatingLayouts?.map((layout, idx) => (
                          <span key={idx} className="text-[10px] bg-brand-cream/80 text-brand-maroon px-2 py-0.5 rounded-full font-medium">
                            {layout.layoutName}: {layout.maxCapacity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-mono">
                      {hall.pricing.hourly ? `KES ${hall.pricing.hourly.toLocaleString()}/hr` : "Half / Full Day Rates"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(hall)}
                        className="p-2 rounded-xl border border-gray-200 hover:bg-brand-maroon hover:text-white text-gray-600 transition-colors"
                        title="Edit Hall"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(hall)}
                        className="p-2 rounded-xl border border-gray-200 hover:bg-red-500 hover:text-white text-gray-400 transition-colors"
                        title="Delete Hall"
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
      {isModalOpen && editingHall && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-xl font-bold text-gray-900">
                {editingHall.id ? "Edit Conference Hall" : "Create Conference Hall"}
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
                  <label className="font-bold text-gray-700 block mb-1">Hall Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cherangani Executive Boardroom"
                    value={editingHall.name || ""}
                    onChange={(e) => setEditingHall({ ...editingHall, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Dimensions</label>
                  <input
                    type="text"
                    placeholder="e.g. 20m x 12m (240 m²)"
                    value={editingHall.dimensions || ""}
                    onChange={(e) => setEditingHall({ ...editingHall, dimensions: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Hall Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Atmosphere, delegate capacity, air conditioning, acoustic finish..."
                  value={editingHall.description || ""}
                  onChange={(e) => setEditingHall({ ...editingHall, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Min Pax</label>
                  <input
                    type="number"
                    min={1}
                    value={editingHall.capacity?.minGuests || 10}
                    onChange={(e) =>
                      setEditingHall({
                        ...editingHall,
                        capacity: { ...(editingHall.capacity as any), minGuests: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Max Pax</label>
                  <input
                    type="number"
                    min={1}
                    value={editingHall.capacity?.maxGuests || 200}
                    onChange={(e) =>
                      setEditingHall({
                        ...editingHall,
                        capacity: { ...(editingHall.capacity as any), maxGuests: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Full Day (KES) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingHall.pricing?.fullDay || 0}
                    onChange={(e) =>
                      setEditingHall({
                        ...editingHall,
                        pricing: { ...(editingHall.pricing as any), fullDay: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono font-bold text-brand-maroon"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Half Day (KES)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingHall.pricing?.halfDay || 0}
                    onChange={(e) =>
                      setEditingHall({
                        ...editingHall,
                        pricing: { ...(editingHall.pricing as any), halfDay: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Featured Photo URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={editingHall.featuredImage || ""}
                  onChange={(e) =>
                    setEditingHall({
                      ...editingHall,
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
                  value={editingHall.publishStatus || "published"}
                  onChange={(e) => setEditingHall({ ...editingHall, publishStatus: e.target.value as any })}
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
                  {saving ? "Saving..." : "Save Hall"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
