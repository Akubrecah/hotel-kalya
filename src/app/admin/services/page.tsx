"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { ServiceContact } from "@/types/hospitality";

export default function AdminServicesConfigPage() {
  const [contacts, setContacts] = useState<ServiceContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const loadContacts = React.useCallback(async () => {
    try {
      const res = await fetch("/api/service-contacts");
      const data = await res.json();
      if (data.success && Array.isArray(data.contacts)) {
        setContacts(data.contacts);
      }
    } catch (err) {
      console.error("Failed to load service contacts", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchContacts() {
      try {
        const res = await fetch("/api/service-contacts");
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.contacts)) {
          setContacts(data.contacts);
        }
      } catch (err) {
        console.error("Failed to load service contacts", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    fetchContacts();
    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (key: string, field: keyof ServiceContact, value: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.serviceKey === key ? { ...c, [field]: value } : c))
    );
  };

  const handleSaveContact = async (contact: ServiceContact) => {
    setSavingKey(contact.serviceKey);
    try {
      const res = await fetch("/api/service-contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceKey: contact.serviceKey,
          responsibleStaff: contact.responsibleStaff,
          roleTitle: contact.roleTitle,
          whatsappNumber: contact.whatsappNumber,
          phone: contact.phone,
          email: contact.email,
          availabilityHours: contact.availabilityHours,
          quickGreeting: contact.quickGreeting,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedKey(contact.serviceKey);
        setTimeout(() => setSavedKey(null), 3000);
      } else {
        alert(data.error || "Save failed.");
      }
    } catch {
      alert("Error saving service contact.");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon">
            Service-Specific WhatsApp &amp; Personnel Config
          </h1>
          <p className="text-xs text-gray-500">
            Configure responsible personnel, direct WhatsApp numbers, and hours across all hotel departments
          </p>
        </div>

        <button
          type="button"
          onClick={loadContacts}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brand-maroon ${loading ? "animate-spin" : ""}`} />
          <span>Reload Config</span>
        </button>
      </div>

      {/* Notice Card */}
      <div className="p-4 bg-brand-cream border border-brand-maroon/15 rounded-2xl text-xs text-brand-maroon space-y-1">
        <p className="font-bold">Zero Hardcoding Rule:</p>
        <p className="text-brand-maroon/80 text-[11px]">
          The customer website dynamically queries this configuration to build context-rich WhatsApp links for Accommodation, Dining, Conferences, Catering, and Garden Events. Updates take effect across all customer forms immediately without code rebuilds.
        </p>
      </div>

      {/* Services List */}
      <div className="space-y-5">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400 animate-pulse bg-white rounded-3xl border">
            Loading departmental routing rules...
          </div>
        ) : (
          contacts.map((c) => {
            const isSaving = savingKey === c.serviceKey;
            const isSaved = savedKey === c.serviceKey;

            return (
              <div
                key={c.id}
                className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-brand-maroon bg-brand-cream px-2 py-0.5 rounded">
                      Department: {c.department}
                    </span>
                    <h2 className="text-base font-bold text-gray-900 mt-1 font-serif">
                      {c.serviceTitle}
                    </h2>
                  </div>

                  {isSaved && (
                    <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Changes Saved!</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Responsible Staff</label>
                    <input
                      type="text"
                      value={c.responsibleStaff}
                      onChange={(e) => handleChange(c.serviceKey, "responsibleStaff", e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Official Role Title</label>
                    <input
                      type="text"
                      value={c.roleTitle}
                      onChange={(e) => handleChange(c.serviceKey, "roleTitle", e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">WhatsApp Number (Clean)</label>
                    <input
                      type="text"
                      value={c.whatsappNumber}
                      onChange={(e) => handleChange(c.serviceKey, "whatsappNumber", e.target.value)}
                      placeholder="e.g. 254719766649"
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Telephone / Desk</label>
                    <input
                      type="text"
                      value={c.phone}
                      onChange={(e) => handleChange(c.serviceKey, "phone", e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Department Email</label>
                    <input
                      type="email"
                      value={c.email}
                      onChange={(e) => handleChange(c.serviceKey, "email", e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Operating Hours</label>
                    <input
                      type="text"
                      value={c.availabilityHours}
                      onChange={(e) => handleChange(c.serviceKey, "availabilityHours", e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1 text-xs">
                    Automated Greeting Pre-filled in WhatsApp
                  </label>
                  <input
                    type="text"
                    value={c.quickGreeting}
                    onChange={(e) => handleChange(c.serviceKey, "quickGreeting", e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs italic"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSaveContact(c)}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold text-xs shadow transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5 text-brand-amber" />
                    <span>{isSaving ? "Saving..." : "Save Department Contact"}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
