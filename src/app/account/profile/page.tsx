"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Mail, Phone, ShieldCheck, Check, ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useAuth } from "@/context/AuthContext";

export default function AccountProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [dietary, setDietary] = useState<string[]>(user?.dietaryPreferences || ["Halal", "Local Cuisine"]);
  const [saved, setSaved] = useState(false);

  const toggleDietary = (item: string) => {
    setDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      email,
      phone,
      dietaryPreferences: dietary,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/account" },
          { label: "Profile Details" },
        ]}
      />

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-maroon hover:underline mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Account Overview</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-xl border border-brand-maroon/10 p-7 sm:p-10 space-y-6">
            <div className="border-b border-brand-cream pb-4">
              <h1 className="font-serif font-black text-2xl text-brand-maroon">
                Personal Profile &amp; Guest Details
              </h1>
              <p className="text-xs text-brand-dark/70 mt-1">
                Keep your contact details up to date for room confirmations and dining order deliveries.
              </p>
            </div>

            {saved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Profile details successfully updated!</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-maroon mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-brand-maroon/20 focus:outline-none focus:ring-2 focus:ring-brand-amber bg-brand-cream/30 text-brand-dark"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-maroon mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-brand-maroon/20 focus:outline-none focus:ring-2 focus:ring-brand-amber bg-brand-cream/30 text-brand-dark"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-maroon mb-1">
                  Contact Phone / M-Pesa Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +254 712 345678"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-brand-maroon/20 focus:outline-none focus:ring-2 focus:ring-brand-amber bg-brand-cream/30 text-brand-dark"
                  />
                </div>
              </div>

              {/* Dietary Preferences for Restaurant */}
              <div>
                <label className="block text-xs font-bold text-brand-maroon mb-2">
                  Kitchen &amp; Dining Preferences
                </label>
                <p className="text-[11px] text-brand-dark/60 mb-3">
                  Select your culinary habits so our chef can customize dining and banquet menus:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Halal",
                    "Vegetarian",
                    "Local Cuisine",
                    "Gluten-Free",
                    "Spicy Preferred",
                    "Mild Flavors",
                    "Low Sodium",
                  ].map((pref) => {
                    const selected = dietary.includes(pref);
                    return (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => toggleDietary(pref)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                          selected
                            ? "bg-brand-maroon text-white shadow-sm"
                            : "bg-brand-cream/80 text-brand-dark/70 hover:bg-brand-cream"
                        }`}
                      >
                        {selected ? `✓ ${pref}` : `+ ${pref}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-brand-cream flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-brand-dark/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Encrypted guest profile</span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-all shadow active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
