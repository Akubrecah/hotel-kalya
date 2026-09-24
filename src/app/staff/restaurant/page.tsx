"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  RefreshCw,
} from "lucide-react";
import { FoodOrder } from "@/types";

interface DiningTable {
  id: string;
  name: string;
  area: "Main Restaurant" | "Garden Terrace" | "Upper Gazebo";
  capacity: number;
  status: "available" | "occupied" | "bill_requested";
  activeOrderId?: string;
}

const DEFAULT_TABLES: DiningTable[] = [
  { id: "tbl-1", name: "Table 1", area: "Main Restaurant", capacity: 2, status: "available" },
  { id: "tbl-2", name: "Table 2", area: "Main Restaurant", capacity: 4, status: "available" },
  { id: "tbl-3", name: "Table 3", area: "Main Restaurant", capacity: 4, status: "available" },
  { id: "tbl-4", name: "Table 4", area: "Main Restaurant", capacity: 6, status: "occupied", activeOrderId: "ORD-519283" },
  { id: "tbl-5", name: "Table 5", area: "Main Restaurant", capacity: 2, status: "available" },
  { id: "tbl-6", name: "Table 6", area: "Main Restaurant", capacity: 8, status: "available" },
  { id: "tbl-g1", name: "Gazebo 1", area: "Upper Gazebo", capacity: 6, status: "available" },
  { id: "tbl-g2", name: "Gazebo 2", area: "Upper Gazebo", capacity: 6, status: "bill_requested", activeOrderId: "ORD-938210" },
  { id: "tbl-t1", name: "Terrace 1", area: "Garden Terrace", capacity: 4, status: "available" },
  { id: "tbl-t2", name: "Terrace 2", area: "Garden Terrace", capacity: 4, status: "available" },
];

export default function StaffRestaurantPage() {
  const [tables, setTables] = useState<DiningTable[]>(DEFAULT_TABLES);
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeArea, setActiveArea] = useState<string>("ALL");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<DiningTable | null>(null);

  // New order form
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("+254 712 345678");
  const [dish, setDish] = useState("Kapenguria Kienyeji Chicken Special");
  const [quantity, setQuantity] = useState(2);
  const [notes, setNotes] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const loadOrders = React.useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    fetchOrders();
    return () => {
      ignore = true;
    };
  }, []);

  const handleRequestBill = (tableId: string) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status: "bill_requested" } : t))
    );
  };

  const handleClearTable = (tableId: string) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status: "available", activeOrderId: undefined } : t))
    );
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable) return;

    setSubmittingOrder(true);
    try {
      const pricePerDish = dish.includes("Chicken") ? 1400 : dish.includes("Tilapia") ? 1100 : 950;
      const subtotal = pricePerDish * quantity;

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: guestName || "Walk-In Guest",
          customerPhone: guestPhone,
          orderType: "dine_in",
          roomOrTableNumber: selectedTable.name,
          specialNotes: notes,
          subtotal,
          total: subtotal,
          items: [
            {
              menuItem: {
                id: "dish_auto_" + Date.now(),
                name: dish,
                description: "Freshly prepared from Hotel Kalya Kitchen",
                price: pricePerDish,
                category: "lunch",
                categoryLabel: "Lunch & Dinner",
                image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80",
                available: true,
              },
              quantity,
            },
          ],
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setTables((prev) =>
          prev.map((t) =>
            t.id === selectedTable.id
              ? { ...t, status: "occupied", activeOrderId: data.order.id }
              : t
          )
        );
        setShowOrderModal(false);
        setGuestName("");
        setNotes("");
        await loadOrders();
      }
    } catch {
      alert("Error sending order to kitchen.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  const filteredTables = tables.filter((t) => {
    if (activeArea === "ALL") return true;
    return t.area === activeArea;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon">
            Waitstaff &amp; Table Dining Console
          </h1>
          <p className="text-xs text-gray-500">
            Real-time table occupancy, waitstaff order taking, and bill request dispatch
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/staff/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-cream border border-brand-maroon/20 text-brand-maroon font-bold text-xs hover:bg-brand-cream/80"
          >
            <span>Kitchen Display (KDS) ↗</span>
          </Link>
          <button
            type="button"
            onClick={loadOrders}
            className="p-2 rounded-xl bg-white border border-gray-200 text-brand-maroon hover:bg-gray-50 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Area Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
        {["ALL", "Main Restaurant", "Garden Terrace", "Upper Gazebo"].map((area) => (
          <button
            key={area}
            type="button"
            onClick={() => setActiveArea(area)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeArea === area
                ? "bg-brand-maroon text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {area === "ALL" ? "All Dining Areas" : area}
          </button>
        ))}
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {filteredTables.map((tbl) => {
          const activeOrder = orders.find((o) => o.id === tbl.activeOrderId);

          return (
            <div
              key={tbl.id}
              className={`rounded-3xl p-5 border shadow-sm flex flex-col justify-between space-y-4 transition-all ${
                tbl.status === "available"
                  ? "bg-white border-gray-200 hover:border-brand-amber"
                  : tbl.status === "occupied"
                  ? "bg-amber-50/50 border-brand-amber/50"
                  : "bg-red-50/50 border-red-300"
              }`}
            >
              {/* Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-brand-maroon">
                    {tbl.name}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      tbl.status === "available"
                        ? "bg-emerald-100 text-emerald-800"
                        : tbl.status === "occupied"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {tbl.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">{tbl.area} • Max {tbl.capacity} Guests</p>
              </div>

              {/* Active Order Details */}
              {tbl.status !== "available" && activeOrder ? (
                <div className="p-3 bg-white rounded-2xl border border-gray-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-brand-maroon font-bold">
                      {activeOrder.id}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-amber-700">
                      {activeOrder.status}
                    </span>
                  </div>
                  <p className="font-bold text-gray-800 truncate">{activeOrder.customerName}</p>
                  <p className="text-[11px] text-gray-500">
                    {activeOrder.items.map((i) => `${i.quantity}× ${i.menuItem.name}`).join(", ")}
                  </p>
                  <p className="text-xs font-extrabold text-brand-maroon pt-1">
                    Total: KES {activeOrder.total.toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-gray-400">
                  Table is clear &amp; ready
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                {tbl.status === "available" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTable(tbl);
                      setShowOrderModal(true);
                    }}
                    className="w-full py-2 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    + Take Table Order
                  </button>
                ) : (
                  <div className="space-y-1.5">
                    {tbl.status === "occupied" && (
                      <button
                        type="button"
                        onClick={() => handleRequestBill(tbl.id)}
                        className="w-full py-1.5 rounded-xl bg-brand-amber text-brand-maroon font-bold text-xs hover:bg-brand-amber-dark transition-colors shadow-sm"
                      >
                        Request Bill (Print)
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleClearTable(tbl.id)}
                      className="w-full py-1 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold text-[11px] transition-colors"
                    >
                      Clear &amp; Reset Table
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Order Modal */}
      {showOrderModal && selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-maroon">
                  New Order: {selectedTable.name}
                </h3>
                <p className="text-xs text-gray-500">{selectedTable.area}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowOrderModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Guest / Group Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. County Visitors"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Main Dish</label>
                <select
                  value={dish}
                  onChange={(e) => setDish(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs"
                >
                  <option value="Kapenguria Kienyeji Chicken Special">
                    Kapenguria Kienyeji Chicken Special (KES 1,400)
                  </option>
                  <option value="Fresh Tilapia Wet Fry">
                    Fresh Tilapia Wet Fry (KES 1,100)
                  </option>
                  <option value="Kalya Executive Farmhouse Breakfast">
                    Kalya Executive Farmhouse Breakfast (KES 950)
                  </option>
                  <option value="Coastal Mahamri & Spicy Viazi">
                    Coastal Mahamri &amp; Spicy Viazi (KES 500)
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Kitchen Preparation Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Mild chili, no onion, brown ugali"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="flex-1 py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold text-xs shadow transition-colors disabled:opacity-50"
                >
                  {submittingOrder ? "Dispatching..." : "Send to Kitchen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
