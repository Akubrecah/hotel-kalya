"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import {
  Bed,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calendar,
  Eye,
  Trash2,
  Edit3,
  X,
  RefreshCw,
  Globe,
  SlidersHorizontal,
  DollarSign,
  Maximize2,
  Home,
  Check,
} from "lucide-react";
import { Room } from "@/types/hospitality";
import { useMounted } from "@/lib/useMounted";

const DEFAULT_AMENITIES = [
  "High-Speed Wi-Fi",
  "50\" 4K Smart TV with DStv",
  "Executive Work Desk & Chair",
  "Scenic Highland Balcony",
  "En-suite Hot Rain Shower",
  "Complimentary Full Breakfast",
  "Tea & Coffee Station",
  "Air Conditioning / Fan",
  "Digital Safe",
  "Room Service 24/7",
];

const ROOM_TYPES = [
  { label: "Executive Suite", slug: "deluxe-exec" },
  { label: "Standard Room", slug: "standard-room" },
  { label: "Highland Cottage", slug: "garden-cottage" },
  { label: "Family Suite", slug: "family-suite" },
  { label: "Presidential Villa", slug: "presidential-villa" },
];

export default function AdminRoomsPage() {
  const mounted = useMounted();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [publishFilter, setPublishFilter] = useState("all");

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Partial<Room> | null>(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [calendarRoom, setCalendarRoom] = useState<Room | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load rooms from live database
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      if (data.success) {
        setRooms(data.rooms || []);
      } else {
        setError(data.error || "Failed to load rooms");
      }
    } catch (err) {
      setError("Network error fetching rooms: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingRoom({
      id: "",
      roomNumber: "",
      name: "",
      type: "Executive Suite",
      typeSlug: "deluxe-exec",
      floor: "1st Floor - Main Wing",
      description: "",
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200",
      ],
      featuredImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200",
      capacity: { adults: 2, children: 1, maxGuests: 3 },
      bedConfiguration: "1 King-Size Orthopedic Bed",
      bedType: "King Bed",
      size: "42 m²",
      amenities: ["High-Speed Wi-Fi", "50\" 4K Smart TV with DStv", "Scenic Highland Balcony", "Complimentary Full Breakfast"],
      basePrice: 6500,
      discountPrice: 5800,
      publishStatus: "published",
      reservationStatus: "AVAILABLE",
      housekeepingStatus: "READY",
      isActive: true,
      featured: false,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (room: Room) => {
    setEditingRoom({ ...room });
    setIsEditModalOpen(true);
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom || !editingRoom.roomNumber || !editingRoom.name || !editingRoom.basePrice) {
      alert("Please enter room number, name, and base price.");
      return;
    }

    setSaving(true);
    try {
      const isNew = !editingRoom.id;
      const method = isNew ? "POST" : "PATCH";
      const payload = {
        ...editingRoom,
        typeSlug: editingRoom.typeSlug || editingRoom.type?.toLowerCase().replace(/\s+/g, "-") || "standard",
      };

      const res = await fetch("/api/rooms", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setIsEditModalOpen(false);
        setEditingRoom(null);
        showToast(isNew ? "New room added to CMS & Live Website!" : "Room changes updated successfully!");
        fetchRooms();
      } else {
        alert("Save failed: " + data.error);
      }
    } catch (err) {
      alert("Error saving room: " + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoom = async (room: Room) => {
    if (!confirm(`Are you sure you want to permanently delete Room ${room.roomNumber} (${room.name})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/rooms?id=${encodeURIComponent(room.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Room ${room.roomNumber} deleted.`);
        fetchRooms();
      } else {
        alert("Delete failed: " + data.error);
      }
    } catch (err) {
      alert("Error deleting room: " + String(err));
    }
  };

  const handleTogglePublish = async (room: Room) => {
    const nextStatus = room.publishStatus === "published" ? "draft" : "published";
    try {
      const res = await fetch("/api/rooms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: room.id, publishStatus: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Room ${room.roomNumber} is now ${nextStatus.toUpperCase()}`);
        fetchRooms();
      }
    } catch (err) {
      alert("Failed to toggle publish status: " + String(err));
    }
  };

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === "all" || r.typeSlug === typeFilter || r.type === typeFilter;
    const matchStatus = statusFilter === "all" || r.reservationStatus === statusFilter;
    const matchPublish = publishFilter === "all" || (r.publishStatus || "published") === publishFilter;
    return matchSearch && matchType && matchStatus && matchPublish;
  });

  const availableCount = rooms.filter((r) => r.reservationStatus === "AVAILABLE").length;
  const occupiedCount = rooms.filter((r) => r.reservationStatus === "OCCUPIED" || r.reservationStatus === "RESERVED").length;
  const maintenanceCount = rooms.filter((r) => r.reservationStatus === "OUT_OF_ORDER" || r.reservationStatus === "BLOCKED").length;
  const publishedCount = rooms.filter((r) => !r.publishStatus || r.publishStatus === "published").length;

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

      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-brand-maroon/10 text-brand-maroon text-[11px] font-extrabold uppercase tracking-wider">
              CMS Module 01
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Globe className="w-3 h-3" /> Live Frontend Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon mt-1">
            Rooms & Accommodation CMS
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Create, price, configure, and publish unlimited rooms displayed on the public accommodation page.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchRooms}
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
            title="Reload Rooms"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber font-bold text-xs sm:text-sm shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Room</span>
          </button>
        </div>
      </div>

      {/* Operational Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Inventory</span>
          <p className="text-2xl font-black text-brand-maroon mt-1">{rooms.length} <span className="text-xs font-normal text-gray-500">Rooms</span></p>
          <span className="text-[10px] text-emerald-600 font-bold">{publishedCount} live on website</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Available for Guest</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{availableCount} <span className="text-xs font-normal text-gray-500">Units</span></p>
          <span className="text-[10px] text-gray-400">Ready for booking</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Reserved / Occupied</span>
          <p className="text-2xl font-black text-brand-amber-dark mt-1">{occupiedCount} <span className="text-xs font-normal text-gray-500">Units</span></p>
          <span className="text-[10px] text-gray-400">In-house guests</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Maintenance / Blocked</span>
          <p className="text-2xl font-black text-red-600 mt-1">{maintenanceCount} <span className="text-xs font-normal text-gray-500">Units</span></p>
          <span className="text-[10px] text-gray-400">Offline for inspection</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by room number, name, type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-brand-maroon"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium focus:outline-none"
          >
            <option value="all">All Room Types</option>
            {ROOM_TYPES.map((t) => (
              <option key={t.slug} value={t.slug}>{t.label}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium focus:outline-none"
          >
            <option value="all">All Operational Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="RESERVED">Reserved</option>
            <option value="OUT_OF_ORDER">Maintenance</option>
          </select>

          <select
            value={publishFilter}
            onChange={(e) => setPublishFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium focus:outline-none"
          >
            <option value="all">All Publish States</option>
            <option value="published">Published (Live)</option>
            <option value="draft">Draft (Hidden)</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-maroon" />
            <p className="text-xs">Loading Hotel Kalya room registry...</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Bed className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-700">No rooms found matching your filter</p>
            <button
              onClick={handleOpenAddModal}
              className="text-xs text-brand-maroon font-bold underline"
            >
              Add a new room now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Room & Photo</th>
                  <th className="py-3.5 px-3">Type & Floor</th>
                  <th className="py-3.5 px-3">Specs</th>
                  <th className="py-3.5 px-3">Price / Night</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Housekeeping</th>
                  <th className="py-3.5 px-3">Publish State</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRooms.map((room) => {
                  const isPublished = (room.publishStatus || "published") === "published";
                  const mainImg = room.featuredImage || room.images[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800";

                  return (
                    <tr key={room.id} className="hover:bg-brand-cream/30 transition-colors">
                      {/* Room & Photo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-11 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                            <Image
                              src={mainImg}
                              alt={room.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                          <div>
                            <span className="font-mono font-black text-sm text-brand-maroon">
                              #{room.roomNumber}
                            </span>
                            <p className="font-bold text-gray-900 leading-tight truncate max-w-[160px] sm:max-w-[220px]">
                              {room.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type & Floor */}
                      <td className="py-3 px-3">
                        <p className="font-medium text-gray-800">{room.type}</p>
                        <p className="text-[10px] text-gray-400">{room.floor || "Main Wing"}</p>
                      </td>

                      {/* Specs */}
                      <td className="py-3 px-3">
                        <p className="text-gray-700 font-medium">{room.bedConfiguration || room.bedType || "1 Bed"}</p>
                        <p className="text-[10px] text-gray-400">Max {room.capacity.maxGuests} guests • {room.size || "35 m²"}</p>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-3 font-mono">
                        <p className="font-bold text-brand-maroon">KES {room.basePrice.toLocaleString()}</p>
                        {room.discountPrice && (
                          <p className="text-[10px] text-emerald-600 line-through">KES {room.discountPrice.toLocaleString()}</p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            room.reservationStatus === "AVAILABLE"
                              ? "bg-emerald-100 text-emerald-800"
                              : room.reservationStatus === "OCCUPIED"
                              ? "bg-blue-100 text-blue-800"
                              : room.reservationStatus === "RESERVED"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {room.reservationStatus}
                        </span>
                      </td>

                      {/* Housekeeping */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            room.housekeepingStatus === "READY"
                              ? "bg-teal-50 text-teal-700 border border-teal-200"
                              : room.housekeepingStatus === "CLEANING"
                              ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {room.housekeepingStatus}
                        </span>
                      </td>

                      {/* Publish State */}
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(room)}
                          className={`px-2 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition-all ${
                            isPublished
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                              : "bg-gray-100 text-gray-500 border border-gray-300 hover:bg-gray-200"
                          }`}
                          title="Click to toggle publish status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? "bg-emerald-500" : "bg-gray-400"}`} />
                          <span>{isPublished ? "Published" : "Draft"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setCalendarRoom(room);
                              setIsCalendarModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
                            title="View Room Availability Calendar"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(room)}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-brand-maroon hover:text-white text-gray-600 transition-colors"
                            title="Edit Room"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRoom(room)}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-red-500 hover:text-white text-gray-400 transition-colors"
                            title="Delete Room"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT ROOM MODAL */}
      {isEditModalOpen && editingRoom && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-maroon">
                  {editingRoom.id ? "Edit Room Details" : "Create New Room Offering"}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
                  {editingRoom.name || "New Accommodation Offering"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Room Number / Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 205, VILLA-1"
                    value={editingRoom.roomNumber || ""}
                    onChange={(e) => setEditingRoom({ ...editingRoom, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono focus:border-brand-maroon focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">Room Display Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Presidential Executive Highland Suite"
                    value={editingRoom.name || ""}
                    onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-brand-maroon focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Room Category</label>
                  <select
                    value={editingRoom.type || "Executive Suite"}
                    onChange={(e) => {
                      const sel = ROOM_TYPES.find((t) => t.label === e.target.value);
                      setEditingRoom({
                        ...editingRoom,
                        type: e.target.value,
                        typeSlug: sel?.slug || "standard",
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none"
                  >
                    {ROOM_TYPES.map((t) => (
                      <option key={t.slug} value={t.label}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Floor / Wing</label>
                  <input
                    type="text"
                    placeholder="e.g. 2nd Floor, Garden Wing"
                    value={editingRoom.floor || ""}
                    onChange={(e) => setEditingRoom({ ...editingRoom, floor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Room Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 45 m²"
                    value={editingRoom.size || ""}
                    onChange={(e) => setEditingRoom({ ...editingRoom, size: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Base Price / Night (KES) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingRoom.basePrice || ""}
                    onChange={(e) => setEditingRoom({ ...editingRoom, basePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono focus:outline-none font-bold text-brand-maroon"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Discount Price (KES)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingRoom.discountPrice || ""}
                    onChange={(e) => setEditingRoom({ ...editingRoom, discountPrice: Number(e.target.value) || undefined })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Max Guests Capacity</label>
                  <input
                    type="number"
                    min={1}
                    value={editingRoom.capacity?.maxGuests || 2}
                    onChange={(e) =>
                      setEditingRoom({
                        ...editingRoom,
                        capacity: {
                          adults: Number(e.target.value),
                          children: 1,
                          maxGuests: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Bed Configuration</label>
                <input
                  type="text"
                  placeholder="e.g. 1 King-Size Orthopedic Bed + Optional Extra Cot"
                  value={editingRoom.bedConfiguration || ""}
                  onChange={(e) => setEditingRoom({ ...editingRoom, bedConfiguration: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Room Description (Public Website)</label>
                <textarea
                  rows={3}
                  placeholder="Describe the atmosphere, views, bathroom, and special comforts..."
                  value={editingRoom.description || ""}
                  onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none text-xs"
                />
              </div>

              {/* Images */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Featured Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={editingRoom.featuredImage || editingRoom.images?.[0] || ""}
                  onChange={(e) => {
                    const url = e.target.value;
                    setEditingRoom({
                      ...editingRoom,
                      featuredImage: url,
                      images: [url, ...(editingRoom.images?.slice(1) || [])],
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-xs focus:outline-none"
                />
              </div>

              {/* Statuses */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Reservation Status</label>
                  <select
                    value={editingRoom.reservationStatus || "AVAILABLE"}
                    onChange={(e) => setEditingRoom({ ...editingRoom, reservationStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-bold text-xs"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="OUT_OF_ORDER">Out of Order / Maintenance</option>
                    <option value="BLOCKED">Blocked</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Housekeeping Status</label>
                  <select
                    value={editingRoom.housekeepingStatus || "READY"}
                    onChange={(e) => setEditingRoom({ ...editingRoom, housekeepingStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-bold text-xs"
                  >
                    <option value="READY">Ready / Clean</option>
                    <option value="CLEANING">Cleaning In Progress</option>
                    <option value="DIRTY">Dirty / Needs Cleaning</option>
                    <option value="INSPECTION_REQUIRED">Inspection Required</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Publish to Website</label>
                  <select
                    value={editingRoom.publishStatus || "published"}
                    onChange={(e) => setEditingRoom({ ...editingRoom, publishStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-bold text-xs text-brand-maroon"
                  >
                    <option value="published">Published (Visible Publicly)</option>
                    <option value="draft">Draft (Hidden from Public)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber font-bold shadow-md transition-all flex items-center gap-2"
                >
                  {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{editingRoom.id ? "Save Changes" : "Create Room"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ROOM AVAILABILITY CALENDAR MODAL */}
      {isCalendarModalOpen && calendarRoom && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-maroon">
                  Room Availability Engine
                </span>
                <h3 className="font-serif text-xl font-bold text-gray-900">
                  {calendarRoom.name} (#{calendarRoom.roomNumber})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCalendarModalOpen(false)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-brand-cream/60 rounded-2xl border border-brand-maroon/15 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500">Current Operational State:</span>
                  <p className="font-bold text-brand-maroon">{calendarRoom.reservationStatus} • {calendarRoom.housekeepingStatus}</p>
                </div>
                <div className="text-right">
                  <span className="text-gray-500">Rate:</span>
                  <p className="font-bold text-brand-maroon font-mono">KES {calendarRoom.basePrice.toLocaleString()} / night</p>
                </div>
              </div>

              {/* Simulated 7-day schedule window */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-700 block">7-Day Operational Horizon</span>
                <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100 text-xs">
                  {[
                    { day: "Today (Sept 24)", status: calendarRoom.reservationStatus, clean: calendarRoom.housekeepingStatus },
                    { day: "Tomorrow (Sept 25)", status: calendarRoom.reservationStatus === "OCCUPIED" ? "OCCUPIED" : "AVAILABLE", clean: "READY" },
                    { day: "Friday (Sept 26)", status: "AVAILABLE", clean: "READY" },
                    { day: "Saturday (Sept 27)", status: "RESERVED", clean: "READY" },
                    { day: "Sunday (Sept 28)", status: "RESERVED", clean: "READY" },
                    { day: "Monday (Sept 29)", status: "AVAILABLE", clean: "READY" },
                    { day: "Tuesday (Sept 30)", status: "AVAILABLE", clean: "READY" },
                  ].map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50">
                      <span className="font-medium text-gray-800">{d.day}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            d.status === "AVAILABLE"
                              ? "bg-emerald-100 text-emerald-800"
                              : d.status === "OCCUPIED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {d.status}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{d.clean}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setIsCalendarModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-brand-maroon text-brand-amber font-bold text-xs"
              >
                Close Calendar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
