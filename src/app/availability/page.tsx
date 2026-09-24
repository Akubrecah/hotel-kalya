"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Users,
  Search,
  CheckCircle2,
  Bed,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { Room } from "@/types/hospitality";
import { RoomBookingModal } from "@/components/rooms/RoomBookingModal";
import { WhatsAppConsultButton } from "@/components/rooms/WhatsAppConsultButton";

export default function AvailabilityPage() {
  const [checkIn, setCheckIn] = useState("2026-09-25");
  const [checkOut, setCheckOut] = useState("2026-09-28");
  const [guests, setGuests] = useState(2);
  const [typeSlug, setTypeSlug] = useState("all");

  const [loading, setLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [unavailableRooms, setUnavailableRooms] = useState<Room[]>([]);

  // Selected room for booking modal
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const performSearch = async (inDate = checkIn, outDate = checkOut, gCount = guests, tSlug = typeSlug) => {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/rooms?checkIn=${encodeURIComponent(inDate)}&checkOut=${encodeURIComponent(outDate)}&guests=${gCount}&typeSlug=${tSlug}`
      );
      const data = await res.json();

      if (data.success) {
        setAvailableRooms(data.availableRooms || []);
        setUnavailableRooms(data.unavailableRooms || []);
      }
    } catch (err) {
      console.error("Availability search error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function initSearch() {
      try {
        const res = await fetch(
          `/api/rooms?checkIn=2026-09-25&checkOut=2026-09-28&guests=2&typeSlug=all`
        );
        const data = await res.json();
        if (!ignore && data.success) {
          setAvailableRooms(data.availableRooms || []);
          setUnavailableRooms(data.unavailableRooms || []);
        }
      } catch (err) {
        console.error("Availability search error", err);
      }
    }
    initSearch();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  // Calculate nights
  const inTime = new Date(checkIn).getTime();
  const outTime = new Date(checkOut).getTime();
  const nights = !isNaN(inTime) && !isNaN(outTime) && outTime > inTime
    ? Math.max(1, Math.round((outTime - inTime) / (1000 * 60 * 60 * 24)))
    : 1;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E0B0F] pb-24">
      {/* Header Banner */}
      <section className="bg-brand-maroon-dark text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-brand-amber">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="px-3 py-1 rounded-full bg-brand-amber text-brand-maroon font-black text-xs uppercase tracking-wider inline-block">
            Real-Time Reservation Engine
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white">
            Check Room &amp; Suite Availability
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto leading-relaxed">
            Our booking engine dynamically evaluates current occupancy, reserved dates, and housekeeping readiness
            to present only rooms guaranteed ready for your stay.
          </p>
        </div>
      </section>

      {/* Floating Search Controls Strip */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white p-5 sm:p-6 rounded-3xl shadow-xl border border-brand-amber/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
        >
          {/* Check-In */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Check-In
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-brand-maroon absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                required
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 focus:ring-2 focus:ring-brand-maroon"
              />
            </div>
          </div>

          {/* Check-Out */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Check-Out
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-brand-maroon absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                required
                min={checkIn}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 focus:ring-2 focus:ring-brand-maroon"
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Guests
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-brand-maroon absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 bg-white focus:ring-2 focus:ring-brand-maroon"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4+ Guests</option>
              </select>
            </div>
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Suite Type
            </label>
            <div className="relative">
              <SlidersHorizontal className="w-4 h-4 text-brand-maroon absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={typeSlug}
                onChange={(e) => setTypeSlug(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 bg-white focus:ring-2 focus:ring-brand-maroon"
              >
                <option value="all">All Suite Types</option>
                <option value="deluxe-exec">Deluxe Executive</option>
                <option value="standard-comfort">Standard Executive</option>
                <option value="kalya-cottage">Luxury Cottages</option>
                <option value="kalya-airbnb">AirBnB Serviced Stays</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-brand-amber" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-brand-amber" />
                  <span>Update Search</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {/* Search Context Summary Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h2 className="font-serif font-bold text-xl text-brand-maroon">
              {availableRooms.length} Suites Available for {checkIn} to {checkOut}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Stay duration: <strong>{nights} night{nights > 1 ? "s" : ""}</strong> • {guests} guest{guests > 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <WhatsAppConsultButton
              context={{
                serviceKey: "accommodation",
                checkInDate: checkIn,
                checkOutDate: checkOut,
                guestsCount: guests,
              }}
              variant="secondary"
              label="Consult on WhatsApp"
            />
          </div>
        </div>

        {/* Section 1: Available Rooms Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="font-serif font-bold text-lg text-emerald-950">
              Available &amp; Ready for Immediate Booking
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRooms.map((room) => {
              const stayTotal = nights * room.basePrice;

              return (
                <div
                  key={room.id}
                  className="bg-white rounded-3xl border border-gray-200/80 hover:border-brand-amber hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Thumbnail Image */}
                    <div className="relative h-52 w-full overflow-hidden">
                      <Image
                        src={room.images[0]}
                        alt={room.name}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute top-3 left-3 bg-brand-maroon text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full shadow">
                        Room {room.roomNumber}
                      </div>
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                        <span>Ready</span>
                      </div>
                    </div>

                    {/* Room Info */}
                    <div className="p-6 pb-0 space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{room.type}</span>
                        <span>{room.bedConfiguration}</span>
                      </div>

                      <h4 className="font-serif font-bold text-lg text-brand-maroon line-clamp-1">
                        {room.name}
                      </h4>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {room.description}
                      </p>

                      {/* Amenities Preview */}
                      <div className="flex flex-wrap gap-1 pt-2">
                        {room.amenities.slice(0, 3).map((a, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md text-gray-600 font-medium"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price & Action Footer */}
                  <div className="p-6 pt-5 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">
                        {nights} Night Total
                      </span>
                      <span className="font-serif font-black text-xl text-brand-maroon">
                        KES {stayTotal.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-500 block">
                        (KES {room.basePrice.toLocaleString()} / night)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/rooms/${room.id}`}
                        className="py-2.5 px-3 rounded-xl border border-brand-maroon/20 text-brand-maroon text-xs font-bold hover:bg-brand-cream"
                      >
                        Details
                      </Link>

                      <button
                        type="button"
                        onClick={() => setSelectedRoom(room)}
                        className="py-2.5 px-4 rounded-xl bg-brand-maroon text-white text-xs font-bold hover:bg-brand-maroon-dark transition-all shadow"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {availableRooms.length === 0 && (
            <div className="bg-white p-12 rounded-3xl border text-center space-y-3">
              <Bed className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-gray-800">
                No rooms available for the selected dates
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                All suites in this category are reserved for {checkIn} to {checkOut}.
                Try shifting your travel dates or consult with our reservations officer on WhatsApp.
              </p>
            </div>
          )}
        </div>

        {/* Section 2: Currently Occupied / Reserved Rooms */}
        {unavailableRooms.length > 0 && (
          <div className="space-y-4 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <h3 className="font-serif font-bold text-base text-gray-700">
                Reserved or Under Maintenance for These Dates ({unavailableRooms.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {unavailableRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-200 opacity-75 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-gray-600">Room {room.roomNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      {room.housekeepingStatus === "OUT_OF_ORDER" ? "Out of Order" : "Reserved"}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 truncate">{room.name}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-1">{room.type}</p>
                  <div className="pt-1">
                    <Link
                      href={`/rooms/${room.id}`}
                      className="text-brand-maroon underline font-bold text-[11px]"
                    >
                      View Calendar &amp; Other Dates →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedRoom && (
        <RoomBookingModal
          room={selectedRoom}
          initialCheckIn={checkIn}
          initialCheckOut={checkOut}
          onClose={() => setSelectedRoom(null)}
          onBookingSuccess={() => {
            performSearch();
          }}
        />
      )}
    </div>
  );
}
