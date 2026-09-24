"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PartyPopper,
  Presentation,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { ConferenceBooking, EventBooking } from "@/types/hospitality";

export default function AdminEventsOverviewPage() {
  const [conferences, setConferences] = useState<ConferenceBooking[]>([]);
  const [events, setEvents] = useState<EventBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = React.useCallback(async () => {
    try {
      const [confRes, evtRes] = await Promise.all([
        fetch("/api/conference"),
        fetch("/api/events"),
      ]);
      const confData = await confRes.json();
      const evtData = await evtRes.json();

      if (confData.success && Array.isArray(confData.conferences)) {
        setConferences(confData.conferences);
      }
      if (evtData.success && Array.isArray(evtData.events)) {
        setEvents(evtData.events);
      }
    } catch (err) {
      console.error("Failed to load events data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      try {
        const [confRes, evtRes] = await Promise.all([
          fetch("/api/conference"),
          fetch("/api/events"),
        ]);
        const confData = await confRes.json();
        const evtData = await evtRes.json();

        if (!ignore && confData.success && Array.isArray(confData.conferences)) {
          setConferences(confData.conferences);
        }
        if (!ignore && evtData.success && Array.isArray(evtData.events)) {
          setEvents(evtData.events);
        }
      } catch (err) {
        console.error("Failed to load events data", err);
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

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon">
            Conferences, Seminars &amp; Garden Events Oversight
          </h1>
          <p className="text-xs text-gray-500">
            Comprehensive contracts register for indoor hall meetings and outdoor garden experiences
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/staff/conference"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            <span>Staff Conference</span>
            <ExternalLink className="w-3 h-3 text-brand-amber-dark" />
          </Link>
          <Link
            href="/staff/events"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            <span>Staff Events</span>
            <ExternalLink className="w-3 h-3 text-brand-amber-dark" />
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

      {/* Conference Section */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Presentation className="w-5 h-5 text-brand-maroon" />
          <h2 className="font-serif text-lg font-bold text-brand-maroon">
            Indoor Conference &amp; Seminar Halls
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Ref</th>
                <th className="py-3 px-4">Organization &amp; Contact</th>
                <th className="py-3 px-4">Hall &amp; Layout</th>
                <th className="py-3 px-4">Delegates</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {conferences.map((c) => (
                <tr key={c.id} className="hover:bg-brand-cream/30">
                  <td className="py-3 px-4 font-mono font-bold text-brand-maroon">{c.id}</td>
                  <td className="py-3 px-4 font-bold text-gray-900">{c.organization}</td>
                  <td className="py-3 px-4 font-semibold text-gray-800">{c.hallName}</td>
                  <td className="py-3 px-4 text-gray-700">{c.delegates} Pax</td>
                  <td className="py-3 px-4 text-gray-600">{c.startDate} → {c.endDate}</td>
                  <td className="py-3 px-4 text-gray-600 truncate max-w-[140px]">{c.cateringPackage}</td>
                  <td className="py-3 px-4 font-bold text-brand-maroon font-serif">
                    KES {c.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Garden Events Section */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex items-center gap-2">
          <PartyPopper className="w-5 h-5 text-brand-maroon" />
          <h2 className="font-serif text-lg font-bold text-brand-maroon">
            Outdoor Lawns &amp; Garden Experiences
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Ref</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Event Type &amp; Grounds Area</th>
                <th className="py-3 px-4">Date &amp; Time Slot</th>
                <th className="py-3 px-4">Guests</th>
                <th className="py-3 px-4">Coordinator</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((e) => (
                <tr key={e.id} className="hover:bg-brand-cream/30">
                  <td className="py-3 px-4 font-mono font-bold text-brand-maroon">{e.id}</td>
                  <td className="py-3 px-4 font-bold text-gray-900">{e.clientName}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-brand-maroon">{e.eventType}</p>
                    <p className="text-[11px] text-gray-500">{e.venueArea}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    <p className="font-bold">{e.eventDate}</p>
                    <p className="text-[10px] text-gray-400">{e.timeSlot}</p>
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900">{e.guestCount} Guests</td>
                  <td className="py-3 px-4 text-gray-600">{e.responsibleStaff}</td>
                  <td className="py-3 px-4 font-bold text-brand-maroon font-serif">
                    KES {e.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
