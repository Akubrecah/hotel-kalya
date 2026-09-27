"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Bed,
  Utensils,
  PhoneCall,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Booking } from "@/types/hospitality";
import { BRAND } from "@/lib/constants";
import { getStandardWhatsAppUrl } from "@/lib/whatsapp";


export default function GuestDashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      try {
        const res = await fetch("/api/bookings");
        const json = await res.json();
        if (json.success && Array.isArray(json.bookings)) {
          // If logged in, filter by user email or name, or show all demo user bookings
          const userEmail = (user?.email || "guest@hotelkalya.com").toLowerCase();
          const userBookings = json.bookings.filter(
            (b: Booking) =>
              b.guestEmail.toLowerCase() === userEmail ||
              b.guestName.toLowerCase().includes("james")
          );
          setBookings(userBookings.length > 0 ? userBookings : json.bookings.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load guest bookings", err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, [user]);

  // Find active or upcoming booking
  const activeBooking = bookings.find(
    (b) => b.status === "CHECKED_IN" || b.status === "CONFIRMED"
  ) || bookings[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-maroon-dark via-brand-maroon to-brand-maroon-light p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/20 border border-brand-amber/40 text-brand-amber text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to Hotel Kalya Lounge</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Hello, {user?.name || "James Chemosit"}
          </h1>
          <p className="text-white/80 text-sm leading-relaxed">
            Manage your room stays, dining orders, conference inquiries, and get direct front desk assistance during your time in Kapenguria.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/availability"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-amber text-brand-maroon font-bold text-xs hover:bg-brand-amber-dark transition-all shadow-md"
            >
              <Bed className="w-4 h-4" />
              <span>Book a Stay</span>
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
            >
              <Utensils className="w-4 h-4 text-brand-amber" />
              <span>Order Room Service</span>
            </Link>
            <a
              href={getStandardWhatsAppUrl("Hello Hotel Kalya Front Desk, I am a guest in house and require assistance.", BRAND.phoneClean)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact Duty Desk on WhatsApp"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold text-xs transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp Duty Desk</span>
            </a>

          </div>
        </div>

        {/* Ambient background ornament */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-amber to-transparent pointer-events-none" />
      </div>

      {/* Primary Stay Card */}
      {loading ? (
        <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse flex items-center justify-center">
          <p className="text-sm text-gray-400">Loading your stay records...</p>
        </div>
      ) : activeBooking ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-maroon/10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-brand-maroon/60">
                Current or Upcoming Stay
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-brand-maroon mt-1">
                Room {activeBooking.roomNumber} — {activeBooking.roomType}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Reference ID: <span className="font-mono font-bold text-gray-800">{activeBooking.id}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                  activeBooking.status === "CHECKED_IN"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : activeBooking.status === "CONFIRMED"
                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                    : "bg-amber-100 text-amber-800 border border-amber-300"
                }`}
              >
                {activeBooking.status.replace("_", " ")}
              </span>

              <Link
                href={`/guest/bookings/${activeBooking.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-cream border border-brand-maroon/20 text-brand-maroon font-bold text-xs hover:bg-brand-cream/80 transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-brand-amber-dark" />
                <span>View Voucher</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold mb-1">
                <Calendar className="w-3.5 h-3.5 text-brand-maroon" />
                <span>Check-In</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{activeBooking.checkInDate}</p>
              <p className="text-[10px] text-gray-500">From 2:00 PM</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold mb-1">
                <Clock className="w-3.5 h-3.5 text-brand-maroon" />
                <span>Check-Out</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{activeBooking.checkOutDate}</p>
              <p className="text-[10px] text-gray-500">By 10:00 AM</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold mb-1">
                <Bed className="w-3.5 h-3.5 text-brand-maroon" />
                <span>Stay Duration</span>
              </div>
              <p className="text-sm font-bold text-gray-900">
                {activeBooking.nights} {activeBooking.nights === 1 ? "Night" : "Nights"}
              </p>
              <p className="text-[10px] text-gray-500">
                {activeBooking.adults} Adults {activeBooking.children > 0 ? `, ${activeBooking.children} Children` : ""}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-maroon" />
                <span>Payment</span>
              </div>
              <p className="text-sm font-bold text-brand-maroon">
                KES {activeBooking.totalAmount.toLocaleString()}
              </p>
              <p className="text-[10px] font-semibold text-emerald-600">{activeBooking.paymentStatus}</p>
            </div>
          </div>

          {activeBooking.specialRequests && (
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-brand-amber/30 text-xs text-brand-maroon">
              <strong>Special Requests:</strong> {activeBooking.specialRequests}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-gray-200 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-brand-amber mx-auto" />
          <h3 className="text-lg font-bold text-brand-maroon">No active reservations found</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            You do not currently have any active room bookings. Search live room availability in Kapenguria and secure your reservation in seconds.
          </p>
          <Link
            href="/availability"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-all"
          >
            <Bed className="w-4 h-4 text-brand-amber" />
            <span>Search Live Room Availability</span>
          </Link>
        </div>
      )}

      {/* Quick Hospitality Essentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wi-Fi & Connectivity */}
        <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-amber/15 text-brand-maroon flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-brand-amber-dark" />
          </div>
          <h3 className="font-bold text-brand-maroon text-base">Complimentary Wi-Fi</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            High-speed optical fiber is available in all rooms, gardens, and conference halls.
          </p>
          <div className="p-3 bg-brand-cream rounded-xl text-xs space-y-1 border border-brand-maroon/10">
            <p className="text-gray-500 text-[11px]">Network: <strong className="text-brand-maroon">HOTEL_KALYA_GUEST</strong></p>
            <p className="text-gray-500 text-[11px]">Password: <strong className="text-brand-maroon">Kalya@2026</strong></p>
          </div>
        </div>

        {/* Dining & Breakfast */}
        <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-amber/15 text-brand-maroon flex items-center justify-center font-bold">
            <Utensils className="w-5 h-5 text-brand-amber-dark" />
          </div>
          <h3 className="font-bold text-brand-maroon text-base">Dining &amp; Breakfast</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Fresh highland breakfast, all-day dining, and room service straight from our farmhouse kitchen.
          </p>
          <div className="p-3 bg-brand-cream rounded-xl text-xs space-y-1 border border-brand-maroon/10">
            <p className="text-gray-500 text-[11px]">Breakfast: <strong className="text-brand-maroon">6:30 AM – 10:00 AM</strong></p>
            <p className="text-gray-500 text-[11px]">Room Service: <strong className="text-brand-maroon">Dial Ext. 100</strong></p>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-maroon hover:text-brand-amber-dark transition-colors"
          >
            <span>Explore Dining Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Front Desk & Reception */}
        <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-amber/15 text-brand-maroon flex items-center justify-center font-bold">
            <PhoneCall className="w-5 h-5 text-brand-amber-dark" />
          </div>
          <h3 className="font-bold text-brand-maroon text-base">24/7 Front Desk</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Our duty managers and reception officers are on site 24/7 to assist with room needs, transport, or local excursions.
          </p>
          <div className="p-3 bg-brand-cream rounded-xl text-xs space-y-1 border border-brand-maroon/10">
            <p className="text-gray-500 text-[11px]">Desk Phone: <strong className="text-brand-maroon">+254 719 766649</strong></p>
            <p className="text-gray-500 text-[11px]">Location: <strong className="text-brand-maroon">Kapenguria, West Pokot</strong></p>
          </div>
          <Link
            href="/guest/messages"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-maroon hover:text-brand-amber-dark transition-colors"
          >
            <span>Chat With Concierge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Reservation History Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-maroon">
              All Booking History
            </h3>
            <p className="text-xs text-gray-500">Your reservations with Hotel Kalya</p>
          </div>

          <Link
            href="/guest/bookings"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-maroon hover:text-brand-amber-dark transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Ref Number</th>
                <th className="py-3 px-4">Room</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-brand-cream/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-maroon">{b.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-gray-800">
                    Room {b.roomNumber} ({b.roomType})
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    {b.checkInDate} → {b.checkOutDate} ({b.nights}n)
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    KES {b.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        b.status === "CONFIRMED"
                          ? "bg-blue-100 text-blue-800"
                          : b.status === "CHECKED_IN"
                          ? "bg-emerald-100 text-emerald-800"
                          : b.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/guest/bookings/${b.id}`}
                      className="px-3 py-1.5 rounded-lg bg-brand-cream border border-brand-maroon/20 text-brand-maroon font-bold text-[11px] hover:bg-brand-maroon hover:text-white transition-colors"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
