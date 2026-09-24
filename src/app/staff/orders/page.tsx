"use client";

import React, { useState, useEffect } from "react";
import {
  ChefHat,
  Clock,
  RefreshCw,
} from "lucide-react";
import { FoodOrder } from "@/types";
import { staffFetch } from "@/lib/api-client";

export default function StaffKitchenKDSPage() {
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ACTIVE");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = React.useCallback(async () => {
    try {
      const res = await staffFetch("/api/orders");
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to load KDS orders", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchOrders() {
      try {
        const res = await staffFetch("/api/orders");
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Failed to load KDS orders", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: FoodOrder["status"]) => {
    setUpdatingId(id);
    try {
      const res = await staffFetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? data.order : o))
        );
      } else {
        alert(data.error || "Failed to update order status.");
      }
    } catch {
      alert("Network error updating order.");
    } finally {
      setUpdatingId(null);
    }
  };

  const activeOrders = orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled");
  const receivedCount = orders.filter((o) => o.status === "received").length;
  const preparingCount = orders.filter((o) => o.status === "preparing").length;
  const readyCount = orders.filter((o) => o.status === "ready").length;

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === "ACTIVE") return o.status !== "delivered" && o.status !== "cancelled";
    if (statusFilter === "ALL") return true;
    return o.status === statusFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Polling Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon flex items-center gap-3">
            <span>Kitchen Display System (KDS)</span>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-amber text-brand-maroon text-xs font-extrabold uppercase">
              Live Cooking
            </span>
          </h1>
          <p className="text-xs text-gray-500">
            Real-time kitchen order dispatch, dish preparation tracking, and waiter pickup alerts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>KDS Station 1 (Hot Line)</span>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="p-2 rounded-xl bg-white border border-gray-200 text-brand-maroon hover:bg-gray-50 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Ticket Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setStatusFilter("ACTIVE")}
          className={`p-4 rounded-3xl border text-left transition-all ${
            statusFilter === "ACTIVE"
              ? "bg-brand-maroon text-white border-brand-maroon shadow-md"
              : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider block opacity-70">
            All In-Kitchen Tickets
          </span>
          <p className="text-2xl font-bold font-serif">{activeOrders.length}</p>
          <span className="text-[10px] opacity-80 font-semibold">Live in preparation</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("received")}
          className={`p-4 rounded-3xl border text-left transition-all ${
            statusFilter === "received"
              ? "bg-red-600 text-white border-red-700 shadow-md"
              : "bg-red-50/70 border-red-200 text-red-800 hover:bg-red-100"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider block opacity-70">
            New / Unaccepted
          </span>
          <p className="text-2xl font-bold font-serif">{receivedCount}</p>
          <span className="text-[10px] font-semibold">Needs Chef Action</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("preparing")}
          className={`p-4 rounded-3xl border text-left transition-all ${
            statusFilter === "preparing"
              ? "bg-amber-500 text-white border-amber-600 shadow-md"
              : "bg-amber-50/70 border-amber-200 text-amber-900 hover:bg-amber-100"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider block opacity-70">
            Cooking / On Grill
          </span>
          <p className="text-2xl font-bold font-serif">{preparingCount}</p>
          <span className="text-[10px] font-semibold">In Progress</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("ready")}
          className={`p-4 rounded-3xl border text-left transition-all ${
            statusFilter === "ready"
              ? "bg-emerald-600 text-white border-emerald-700 shadow-md"
              : "bg-emerald-50/70 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider block opacity-70">
            Ready on Pass
          </span>
          <p className="text-2xl font-bold font-serif">{readyCount}</p>
          <span className="text-[10px] font-semibold">Call Waiter</span>
        </button>
      </div>

      {/* Tickets Grid */}
      {loading && orders.length === 0 ? (
        <div className="p-12 text-center text-xs text-gray-400 animate-pulse bg-white rounded-3xl border">
          Connecting to kitchen order queue...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 space-y-2">
          <ChefHat className="w-10 h-10 text-brand-amber mx-auto" />
          <h3 className="font-bold text-gray-800 text-base">Pass is completely clear!</h3>
          <p className="text-xs text-gray-500">No pending orders matching the selected status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((ticket) => {
            const isBusy = updatingId === ticket.id;
            const ticketTime = ticket.createdAt ? ticket.createdAt.slice(11, 16) : "--:--";

            return (
              <div
                key={ticket.id}
                className={`rounded-3xl border-2 shadow-md overflow-hidden flex flex-col justify-between transition-all ${
                  ticket.status === "received"
                    ? "bg-red-50/30 border-red-500"
                    : ticket.status === "preparing"
                    ? "bg-amber-50/30 border-brand-amber"
                    : ticket.status === "ready"
                    ? "bg-emerald-50/30 border-emerald-500"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Ticket Top Header */}
                <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-extrabold text-brand-maroon">
                        {ticket.id}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {ticket.orderType.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-900 mt-1">
                      {ticket.roomOrTableNumber || "Main Dining Area"}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        ticket.status === "received"
                          ? "bg-red-100 text-red-800"
                          : ticket.status === "preparing"
                          ? "bg-amber-100 text-amber-800"
                          : ticket.status === "ready"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {ticket.status}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3 text-brand-maroon" />
                      <span>{ticketTime}</span>
                    </p>
                  </div>
                </div>

                {/* Ticket Items List */}
                <div className="p-5 space-y-4 flex-1">
                  <div className="space-y-2 divide-y divide-gray-100">
                    {ticket.items.map((item, idx) => (
                      <div key={idx} className="pt-2 first:pt-0 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-brand-maroon text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                            {item.quantity}×
                          </span>
                          <div>
                            <p className="text-xs font-bold text-gray-900 leading-snug">
                              {item.menuItem.name}
                            </p>
                            {item.specialInstructions && (
                              <p className="text-[10px] text-amber-700 font-semibold italic">
                                Note: {item.specialInstructions}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-[11px] text-gray-400 font-mono">
                          KES {(item.menuItem.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {ticket.specialNotes && (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-brand-amber/30 text-[11px] text-brand-maroon font-medium">
                      <strong>Server Request:</strong> {ticket.specialNotes}
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                    Guest: <strong className="text-gray-800">{ticket.customerName}</strong> ({ticket.customerPhone})
                  </div>
                </div>

                {/* KDS Action Buttons */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-2">
                  {ticket.status === "received" && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleUpdateStatus(ticket.id, "preparing")}
                      className="w-full py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold text-xs transition-colors shadow disabled:opacity-50"
                    >
                      {isBusy ? "Accepting..." : "▶ Accept & Start Cooking"}
                    </button>
                  )}

                  {ticket.status === "preparing" && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleUpdateStatus(ticket.id, "ready")}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow disabled:opacity-50"
                    >
                      {isBusy ? "Marking..." : "✓ Dish Ready on Pass (Notify Server)"}
                    </button>
                  )}

                  {ticket.status === "ready" && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleUpdateStatus(ticket.id, "delivered")}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow disabled:opacity-50"
                    >
                      {isBusy ? "Updating..." : "✓ Served / Dispatched to Table"}
                    </button>
                  )}

                  {ticket.status === "delivered" && (
                    <div className="text-center text-[11px] text-emerald-700 font-bold py-1">
                      ✓ Successfully Delivered to Guest
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
