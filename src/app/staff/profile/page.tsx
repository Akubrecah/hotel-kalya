"use client";

import React, { useState } from "react";

import { useAuth } from "@/context/AuthContext";

export default function StaffProfilePage() {
  const { user } = useAuth();
  const [shiftStatus, setShiftStatus] = useState<"ON_DUTY" | "BREAK" | "OFF_DUTY">("ON_DUTY");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon">
          Staff Member Profile &amp; Shift Console
        </h1>
        <p className="text-xs text-gray-500">
          Personal staff identity, active duty shift status, and departmental assignment
        </p>
      </div>

      {/* Staff Identity Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-maroon text-white font-bold text-xl flex items-center justify-center font-serif shadow">
              {user ? user.name.charAt(0) : "S"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{user?.name || "Staff Member on Duty"}</h2>
              <p className="text-xs text-brand-amber-dark font-semibold">
                Hotel Kalya Front Desk &amp; Operations
              </p>
              <p className="text-[11px] text-gray-400">Kapenguria, West Pokot County</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider ${
                shiftStatus === "ON_DUTY"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : shiftStatus === "BREAK"
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              ● {shiftStatus.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Shift Control Buttons */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
          <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
            Shift Attendance &amp; Activity Tracking
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShiftStatus("ON_DUTY")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                shiftStatus === "ON_DUTY"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white border text-gray-700 hover:bg-gray-100"
              }`}
            >
              ✓ On Duty Active
            </button>
            <button
              type="button"
              onClick={() => setShiftStatus("BREAK")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                shiftStatus === "BREAK"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-white border text-gray-700 hover:bg-gray-100"
              }`}
            >
              ☕ Lunch / Tea Break
            </button>
            <button
              type="button"
              onClick={() => setShiftStatus("OFF_DUTY")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                shiftStatus === "OFF_DUTY"
                  ? "bg-gray-800 text-white shadow-sm"
                  : "bg-white border text-gray-700 hover:bg-gray-100"
              }`}
            >
              End Shift (Off Duty)
            </button>
          </div>
        </div>

        {/* Operational Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white border border-gray-200/80 space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Official Email</span>
            <p className="font-semibold text-gray-800">{user?.email || "staff@hotelkalya.com"}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200/80 space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Duty Phone</span>
            <p className="font-semibold text-gray-800">{user?.phone || "+254 719 766649"}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200/80 space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Department</span>
            <p className="font-semibold text-gray-800">Front Office &amp; Guest Accommodation</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200/80 space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Shift Hours</span>
            <p className="font-semibold text-gray-800">Morning Shift (6:00 AM – 2:00 PM)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
