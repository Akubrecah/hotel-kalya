"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Calendar as CalendarIcon } from "lucide-react";

interface DayStatus {
  date: string;
  day: number;
  status: "AVAILABLE" | "RESERVED" | "PENDING" | "CHECKED_IN" | "MAINTENANCE";
}

interface RoomCalendarProps {
  roomId: string;
  roomName: string;
  onSelectDate?: (dateStr: string) => void;
  selectedCheckIn?: string;
  selectedCheckOut?: string;
}

export function RoomCalendar({
  roomId,
  roomName,
  onSelectDate,
  selectedCheckIn,
  selectedCheckOut,
}: RoomCalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 8, 1)); // Default September 2026
  const [days, setDays] = useState<DayStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-12
  const monthName = currentDate.toLocaleString("en-US", { month: "long" });

  useEffect(() => {
    let mounted = true;
    fetch(`/api/rooms/${roomId}?calendar=true&year=${year}&month=${month}`)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (data.success && data.calendar) {
          setDays(data.calendar);
        }
        setLoading(false);
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [roomId, year, month]);

  const handlePrevMonth = () => {
    setLoading(true);
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setLoading(true);
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Day of week offset for the 1st day of the month (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  // Adjust to Monday start (0 = Mon, 6 = Sun)
  const startOffset = (firstDayOfWeek + 6) % 7;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-brand-amber-light shadow-md space-y-5">
      {/* Calendar Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-maroon block">
            Real-Time Availability
          </span>
          <h3 className="font-serif font-bold text-lg text-brand-maroon-dark flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-brand-amber" />
            <span>
              {monthName} {year}
            </span>
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {roomName} • Live reservations from database
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels (Mon - Sun) */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((w) => (
          <div key={w} className="text-[11px] font-bold text-gray-400 uppercase py-1">
            {w}
          </div>
        ))}
      </div>

      {/* Day Cells Grid */}
      {loading ? (
        <div className="py-12 text-center space-y-2">
          <RefreshCw className="w-6 h-6 text-brand-maroon animate-spin mx-auto" />
          <p className="text-xs text-gray-400">Loading live availability records...</p>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Leading blank days */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`offset-${i}`} className="h-10 sm:h-12 rounded-xl bg-gray-50/50" />
          ))}

          {/* Month days */}
          {days.map((item) => {
            const isSelectedIn = selectedCheckIn === item.date;
            const isSelectedOut = selectedCheckOut === item.date;
            const isInSelectedRange =
              selectedCheckIn &&
              selectedCheckOut &&
              item.date > selectedCheckIn &&
              item.date < selectedCheckOut;

            let bgClass = "bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100 cursor-pointer";
            let statusDot = "bg-emerald-500";
            let statusLabel = "Available";

            if (item.status === "MAINTENANCE") {
              bgClass = "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed";
              statusDot = "bg-gray-500";
              statusLabel = "Maintenance";
            } else if (item.status === "CHECKED_IN") {
              bgClass = "bg-blue-50 text-blue-900 border-blue-200 cursor-not-allowed";
              statusDot = "bg-blue-600";
              statusLabel = "Checked In";
            } else if (item.status === "RESERVED") {
              bgClass = "bg-rose-50 text-rose-900 border-rose-200 cursor-not-allowed";
              statusDot = "bg-rose-500";
              statusLabel = "Reserved";
            } else if (item.status === "PENDING") {
              bgClass = "bg-amber-50 text-amber-900 border-amber-200 cursor-not-allowed";
              statusDot = "bg-amber-500";
              statusLabel = "Pending";
            }

            if (isSelectedIn || isSelectedOut) {
              bgClass = "bg-brand-maroon text-white border-brand-maroon shadow-md cursor-pointer font-bold";
              statusDot = "bg-brand-amber";
            } else if (isInSelectedRange) {
              bgClass = "bg-brand-amber-light/70 text-brand-maroon border-brand-amber cursor-pointer";
            }

            return (
              <button
                key={item.date}
                type="button"
                onClick={() => {
                  if (item.status === "AVAILABLE" && onSelectDate) {
                    onSelectDate(item.date);
                  }
                }}
                disabled={item.status !== "AVAILABLE"}
                title={`${item.date}: ${statusLabel}`}
                className={`h-11 sm:h-13 p-1 rounded-xl border flex flex-col justify-between items-center transition-all ${bgClass}`}
              >
                <span className="text-xs sm:text-sm font-semibold">{item.day}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
              </button>
            );
          })}
        </div>
      )}

      {/* Accessible Legend with Text Labels */}
      <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <span>In-House</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
          <span>Blocked</span>
        </div>
      </div>
    </div>
  );
}
