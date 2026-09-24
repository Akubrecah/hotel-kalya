"use client";

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Trees,
} from "lucide-react";
import { EventBooking } from "@/types/hospitality";

export default function StaffEventsPage() {
  const [events, setEvents] = useState<EventBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.success && Array.isArray(data.events)) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.events)) {
          setEvents(data.events);
        }
      } catch (err) {
        console.error("Failed to load events", err);
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

  const handleUpdateStatus = async (id: string, status: EventBooking["status"]) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, operatorName: "Kevin Lokor (Events Coord)" }),
      });
      const data = await res.json();
      if (data.success && data.event) {
        setEvents((prev) =>
          prev.map((e) => (e.id === id ? data.event : e))
        );
      }
    } catch {
      alert("Error updating event status.");
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
            Garden &amp; Outdoor Events Management
          </h1>
          <p className="text-xs text-gray-500">
            Garden wedding receptions, photo shoots, sundowner retreats, and grounds setup
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brand-maroon ${loading ? "animate-spin" : ""}`} />
          <span>Sync Events</span>
        </button>
      </div>

      {/* Garden Venues Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-sm text-brand-maroon">Grand Manicured Lawns</span>
            <span className="text-[10px] bg-brand-cream text-brand-maroon font-extrabold px-2 py-0.5 rounded">
              500+ Pax
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Expansive landscaped gardens with flowering borders, ideal for grand wedding receptions and church retreats.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-sm text-brand-maroon">Hillside Sunset Terrace</span>
            <span className="text-[10px] bg-brand-cream text-brand-maroon font-extrabold px-2 py-0.5 rounded">
              100 Pax
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Elevated stone terrace overlooking Kapenguria hills, tailored for sunset cocktails and private corporate sundowners.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-sm text-brand-maroon">Central Floral Gazebo</span>
            <span className="text-[10px] bg-brand-cream text-brand-maroon font-extrabold px-2 py-0.5 rounded">
              30 Pax
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Shaded wooden gazebo for intimate ceremonies, cake cutting, or VIP bridal photo sessions.
          </p>
        </div>
      </div>

      {/* Events Pipeline Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-4">
        <h2 className="font-serif text-lg font-bold text-brand-maroon">
          Active Garden Events Schedule
        </h2>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-400 animate-pulse">
            Loading events schedule...
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500">
            No events scheduled.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Ref</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Event Type &amp; Venue</th>
                  <th className="py-3 px-4">Event Date</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Guest Count</th>
                  <th className="py-3 px-4">Setup Requirements</th>
                  <th className="py-3 px-4">Total (KES)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((e) => {
                  const isBusy = updatingId === e.id;

                  return (
                    <tr key={e.id} className="hover:bg-brand-cream/30">
                      <td className="py-3 px-4 font-mono font-bold text-brand-maroon">{e.id}</td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-gray-900">{e.clientName}</p>
                        <p className="text-[11px] text-gray-500">{e.phone}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-brand-maroon">{e.eventType}</p>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Trees className="w-3 h-3 text-brand-amber-dark" />
                          <span>{e.venueArea}</span>
                        </p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-semibold text-gray-800">
                        {e.eventDate}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{e.timeSlot}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{e.guestCount} Guests</td>
                      <td className="py-3 px-4 text-gray-500 truncate max-w-[150px]">{e.setupRequirements}</td>
                      <td className="py-3 px-4 font-bold text-gray-900 font-serif">
                        {e.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            e.status === "CONFIRMED"
                              ? "bg-blue-100 text-blue-800"
                              : e.status === "IN_PROGRESS"
                              ? "bg-purple-100 text-purple-800"
                              : e.status === "COMPLETED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {e.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        {e.status === "CONFIRMED" && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleUpdateStatus(e.id, "IN_PROGRESS")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700"
                          >
                            Commence
                          </button>
                        )}
                        {e.status === "IN_PROGRESS" && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleUpdateStatus(e.id, "COMPLETED")}
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
