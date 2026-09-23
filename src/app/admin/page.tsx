"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  UtensilsCrossed,
  Bed,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { ReservationRecord } from "@/app/api/bookings/route";
import { FoodOrder } from "@/types";

export default function AdminDashboardPage() {
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetch("/api/bookings").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
    ])
      .then(([resData, ordData]) => {
        if (!mounted) return;
        if (resData?.success) setReservations(resData.reservations);
        if (ordData?.success) setOrders(ordData.orders);
        setLoading(false);
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const fetchDashboardData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/bookings").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
    ])
      .then(([resData, ordData]) => {
        if (resData?.success) setReservations(resData.reservations);
        if (ordData?.success) setOrders(ordData.orders);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const totalRevenue = reservations.reduce((acc, r) => acc + r.totalAmount, 0) +
    orders.reduce((acc, o) => acc + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === "received" || o.status === "preparing");
  const confirmedBookings = reservations.filter((r) => r.status === "Confirmed" || r.status === "Checked-In");

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon">
            Front-Desk Operations Console
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time occupancy, guest arrivals, and kitchen tickets across Hotel Kalya.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            fetchDashboardData();
          }}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brand-maroon ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Today's Occupancy */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Room Occupancy
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-brand-amber">
              <Bed className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-serif font-black text-brand-maroon">
              {confirmedBookings.length} / 41
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{Math.round((confirmedBookings.length / 41) * 100)}% Capacity today</span>
            </div>
          </div>
        </div>

        {/* Card 2: Kitchen Orders */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Kitchen Orders in Prep
            </span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-serif font-black text-brand-maroon">
              {pendingOrders.length}
            </h3>
            <p className="text-xs text-gray-500">
              {orders.length} total orders today
            </p>
          </div>
        </div>

        {/* Card 3: Active Reservations */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Active Bookings
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-serif font-black text-brand-maroon">
              {reservations.length}
            </h3>
            <p className="text-xs text-gray-500">
              Rooms &amp; Event Halls
            </p>
          </div>
        </div>

        {/* Card 4: Daily Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Consolidated Revenue
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon">
              KES {totalRevenue.toLocaleString()}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold">
              Reconciled across Desk &amp; M-Pesa
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Urgent Reservations & Kitchen KDS Snippet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Reservations (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border border-gray-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-base text-brand-maroon">
                Arrivals &amp; Reservation Desk
              </h3>
              <p className="text-xs text-gray-500">Latest guest stays recorded in the system</p>
            </div>
            <Link
              href="/admin/reservations"
              className="text-xs font-bold text-brand-maroon hover:text-brand-amber-dark flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {reservations.slice(0, 4).map((res) => (
              <div
                key={res.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-brand-maroon/20 hover:bg-brand-cream/20 transition-all gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-brand-maroon">{res.id}</span>
                    <span className="text-gray-400">•</span>
                    <span className="font-bold text-gray-900">{res.guestName}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        res.status === "Confirmed"
                          ? "bg-emerald-100 text-emerald-700"
                          : res.status === "Checked-In"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {res.service} • {res.roomNumber || "Unassigned"} • {res.checkInDate} to {res.checkOutDate}
                  </p>
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <span className="font-serif font-bold text-brand-maroon block">
                    KES {res.totalAmount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-500">{res.paymentStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Kitchen Orders in Queue (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-gray-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-base text-brand-maroon">
                Live Kitchen Tickets
              </h3>
              <p className="text-xs text-gray-500">Orders currently in food preparation</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-brand-maroon hover:text-brand-amber-dark flex items-center gap-1 transition-colors"
            >
              <span>Open KDS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 3).map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-xl border border-gray-100 bg-brand-cream/30 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-brand-maroon">#{ord.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white border border-gray-200 text-gray-700">
                      {ord.orderType.replace("_", " ")}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ord.status === "received"
                        ? "bg-amber-100 text-amber-800"
                        : ord.status === "preparing"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {ord.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-[11px] text-gray-700 space-y-0.5">
                  <p>
                    <strong>Destination:</strong> {ord.roomOrTableNumber || "Front Desk"}
                  </p>
                  <p>
                    <strong>Dishes:</strong> {ord.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(", ")}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-brand-maroon/5 text-[11px]">
                  <span className="text-gray-500">{ord.customerName} ({ord.customerPhone})</span>
                  <span className="font-bold text-brand-maroon">KES {ord.total.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
