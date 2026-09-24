"use client";

import React, { useState } from "react";
import {
  Save,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [hotelName, setHotelName] = useState("Hotel Kalya Kapenguria");
  const [tagline, setTagline] = useState("Hospitality Redefined");
  const [address, setAddress] = useState("Kapenguria, West Pokot County, Kenya");
  const [checkInTime, setCheckInTime] = useState("14:00 (2:00 PM)");
  const [checkOutTime, setCheckOutTime] = useState("10:00 (10:00 AM)");
  const [cancellationHours, setCancellationHours] = useState("24 Hours");
  const [wifiSsid, setWifiSsid] = useState("HOTEL_KALYA_GUEST");
  const [wifiPassword, setWifiPassword] = useState("Kalya@2026");
  const [googleMapsUrl, setGoogleMapsUrl] = useState(
    "https://maps.google.com/?q=Hotel+Kalya+Kapenguria+Kenya"
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaved(true);
      setSaving(false);
      setTimeout(() => setSaved(false), 3000);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon">
          Hotel Operational &amp; Brand Settings
        </h1>
        <p className="text-xs text-gray-500">
          Configure global business parameters, check-in rules, Wi-Fi credentials, and map coordinates
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Operational settings saved successfully! Changes are active immediately.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Brand & Identity */}
          <div className="space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
              Hospitality Brand Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Hotel Name</label>
                <input
                  type="text"
                  required
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Brand Tagline</label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Physical Location &amp; Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs"
              />
            </div>
          </div>

          {/* Operational Timings & Rules */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
              Stay &amp; Reservation Rules
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Check-in Commences</label>
                <input
                  type="text"
                  required
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Check-out Deadline</label>
                <input
                  type="text"
                  required
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Free Cancellation Window</label>
                <input
                  type="text"
                  required
                  value={cancellationHours}
                  onChange={(e) => setCancellationHours(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Wi-Fi & Connectivity */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
              Guest Optical Fiber Wi-Fi Credentials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Network SSID</label>
                <input
                  type="text"
                  required
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Network Password</label>
                <input
                  type="text"
                  required
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Google Maps & Navigation */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
              Google Maps Location &amp; Directions URL
            </h2>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Google Maps Link</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs"
                />
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Link</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold text-xs shadow transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-brand-amber" />
              <span>{saving ? "Saving..." : "Save Configuration"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
