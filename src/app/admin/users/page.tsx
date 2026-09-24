"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  RefreshCw,
} from "lucide-react";
import { Booking } from "@/types/hospitality";

interface GuestUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalStays: number;
  totalSpent: number;
  lastVisit: string;
}

export default function AdminUsersPage() {
  const [guests, setGuests] = useState<GuestUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadGuests = React.useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success && Array.isArray(data.bookings)) {
        // Aggregate guest profiles from real booking history
        const map: Record<string, GuestUser> = {};
        data.bookings.forEach((b: Booking) => {
          const key = b.guestEmail.toLowerCase();
          if (!map[key]) {
            map[key] = {
              id: "usr-" + key.split("@")[0],
              name: b.guestName,
              email: b.guestEmail,
              phone: b.guestPhone,
              totalStays: 0,
              totalSpent: 0,
              lastVisit: b.checkInDate,
            };
          }
          if (b.status !== "CANCELLED") {
            map[key].totalStays += 1;
            map[key].totalSpent += b.totalAmount;
            if (new Date(b.checkInDate) > new Date(map[key].lastVisit)) {
              map[key].lastVisit = b.checkInDate;
            }
          }
        });

        // Add standard demo guest if not in list
        if (!map["guest@hotelkalya.com"]) {
          map["guest@hotelkalya.com"] = {
            id: "usr-kalya-guest-01",
            name: "James Chemosit",
            email: "guest@hotelkalya.com",
            phone: "+254 712 345678",
            totalStays: 3,
            totalSpent: 26000,
            lastVisit: "2026-09-24",
          };
        }

        setGuests(Object.values(map));
      }
    } catch (err) {
      console.error("Failed to load guests", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchGuests() {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.bookings)) {
          const map: Record<string, GuestUser> = {};
          data.bookings.forEach((b: Booking) => {
            const key = b.guestEmail.toLowerCase();
            if (!map[key]) {
              map[key] = {
                id: "usr-" + key.split("@")[0],
                name: b.guestName,
                email: b.guestEmail,
                phone: b.guestPhone,
                totalStays: 0,
                totalSpent: 0,
                lastVisit: b.checkInDate,
              };
            }
            if (b.status !== "CANCELLED") {
              map[key].totalStays += 1;
              map[key].totalSpent += b.totalAmount;
              if (new Date(b.checkInDate) > new Date(map[key].lastVisit)) {
                map[key].lastVisit = b.checkInDate;
              }
            }
          });

          if (!map["guest@hotelkalya.com"]) {
            map["guest@hotelkalya.com"] = {
              id: "usr-kalya-guest-01",
              name: "James Chemosit",
              email: "guest@hotelkalya.com",
              phone: "+254 712 345678",
              totalStays: 3,
              totalSpent: 26000,
              lastVisit: "2026-09-24",
            };
          }

          setGuests(Object.values(map));
        }
      } catch (err) {
        console.error("Failed to load guests", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    fetchGuests();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredGuests = guests.filter((g) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        g.name.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon">
            Guest Accounts &amp; Member Directory
          </h1>
          <p className="text-xs text-gray-500">
            Registered customer profiles, cumulative guest spend, and stay histories
          </p>
        </div>

        <button
          type="button"
          onClick={loadGuests}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brand-maroon ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by guest name, phone, or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber text-xs"
          />
        </div>
        <span className="text-xs text-gray-500 font-medium hidden sm:inline">
          Unique Guests: <strong>{guests.length}</strong>
        </span>
      </div>

      {/* Guests Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400 animate-pulse">
            Compiling guest accounts...
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No guest accounts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Guest Profile</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4 text-center">Stays Completed</th>
                  <th className="py-3 px-4 text-right">Lifetime Spend</th>
                  <th className="py-3 px-4">Recent Visit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredGuests.map((g) => (
                  <tr key={g.id} className="hover:bg-brand-cream/30">
                    <td className="py-3.5 px-4 font-bold text-gray-900">{g.name}</td>
                    <td className="py-3.5 px-4 text-gray-600 font-mono text-[11px]">{g.email}</td>
                    <td className="py-3.5 px-4 text-gray-700">{g.phone}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-gray-800">
                      {g.totalStays} {g.totalStays === 1 ? "Stay" : "Stays"}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-brand-maroon font-serif">
                      KES {g.totalSpent.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">{g.lastVisit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
