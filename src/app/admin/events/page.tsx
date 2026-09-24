"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PartyPopper,
  Presentation,
  RefreshCw,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit3,
  X,
  Globe,
  Users,
  Sparkles,
  Calendar,
} from "lucide-react";
import { ConferenceBooking, EventBooking, EventSpace } from "@/types/hospitality";
import { useMounted } from "@/lib/useMounted";

export default function AdminEventsOverviewPage() {
  const mounted = useMounted();
  const [activeTab, setActiveTab] = useState<"spaces" | "bookings">("spaces");
  const [spaces, setSpaces] = useState<EventSpace[]>([]);
  const [conferences, setConferences] = useState<ConferenceBooking[]>([]);
  const [events, setEvents] = useState<EventBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Partial<EventSpace> | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [spacesRes, confRes, evtRes] = await Promise.all([
        fetch("/api/event-spaces"),
        fetch("/api/conference"),
        fetch("/api/events"),
      ]);
      const spacesData = await spacesRes.json();
      const confData = await confRes.json();
      const evtData = await evtRes.json();

      if (spacesData.success) setSpaces(spacesData.spaces || []);
      if (confData.success && Array.isArray(confData.conferences)) setConferences(confData.conferences);
      if (evtData.success && Array.isArray(evtData.events)) setEvents(evtData.events);
    } catch (err) {
      console.error("Failed to load events data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingSpace({
      name: "",
      slug: "",
      description: "",
      capacity: { minGuests: 30, maxGuests: 250 },
      pricing: { basePrice: 40000, perGuest: 1800 },
      images: ["https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200"],
      featuredImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
      amenities: ["PA System & Microphones", "High-Peak Tents", "Ambient Warm Lighting", "Private Restrooms"],
      suitableEventTypes: ["Weddings", "Birthday Parties", "Corporate Gala Dinners", "Church Functions", "Graduation Banquets"],
      cateringOptions: ["Full In-House Buffet", "External Catering Allowed with Kitchen Fee", "Live BBQ Station"],
      decorationOptions: ["Floral Arches Available", "Custom High Table Linens", "Red Carpet Entrance"],
      bookingStatus: "available",
      publishStatus: "published",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (space: EventSpace) => {
    setEditingSpace({ ...space });
    setIsModalOpen(true);
  };

  const handleSaveSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpace || !editingSpace.name) {
      alert("Venue name is required");
      return;
    }

    setSaving(true);
    try {
      const isNew = !editingSpace.id;
      const method = isNew ? "POST" : "PATCH";
      const slug = editingSpace.slug || editingSpace.name.toLowerCase().replace(/[^a-z0-9]/g, "-");

      const res = await fetch("/api/event-spaces", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingSpace, slug }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        showToast(isNew ? "Event venue published to website!" : "Venue updated!");
        loadData();
      } else {
        alert("Failed to save: " + data.error);
      }
    } catch (err) {
      alert("Error: " + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSpace = async (space: EventSpace) => {
    if (!confirm(`Delete venue "${space.name}"?`)) return;
    try {
      const res = await fetch(`/api/event-spaces?id=${encodeURIComponent(space.id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Event venue deleted");
        loadData();
      }
    } catch (err) {
      alert("Error: " + String(err));
    }
  };

  const handleTogglePublish = async (space: EventSpace) => {
    const next = space.publishStatus === "published" ? "draft" : "published";
    try {
      const res = await fetch("/api/event-spaces", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: space.id, publishStatus: next }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`${space.name} status: ${next.toUpperCase()}`);
        loadData();
      }
    } catch (err) {
      alert("Error: " + String(err));
    }
  };

  const filteredSpaces = spaces.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!mounted) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-brand-maroon/20 border-t-brand-maroon rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-8">
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
              CMS Module 11
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Globe className="w-3 h-3" /> Live Event Venues Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon mt-1">
            Events &amp; Function Spaces CMS
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Manage wedding reception lawns, corporate gala pavilions, graduation party venues, and active bookings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "spaces" && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event Venue</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab("spaces")}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "spaces"
              ? "border-brand-maroon text-brand-maroon"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <PartyPopper className="w-4 h-4" />
          <span>Manage Event Venues ({spaces.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("bookings")}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "bookings"
              ? "border-brand-maroon text-brand-maroon"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Active Client Bookings ({conferences.length + events.length})</span>
        </button>
      </div>

      {/* TAB 1: DYNAMIC EVENT SPACES CMS */}
      {activeTab === "spaces" && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search event venues by name, suitable events, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-brand-maroon bg-white"
            />
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-maroon" />
              <p className="text-xs">Loading event spaces...</p>
            </div>
          ) : filteredSpaces.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
              <PartyPopper className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-gray-700">No event venues found</p>
              <button onClick={handleOpenAdd} className="text-xs text-brand-maroon font-bold underline">
                Create an event venue now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpaces.map((space) => {
                const isLive = space.publishStatus === "published";
                return (
                  <div
                    key={space.id}
                    className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all"
                  >
                    <div className="relative h-48 w-full bg-gray-100">
                      <Image
                        src={space.featuredImage || space.images[0]}
                        alt={space.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(space)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold backdrop-blur-sm shadow ${
                            isLive ? "bg-emerald-600/90 text-white" : "bg-black/60 text-gray-300"
                          }`}
                        >
                          {isLive ? "Published" : "Draft"}
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] uppercase font-bold text-brand-amber block">
                          Capacity: {space.capacity.minGuests}–{space.capacity.maxGuests} Guests
                        </span>
                        <h3 className="font-bold text-base leading-snug">{space.name}</h3>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                          {space.description}
                        </p>

                        <div className="flex items-center justify-between text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100 font-mono">
                          <span className="text-gray-400 font-sans">Venue Hire:</span>
                          <span className="font-bold text-brand-maroon">
                            KES {(space.pricing.basePrice || space.pricing.baseHire || 0).toLocaleString()}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-gray-400 block">Suitable Functions:</span>
                          <div className="flex flex-wrap gap-1">
                            {(space.suitableEventTypes || space.eventTypes || []).slice(0, 3).map((item, idx) => (
                              <span key={idx} className="text-[10px] bg-brand-cream/80 text-brand-maroon px-2 py-0.5 rounded-full font-medium">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(space)}
                          className="p-2 rounded-xl border border-gray-200 hover:bg-brand-maroon hover:text-white text-gray-600 transition-colors"
                          title="Edit Space"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSpace(space)}
                          className="p-2 rounded-xl border border-gray-200 hover:bg-red-500 hover:text-white text-gray-400 transition-colors"
                          title="Delete Space"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CLIENT BOOKINGS LIST */}
      {activeTab === "bookings" && (
        <div className="space-y-6">
          {/* Conference Bookings */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Presentation className="w-5 h-5 text-brand-maroon" />
                <h2 className="font-serif text-lg font-bold text-brand-maroon">
                  Conference Hall Reservations ({conferences.length})
                </h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Ref</th>
                    <th className="py-3 px-4">Organization</th>
                    <th className="py-3 px-4">Hall Name</th>
                    <th className="py-3 px-4">Delegates</th>
                    <th className="py-3 px-4">Dates</th>
                    <th className="py-3 px-4">Total (KES)</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {conferences.map((c) => (
                    <tr key={c.id} className="hover:bg-brand-cream/30">
                      <td className="py-3 px-4 font-mono font-bold text-brand-maroon">{c.id}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{c.organization}</td>
                      <td className="py-3 px-4 font-semibold text-gray-800">{c.hallName}</td>
                      <td className="py-3 px-4 text-gray-700">{c.delegates} Pax</td>
                      <td className="py-3 px-4 text-gray-600">{c.startDate} → {c.endDate}</td>
                      <td className="py-3 px-4 font-bold text-brand-maroon font-serif">
                        KES {c.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Garden & Function Events */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-2">
              <PartyPopper className="w-5 h-5 text-brand-maroon" />
              <h2 className="font-serif text-lg font-bold text-brand-maroon">
                Outdoor Lawns &amp; Private Function Events ({events.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Ref</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Event Type &amp; Grounds</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Guests</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map((e) => (
                    <tr key={e.id} className="hover:bg-brand-cream/30">
                      <td className="py-3 px-4 font-mono font-bold text-brand-maroon">{e.id}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{e.clientName}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-brand-maroon">{e.eventType}</p>
                        <p className="text-[11px] text-gray-500">{e.venueArea}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{e.eventDate}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{e.guestCount} Guests</td>
                      <td className="py-3 px-4 font-bold text-brand-maroon font-serif">
                        KES {e.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && editingSpace && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-xl font-bold text-gray-900">
                {editingSpace.id ? "Edit Event Venue" : "Create Event & Function Space"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSpace} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Venue Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kapenguria Grand Wedding Pavilion"
                    value={editingSpace.name || ""}
                    onChange={(e) => setEditingSpace({ ...editingSpace, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Base Venue Hire (KES) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingSpace.pricing?.basePrice || 0}
                    onChange={(e) =>
                      setEditingSpace({
                        ...editingSpace,
                        pricing: { ...(editingSpace.pricing as any), basePrice: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono font-bold text-brand-maroon focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Venue Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Atmosphere, scenery, capacity, setup options..."
                  value={editingSpace.description || ""}
                  onChange={(e) => setEditingSpace({ ...editingSpace, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Min Guests</label>
                  <input
                    type="number"
                    min={1}
                    value={editingSpace.capacity?.minGuests || 20}
                    onChange={(e) =>
                      setEditingSpace({
                        ...editingSpace,
                        capacity: { ...(editingSpace.capacity as any), minGuests: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Max Guests</label>
                  <input
                    type="number"
                    min={1}
                    value={editingSpace.capacity?.maxGuests || 400}
                    onChange={(e) =>
                      setEditingSpace({
                        ...editingSpace,
                        capacity: { ...(editingSpace.capacity as any), maxGuests: Number(e.target.value) },
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
                  value={editingSpace.featuredImage || ""}
                  onChange={(e) =>
                    setEditingSpace({
                      ...editingSpace,
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
                  value={editingSpace.publishStatus || "published"}
                  onChange={(e) => setEditingSpace({ ...editingSpace, publishStatus: e.target.value as any })}
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
                  {saving ? "Saving..." : "Save Venue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
