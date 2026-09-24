"use client";

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
} from "lucide-react";
import { ConferenceBooking } from "@/types/hospitality";

export default function StaffConferencePage() {
  const [conferences, setConferences] = useState<ConferenceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      const res = await fetch("/api/conference");
      const data = await res.json();
      if (data.success && Array.isArray(data.conferences)) {
        setConferences(data.conferences);
      }
    } catch (err) {
      console.error("Failed to load conferences", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      try {
        const res = await fetch("/api/conference");
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.conferences)) {
          setConferences(data.conferences);
        }
      } catch (err) {
        console.error("Failed to load conferences", err);
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

  const handleUpdateStatus = async (id: string, status: ConferenceBooking["status"]) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/conference", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, operatorName: "Kevin Lokor (Events Coord)" }),
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setConferences((prev) =>
          prev.map((c) => (c.id === id ? data.booking : c))
        );
      }
    } catch {
      alert("Error updating conference status.");
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
            Conference &amp; Seminar Hall Management
          </h1>
          <p className="text-xs text-gray-500">
            Mount Elgon Ballroom, Cherang&apos;any Suite, and Kapenguria Executive Boardroom bookings
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brand-maroon ${loading ? "animate-spin" : ""}`} />
          <span>Sync Seminars</span>
        </button>
      </div>

      {/* Hall Capacity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-sm text-brand-maroon">Mount Elgon Ballroom</span>
            <span className="text-[10px] bg-brand-cream text-brand-maroon font-extrabold px-2 py-0.5 rounded border border-brand-maroon/10">
              Capacity: 150 Pax
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Grand theater or classroom hall with dual projectors, surround PA, and private buffet terrace.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-sm text-brand-maroon">Cherang&apos;any Suite</span>
            <span className="text-[10px] bg-brand-cream text-brand-maroon font-extrabold px-2 py-0.5 rounded border border-brand-maroon/10">
              Capacity: 60 Pax
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Medium seminar hall tailored for workshops, NGO panels, and U-Shape interactive discussions.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-sm text-brand-maroon">Kapenguria Boardroom</span>
            <span className="text-[10px] bg-brand-cream text-brand-maroon font-extrabold px-2 py-0.5 rounded border border-brand-maroon/10">
              Capacity: 25 Pax
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Executive boardroom with high-definition smart video conference screens and leather seating.
          </p>
        </div>
      </div>

      {/* Active Conference Bookings Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden space-y-4 p-6">
        <h2 className="font-serif text-lg font-bold text-brand-maroon">
          Active Conference Schedule
        </h2>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-400 animate-pulse">
            Loading seminar bookings...
          </div>
        ) : conferences.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500">
            No conference bookings found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Ref</th>
                  <th className="py-3 px-4">Organization &amp; Client</th>
                  <th className="py-3 px-4">Hall &amp; Layout</th>
                  <th className="py-3 px-4">Delegates</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Total (KES)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {conferences.map((c) => {
                  const isBusy = updatingId === c.id;

                  return (
                    <tr key={c.id} className="hover:bg-brand-cream/30">
                      <td className="py-3 px-4 font-mono font-bold text-brand-maroon">{c.id}</td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-gray-900">{c.organization}</p>
                        <p className="text-[11px] text-gray-500">{c.clientName} ({c.phone})</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-brand-maroon">{c.hallName}</p>
                        <p className="text-[11px] text-gray-500">{c.seatingLayout} Layout</p>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-800">{c.delegates} Pax</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <p className="font-semibold">{c.startDate}</p>
                        <p className="text-[10px] text-gray-400">to {c.endDate}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-600 truncate max-w-[150px]">{c.cateringPackage}</td>
                      <td className="py-3 px-4 font-bold text-gray-900 font-serif">
                        {c.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            c.status === "CONFIRMED"
                              ? "bg-blue-100 text-blue-800"
                              : c.status === "IN_PROGRESS"
                              ? "bg-emerald-100 text-emerald-800"
                              : c.status === "QUOTED"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {c.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        {c.status === "QUOTED" && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleUpdateStatus(c.id, "CONFIRMED")}
                            className="px-2.5 py-1 rounded-lg bg-brand-maroon text-white font-bold text-[11px] hover:bg-brand-maroon-dark"
                          >
                            Confirm
                          </button>
                        )}
                        {c.status === "CONFIRMED" && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleUpdateStatus(c.id, "IN_PROGRESS")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700"
                          >
                            Start
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
