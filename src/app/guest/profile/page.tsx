"use client";

import React, { useState } from "react";
import { User, Mail, Phone, CheckCircle2, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function GuestProfilePage() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "James Chemosit");
  const [email, setEmail] = useState(user?.email || "guest@hotelkalya.com");
  const [phone, setPhone] = useState(user?.phone || "+254 712 345678");
  const [dietary, setDietary] = useState<string[]>(user?.dietaryPreferences || ["Halal", "Local Cuisine"]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleDiet = (item: string) => {
    setDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name,
        email,
        phone,
        dietaryPreferences: dietary,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon">
          Guest Profile &amp; Stay Preferences
        </h1>
        <p className="text-xs text-gray-500">
          Customize your contact details and stay preferences so our team can personalize your experience
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Profile and stay preferences saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Personal Info */}
          <div className="space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber text-xs"
                />
              </div>
            </div>
          </div>

          {/* Dining & Dietary Preferences */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
              Kitchen &amp; Dietary Preferences
            </h2>
            <p className="text-[11px] text-gray-500">
              Select any dietary preferences or meal options you would like our chef to accommodate:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "Halal",
                "Vegetarian",
                "Gluten-Free",
                "Organic Farm-to-Table",
                "Spicy / Hot Pepper",
                "No Added Sugar",
                "Traditional Indigenous Greens",
              ].map((item) => {
                const active = dietary.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleDiet(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? "bg-brand-maroon text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {active ? "✓ " : "+ "} {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-all shadow disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-brand-amber" />
              <span>{saving ? "Saving..." : "Save Preferences"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
