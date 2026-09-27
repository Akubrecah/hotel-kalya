"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Calendar,
  Sparkles,
  UtensilsCrossed,
  ChefHat,
  TrendingUp,
  ArrowRight,
  Clock,
  RefreshCw,
  Bed,
  Truck,
  Presentation,
  Wrench,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { OperationalAnalytics, Booking, Room, HousekeepingStatus } from "@/types/hospitality";
import { FoodOrder } from "@/types";
import { hasPermission } from "@/lib/rbac";
import { staffFetch } from "@/lib/api-client";

const ROLE_LABELS: Record<string, { label: string; dept: string }> = {
  RECEPTIONIST: { label: "Front Desk & Reservations", dept: "Front Office" },
  HOUSEKEEPING: { label: "Housekeeping & Room Operations", dept: "Housekeeping" },
  WAITER: { label: "Dining Room & Floor Waitstaff", dept: "Food & Beverage" },
  CHEF: { label: "Kitchen Display System (KDS)", dept: "Kitchen Operations" },
  EVENT_COORDINATOR: { label: "Conferences & Events Coordination", dept: "Conferences & Banqueting" },
  CATERING_STAFF: { label: "Outside Catering Logistics", dept: "Catering Operations" },
  MAINTENANCE: { label: "Engineering & Repairs", dept: "Maintenance" },
  MANAGER: { label: "Operations Command & Duty Management", dept: "Operations" },
  ADMIN: { label: "Executive Administration", dept: "Executive Management" },
};

export default function StaffDashboardPage() {
  const { user } = useAuth();
  const effectiveRole = user?.staffRole || (user?.role === "admin" ? "ADMIN" : "RECEPTIONIST");
  const roleMeta = ROLE_LABELS[effectiveRole] || { label: effectiveRole, dept: user?.department || "Operations" };
  const [analytics, setAnalytics] = useState<OperationalAnalytics | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // 86 / Out-of-stock items for Chef KDS
  const [outOfStockItems, setOutOfStockItems] = useState<Record<string, boolean>>({
    "Fresh Cow Milk": false,
    "Lake Victoria Tilapia": false,
    "Kienyeji Chicken": false,
    "Highland Goat Choma": false,
    "Passion Fruit Juice": false,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const promises: Promise<void>[] = [];

      if (hasPermission(user, "view_reports")) {
        promises.push(
          staffFetch("/api/analytics")
            .then((r) => r.json())
            .then((data) => {
              if (data.success && data.analytics) setAnalytics(data.analytics);
            })
            .catch(() => {})
        );
      }

      if (hasPermission(user, "view_reservations")) {
        promises.push(
          staffFetch("/api/bookings")
            .then((r) => r.json())
            .then((data) => {
              if (data.success && Array.isArray(data.reservations)) setBookings(data.reservations);
              else if (data.success && Array.isArray(data.bookings)) setBookings(data.bookings);
            })
            .catch(() => {})
        );
      }

      if (hasPermission(user, "view_rooms")) {
        promises.push(
          staffFetch("/api/rooms")
            .then((r) => r.json())
            .then((data) => {
              if (data.success && Array.isArray(data.rooms)) setRooms(data.rooms);
            })
            .catch(() => {})
        );
      }

      if (hasPermission(user, "view_orders")) {
        promises.push(
          staffFetch("/api/orders")
            .then((r) => r.json())
            .then((data) => {
              if (data.success && Array.isArray(data.orders)) setOrders(data.orders);
            })
            .catch(() => {})
        );
      }

      await Promise.all(promises);
    } catch (err) {
      console.error("Failed to load staff dashboard operational data", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Housekeeping status update
  const handleUpdateHousekeeping = async (roomId: string, newStatus: HousekeepingStatus) => {
    setUpdatingId(roomId);
    try {
      const res = await staffFetch("/api/housekeeping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          status: newStatus,
          staffName: user?.name || "Staff Member",
          notes: `Updated from staff dashboard by ${user?.name || "staff"}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRooms((prev) =>
          prev.map((r) =>
            r.id === roomId ? { ...r, housekeepingStatus: newStatus } : r
          )
        );
      }
    } catch (err) {
      console.error("Error updating housekeeping status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Reservation check-in / check-out
  const handleUpdateBookingStatus = async (
    bookingId: string,
    newStatus: "CHECKED_IN" | "CHECKED_OUT" | "CONFIRMED"
  ) => {
    setUpdatingId(bookingId);
    try {
      const res = await staffFetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: bookingId,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err) {
      console.error("Error updating reservation status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Order status progression
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await staffFetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, status: newStatus as FoodOrder["status"] }
              : o
          )
        );
      }
    } catch (err) {
      console.error("Error updating food order status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const toggle86Item = (item: string) => {
    setOutOfStockItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  // Partitioned Data
  const confirmedArrivals = bookings.filter((b) => b.status === "CONFIRMED");
  const inHouseGuests = bookings.filter((b) => b.status === "CHECKED_IN");
  const dirtyRooms = rooms.filter((r) => r.housekeepingStatus === "DIRTY");
  const cleaningRooms = rooms.filter((r) => r.housekeepingStatus === "CLEANING");
  const cleanRooms = rooms.filter((r) => r.housekeepingStatus === "CLEAN");
  const readyRooms = rooms.filter((r) => r.housekeepingStatus === "READY");
  const outOfOrderRooms = rooms.filter((r) => r.housekeepingStatus === "OUT_OF_ORDER");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Luxury Executive Workstation Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2A0B13] via-[#43141F] to-[#1D060D] border border-amber-500/20 text-white p-6 sm:p-7 shadow-md">
        {/* Subtle decorative glow */}
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-brand-amber/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-48 h-48 rounded-full bg-brand-maroon-light/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/25 text-amber-200 font-mono text-[11px] font-bold tracking-wide uppercase">
                {effectiveRole} STATION
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Shift Active • {roleMeta.dept}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {roleMeta.label}
            </h1>
            <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
              Welcome back, <strong className="text-white font-semibold">{user?.name || "Staff Member"}</strong>. Workstation connected to central hotel dispatch and operations.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold text-white border border-white/15 transition-all shadow-sm backdrop-blur-sm cursor-pointer"
              title="Reload live workstation telemetry and folios"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-brand-amber ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Updating..." : "Refresh Data"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. RECEPTIONIST / FRONT DESK DASHBOARD VIEW                               */}
      {/* ========================================================================= */}
      {effectiveRole === "RECEPTIONIST" && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-blue-50/70 p-4 rounded-3xl border border-blue-200/80 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-blue-800 block">Expected Arrivals Today</span>
              <p className="text-3xl font-serif font-black text-blue-900 mt-1">{confirmedArrivals.length}</p>
              <span className="text-[10px] text-blue-600 font-semibold">Ready for check-in</span>
            </div>

            <div className="bg-emerald-50/70 p-4 rounded-3xl border border-emerald-200/80 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">In-House Guests</span>
              <p className="text-3xl font-serif font-black text-emerald-900 mt-1">{inHouseGuests.length}</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Active stay folios</span>
            </div>

            <div className="bg-amber-50/70 p-4 rounded-3xl border border-amber-200/80 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">Rooms Ready to Sell</span>
              <p className="text-3xl font-serif font-black text-amber-900 mt-1">{readyRooms.length}</p>
              <span className="text-[10px] text-amber-600 font-semibold">Inspected &amp; Clean</span>
            </div>

            <div className="bg-red-50/70 p-4 rounded-3xl border border-red-200/80 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-red-800 block">Rooms Need Cleaning</span>
              <p className="text-3xl font-serif font-black text-red-900 mt-1">{dirtyRooms.length + cleaningRooms.length}</p>
              <span className="text-[10px] text-red-600 font-semibold">Dirty / Housekeeping</span>
            </div>
          </div>

          {/* Today's Expected Arrivals */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-brand-maroon flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-amber" />
                  <span>Front Desk — Today&apos;s Arrivals</span>
                </h2>
                <p className="text-xs text-gray-500">
                  Verify guest identification, check room readiness, and issue key cards
                </p>
              </div>
              <Link
                href="/staff/reservations"
                className="text-xs font-bold text-brand-maroon hover:text-brand-amber-dark flex items-center gap-1"
              >
                <span>Full Reservation Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {confirmedArrivals.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-2xl text-xs text-gray-500">
                No pending arrivals awaiting check-in for today.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F5] border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Booking Ref</th>
                      <th className="py-3 px-4">Guest Name</th>
                      <th className="py-3 px-4">Assigned Room</th>
                      <th className="py-3 px-4">Dates &amp; Nights</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Room Condition</th>
                      <th className="py-3 px-4 text-right">Front Desk Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {confirmedArrivals.map((b) => {
                      const roomObj = rooms.find((r) => r.roomNumber === b.roomNumber);
                      const isReady = roomObj?.housekeepingStatus === "READY";
                      return (
                        <tr key={b.id} className="hover:bg-brand-cream/30">
                          <td className="py-3 px-4 font-mono font-bold text-brand-maroon">{b.id}</td>
                          <td className="py-3 px-4 font-bold text-gray-900">{b.guestName}</td>
                          <td className="py-3 px-4 font-bold text-gray-800">Room {b.roomNumber}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {b.checkInDate} ({b.nights} nights)
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-gray-800">
                            KES {(b.totalAmount || b.totalPrice || 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                isReady ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {roomObj?.housekeepingStatus || "READY"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleUpdateBookingStatus(b.id, "CHECKED_IN")}
                              disabled={updatingId === b.id}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
                            >
                              {updatingId === b.id ? "Processing..." : "Complete Check-In"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* In-House Guests Table */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-brand-maroon flex items-center gap-2">
                  <Bed className="w-5 h-5 text-emerald-600" />
                  <span>In-House Guests Currently Staying</span>
                </h2>
                <p className="text-xs text-gray-500">
                  Active room occupancy, folio reconciliation, and checkout departure processing
                </p>
              </div>
            </div>

            {inHouseGuests.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-2xl text-xs text-gray-500">
                No in-house guests currently registered.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F5] border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Room #</th>
                      <th className="py-3 px-4">Guest</th>
                      <th className="py-3 px-4">Phone Contact</th>
                      <th className="py-3 px-4">Scheduled Departure</th>
                      <th className="py-3 px-4">Folio Status</th>
                      <th className="py-3 px-4 text-right">Departure Processing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {inHouseGuests.map((b) => (
                      <tr key={b.id} className="hover:bg-brand-cream/30">
                        <td className="py-3 px-4 font-bold text-brand-maroon">Room {b.roomNumber}</td>
                        <td className="py-3 px-4 font-bold text-gray-900">{b.guestName}</td>
                        <td className="py-3 px-4 text-gray-600 font-mono">{b.guestPhone}</td>
                        <td className="py-3 px-4 text-gray-600">{b.checkOutDate}</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                          KES {(b.totalAmount || b.totalPrice || 0).toLocaleString()} (Paid)
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleUpdateBookingStatus(b.id, "CHECKED_OUT")}
                            disabled={updatingId === b.id}
                            className="px-3.5 py-1.5 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
                          >
                            {updatingId === b.id ? "Checking Out..." : "Process Check-Out"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. HOUSEKEEPING DASHBOARD VIEW                                            */}
      {/* ========================================================================= */}
      {effectiveRole === "HOUSEKEEPING" && (
        <div className="space-y-6">
          {/* Cleanliness Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-red-50 p-4 rounded-2xl border border-red-200">
              <span className="text-[10px] uppercase font-bold text-red-700 block">🔴 Dirty (Needs Cleaning)</span>
              <p className="text-2xl font-bold text-red-800 font-serif mt-1">{dirtyRooms.length}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">🟡 Cleaning In Progress</span>
              <p className="text-2xl font-bold text-amber-800 font-serif mt-1">{cleaningRooms.length}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
              <span className="text-[10px] uppercase font-bold text-blue-700 block">🔵 Clean (Awaiting Inspection)</span>
              <p className="text-2xl font-bold text-blue-800 font-serif mt-1">{cleanRooms.length}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">🟢 Ready for Guests</span>
              <p className="text-2xl font-bold text-emerald-800 font-serif mt-1">{readyRooms.length}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200">
              <span className="text-[10px] uppercase font-bold text-gray-600 block">⚫ Out of Order</span>
              <p className="text-2xl font-bold text-gray-800 font-serif mt-1">{outOfOrderRooms.length}</p>
            </div>
          </div>

          {/* Interactive Room Sanitation Board */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-brand-maroon flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-amber" />
                  <span>Interactive Room Sanitation Board (One-Tap Status)</span>
                </h2>
                <p className="text-xs text-gray-500">
                  Tap any status pill to update the hotel inventory in real-time
                </p>
              </div>
              <Link
                href="/staff/housekeeping"
                className="text-xs font-bold text-brand-maroon hover:text-brand-amber-dark flex items-center gap-1"
              >
                <span>Full Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {rooms.slice(0, 12).map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-brand-maroon block">
                        Room {r.roomNumber}
                      </span>
                      <span className="text-[10px] text-gray-500 font-semibold">{r.name}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        r.housekeepingStatus === "READY"
                          ? "bg-emerald-100 text-emerald-800"
                          : r.housekeepingStatus === "DIRTY"
                          ? "bg-red-100 text-red-800"
                          : r.housekeepingStatus === "CLEANING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {r.housekeepingStatus}
                    </span>
                  </div>

                  {/* One-tap status buttons */}
                  <div className="grid grid-cols-4 gap-1 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => handleUpdateHousekeeping(r.id, "DIRTY")}
                      disabled={updatingId === r.id || r.housekeepingStatus === "DIRTY"}
                      className="py-1 px-1 rounded bg-red-100 hover:bg-red-200 text-red-800 disabled:opacity-30"
                    >
                      Dirty
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateHousekeeping(r.id, "CLEANING")}
                      disabled={updatingId === r.id || r.housekeepingStatus === "CLEANING"}
                      className="py-1 px-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 disabled:opacity-30"
                    >
                      Cleaning
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateHousekeeping(r.id, "CLEAN")}
                      disabled={updatingId === r.id || r.housekeepingStatus === "CLEAN"}
                      className="py-1 px-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 disabled:opacity-30"
                    >
                      Clean
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateHousekeeping(r.id, "READY")}
                      disabled={updatingId === r.id || r.housekeepingStatus === "READY"}
                      className="py-1 px-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 disabled:opacity-30"
                    >
                      Ready
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. WAITER / WAITSTAFF DASHBOARD VIEW                                      */}
      {/* ========================================================================= */}
      {effectiveRole === "WAITER" && (
        <div className="space-y-6">
          {/* Restaurant Floor Plan */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-brand-maroon flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-brand-amber" />
                  <span>Restaurant Floor Plan &amp; Table Activity</span>
                </h2>
                <p className="text-xs text-gray-500">
                  Main Dining Room, Garden Gazebos, and Mountain View Terrace tables
                </p>
              </div>
              <Link
                href="/staff/restaurant"
                className="px-3.5 py-1.5 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-colors shadow-sm"
              >
                + Take New Order
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { table: "Table 01", location: "Main Hall", pax: "4 Guests", status: "OCCUPIED", bill: "KES 3,200" },
                { table: "Table 02", location: "Main Hall", pax: "2 Guests", status: "AVAILABLE", bill: "Empty" },
                { table: "Table 03", location: "Terrace", pax: "6 Guests", status: "OCCUPIED", bill: "KES 5,400" },
                { table: "Table 04", location: "Terrace", pax: "4 Guests", status: "BILL_REQUESTED", bill: "KES 2,850" },
                { table: "Gazebo A", location: "Kalya Gardens", pax: "8 Guests", status: "OCCUPIED", bill: "KES 7,900" },
                { table: "Gazebo B", location: "Kalya Gardens", pax: "8 Guests", status: "AVAILABLE", bill: "Empty" },
              ].map((t) => (
                <div
                  key={t.table}
                  className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                    t.status === "OCCUPIED"
                      ? "bg-amber-50/60 border-amber-200"
                      : t.status === "BILL_REQUESTED"
                      ? "bg-blue-50/60 border-blue-200"
                      : "bg-emerald-50/60 border-emerald-200"
                  }`}
                >
                  <span className="text-sm font-bold text-gray-900 block font-serif">{t.table}</span>
                  <span className="text-[10px] text-gray-500 block">{t.location} • {t.pax}</span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                      t.status === "OCCUPIED"
                        ? "bg-amber-100 text-amber-800"
                        : t.status === "BILL_REQUESTED"
                        ? "bg-blue-100 text-blue-800 animate-pulse"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {t.status.replace("_", " ")}
                  </span>
                  <p className="text-[11px] font-mono font-bold text-gray-700">{t.bill}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Dining & Kitchen Orders Feed */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-brand-maroon">
              Active Dining &amp; Room Service Orders
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Table / Room</th>
                    <th className="py-3 px-4">Guest</th>
                    <th className="py-3 px-4">Items Ordered</th>
                    <th className="py-3 px-4">Kitchen Status</th>
                    <th className="py-3 px-4">Total Bill</th>
                    <th className="py-3 px-4 text-right">Waitstaff Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-brand-cream/30">
                      <td className="py-3 px-4 font-mono font-bold text-brand-maroon">{o.id}</td>
                      <td className="py-3 px-4 font-bold text-gray-800">{o.roomOrTableNumber}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">{o.customerName}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {o.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(", ")}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            o.status === "ready"
                              ? "bg-emerald-100 text-emerald-800 animate-bounce"
                              : o.status === "preparing"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">
                        KES {o.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {o.status === "ready" ? (
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(o.id, "delivered")}
                            className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                          >
                            Mark Delivered
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => alert(`Folio receipt printed for ${o.roomOrTableNumber}: KES ${o.total}`)}
                            className="px-3 py-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs"
                          >
                            Print Bill
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CHEF / KITCHEN DISPLAY SYSTEM (KDS) DASHBOARD VIEW                     */}
      {/* ========================================================================= */}
      {effectiveRole === "CHEF" && (
        <div className="space-y-6">
          {/* Active Cooking Tickets */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-brand-maroon flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-brand-amber" />
                  <span>Kitchen Display System (KDS) Live Tickets</span>
                </h2>
                <p className="text-xs text-gray-500">
                  Real-time cooking line progression and prep queue
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>Kitchen Line 1 &amp; 2 Active</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {orders
                .filter((o) => o.status === "received" || o.status === "preparing")
                .map((o) => (
                  <div
                    key={o.id}
                    className="p-5 rounded-3xl border-2 border-brand-maroon/20 bg-brand-cream/30 space-y-3 relative shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-brand-maroon/10 pb-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-brand-maroon block">{o.id}</span>
                        <span className="text-xs font-bold text-gray-800 font-serif">
                          {o.roomOrTableNumber} ({o.orderType.replace("_", " ")})
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          o.status === "preparing"
                            ? "bg-amber-100 text-amber-800 animate-pulse"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-gray-400">Order Items:</span>
                      <ul className="text-xs space-y-1">
                        {o.items.map((i, idx) => (
                          <li key={idx} className="flex items-start justify-between font-bold text-gray-900">
                            <span>{i.quantity}x {i.menuItem.name}</span>
                          </li>
                        ))}
                      </ul>
                      {o.specialNotes && (
                        <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200/80 font-medium">
                          Note: {o.specialNotes}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      {o.status === "received" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateOrderStatus(o.id, "preparing")}
                          className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-colors"
                        >
                          Start Cooking
                        </button>
                      )}
                      {o.status === "preparing" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateOrderStatus(o.id, "ready")}
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                        >
                          Mark Ready for Waitstaff
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* 86 Board / Ingredients Availability */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-brand-maroon">
              Kitchen 86 Board (Stock Toggles)
            </h2>
            <p className="text-xs text-gray-500">
              Toggle ingredients out-of-stock to alert dining waitstaff instantly
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.keys(outOfStockItems).map((item) => {
                const isOut = outOfStockItems[item];
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggle86Item(item)}
                    className={`p-3.5 rounded-2xl border text-center transition-all ${
                      isOut
                        ? "bg-red-50 border-red-300 text-red-800"
                        : "bg-emerald-50 border-emerald-200 text-emerald-800"
                    }`}
                  >
                    <span className="text-xs font-bold block">{item}</span>
                    <span className="text-[10px] uppercase font-extrabold mt-1 block">
                      {isOut ? "❌ 86 (Out of Stock)" : "✅ Available"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. EVENT COORDINATOR DASHBOARD VIEW                                       */}
      {/* ========================================================================= */}
      {effectiveRole === "EVENT_COORDINATOR" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-brand-maroon flex items-center gap-2">
                  <Presentation className="w-5 h-5 text-brand-amber" />
                  <span>Conference Halls &amp; Event Spaces Schedule</span>
                </h2>
                <p className="text-xs text-gray-500">
                  Mount Elgon Hall, Cherang&apos;any Hall, Executive Boardroom, and Kalya Gardens
                </p>
              </div>
              <Link
                href="/staff/conference"
                className="px-3.5 py-1.5 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-colors shadow-sm"
              >
                Manage Bookings
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  hall: "Mount Elgon Hall",
                  capacity: "250 Delegates",
                  event: "West Pokot County Health Conference",
                  timing: "8:00 AM - 5:00 PM",
                  setup: "Classroom Layout",
                  av: "Dual Projectors, 4 Wireless Mics",
                  teaStatus: "10:30 AM & 3:30 PM",
                },
                {
                  hall: "Cherang'any Hall",
                  capacity: "100 Delegates",
                  event: "Agricultural Cooperative Training",
                  timing: "9:00 AM - 4:00 PM",
                  setup: "U-Shape Configuration",
                  av: "65-inch Smart Display, PA System",
                  teaStatus: "11:00 AM",
                },
                {
                  hall: "Executive Boardroom",
                  capacity: "25 Executives",
                  event: "Regional Bank Strategy Retreat",
                  timing: "10:00 AM - 2:00 PM",
                  setup: "Boardroom Oval Table",
                  av: "Video Conference Cam, High-Speed Wi-Fi",
                  teaStatus: "Continuous Tea / Coffee",
                },
              ].map((h) => (
                <div key={h.hall} className="p-5 rounded-3xl border border-gray-200 bg-gray-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-sm text-brand-maroon">{h.hall}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-amber/20 text-brand-maroon font-bold">
                      {h.capacity}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-700">
                    <p className="font-bold text-gray-900">{h.event}</p>
                    <p className="text-[11px] text-gray-500">⏰ {h.timing}</p>
                    <p className="text-[11px] text-gray-500">📐 Setup: {h.setup}</p>
                    <p className="text-[11px] text-gray-500">🎙️ AV: {h.av}</p>
                    <p className="text-[11px] text-emerald-700 font-semibold">☕ Catering: {h.teaStatus}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Checklist verified for ${h.hall}`)}
                    className="w-full py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-brand-maroon hover:bg-brand-cream transition-colors"
                  >
                    Verify AV &amp; Setup Ready
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. OUTSIDE CATERING DASHBOARD VIEW                                        */}
      {/* ========================================================================= */}
      {effectiveRole === "CATERING_STAFF" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-brand-maroon flex items-center gap-2">
                  <Truck className="w-5 h-5 text-brand-amber" />
                  <span>Outside Catering Banquets &amp; Transport Schedule</span>
                </h2>
                <p className="text-xs text-gray-500">
                  Off-site county events, private banquets, and transport van dispatch
                </p>
              </div>
              <Link
                href="/staff/catering"
                className="px-3.5 py-1.5 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-colors shadow-sm"
              >
                Logistics Plan
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  client: "County Government of West Pokot",
                  venue: "Makutano Stadium Grounds",
                  guests: "450 Guests",
                  van: "Toyota Hiace (KDG 410A) - Departure 11:30 AM",
                  menu: "Nyama Choma, Pilau, Kienyeji Chicken, Chapati, Fresh Salads",
                  staff: "8 Buffet Service Waiters + 2 Chefs",
                  status: "PACKING",
                },
                {
                  client: "Kapenguria Law Courts End of Term Dinner",
                  venue: "Judicial Law Courts Compound",
                  guests: "120 Guests",
                  van: "Isuzu Van (KDH 209B) - Departure 4:00 PM",
                  menu: "Three-course plated dinner, Tilapia wet fry, Seasonal fruit platters",
                  staff: "4 Service Attendants + 1 Chef",
                  status: "CONFIRMED",
                },
              ].map((c, i) => (
                <div key={i} className="p-5 rounded-3xl border border-gray-200 bg-gray-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-sm text-brand-maroon">{c.client}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      {c.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-700">
                    <p className="font-semibold text-gray-900">📍 Venue: {c.venue} ({c.guests})</p>
                    <p className="text-[11px] text-gray-600">🚐 Transport: {c.van}</p>
                    <p className="text-[11px] text-gray-600">🍽️ Menu: {c.menu}</p>
                    <p className="text-[11px] text-gray-600">👥 Team: {c.staff}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Van packing verified for ${c.client}`)}
                    className="w-full py-1.5 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-colors shadow-sm"
                  >
                    Confirm Van Departure Checklist
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MAINTENANCE DASHBOARD VIEW                                             */}
      {/* ========================================================================= */}
      {effectiveRole === "MAINTENANCE" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-brand-maroon flex items-center gap-2">
              <Wrench className="w-5 h-5 text-brand-amber" />
              <span>Room Maintenance &amp; Repair Work Orders</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { room: "Room 105", issue: "Hot water shower pressure valve replacement", severity: "HIGH", assigned: "Eng. Samuel" },
                { room: "Cottage 4", issue: "Balcony door latch alignment", severity: "MEDIUM", assigned: "Eng. Samuel" },
                { room: "Boardroom", issue: "HDMI wall jack signal flickering", severity: "LOW", assigned: "IT Kevin" },
              ].map((t) => (
                <div key={t.room} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-brand-maroon">{t.room}</span>
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-100 text-red-800">
                      {t.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700">{t.issue}</p>
                  <p className="text-[10px] text-gray-400">Assigned: {t.assigned}</p>
                  <button
                    type="button"
                    onClick={() => alert(`Marked ${t.room} repair as completed.`)}
                    className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                  >
                    Mark Resolved
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MANAGER / ADMIN 360° DASHBOARD VIEW                                    */}
      {/* ========================================================================= */}
      {(effectiveRole === "MANAGER" || effectiveRole === "ADMIN") && (
        <div className="space-y-6">
          {/* Executive Analytics Ribbon */}
          {analytics && (
            <div className="bg-brand-cream/60 p-4 rounded-3xl border border-brand-maroon/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Today&apos;s Occupancy Rate</span>
                <span className="text-xl font-bold font-serif text-brand-maroon">{analytics.occupancyRatePercentage}%</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Today&apos;s Arrivals</span>
                <span className="text-xl font-bold font-serif text-emerald-700">{analytics.todayArrivals} Guests</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Scheduled Checkouts</span>
                <span className="text-xl font-bold font-serif text-amber-700">{analytics.todayDepartures} Rooms</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Average Daily Rate (ADR)</span>
                <span className="text-xl font-bold font-serif text-brand-maroon">KES {analytics.averageDailyRate?.toLocaleString() || "6,500"}</span>
              </div>
            </div>
          )}

          {/* Executive Overview KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Rooms</span>
              <p className="text-2xl font-bold text-brand-maroon font-serif">{rooms.length || 41}</p>
              <span className="text-[10px] text-gray-500">All Wings</span>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-3xl border border-emerald-200/80 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Available (Ready)</span>
              <p className="text-2xl font-bold text-emerald-700 font-serif">{readyRooms.length}</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Ready to sell</span>
            </div>

            <div className="bg-blue-50/60 p-4 rounded-3xl border border-blue-200/80 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-blue-800 block">Occupied</span>
              <p className="text-2xl font-bold text-blue-700 font-serif">{inHouseGuests.length}</p>
              <span className="text-[10px] text-blue-600 font-semibold">Active stays</span>
            </div>

            <div className="bg-red-50/60 p-4 rounded-3xl border border-red-200/80 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-red-800 block">Dirty Rooms</span>
              <p className="text-2xl font-bold text-red-700 font-serif">{dirtyRooms.length}</p>
              <span className="text-[10px] text-red-600 font-semibold">Needs turnover</span>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-3xl border border-amber-200/80 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-900 block">Cleaning in Progress</span>
              <p className="text-2xl font-bold text-amber-700 font-serif">{cleaningRooms.length}</p>
              <span className="text-[10px] text-amber-700 font-semibold">Housekeeping</span>
            </div>

            <div className="bg-gray-100 p-4 rounded-3xl border border-gray-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Out of Order</span>
              <p className="text-2xl font-bold text-gray-700 font-serif">{outOfOrderRooms.length}</p>
              <span className="text-[10px] text-gray-500 font-semibold">Maintenance</span>
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/roles"
              className="bg-white p-5 rounded-3xl border border-gray-200 hover:border-brand-maroon hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-brand-maroon text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-brand-amber" />
              </div>
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-brand-maroon transition-colors">
                Role &amp; RBAC Management
              </h3>
              <p className="text-xs text-gray-500">
                Create custom staff roles, configure granular permissions, and edit access.
              </p>
            </Link>

            <Link
              href="/admin/staff"
              className="bg-white p-5 rounded-3xl border border-gray-200 hover:border-brand-amber hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-brand-amber text-brand-maroon flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-brand-maroon transition-colors">
                Staff Roster &amp; Shifts
              </h3>
              <p className="text-xs text-gray-500">
                Manage employees, assign roles, and maintain WhatsApp emergency numbers.
              </p>
            </Link>

            <Link
              href="/admin/reports"
              className="bg-white p-5 rounded-3xl border border-gray-200 hover:border-brand-maroon hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5 text-emerald-200" />
              </div>
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-brand-maroon transition-colors">
                Financial &amp; ADR Reports
              </h3>
              <p className="text-xs text-gray-500">
                Live occupancy rate, RevPAR, dining revenue, and monthly trends.
              </p>
            </Link>

            <Link
              href="/admin/audit-log"
              className="bg-white p-5 rounded-3xl border border-gray-200 hover:border-brand-maroon hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gray-800 text-white flex items-center justify-center font-bold">
                <Clock className="w-5 h-5 text-gray-300" />
              </div>
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-brand-maroon transition-colors">
                Operational Audit Trail
              </h3>
              <p className="text-xs text-gray-500">
                Review room status transitions, check-in history, and staff action logs.
              </p>
            </Link>
          </div>

          {/* Master Recent Reservations Stream */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-brand-maroon">
                360° Real-Time Reservation Movements
              </h2>
              <Link
                href="/staff/reservations"
                className="text-xs font-bold text-brand-maroon hover:text-brand-amber-dark flex items-center gap-1"
              >
                <span>Full Reservation Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Ref Number</th>
                    <th className="py-3 px-4">Guest</th>
                    <th className="py-3 px-4">Room</th>
                    <th className="py-3 px-4">Dates</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.slice(0, 6).map((b) => (
                    <tr key={b.id} className="hover:bg-brand-cream/30">
                      <td className="py-3 px-4 font-mono font-bold text-brand-maroon">{b.id}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{b.guestName}</td>
                      <td className="py-3 px-4 text-gray-700">Room {b.roomNumber}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {b.checkInDate} → {b.checkOutDate} ({b.nights}n)
                      </td>
                      <td className="py-3 px-4">
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
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-gray-800">
                        KES {(b.totalAmount || b.totalPrice || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/staff/reservations`}
                          className="px-3 py-1 rounded-lg bg-brand-cream border border-brand-maroon/20 text-brand-maroon font-bold text-[11px] hover:bg-brand-maroon hover:text-white transition-colors"
                        >
                          View Folio
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
