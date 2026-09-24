"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Printer,
  Plus,
  RefreshCw,
} from "lucide-react";
import { ReservationRecord } from "@/app/api/bookings/route";

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchReservations = () => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setReservations(data.reservations);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    let mounted = true;
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (data?.success) {
          setReservations(data.reservations);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: ReservationRecord["status"]) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
        setActionSuccess(`Reservation #${id} updated to ${newStatus}.`);
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch {
      // Ignore
    }
  };

  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      const matchesSearch =
        r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.guestPhone.includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" || r.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [reservations, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-brand-maroon">
            Reservations &amp; Guest Folios
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage room allocations, check-in arrivals, and county conference bookings.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={fetchReservations}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors shadow-sm"
            title="Refresh reservations"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            <span className="hidden sm:inline">Sync</span>
          </button>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-maroon text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-maroon-dark transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-brand-amber" />
            <span>New Reservation</span>
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Guest Name, Phone or ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-amber text-gray-800"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {["all", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? "bg-brand-maroon text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st === "all" ? "All Bookings" : st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table & Mobile Card View */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs">
            No reservations found matching your criteria.
          </div>
        ) : (
          <>
            {/* Mobile Cards (<lg) */}
            <div className="block lg:hidden divide-y divide-gray-100">
              {filteredReservations.map((res) => (
                <div key={res.id} className="p-4 space-y-3 hover:bg-brand-cream/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-maroon text-xs">#{res.id}</span>
                      <span className="px-2 py-0.5 rounded-lg bg-gray-100 font-bold text-gray-900 text-xs">
                        {res.roomNumber ? `Room ${res.roomNumber}` : res.service}
                      </span>
                    </div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        res.status === "CONFIRMED"
                          ? "bg-emerald-100 text-emerald-700"
                          : res.status === "CHECKED_IN"
                          ? "bg-blue-100 text-blue-700"
                          : res.status === "COMPLETED" || res.status === "CHECKED_OUT"
                          ? "bg-gray-100 text-gray-600"
                          : res.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {res.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{res.guestName}</p>
                      <p className="text-[11px] text-gray-500">{res.guestPhone}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif font-bold text-brand-maroon block text-sm">
                        KES {res.totalAmount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-500">{res.paymentStatus}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-[11px] text-gray-600 flex justify-between items-center">
                    <div>
                      <span className="font-medium">{res.checkInDate} → {res.checkOutDate}</span>
                    </div>
                    <span className="text-gray-500 font-medium truncate max-w-[130px]">{res.service}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    {res.status === "CONFIRMED" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(res.id, "CHECKED_IN")}
                        className="flex-1 py-2 px-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors text-center"
                      >
                        Check-In
                      </button>
                    )}
                    {res.status === "CHECKED_IN" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(res.id, "CHECKED_OUT")}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition-colors text-center"
                      >
                        Check-Out
                      </button>
                    )}
                    <Link
                      href={`/guest/bookings/${res.id}`}
                      className="py-2 px-3 rounded-xl border border-gray-200 text-gray-600 hover:text-brand-maroon hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-1.5 text-xs font-bold"
                      title="View Voucher"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Voucher</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (lg+) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-cream/60 border-b border-gray-200/80 text-brand-maroon uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Ref ID</th>
                    <th className="py-3.5 px-4">Guest Details</th>
                    <th className="py-3.5 px-4">Service &amp; Room</th>
                    <th className="py-3.5 px-4">Dates</th>
                    <th className="py-3.5 px-4">Total (KES)</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-brand-cream/20 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-maroon whitespace-nowrap">
                        #{res.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-gray-900">{res.guestName}</p>
                        <p className="text-[11px] text-gray-500">{res.guestPhone}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-gray-800">{res.service}</p>
                        <p className="text-[11px] text-gray-500 font-mono">{res.roomNumber || "TBD"}</p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="text-gray-900 font-semibold">{res.checkInDate}</p>
                        <p className="text-[11px] text-gray-500">to {res.checkOutDate}</p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-serif font-bold text-brand-maroon block">
                          KES {res.totalAmount.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-500">{res.paymentStatus}</span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            res.status === "CONFIRMED"
                              ? "bg-emerald-100 text-emerald-700"
                              : res.status === "CHECKED_IN"
                              ? "bg-blue-100 text-blue-700"
                              : res.status === "COMPLETED" || res.status === "CHECKED_OUT"
                              ? "bg-gray-100 text-gray-600"
                              : res.status === "PENDING"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {res.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {res.status === "CONFIRMED" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(res.id, "CHECKED_IN")}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] transition-colors"
                            >
                              Check-In
                            </button>
                          )}
                          {res.status === "CHECKED_IN" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(res.id, "CHECKED_OUT")}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] transition-colors"
                            >
                              Check-Out
                            </button>
                          )}
                          <Link
                            href={`/guest/bookings/${res.id}`}
                            className="p-1 text-gray-400 hover:text-brand-maroon transition-colors"
                            title="View Voucher"
                          >
                            <Printer className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
