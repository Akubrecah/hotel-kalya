"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  AlertCircle,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import { Booking, ReservationLifecycleStatus } from "@/types/hospitality";
import { staffFetch } from "@/lib/api-client";

export default function StaffReservationsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadBookings = React.useCallback(async () => {
    try {
      const res = await staffFetch("/api/bookings");
      const data = await res.json();
      const list = data.reservations || data.bookings || [];
      if (data.success && Array.isArray(list)) {
        setBookings(list);
      }
    } catch (err) {
      console.error("Failed to load reservations", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchBookings() {
      try {
        const res = await staffFetch("/api/bookings");
        const data = await res.json();
        const list = data.reservations || data.bookings || [];
        if (!ignore && data.success && Array.isArray(list)) {
          setBookings(list);
        }
      } catch (err) {
        console.error("Failed to load reservations", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    fetchBookings();
    return () => {
      ignore = true;
    };
  }, []);

  const handleStatusChange = async (id: string, newStatus: ReservationLifecycleStatus) => {
    setActionLoading(id);
    try {
      const res = await staffFetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          operatorName: "Duty Receptionist",
        }),
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? data.booking : b))
        );
      } else {
        alert(data.error || "Action failed.");
      }
    } catch {
      alert("Network error updating status.");
    } finally {
      setActionLoading(null);
    }
  };

  const todayStr = "2026-09-24";
  const todayArrivals = bookings.filter((b) => b.checkInDate === todayStr && b.status !== "CANCELLED").length;
  const todayDepartures = bookings.filter((b) => b.checkOutDate === todayStr && b.status !== "CANCELLED").length;
  const inHouseGuests = bookings.filter((b) => b.status === "CHECKED_IN").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;

  const filtered = bookings.filter((b) => {
    if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.guestName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.roomNumber.toLowerCase().includes(q) ||
        b.guestPhone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon">
            Front Desk &amp; Reservation Operations
          </h1>
          <p className="text-xs text-gray-500">
            Real-time guest arrivals, check-in processing, departures, and room allocations
          </p>
        </div>

        <button
          type="button"
          onClick={loadBookings}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brand-maroon ${loading ? "animate-spin" : ""}`} />
          <span>Sync Desk</span>
        </button>
      </div>

      {/* Front Desk Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Today&apos;s Arrivals</span>
          <p className="text-2xl font-bold text-blue-700 font-serif">{todayArrivals}</p>
          <span className="text-[10px] text-gray-500">Expected Check-ins</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">In-House Guests</span>
          <p className="text-2xl font-bold text-emerald-700 font-serif">{inHouseGuests}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Active Checked-In</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Today&apos;s Departures</span>
          <p className="text-2xl font-bold text-amber-700 font-serif">{todayDepartures}</p>
          <span className="text-[10px] text-gray-500">Scheduled Check-outs</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Upcoming Confirmed</span>
          <p className="text-2xl font-bold text-brand-maroon font-serif">{confirmedCount}</p>
          <span className="text-[10px] text-gray-500">Future Bookings</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {[
            { label: "All Reservations", value: "ALL" },
            { label: "Confirmed", value: "CONFIRMED" },
            { label: "Checked In", value: "CHECKED_IN" },
            { label: "Checked Out", value: "CHECKED_OUT" },
            { label: "Cancelled", value: "CANCELLED" },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === tab.value
                  ? "bg-brand-maroon text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guest, ref, room, phone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber focus:bg-white"
          />
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400 animate-pulse">
            Loading reservations registry...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-sm font-bold text-gray-800">No reservations found</p>
            <p className="text-xs text-gray-500">Try adjusting your search criteria or status filter.</p>
          </div>
        ) : (
          <>
            {/* Mobile Stacked Cards View (<lg) */}
            <div className="block lg:hidden divide-y divide-gray-100">
              {filtered.map((b) => {
                const isOperating = actionLoading === b.id;
                const waUrl = `https://wa.me/${b.guestPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Hello ${b.guestName}, this is Hotel Kalya Reception desk regarding your stay in Room ${b.roomNumber} (Ref: ${b.id}). How may we assist you today?`
                )}`;

                return (
                  <div key={b.id} className="p-4 space-y-3 hover:bg-brand-cream/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-brand-maroon text-xs">{b.id}</span>
                        <span className="px-2 py-0.5 rounded-lg bg-gray-100 font-bold text-gray-900 text-xs">
                          Room {b.roomNumber}
                        </span>
                      </div>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
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
                    </div>

                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{b.guestName}</p>
                        <p className="text-gray-500 text-xs">{b.guestPhone}</p>
                        <p className="text-gray-400 text-[11px] truncate max-w-[200px]">{b.guestEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">KES {b.totalAmount.toLocaleString()}</p>
                        <span
                          className={`text-[10px] font-bold ${
                            b.paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-600"
                          }`}
                        >
                          {b.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-[11px] text-gray-600 flex justify-between items-center">
                      <div>
                        <span className="font-medium">{b.checkInDate} → {b.checkOutDate}</span>
                        <span className="text-gray-400 block text-[10px]">
                          {b.nights} {b.nights === 1 ? "night" : "nights"} • {b.adults} Adults
                        </span>
                      </div>
                      <span className="text-gray-500 font-medium truncate max-w-[120px]">{b.roomType}</span>
                    </div>

                    {/* Touch Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      {b.status === "CONFIRMED" && (
                        <button
                          type="button"
                          disabled={isOperating}
                          onClick={() => handleStatusChange(b.id, "CHECKED_IN")}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors disabled:opacity-50 text-center"
                        >
                          {isOperating ? "..." : "Check In"}
                        </button>
                      )}

                      {b.status === "CHECKED_IN" && (
                        <button
                          type="button"
                          disabled={isOperating}
                          onClick={() => handleStatusChange(b.id, "CHECKED_OUT")}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors disabled:opacity-50 text-center"
                        >
                          {isOperating ? "..." : "Check Out"}
                        </button>
                      )}

                      {b.status === "CONFIRMED" && (
                        <button
                          type="button"
                          disabled={isOperating}
                          onClick={() => handleStatusChange(b.id, "CANCELLED")}
                          className="py-2.5 px-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (lg+) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Ref Number</th>
                  <th className="py-3.5 px-4">Guest Details</th>
                  <th className="py-3.5 px-4">Room Allocated</th>
                  <th className="py-3.5 px-4">Stay Dates</th>
                  <th className="py-3.5 px-4">Financials</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Desk Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((b) => {
                  const isOperating = actionLoading === b.id;
                  const waUrl = `https://wa.me/${b.guestPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hello ${b.guestName}, this is Hotel Kalya Reception desk regarding your stay in Room ${b.roomNumber} (Ref: ${b.id}). How may we assist you today?`
                  )}`;

                  return (
                    <tr key={b.id} className="hover:bg-brand-cream/30 transition-colors">
                      {/* Ref */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-brand-maroon block">{b.id}</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Guest */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-gray-900">{b.guestName}</p>
                        <p className="text-[11px] text-gray-500">{b.guestPhone}</p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[140px]">{b.guestEmail}</p>
                      </td>

                      {/* Room */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-lg bg-gray-100 font-bold text-gray-900">
                          Room {b.roomNumber}
                        </span>
                        <p className="text-[11px] text-gray-500 mt-0.5">{b.roomType}</p>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-gray-800">
                          {b.checkInDate} → {b.checkOutDate}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {b.nights} {b.nights === 1 ? "night" : "nights"} • {b.adults} Adults
                        </p>
                      </td>

                      {/* Financials */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-gray-900">KES {b.totalAmount.toLocaleString()}</p>
                        <span
                          className={`text-[10px] font-bold ${
                            b.paymentStatus === "Paid"
                              ? "text-emerald-600"
                              : "text-amber-600"
                          }`}
                        >
                          {b.paymentStatus}
                        </span>
                      </td>

                      {/* Status */}
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
                          {b.status.replace("_", " ")}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                        {/* WhatsApp Guest */}
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 inline-flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="WhatsApp Guest"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>

                        {/* Check In Action */}
                        {b.status === "CONFIRMED" && (
                          <button
                            type="button"
                            disabled={isOperating}
                            onClick={() => handleStatusChange(b.id, "CHECKED_IN")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition-colors disabled:opacity-50"
                          >
                            {isOperating ? "..." : "Check In"}
                          </button>
                        )}

                        {/* Check Out Action */}
                        {b.status === "CHECKED_IN" && (
                          <button
                            type="button"
                            disabled={isOperating}
                            onClick={() => handleStatusChange(b.id, "CHECKED_OUT")}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 transition-colors disabled:opacity-50"
                          >
                            {isOperating ? "..." : "Check Out"}
                          </button>
                        )}

                        {/* Cancel Action if confirmed */}
                        {b.status === "CONFIRMED" && (
                          <button
                            type="button"
                            disabled={isOperating}
                            onClick={() => handleStatusChange(b.id, "CANCELLED")}
                            className="px-2 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-bold text-[11px] transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
