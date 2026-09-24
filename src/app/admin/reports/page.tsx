"use client";

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { OperationalAnalytics, Booking } from "@/types/hospitality";

export default function AdminReportsPage() {
  const [analytics, setAnalytics] = useState<OperationalAnalytics | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = React.useCallback(async () => {
    try {
      const [anaRes, bookRes] = await Promise.all([
        fetch("/api/analytics"),
        fetch("/api/bookings"),
      ]);
      const anaData = await anaRes.json();
      const bookData = await bookRes.json();

      if (anaData.success) {
        setAnalytics(anaData.analytics);
      }
      if (bookData.success && Array.isArray(bookData.bookings)) {
        setBookings(bookData.bookings);
      }
    } catch (err) {
      console.error("Failed to load reports", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      try {
        const [anaRes, bookRes] = await Promise.all([
          fetch("/api/analytics"),
          fetch("/api/bookings"),
        ]);
        const anaData = await anaRes.json();
        const bookData = await bookRes.json();

        if (!ignore && anaData.success) {
          setAnalytics(anaData.analytics);
        }
        if (!ignore && bookData.success && Array.isArray(bookData.bookings)) {
          setBookings(bookData.bookings);
        }
      } catch (err) {
        console.error("Failed to load reports", err);
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

  // Room type revenue breakdown from actual database records
  const typeRevenueMap: Record<string, { count: number; revenue: number }> = {};
  bookings.forEach((b) => {
    if (b.status !== "CANCELLED") {
      const type = b.roomType || "Standard";
      if (!typeRevenueMap[type]) {
        typeRevenueMap[type] = { count: 0, revenue: 0 };
      }
      typeRevenueMap[type].count += 1;
      typeRevenueMap[type].revenue += b.totalAmount;
    }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon">
            Executive Analytics &amp; Revenue Reporting
          </h1>
          <p className="text-xs text-gray-500">
            Real-time business performance derived from verified database transactions
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brand-maroon ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Reports</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Revenue</span>
          <p className="text-2xl font-bold text-brand-maroon font-serif">
            KES {analytics?.totalMonthlyRevenue.toLocaleString() || 0}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">Active Booking Value</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Occupancy Rate</span>
          <p className="text-2xl font-bold text-blue-700 font-serif">
            {analytics?.occupancyRatePercentage || 0}%
          </p>
          <span className="text-[10px] text-gray-500">
            {analytics?.occupiedRooms || 0} of {analytics?.totalRooms || 41} Rooms Occupied
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Average Daily Rate (ADR)</span>
          <p className="text-2xl font-bold text-brand-maroon font-serif">
            KES {analytics?.averageDailyRate.toLocaleString() || 0}
          </p>
          <span className="text-[10px] text-gray-500">Per occupied night</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Active Reservations</span>
          <p className="text-2xl font-bold text-emerald-700 font-serif">
            {analytics?.activeReservationsCount || 0}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">Confirmed &amp; In-House</span>
        </div>
      </div>

      {/* Revenue Breakdown by Room Category */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-brand-maroon">
              Revenue Breakdown by Accommodation Wing
            </h2>
            <p className="text-xs text-gray-500">Real transaction volume by room tier</p>
          </div>
          <BarChart3 className="w-5 h-5 text-brand-amber-dark" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Room Category</th>
                <th className="py-3 px-4 text-center">Reservations</th>
                <th className="py-3 px-4 text-right">Total Revenue (KES)</th>
                <th className="py-3 px-4 text-right">% Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(typeRevenueMap).map(([type, data]) => {
                const totalRev = analytics?.totalMonthlyRevenue || 1;
                const percentage = Math.round((data.revenue / totalRev) * 100);

                return (
                  <tr key={type} className="hover:bg-brand-cream/30">
                    <td className="py-3.5 px-4 font-bold text-gray-900">{type}</td>
                    <td className="py-3.5 px-4 text-center text-gray-600">{data.count}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-brand-maroon font-serif">
                      KES {data.revenue.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-gray-700">
                      {percentage}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
