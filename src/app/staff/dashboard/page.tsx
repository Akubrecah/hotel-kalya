"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { OperationalAnalytics, Booking } from "@/types/hospitality";

export default function StaffDashboardPage() {
  const [analytics, setAnalytics] = useState<OperationalAnalytics | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = React.useCallback(async () => {
    try {
      const [analyticsRes, bookingsRes] = await Promise.all([
        fetch("/api/analytics"),
        fetch("/api/bookings"),
      ]);
      const analyticsData = await analyticsRes.json();
      const bookingsData = await bookingsRes.json();

      if (analyticsData.success) {
        setAnalytics(analyticsData.analytics);
      }
      if (bookingsData.success && Array.isArray(bookingsData.bookings)) {
        setRecentBookings(bookingsData.bookings.slice(0, 5));
      }
    } catch (err) {
      console.error("Failed to load staff dashboard data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      try {
        const [analyticsRes, bookingsRes] = await Promise.all([
          fetch("/api/analytics"),
          fetch("/api/bookings"),
        ]);
        const analyticsData = await analyticsRes.json();
        const bookingsData = await bookingsRes.json();

        if (!ignore && analyticsData.success) {
          setAnalytics(analyticsData.analytics);
        }
        if (!ignore && bookingsData.success && Array.isArray(bookingsData.bookings)) {
          setRecentBookings(bookingsData.bookings.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load staff dashboard data", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    fetchData();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon">
            Operational Shift Command
          </h1>
          <p className="text-xs text-gray-500">
            Real-time room occupancy, front-desk movements, dining orders, and housekeeping status
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brand-maroon ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Live Metrics</span>
        </button>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Rooms</span>
          <p className="text-2xl font-bold text-brand-maroon font-serif">{analytics?.totalRooms || 41}</p>
          <span className="text-[10px] text-gray-500">All Wings</span>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-3xl border border-emerald-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block">Available (Ready)</span>
          <p className="text-2xl font-bold text-emerald-700 font-serif">{analytics?.availableRooms || 0}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Ready for Guest</span>
        </div>

        <div className="bg-blue-50/60 p-4 rounded-3xl border border-blue-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-blue-800 block">Occupied</span>
          <p className="text-2xl font-bold text-blue-700 font-serif">{analytics?.occupiedRooms || 0}</p>
          <span className="text-[10px] text-blue-600 font-semibold">Checked-In</span>
        </div>

        <div className="bg-red-50/60 p-4 rounded-3xl border border-red-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-red-800 block">Dirty Rooms</span>
          <p className="text-2xl font-bold text-red-700 font-serif">{analytics?.dirtyRooms || 0}</p>
          <span className="text-[10px] text-red-600 font-semibold">Needs Cleaning</span>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-3xl border border-amber-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-900 block">Cleaning in Progress</span>
          <p className="text-2xl font-bold text-amber-700 font-serif">{analytics?.cleaningRooms || 0}</p>
          <span className="text-[10px] text-amber-700 font-semibold">Housekeeping</span>
        </div>

        <div className="bg-gray-100 p-4 rounded-3xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-500 block">Out of Order</span>
          <p className="text-2xl font-bold text-gray-700 font-serif">{analytics?.outOfOrderRooms || 0}</p>
          <span className="text-[10px] text-gray-500 font-semibold">Maintenance</span>
        </div>
      </div>

      {/* Operational Highlights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase">Today&apos;s Arrivals</span>
            <p className="text-xl font-bold text-gray-900 mt-1">{analytics?.todayArrivals || 0} Guests</p>
            <p className="text-[11px] text-gray-500">Scheduled 2:00 PM check-in</p>
          </div>
          <Link
            href="/staff/reservations"
            className="p-3 rounded-2xl bg-brand-cream text-brand-maroon hover:bg-brand-maroon hover:text-white transition-colors"
          >
            <Calendar className="w-5 h-5" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase">Today&apos;s Departures</span>
            <p className="text-xl font-bold text-gray-900 mt-1">{analytics?.todayDepartures || 0} Rooms</p>
            <p className="text-[11px] text-gray-500">Scheduled 10:00 AM checkout</p>
          </div>
          <Link
            href="/staff/reservations"
            className="p-3 rounded-2xl bg-brand-cream text-brand-maroon hover:bg-brand-maroon hover:text-white transition-colors"
          >
            <Clock className="w-5 h-5" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase">Occupancy Rate</span>
            <p className="text-xl font-bold text-brand-maroon mt-1">
              {analytics?.occupancyRatePercentage || 0}%
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold">Active in-house guest stays</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Department Quick Navigation Cards */}
      <div className="space-y-4">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
          Departmental Action Workspaces
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Front Desk */}
          <Link
            href="/staff/reservations"
            className="bg-white p-5 rounded-3xl border border-gray-200/80 hover:border-brand-maroon hover:shadow-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-brand-maroon text-white flex items-center justify-center font-bold shadow">
              <Calendar className="w-5 h-5 text-brand-amber" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-brand-maroon transition-colors">
                Front Desk Desk
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Check-in arrivals, process check-outs, and manage room allocations.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-maroon">
              <span>Open Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Housekeeping */}
          <Link
            href="/staff/housekeeping"
            className="bg-white p-5 rounded-3xl border border-gray-200/80 hover:border-brand-amber hover:shadow-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-brand-amber text-brand-maroon flex items-center justify-center font-bold shadow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-brand-maroon transition-colors">
                Housekeeping Board
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Update room cleaning cycle: Dirty → Cleaning → Clean → Ready.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-maroon">
              <span>Update Rooms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Dining Waitstaff */}
          <Link
            href="/staff/restaurant"
            className="bg-white p-5 rounded-3xl border border-gray-200/80 hover:border-brand-maroon hover:shadow-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-brand-maroon text-white flex items-center justify-center font-bold shadow">
              <UtensilsCrossed className="w-5 h-5 text-brand-amber" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-brand-maroon transition-colors">
                Restaurant Waitstaff
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage assigned tables, take orders, and request guest bills.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-maroon">
              <span>View Tables</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Kitchen Display */}
          <Link
            href="/staff/orders"
            className="bg-white p-5 rounded-3xl border border-gray-200/80 hover:border-brand-maroon hover:shadow-md transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-brand-amber-dark text-white flex items-center justify-center font-bold shadow">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-brand-maroon transition-colors">
                Kitchen Display (KDS)
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Live cooking order tickets, preparation status, and dish dispatch.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-maroon">
              <span>Open KDS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Reservations Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-brand-maroon">
            Live Reservation Movements
          </h2>
          <Link
            href="/staff/reservations"
            className="text-xs font-bold text-brand-maroon hover:text-brand-amber-dark transition-colors inline-flex items-center gap-1"
          >
            <span>All Reservations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Ref Number</th>
                <th className="py-3 px-4">Guest Name</th>
                <th className="py-3 px-4">Room</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-brand-cream/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-brand-maroon">{b.id}</td>
                  <td className="py-3 px-4 font-bold text-gray-800">{b.guestName}</td>
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
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/staff/reservations`}
                      className="px-3 py-1 rounded-lg bg-brand-cream border border-brand-maroon/20 text-brand-maroon font-bold text-[11px] hover:bg-brand-maroon hover:text-white transition-colors"
                    >
                      Manage
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
