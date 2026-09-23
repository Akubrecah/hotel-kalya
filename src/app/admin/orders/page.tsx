"use client";

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { FoodOrder } from "@/types";

export default function AdminOrdersKDSPage() {
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let mounted = true;
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (data?.success) {
          setOrders(data.orders);
        }
        setLoading(false);
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleAdvanceStatus = async (
    id: string,
    currentStatus: FoodOrder["status"]
  ) => {
    let nextStatus: FoodOrder["status"] = "preparing";
    if (currentStatus === "received") nextStatus = "preparing";
    else if (currentStatus === "preparing") nextStatus = "ready";
    else if (currentStatus === "ready") nextStatus = "delivered";

    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o))
        );
      }
    } catch {
      // Ignore
    }
  };

  const columns: {
    status: FoodOrder["status"];
    label: string;
    pillClass: string;
    nextLabel?: string;
  }[] = [
    {
      status: "received",
      label: "New Orders",
      pillClass: "bg-amber-100 text-amber-800 border-amber-200",
      nextLabel: "Start Prep 👨‍🍳",
    },
    {
      status: "preparing",
      label: "Cooking & In Prep",
      pillClass: "bg-blue-100 text-blue-800 border-blue-200",
      nextLabel: "Mark Ready 🛎️",
    },
    {
      status: "ready",
      label: "Ready for Delivery",
      pillClass: "bg-purple-100 text-purple-800 border-purple-200",
      nextLabel: "Delivered ✅",
    },
    {
      status: "delivered",
      label: "Completed",
      pillClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-brand-maroon">
            Kitchen Display System (KDS)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Live order queue for room service, restaurant dine-in, and outside takeaway.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brand-maroon ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Tickets</span>
        </button>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {columns.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.status);

          return (
            <div
              key={col.status}
              className="bg-white/80 rounded-2xl p-4 border border-gray-200/80 shadow-sm space-y-4 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${col.pillClass}`}
                  >
                    {col.label}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-gray-400">
                  {colOrders.length}
                </span>
              </div>

              {/* Order Cards in this Column */}
              <div className="space-y-3">
                {colOrders.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-xs italic">
                    No tickets in this stage.
                  </div>
                ) : (
                  colOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm space-y-3 hover:shadow-md transition-shadow text-xs"
                    >
                      {/* Ticket Header */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-brand-maroon text-sm">
                          #{ord.id}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-cream text-brand-dark/70">
                          {ord.orderType.replace("_", " ")}
                        </span>
                      </div>

                      {/* Destination / Room Info */}
                      <div className="bg-brand-cream/50 p-2.5 rounded-lg border border-brand-maroon/10 space-y-0.5">
                        <p className="font-bold text-gray-900 text-xs">
                          {ord.roomOrTableNumber || "Unspecified"}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {ord.customerName} • {ord.customerPhone}
                        </p>
                      </div>

                      {/* Dishes List */}
                      <div className="space-y-1.5 pt-1 border-t border-gray-100">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start text-xs">
                            <span className="font-semibold text-gray-800">
                              {item.quantity}x {item.menuItem.name}
                            </span>
                            <span className="text-gray-400 font-mono text-[11px]">
                              KES {(item.menuItem.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Special Notes if any */}
                      {ord.specialNotes && (
                        <div className="p-2 rounded bg-amber-50 border border-amber-200/60 text-amber-900 text-[11px] flex items-start gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-700" />
                          <span>
                            <strong>Note:</strong> {ord.specialNotes}
                          </span>
                        </div>
                      )}

                      {/* Ticket Footer with Action Button */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="font-serif font-black text-brand-maroon text-xs">
                          KES {ord.total.toLocaleString()}
                        </span>

                        {col.nextLabel && (
                          <button
                            type="button"
                            onClick={() => handleAdvanceStatus(ord.id, ord.status)}
                            className="px-3 py-1.5 rounded-lg bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold text-[11px] transition-colors shadow-sm active:scale-95"
                          >
                            {col.nextLabel}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
