"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Wifi,
  Globe,
  RefreshCw,
} from "lucide-react";
import { HotelSettings } from "@/types/hospitality";
import { useMounted } from "@/lib/useMounted";

export default function AdminSettingsPage() {
  const mounted = useMounted();
  const [settings, setSettings] = useState<HotelSettings>({
    name: "Hotel Kalya Kapenguria",
    tagline: "Premier Hospitality, Serene Highland Gardens & Mountain Views",
    officialWhatsApp: "+254722650000",
    primaryPhone: "+254 722 650 000",
    secondaryPhone: "+254 733 650 000",
    email: "reservations@hotelkalya.com",
    address: "Kapenguria Town, Off Makutano-Kitale Highway, West Pokot County, Kenya",
    coordinates: { lat: 1.2408, lng: 35.1119 },
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15951.109265147823!2d35.1019!3d1.2408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTQnMjYuOSJOIDM1wrAwNic0Mi44IkU!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske",
    googleMapsDirectionsUrl: "https://maps.google.com/?q=Hotel+Kalya+Kapenguria+Kenya",
    checkInTime: "2:00 PM (14:00)",
    checkOutTime: "10:30 AM (10:30)",
    receptionHours: "24/7 Front Desk Attendance",
    restaurantHours: "6:30 AM – 10:30 PM Daily",
    wifiNetwork: "HotelKalya-Guest",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      } catch (err) {
        console.error("Failed to load hotel settings", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
      } else {
        alert("Failed to save: " + data.error);
      }
    } catch (err) {
      alert("Error saving settings: " + String(err));
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-brand-maroon/20 border-t-brand-maroon rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-brand-maroon/10 text-brand-maroon text-[11px] font-extrabold uppercase tracking-wider">
            Universal CMS Config
          </span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <Globe className="w-3 h-3" /> Live Frontend Contact Synced
          </span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon mt-1">
          Brand, Contact &amp; Google Maps Settings
        </h1>
        <p className="text-xs text-gray-500">
          Universal business coordinates, customer WhatsApp numbers, phone lines, check-in policies, and embed map URLs.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-bold">Operational settings saved successfully! All public contact and maps are updated.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 text-xs sm:text-sm">
          {/* Brand & Identity */}
          <div className="space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-brand-maroon flex items-center gap-2 border-b border-gray-100 pb-2">
              <Globe className="w-4 h-4 text-brand-amber-dark" />
              <span>Hospitality Brand Identity</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Hotel Title *</label>
                <input
                  type="text"
                  required
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-maroon text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-maroon text-xs"
                />
              </div>
            </div>
          </div>

          {/* Contact Numbers & WhatsApp */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-brand-maroon flex items-center gap-2 border-b border-gray-100 pb-2">
              <Phone className="w-4 h-4 text-brand-amber-dark" />
              <span>Direct Customer Communication &amp; WhatsApp</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Official WhatsApp Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+2547XXXXXXXX"
                  value={settings.officialWhatsApp}
                  onChange={(e) => setSettings({ ...settings, officialWhatsApp: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-maroon text-xs font-mono font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Primary Reception Phone</label>
                <input
                  type="text"
                  required
                  value={settings.primaryPhone}
                  onChange={(e) => setSettings({ ...settings, primaryPhone: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-maroon text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">General Inquiries Email</label>
                <input
                  type="email"
                  required
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-maroon text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Physical Location & Google Maps */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-brand-maroon flex items-center gap-2 border-b border-gray-100 pb-2">
              <MapPin className="w-4 h-4 text-brand-amber-dark" />
              <span>Physical Address &amp; Google Maps Navigation</span>
            </h2>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Physical Location Address</label>
              <input
                type="text"
                required
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-maroon text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Google Maps Directions URL</label>
                <input
                  type="url"
                  value={settings.googleMapsDirectionsUrl}
                  onChange={(e) => setSettings({ ...settings, googleMapsDirectionsUrl: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-maroon text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={settings.coordinates.lat}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        coordinates: { ...settings.coordinates, lat: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={settings.coordinates.lng}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        coordinates: { ...settings.coordinates, lng: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Embedded Map Iframe URL</label>
              <input
                type="text"
                value={settings.googleMapsEmbedUrl}
                onChange={(e) => setSettings({ ...settings, googleMapsEmbedUrl: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-maroon text-xs font-mono"
              />
            </div>
          </div>

          {/* Operating Hours & Wi-Fi */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-brand-maroon flex items-center gap-2 border-b border-gray-100 pb-2">
              <Clock className="w-4 h-4 text-brand-amber-dark" />
              <span>Standard Operational Timings</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Check-in Standard Time</label>
                <input
                  type="text"
                  value={settings.checkInTime}
                  onChange={(e) => setSettings({ ...settings, checkInTime: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Check-out Standard Time</label>
                <input
                  type="text"
                  value={settings.checkOutTime}
                  onChange={(e) => setSettings({ ...settings, checkOutTime: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Guest Wi-Fi Network SSID</label>
                <input
                  type="text"
                  value={settings.wifiNetwork}
                  onChange={(e) => setSettings({ ...settings, wifiNetwork: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber font-bold shadow-md transition-all flex items-center gap-2"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save &amp; Broadcast Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
