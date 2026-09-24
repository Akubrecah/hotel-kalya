"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Room, HousekeepingTask } from "@/types/hospitality";

export default function AdminHousekeepingPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tasks, setTasks] = useState<HousekeepingTask[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = React.useCallback(async () => {
    try {
      const res = await fetch("/api/housekeeping");
      const data = await res.json();
      if (data.success) {
        setRooms(data.rooms || []);
        setTasks(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to load housekeeping", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      try {
        const res = await fetch("/api/housekeeping");
        const data = await res.json();
        if (!ignore && data.success) {
          setRooms(data.rooms || []);
          setTasks(data.logs || []);
        }
      } catch (err) {
        console.error("Failed to load housekeeping", err);
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

  const ready = rooms.filter((r) => r.housekeepingStatus === "READY").length;
  const dirty = rooms.filter((r) => r.housekeepingStatus === "DIRTY").length;
  const cleaning = rooms.filter((r) => r.housekeepingStatus === "CLEANING").length;
  const outOfOrder = rooms.filter((r) => r.housekeepingStatus === "OUT_OF_ORDER").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon">
            Housekeeping Operational Oversight
          </h1>
          <p className="text-xs text-gray-500">
            Room cleanliness status across all 41 units with staff accountability logs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/staff/housekeeping"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-colors"
          >
            <span>Open Staff Cleaning Board</span>
            <ExternalLink className="w-3.5 h-3.5 text-brand-amber" />
          </Link>
          <button
            type="button"
            onClick={loadData}
            className="p-2 rounded-xl bg-white border border-gray-200 text-brand-maroon hover:bg-gray-50 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-3xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block">Pristine &amp; Ready</span>
          <p className="text-2xl font-bold text-emerald-700 font-serif">{ready}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Available for Guests</span>
        </div>

        <div className="bg-red-50 border border-red-200 p-5 rounded-3xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-red-800 block">Dirty / Departed</span>
          <p className="text-2xl font-bold text-red-700 font-serif">{dirty}</p>
          <span className="text-[10px] text-red-600 font-semibold">Pending Housekeeper</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-900 block">Currently Cleaning</span>
          <p className="text-2xl font-bold text-amber-700 font-serif">{cleaning}</p>
          <span className="text-[10px] text-amber-700 font-semibold">Attendant in Room</span>
        </div>

        <div className="bg-gray-100 border border-gray-200 p-5 rounded-3xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-600 block">Out of Order</span>
          <p className="text-2xl font-bold text-gray-700 font-serif">{outOfOrder}</p>
          <span className="text-[10px] text-gray-500 font-semibold">Maintenance</span>
        </div>
      </div>

      {/* Housekeeping Tasks Log */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-4">
        <h2 className="font-serif text-lg font-bold text-brand-maroon">
          Latest Sanitation Transitions &amp; Attributions
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Room Number</th>
                <th className="py-3 px-4">Previous State</th>
                <th className="py-3 px-4">New State</th>
                <th className="py-3 px-4">Attendant</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.map((t) => (
                <tr key={t.id} className="hover:bg-brand-cream/30">
                  <td className="py-3.5 px-4 text-gray-500">
                    {new Date(t.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} •{" "}
                    {new Date(t.timestamp).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-brand-maroon">Room {t.roomNumber}</td>
                  <td className="py-3.5 px-4 font-mono text-gray-500">{t.previousStatus}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">{t.newStatus}</td>
                  <td className="py-3.5 px-4 font-semibold text-gray-800">{t.staffName}</td>
                  <td className="py-3.5 px-4 text-gray-500">{t.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
