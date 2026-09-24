"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Search,
  Bed,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Booking } from "@/types/hospitality";

export default function GuestBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings");
        const json = await res.json();
        if (json.success && Array.isArray(json.bookings)) {
          setBookings(json.bookings);
        }
      } catch {
        console.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab !== "ALL" && b.status !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.id.toLowerCase().includes(q) ||
        b.roomNumber.toLowerCase().includes(q) ||
        b.roomType.toLowerCase().includes(q) ||
        b.guestName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon">
            My Reservations
          </h1>
          <p className="text-xs text-gray-500">
            View your active bookings, past history, and download official booking vouchers
          </p>
        </div>

        <Link
          href="/availability"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-all shadow"
        >
          <Bed className="w-4 h-4 text-brand-amber" />
          <span>New Reservation</span>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200/80 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0">
          {[
            { label: "All Bookings", value: "ALL" },
            { label: "Confirmed", value: "CONFIRMED" },
            { label: "Checked In", value: "CHECKED_IN" },
            { label: "Checked Out", value: "CHECKED_OUT" },
            { label: "Cancelled", value: "CANCELLED" },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.value
                  ? "bg-brand-amber text-brand-maroon shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ref or room..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber focus:bg-white"
          />
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-gray-100">
          <p className="text-xs text-gray-400 animate-pulse">Loading reservations from database...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 space-y-3">
          <AlertCircle className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-800">No reservations found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            We couldn&apos;t find any bookings matching your current filter. Check availability to book a stay.
          </p>
          <Link
            href="/availability"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-amber text-brand-maroon font-bold text-xs hover:bg-brand-amber-dark transition-all"
          >
            <span>Search Rooms</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 hover:border-brand-amber/60 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-brand-maroon bg-brand-cream px-2.5 py-1 rounded-lg border border-brand-maroon/10">
                    {b.id}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      b.status === "CONFIRMED"
                        ? "bg-blue-100 text-blue-800"
                        : b.status === "CHECKED_IN"
                        ? "bg-emerald-100 text-emerald-800"
                        : b.status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {b.status.replace("_", " ")}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Booked on {new Date(b.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-serif font-bold text-gray-900">
                  Room {b.roomNumber} — {b.roomType}
                </h3>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-maroon" />
                    <strong>{b.checkInDate}</strong> → <strong>{b.checkOutDate}</strong> ({b.nights} {b.nights === 1 ? "night" : "nights"})
                  </span>
                  <span>•</span>
                  <span>{b.adults} Adults {b.children > 0 ? `, ${b.children} Children` : ""}</span>
                  <span>•</span>
                  <span>Payment: <strong className="text-brand-maroon">{b.paymentStatus}</strong></span>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 gap-3">
                <div className="text-left md:text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Cost</span>
                  <span className="text-lg font-extrabold text-brand-maroon font-serif">
                    KES {b.totalAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/guest/bookings/${b.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-all shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5 text-brand-amber" />
                    <span>View Voucher</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
