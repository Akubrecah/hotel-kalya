"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  RefreshCw,
} from "lucide-react";
import { Room } from "@/types/hospitality";
import { staffFetch } from "@/lib/api-client";

export default function StaffRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [wingFilter, setWingFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const loadRooms = React.useCallback(async () => {
    try {
      const res = await staffFetch("/api/rooms");
      const data = await res.json();
      if (data.success && Array.isArray(data.rooms)) {
        setRooms(data.rooms);
      }
    } catch (err) {
      console.error("Failed to load rooms", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchRooms() {
      try {
        const res = await staffFetch("/api/rooms");
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.rooms)) {
          setRooms(data.rooms);
        }
      } catch (err) {
        console.error("Failed to load rooms", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    fetchRooms();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredRooms = rooms.filter((r) => {
    if (wingFilter !== "ALL" && r.typeSlug !== wingFilter) return false;
    if (statusFilter === "READY" && r.housekeepingStatus !== "READY") return false;
    if (statusFilter === "DIRTY" && r.housekeepingStatus !== "DIRTY") return false;
    if (statusFilter === "CLEANING" && r.housekeepingStatus !== "CLEANING") return false;
    if (statusFilter === "OCCUPIED" && r.reservationStatus !== "CHECKED-IN") return false;
    if (statusFilter === "MAINTENANCE" && r.reservationStatus !== "MAINTENANCE") return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.roomNumber.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.floor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon">
            Rooms &amp; Operational Dual-Status Matrix
          </h1>
          <p className="text-xs text-gray-500">
            Monitoring both Reservation Status and Housekeeping Status for all 41 inventory units
          </p>
        </div>

        <button
          type="button"
          onClick={loadRooms}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brand-maroon ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Grid</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Wing Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
            {[
              { label: "All Wings (41)", value: "ALL" },
              { label: "Standard (101-110)", value: "standard-comfort" },
              { label: "Suites (201-215)", value: "deluxe-exec" },
              { label: "Cottages (1-8)", value: "kalya-cottage" },
              { label: "AirBnBs (1-8)", value: "kalya-airbnb" },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setWingFilter(tab.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  wingFilter === tab.value
                    ? "bg-brand-maroon text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search room number..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber focus:bg-white"
            />
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-gray-100 text-[11px]">
          <span className="font-bold text-gray-400 uppercase text-[10px] pr-2">Filter State:</span>
          {[
            { label: "All Statuses", value: "ALL" },
            { label: "🟢 Ready for Guest", value: "READY" },
            { label: "🔴 Dirty / Needs Service", value: "DIRTY" },
            { label: "🟡 Cleaning in Progress", value: "CLEANING" },
            { label: "🔵 In-House Occupied", value: "OCCUPIED" },
            { label: "⚫ Maintenance / Blocked", value: "MAINTENANCE" },
          ].map((pill) => (
            <button
              key={pill.value}
              type="button"
              onClick={() => setStatusFilter(pill.value)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                statusFilter === pill.value
                  ? "bg-brand-amber text-brand-maroon font-bold shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-400 animate-pulse bg-white rounded-3xl border border-gray-100">
          Loading 41 room inventory records...
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 space-y-2">
          <p className="text-sm font-bold text-gray-800">No rooms match filter</p>
          <p className="text-xs text-gray-500">Reset filter parameters to view inventory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room) => {
            const isGuestReady =
              room.reservationStatus === "AVAILABLE" && room.housekeepingStatus === "READY";
            const isOccupied = room.reservationStatus === "CHECKED-IN";
            const isMaintenance =
              room.housekeepingStatus === "OUT_OF_ORDER" || room.reservationStatus === "MAINTENANCE";

            return (
              <div
                key={room.id}
                className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-sm flex flex-col justify-between hover:border-brand-amber hover:shadow-md transition-all space-y-4"
              >
                {/* Room Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-serif font-bold text-brand-maroon">
                      {room.roomNumber}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      KES {room.basePrice.toLocaleString()}/nt
                    </span>
                  </div>

                  <p className="text-xs font-bold text-gray-800 leading-snug">{room.name}</p>
                  <p className="text-[10px] text-gray-400">{room.floor}</p>
                </div>

                {/* Dual Status Card */}
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
                  {/* Reservation State */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Reservation:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        room.reservationStatus === "AVAILABLE"
                          ? "bg-emerald-100 text-emerald-800"
                          : room.reservationStatus === "CHECKED-IN"
                          ? "bg-blue-100 text-blue-800"
                          : room.reservationStatus === "RESERVED"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {room.reservationStatus}
                    </span>
                  </div>

                  {/* Housekeeping State */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Housekeeping:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        room.housekeepingStatus === "READY"
                          ? "bg-emerald-100 text-emerald-800"
                          : room.housekeepingStatus === "CLEAN"
                          ? "bg-blue-100 text-blue-800"
                          : room.housekeepingStatus === "CLEANING"
                          ? "bg-amber-100 text-amber-800"
                          : room.housekeepingStatus === "DIRTY"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {room.housekeepingStatus.replace("_", " ")}
                    </span>
                  </div>

                  {/* Calculated Overall State */}
                  <div className="pt-2 border-t border-gray-200/80 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase text-gray-400">Guest Ready:</span>
                    <span
                      className={`text-[10px] font-extrabold uppercase ${
                        isGuestReady
                          ? "text-emerald-600"
                          : isOccupied
                          ? "text-blue-600"
                          : isMaintenance
                          ? "text-gray-500"
                          : "text-amber-600"
                      }`}
                    >
                      {isGuestReady
                        ? "✓ Ready For Guest"
                        : isOccupied
                        ? "Occupied (In-House)"
                        : isMaintenance
                        ? "Out of Order"
                        : "Not Ready"}
                    </span>
                  </div>
                </div>

                {/* Footer action */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <Link
                    href={`/rooms/${room.id}`}
                    target="_blank"
                    className="text-[11px] font-bold text-gray-500 hover:text-brand-maroon"
                  >
                    View Page ↗
                  </Link>

                  <Link
                    href="/staff/housekeeping"
                    className="px-3 py-1 rounded-xl bg-brand-cream border border-brand-maroon/20 text-brand-maroon font-bold text-[11px] hover:bg-brand-maroon hover:text-white transition-colors"
                  >
                    Housekeeping ↺
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
