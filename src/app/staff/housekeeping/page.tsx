"use client";

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  User,
  History,
} from "lucide-react";
import { Room, HousekeepingStatus, HousekeepingTask } from "@/types/hospitality";
import { staffFetch } from "@/lib/api-client";

export default function StaffHousekeepingPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tasks, setTasks] = useState<HousekeepingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [attendantName, setAttendantName] = useState("Denis Limo (Housekeeping)");
  const [updatingRoomId, setUpdatingRoomId] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<string>("ALL");

  const loadData = React.useCallback(async () => {
    try {
      const res = await staffFetch("/api/housekeeping");
      const data = await res.json();
      if (data.success) {
        setRooms(data.rooms || []);
        setTasks(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to load housekeeping data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      try {
        const res = await staffFetch("/api/housekeeping");
        const data = await res.json();
        if (!ignore && data.success) {
          setRooms(data.rooms || []);
          setTasks(data.logs || []);
        }
      } catch (err) {
        console.error("Failed to load housekeeping data", err);
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

  const handleUpdateStatus = async (
    roomId: string,
    newStatus: HousekeepingStatus,
    notes?: string
  ) => {
    setUpdatingRoomId(roomId);
    try {
      const res = await staffFetch("/api/housekeeping", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          newStatus,
          staffName: attendantName,
          notes,
        }),
      });
      const data = await res.json();
      if (data.success && data.room) {
        // Update room in state
        setRooms((prev) =>
          prev.map((r) => (r.id === roomId ? { ...r, ...data.room } : r))
        );
        // Refresh logs
        const refresh = await staffFetch("/api/housekeeping");
        const json = await refresh.json();
        if (json.success && Array.isArray(json.logs)) {
          setTasks(json.logs);
        }
      } else {
        alert(data.error || "Update failed.");
      }
    } catch {
      alert("Network error updating status.");
    } finally {
      setUpdatingRoomId(null);
    }
  };

  const readyCount = rooms.filter((r) => r.housekeepingStatus === "READY").length;
  const dirtyCount = rooms.filter((r) => r.housekeepingStatus === "DIRTY").length;
  const cleaningCount = rooms.filter((r) => r.housekeepingStatus === "CLEANING").length;
  const cleanCount = rooms.filter((r) => r.housekeepingStatus === "CLEAN").length;
  const outOfOrderCount = rooms.filter((r) => r.housekeepingStatus === "OUT_OF_ORDER").length;

  const filteredRooms = rooms.filter((r) => {
    if (filterState === "ALL") return true;
    return r.housekeepingStatus === filterState;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title & Attendant Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-brand-maroon">
            Housekeeping Management Board
          </h1>
          <p className="text-xs text-brand-dark/60 font-sans">
            Real-time room sanitation cycle with staff attribution and audit trail
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-cream border border-brand-maroon/20 rounded-xl shadow-sm text-xs">
            <User className="w-3.5 h-3.5 text-brand-amber-dark" />
            <input
              type="text"
              value={attendantName}
              onChange={(e) => setAttendantName(e.target.value)}
              placeholder="Staff Name"
              className="bg-transparent font-bold text-brand-dark text-xs focus:outline-none w-48"
            />
          </div>

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-xl bg-brand-cream border border-brand-maroon/20 text-brand-maroon hover:bg-white transition-all shadow-sm"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Housekeeping Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          type="button"
          onClick={() => setFilterState("DIRTY")}
          className={`p-4 rounded-3xl border text-left transition-all ${
            filterState === "DIRTY"
              ? "bg-red-600 text-white border-red-700 shadow-md"
              : "bg-white border-brand-maroon/10 text-brand-dark hover:border-red-300"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider block text-brand-dark/50">
            Dirty Rooms
          </span>
          <p className="text-2xl font-black font-serif text-red-600">{dirtyCount}</p>
          <span className="text-[10px] font-semibold text-brand-dark/60">Needs Cleaning</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterState("CLEANING")}
          className={`p-4 rounded-3xl border text-left transition-all ${
            filterState === "CLEANING"
              ? "bg-brand-amber-dark text-white border-brand-amber shadow-md"
              : "bg-white border-brand-maroon/10 text-brand-dark hover:border-amber-300"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider block text-brand-dark/50">
            In Progress
          </span>
          <p className="text-2xl font-black font-serif text-brand-amber-dark">{cleaningCount}</p>
          <span className="text-[10px] font-semibold text-brand-dark/60">Being Sanitized</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterState("CLEAN")}
          className={`p-4 rounded-3xl border text-left transition-all ${
            filterState === "CLEAN"
              ? "bg-blue-600 text-white border-blue-700 shadow-md"
              : "bg-white border-brand-maroon/10 text-brand-dark hover:border-blue-300"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider block text-brand-dark/50">
            Cleaned
          </span>
          <p className="text-2xl font-black font-serif text-blue-700">{cleanCount}</p>
          <span className="text-[10px] font-semibold text-brand-dark/60">Ready for Inspect</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterState("READY")}
          className={`p-4 rounded-3xl border text-left transition-all ${
            filterState === "READY"
              ? "bg-emerald-600 text-white border-emerald-700 shadow-md"
              : "bg-white border-brand-maroon/10 text-brand-dark hover:border-emerald-300"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider block text-brand-dark/50">
            Ready for Guest
          </span>
          <p className="text-2xl font-black font-serif text-emerald-700">{readyCount}</p>
          <span className="text-[10px] font-semibold text-emerald-700 font-bold">Inspected &amp; Pristine</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterState("OUT_OF_ORDER")}
          className={`p-4 rounded-3xl border text-left transition-all ${
            filterState === "OUT_OF_ORDER"
              ? "bg-brand-maroon text-white border-brand-maroon-dark shadow-md"
              : "bg-white border-brand-maroon/10 text-brand-dark hover:border-brand-maroon/30"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider block text-brand-dark/50">
            Out of Order
          </span>
          <p className="text-2xl font-black font-serif text-brand-maroon">{outOfOrderCount}</p>
          <span className="text-[10px] font-semibold text-brand-dark/60">Maintenance</span>
        </button>
      </div>

      {filterState !== "ALL" && (
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-brand-maroon/10 text-xs">
          <span>Filtering by: <strong className="uppercase font-bold text-brand-maroon">{filterState}</strong></span>
          <button
            type="button"
            onClick={() => setFilterState("ALL")}
            className="text-brand-maroon font-bold hover:underline"
          >
            Show All Rooms (41)
          </button>
        </div>
      )}

      {/* Housekeeping Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredRooms.map((room) => {
          const isBusy = updatingRoomId === room.id;
          const status = room.housekeepingStatus;

          return (
            <div
              key={room.id}
              className={`rounded-3xl p-5 border shadow-sm flex flex-col justify-between space-y-4 transition-all ${
                status === "DIRTY"
                  ? "bg-red-50/40 border-red-200"
                  : status === "CLEANING"
                  ? "bg-amber-50/40 border-amber-200"
                  : status === "CLEAN"
                  ? "bg-blue-50/40 border-blue-200"
                  : status === "READY"
                  ? "bg-white border-gray-200"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              {/* Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold font-serif text-brand-maroon">
                    Room {room.roomNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      status === "DIRTY"
                        ? "bg-red-600 text-white"
                        : status === "CLEANING"
                        ? "bg-amber-600 text-white"
                        : status === "CLEAN"
                        ? "bg-blue-600 text-white"
                        : status === "READY"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-700">{room.name}</p>
                <p className="text-[10px] text-gray-400">{room.floor}</p>
                {room.outOfOrderReason && (
                  <p className="text-[10px] text-red-600 font-semibold bg-red-100 p-1 rounded">
                    Reason: {room.outOfOrderReason}
                  </p>
                )}
              </div>

              {/* Status Action Buttons */}
              <div className="pt-2 border-t border-gray-200/60 space-y-2">
                {status === "DIRTY" && (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleUpdateStatus(room.id, "CLEANING")}
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-colors disabled:opacity-50"
                  >
                    {isBusy ? "Updating..." : "▶ Start Cleaning"}
                  </button>
                )}

                {status === "CLEANING" && (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleUpdateStatus(room.id, "CLEAN")}
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors disabled:opacity-50"
                  >
                    {isBusy ? "Updating..." : "✓ Mark Clean"}
                  </button>
                )}

                {status === "CLEAN" && (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleUpdateStatus(room.id, "READY")}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors disabled:opacity-50"
                  >
                    {isBusy ? "Updating..." : "✓ Mark Ready for Guest"}
                  </button>
                )}

                {status === "READY" && (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleUpdateStatus(room.id, "DIRTY", "Guest checked out")}
                    className="w-full py-1.5 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-700 font-bold text-[11px] transition-colors disabled:opacity-50"
                  >
                    {isBusy ? "Updating..." : "Mark as Dirty (Needs Service)"}
                  </button>
                )}

                {/* Maintenance toggles */}
                <div className="flex items-center justify-between pt-1">
                  {status !== "OUT_OF_ORDER" ? (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() =>
                        handleUpdateStatus(room.id, "OUT_OF_ORDER", "Plumbing/Fixture Repair")
                      }
                      className="text-[10px] text-gray-400 hover:text-red-600 font-bold"
                    >
                      Put Out of Order
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleUpdateStatus(room.id, "CLEANING", "Maintenance resolved")}
                      className="text-[10px] text-emerald-600 hover:underline font-bold"
                    >
                      Maintenance Complete (Clean)
                    </button>
                  )}

                  <span className="text-[10px] text-gray-400">
                    Res: {room.reservationStatus}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Housekeeping Real-Time Audit Log */}
      <div className="bg-white rounded-3xl p-6 border border-brand-maroon/10 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-brand-maroon" />
          <h2 className="font-serif text-base font-bold text-brand-maroon">
            Live Housekeeping Transition History (Audit Trail)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-cream border-b border-brand-maroon/10 text-brand-maroon font-serif font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Room</th>
                <th className="py-3 px-4">Transition</th>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-maroon/5">
              {tasks.slice(0, 10).map((t) => (
                <tr key={t.id} className="hover:bg-brand-cream/40 transition-colors">
                  <td className="py-3 px-4 text-brand-dark/60 whitespace-nowrap">
                    {new Date(t.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} •{" "}
                    {new Date(t.timestamp).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-serif font-bold text-brand-maroon">Room {t.roomNumber}</td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-brand-dark/50">{t.previousStatus}</span>
                    <span className="mx-2 text-brand-amber font-bold">→</span>
                    <span className="font-mono font-bold text-emerald-700">{t.newStatus}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-brand-dark">{t.staffName}</td>
                  <td className="py-3 px-4 text-brand-dark/60">{t.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
