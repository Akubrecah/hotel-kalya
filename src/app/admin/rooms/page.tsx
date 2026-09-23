"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";

interface RoomInventoryItem {
  id: string;
  name: string;
  category: "Executive Suite" | "Standard Room" | "Luxury Cottage" | "Serviced AirBnB";
  tier: string;
  pricePerNight: number;
  status: "Available" | "Occupied" | "Maintenance";
  housekeeping: "Clean" | "Needs Cleaning";
  currentGuest?: string;
}

const INITIAL_ROOMS: RoomInventoryItem[] = [
  {
    id: "201",
    name: "Executive Suite 201",
    category: "Executive Suite",
    tier: "Highland Suite",
    pricePerNight: 8500,
    status: "Available",
    housekeeping: "Clean",
  },
  {
    id: "202",
    name: "Executive Suite 202",
    category: "Executive Suite",
    tier: "Highland Suite",
    pricePerNight: 8500,
    status: "Occupied",
    housekeeping: "Clean",
    currentGuest: "Dr. Kiptoo (Check-out 25 Sep)",
  },
  {
    id: "203",
    name: "Executive Suite 203",
    category: "Executive Suite",
    tier: "Mountain View",
    pricePerNight: 8500,
    status: "Maintenance",
    housekeeping: "Needs Cleaning",
  },
  {
    id: "204",
    name: "Executive Suite 204",
    category: "Executive Suite",
    tier: "Corner View",
    pricePerNight: 8500,
    status: "Occupied",
    housekeeping: "Clean",
    currentGuest: "James Chemosit (Check-out 30 Sep)",
  },
  {
    id: "COT-01",
    name: "Kalya Cottage 1",
    category: "Luxury Cottage",
    tier: "Private Garden",
    pricePerNight: 12000,
    status: "Available",
    housekeeping: "Clean",
  },
  {
    id: "COT-02",
    name: "Kalya Cottage 2",
    category: "Luxury Cottage",
    tier: "Private Garden",
    pricePerNight: 12000,
    status: "Occupied",
    housekeeping: "Clean",
    currentGuest: "Ambassador Delegations",
  },
  {
    id: "COT-03",
    name: "Kalya Cottage 3",
    category: "Luxury Cottage",
    tier: "Family 2-Bedroom",
    pricePerNight: 14000,
    status: "Occupied",
    housekeeping: "Clean",
    currentGuest: "David Kiprop",
  },
  {
    id: "AB-01",
    name: "Serviced AirBnB Apartment A",
    category: "Serviced AirBnB",
    tier: "Full Kitchenette",
    pricePerNight: 6500,
    status: "Available",
    housekeeping: "Clean",
  },
  {
    id: "AB-02",
    name: "Serviced AirBnB Apartment B",
    category: "Serviced AirBnB",
    tier: "Full Kitchenette",
    pricePerNight: 6500,
    status: "Available",
    housekeeping: "Clean",
  },
  {
    id: "101",
    name: "Standard Room 101",
    category: "Standard Room",
    tier: "Garden Terrace",
    pricePerNight: 4500,
    status: "Available",
    housekeeping: "Clean",
  },
  {
    id: "102",
    name: "Standard Room 102",
    category: "Standard Room",
    tier: "Garden Terrace",
    pricePerNight: 4500,
    status: "Available",
    housekeeping: "Clean",
  },
  {
    id: "103",
    name: "Standard Room 103",
    category: "Standard Room",
    tier: "Courtyard",
    pricePerNight: 4500,
    status: "Maintenance",
    housekeeping: "Needs Cleaning",
  },
];

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<RoomInventoryItem[]>(INITIAL_ROOMS);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const toggleStatus = (id: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next: RoomInventoryItem["status"] =
          r.status === "Available"
            ? "Occupied"
            : r.status === "Occupied"
            ? "Maintenance"
            : "Available";
        return { ...r, status: next };
      })
    );
  };

  const toggleHousekeeping = (id: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          housekeeping: r.housekeeping === "Clean" ? "Needs Cleaning" : "Clean",
        };
      })
    );
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesCat = filterCategory === "all" || r.category === filterCategory;
    const matchesStat = filterStatus === "all" || r.status === filterStatus;
    return matchesCat && matchesStat;
  });

  const availableCount = rooms.filter((r) => r.status === "Available").length;
  const occupiedCount = rooms.filter((r) => r.status === "Occupied").length;
  const maintenanceCount = rooms.filter((r) => r.status === "Maintenance").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-brand-maroon">
            Rooms &amp; Inventory Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Live inventory occupancy toggle, housekeeping verification, and nightly rate schedules.
          </p>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800">
            {availableCount} Available
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-blue-100 text-blue-800">
            {occupiedCount} Occupied
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800">
            {maintenanceCount} Maintenance
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-gray-500 uppercase tracking-wider text-[11px]">
            Category:
          </span>
          {["all", "Executive Suite", "Standard Room", "Luxury Cottage", "Serviced AirBnB"].map(
            (c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilterCategory(c)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filterCategory === c
                    ? "bg-brand-maroon text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c === "all" ? "All Types" : c}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-500 uppercase tracking-wider text-[11px]">
            Status:
          </span>
          {["all", "Available", "Occupied", "Maintenance"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all ${
                filterStatus === s
                  ? "bg-brand-amber text-brand-maroon font-bold"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4 text-xs"
          >
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-sm font-black text-brand-maroon block">
                  #{room.id}
                </span>
                <h4 className="font-bold text-gray-900 text-sm mt-0.5">{room.name}</h4>
                <p className="text-[11px] text-gray-500">{room.category}</p>
              </div>

              <button
                type="button"
                onClick={() => toggleStatus(room.id)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-transform active:scale-95 ${
                  room.status === "Available"
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    : room.status === "Occupied"
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                }`}
                title="Click to toggle status"
              >
                {room.status}
              </button>
            </div>

            {/* Current Guest info */}
            <div className="p-3 bg-brand-cream/40 rounded-xl border border-brand-maroon/10 space-y-1">
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>Nightly Rate:</span>
                <strong className="text-brand-maroon font-serif font-black">
                  KES {room.pricePerNight.toLocaleString()}
                </strong>
              </div>
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>Occupant:</span>
                <span className="font-semibold text-gray-800 truncate max-w-[140px]">
                  {room.currentGuest || "Vacant"}
                </span>
              </div>
            </div>

            {/* Housekeeping Toggle */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-gray-500 text-[11px]">Housekeeping:</span>
              <button
                type="button"
                onClick={() => toggleHousekeeping(room.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  room.housekeeping === "Clean"
                    ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                    : "text-amber-700 bg-amber-50 hover:bg-amber-100"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>{room.housekeeping}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
