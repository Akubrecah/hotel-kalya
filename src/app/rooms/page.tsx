"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bed,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Calendar,
  Users,
  Maximize2,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Room } from "@/types/hospitality";
import { useMounted } from "@/lib/useMounted";
import { BRAND } from "@/lib/constants";
import { getStandardWhatsAppUrl } from "@/lib/whatsapp";

export default function RoomsPage() {
  const mounted = useMounted();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceSort, setPriceSort] = useState<"default" | "low" | "high">("default");
  const [selectedCalendarRoom, setSelectedCalendarRoom] = useState<Room | null>(null);

  // WhatsApp enquiry generator with centralized fallback
  const [officialWhatsApp, setOfficialWhatsApp] = useState(BRAND.phoneClean);


  useEffect(() => {
    async function loadData() {
      try {
        const [roomsRes, settingsRes] = await Promise.all([
          fetch("/api/rooms?published=true"),
          fetch("/api/settings"),
        ]);
        const roomsData = await roomsRes.json();
        const settingsData = await settingsRes.json();

        if (roomsData.success && Array.isArray(roomsData.rooms)) {
          setRooms(roomsData.rooms);
        }
        if (settingsData.success && settingsData.settings?.officialWhatsApp) {
          setOfficialWhatsApp(settingsData.settings.officialWhatsApp.replace(/[^0-9+]/g, ""));
        }
      } catch (err) {
        console.error("Failed to load rooms", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = [
    { id: "all", label: "All Rooms & Suites" },
    { id: "deluxe-exec", label: "Executive Suites" },
    { id: "standard-room", label: "Standard Rooms" },
    { id: "garden-cottage", label: "Garden Cottages" },
  ];

  // Filter & sort
  let filtered = rooms.filter((r) => {
    const matchCategory =
      selectedCategory === "all" ||
      r.typeSlug === selectedCategory ||
      r.type.toLowerCase().includes(selectedCategory.replace("-", " "));
    const matchSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.amenities.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchSearch;
  });

  if (priceSort === "low") {
    filtered.sort((a, b) => a.basePrice - b.basePrice);
  } else if (priceSort === "high") {
    filtered.sort((a, b) => b.basePrice - a.basePrice);
  }

  const getWhatsAppLink = (room: Room) => {
    const msg = `Hello Hotel Kalya, I would like to enquire about Room ${room.roomNumber} (${room.name}) priced at KES ${room.basePrice.toLocaleString()} per night. Please confirm availability.`;
    return getStandardWhatsAppUrl(msg, officialWhatsApp);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: "Rooms & Accommodation" },
        ]}
      />

      {/* Hero Header */}
      <section className="bg-brand-cream/80 py-12 lg:py-16 border-b border-brand-maroon/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <span className="text-xs uppercase tracking-widest font-extrabold text-brand-maroon mb-2 block">
                Kapenguria Highland Accommodation
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-brand-maroon leading-tight">
                Rooms, Suites &amp; Highland Stays
              </h1>
              <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed">
                Experience quiet mountain air, restorative sleep, en-suite hot showers, and farm-fresh morning breakfasts at Hotel Kalya.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={getStandardWhatsAppUrl(
                  "Hello Hotel Kalya, I would like to check accommodation options.",
                  officialWhatsApp
                )}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Front Desk about accommodation on WhatsApp"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span>WhatsApp Front Desk</span>
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* Search & Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === c.id
                    ? "bg-brand-maroon text-brand-amber shadow"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search amenities, title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-maroon"
              />
            </div>

            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as any)}
              className="px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none"
            >
              <option value="default">Sort by Rate</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Rooms Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-brand-maroon mb-3" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Loading Hotel Kalya room collection...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-gray-50 rounded-3xl border border-gray-200">
            <Bed className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="font-bold text-gray-700 text-sm">No rooms found matching your search</p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchTerm("");
              }}
              className="text-xs text-brand-maroon font-bold underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((room) => {
              const imageSrc =
                room.featuredImage ||
                room.images?.[0] ||
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200";

              const isAvailable = room.reservationStatus === "AVAILABLE";

              return (
                <div
                  key={room.id}
                  className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Photo & Badges */}
                  <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={imageSrc}
                      alt={room.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-brand-maroon text-brand-amber font-mono font-black text-xs shadow-md">
                        #{room.roomNumber}
                      </span>
                      {room.type && (
                        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-bold text-xs">
                          {room.type}
                        </span>
                      )}
                    </div>

                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase shadow backdrop-blur-md ${
                          isAvailable
                            ? "bg-emerald-600/90 text-white"
                            : "bg-amber-600/90 text-white"
                        }`}
                      >
                        {isAvailable ? "Available" : "Reserved / Inquiry"}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="font-mono">
                        <span className="text-2xl font-black text-brand-amber">
                          KES {room.basePrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-white/80 font-sans ml-1">/ night</span>
                        {room.discountPrice && (
                          <span className="text-xs text-white/60 line-through ml-2">
                            KES {room.discountPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Body & Specs */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-brand-maroon group-hover:text-brand-maroon-dark transition-colors">
                          {room.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {room.description || "Executive accommodation tailored for traveling professionals, NGO personnel, and holiday seekers."}
                        </p>
                      </div>

                      {/* Specs Row */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-2xl border border-gray-100 font-medium text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-brand-maroon" />
                          <span>Max {room.capacity?.maxGuests || 2} Guests</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Bed className="w-3.5 h-3.5 text-brand-maroon" />
                          <span className="truncate">{room.bedConfiguration || room.bedType || "1 Bed"}</span>
                        </div>
                      </div>

                      {/* Amenities Pills */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                          Included Comforts:
                        </span>
                        <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-600">
                          {room.amenities.slice(0, 4).map((amenity, idx) => (
                            <div key={idx} className="flex items-center gap-1 truncate">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="truncate">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCalendarRoom(room)}
                        className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-colors"
                        title="Check Availability Calendar"
                      >
                        <Calendar className="w-4 h-4 text-brand-maroon" />
                        <span className="hidden sm:inline">Calendar</span>
                      </button>

                      <a
                        href={getWhatsAppLink(room)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span>Enquire</span>
                      </a>

                      <Link
                        href={`/booking?roomId=${encodeURIComponent(room.id)}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber text-xs font-bold shadow transition-colors"
                      >
                        <span>Book Room</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CUSTOMER ROOM AVAILABILITY MODAL */}
      {selectedCalendarRoom && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-maroon">
                  Room Availability Checker
                </span>
                <h3 className="font-serif text-xl font-bold text-gray-900">
                  {selectedCalendarRoom.name} (#{selectedCalendarRoom.roomNumber})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCalendarRoom(null)}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-brand-cream/60 rounded-2xl border border-brand-maroon/15 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500">Current Status:</span>
                  <p className="font-bold text-brand-maroon">
                    {selectedCalendarRoom.reservationStatus === "AVAILABLE" ? "Ready for Booking" : "Reserved / In-House"}
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-gray-500">Rate:</span>
                  <p className="font-bold text-brand-maroon">KES {selectedCalendarRoom.basePrice.toLocaleString()} / night</p>
                </div>
              </div>

              {/* 5-Day Visual Calendar */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-700 block">Upcoming Schedule Horizon</span>
                <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100 text-xs">
                  {[
                    { date: "Sept 24 (Today)", status: selectedCalendarRoom.reservationStatus === "AVAILABLE" ? "Available" : "Occupied" },
                    { date: "Sept 25 (Tomorrow)", status: "Available" },
                    { date: "Sept 26 (Friday)", status: "Available" },
                    { date: "Sept 27 (Saturday)", status: "Reserved" },
                    { date: "Sept 28 (Sunday)", status: "Reserved" },
                  ].map((row, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50">
                      <span className="font-medium text-gray-800">{row.date}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          row.status === "Available"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
              <a
                href={getWhatsAppLink(selectedCalendarRoom)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Enquire Dates on WhatsApp</span>
              </a>
              <Link
                href={`/booking?roomId=${encodeURIComponent(selectedCalendarRoom.id)}`}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-brand-maroon text-brand-amber font-bold text-xs text-center"
              >
                Proceed to Reservation
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
