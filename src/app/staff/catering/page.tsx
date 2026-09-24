"use client";

import React, { useState, useEffect } from "react";
import {
  Truck,
  MapPin,
  Utensils,
  RefreshCw,
  PhoneCall,
} from "lucide-react";
import { CateringBooking } from "@/types/hospitality";
import { staffFetch } from "@/lib/api-client";

export default function StaffCateringPage() {
  const [caterings, setCaterings] = useState<CateringBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      const res = await staffFetch("/api/catering");
      const data = await res.json();
      if (data.success && Array.isArray(data.caterings)) {
        setCaterings(data.caterings);
      }
    } catch (err) {
      console.error("Failed to load catering bookings", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      try {
        const res = await staffFetch("/api/catering");
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.caterings)) {
          setCaterings(data.caterings);
        }
      } catch (err) {
        console.error("Failed to load catering bookings", err);
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

  const handleUpdateStatus = async (id: string, status: CateringBooking["status"]) => {
    setUpdatingId(id);
    try {
      const res = await staffFetch("/api/catering", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, operatorName: "Grace Chepkorir (Catering Mgr)" }),
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setCaterings((prev) =>
          prev.map((c) => (c.id === id ? data.booking : c))
        );
      }
    } catch {
      alert("Error updating catering status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon">
            Outside Catering Operations Dispatch
          </h1>
          <p className="text-xs text-gray-500">
            Field banquet catering, mobile buffet setup, corporate dinners, and equipment dispatch
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brand-maroon ${loading ? "animate-spin" : ""}`} />
          <span>Sync Catering</span>
        </button>
      </div>

      {/* Catering Logistics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-brand-maroon font-bold text-sm">
            <Truck className="w-4 h-4 text-brand-amber-dark" />
            <span>Mobile Catering Van 1</span>
          </div>
          <p className="text-xs text-gray-500">
            Equipped with thermal chafing warmers, mobile gazebos, cutlery, and banquet glassware.
          </p>
          <span className="inline-block text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
            Ready for Field Dispatch
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-brand-maroon font-bold text-sm">
            <Utensils className="w-4 h-4 text-brand-amber-dark" />
            <span>Field Kitchen Staff Pool</span>
          </div>
          <p className="text-xs text-gray-500">
            Professional waitstaff, barbecue carvers, and food safety marshals assigned per event.
          </p>
          <span className="inline-block text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
            6 Field Attendants on Shift
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-brand-maroon font-bold text-sm">
            <PhoneCall className="w-4 h-4 text-brand-amber-dark" />
            <span>Catering Lead: Grace Chepkorir</span>
          </div>
          <p className="text-xs text-gray-500">
            Direct coordination for custom menus, dietary requirements, and on-site tastings.
          </p>
          <span className="inline-block text-[10px] text-brand-maroon font-bold bg-brand-cream px-2 py-0.5 rounded">
            Tel: +254 728 990011
          </span>
        </div>
      </div>

      {/* Catering Pipeline Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-4">
        <h2 className="font-serif text-lg font-bold text-brand-maroon">
          Active Outside Catering Bookings
        </h2>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-400 animate-pulse">
            Loading catering contracts...
          </div>
        ) : caterings.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500">
            No outside catering bookings recorded.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Ref</th>
                  <th className="py-3 px-4">Client / Organization</th>
                  <th className="py-3 px-4">Event &amp; Location</th>
                  <th className="py-3 px-4">Event Date</th>
                  <th className="py-3 px-4">Pax</th>
                  <th className="py-3 px-4">Menu Package</th>
                  <th className="py-3 px-4">Staff Assigned</th>
                  <th className="py-3 px-4">Total (KES)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {caterings.map((c) => {
                  const isBusy = updatingId === c.id;

                  return (
                    <tr key={c.id} className="hover:bg-brand-cream/30">
                      <td className="py-3 px-4 font-mono font-bold text-brand-maroon">{c.id}</td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-gray-900">{c.clientName}</p>
                        <p className="text-[11px] text-gray-500">{c.phone}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-gray-800">{c.eventType}</p>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-maroon" />
                          <span>{c.location}</span>
                        </p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-semibold text-gray-800">
                        {c.eventDate}
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">{c.guestCount} Pax</td>
                      <td className="py-3 px-4 text-gray-600 truncate max-w-[150px]">{c.menuPackage}</td>
                      <td className="py-3 px-4 text-gray-500">{c.staffAssigned.join(", ")}</td>
                      <td className="py-3 px-4 font-bold text-gray-900 font-serif">
                        {c.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            c.status === "CONFIRMED"
                              ? "bg-blue-100 text-blue-800"
                              : c.status === "PREPARING"
                              ? "bg-amber-100 text-amber-800"
                              : c.status === "IN_PROGRESS"
                              ? "bg-purple-100 text-purple-800"
                              : c.status === "COMPLETED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {c.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        {c.status === "CONFIRMED" && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleUpdateStatus(c.id, "PREPARING")}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 text-white font-bold text-[11px] hover:bg-amber-600"
                          >
                            Prepare
                          </button>
                        )}
                        {c.status === "PREPARING" && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleUpdateStatus(c.id, "IN_PROGRESS")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700"
                          >
                            Dispatch
                          </button>
                        )}
                        {c.status === "IN_PROGRESS" && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleUpdateStatus(c.id, "COMPLETED")}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700"
                          >
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
