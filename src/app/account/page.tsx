"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Calendar,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  MapPin,
  ChevronRight,
  Bed,
  Utensils,
  ArrowRight,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useAuth } from "@/context/AuthContext";
import { DirectionsButton } from "@/components/maps/DirectionsButton";
import { BRAND } from "@/lib/constants";

interface AccountLocalOrder {
  id: string;
  date: string;
  type: string;
  itemsCount: number;
  total: number;
  status: string;
}

export default function AccountOverviewPage() {
  const { user, logout, isLoading } = useAuth();
  const [localOrders] = useState<AccountLocalOrder[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("hotel_kalya_user_orders") || "[]");
    } catch {
      return [];
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-brand-amber border-t-brand-maroon animate-spin" />
      </div>
    );
  }

  // Pre-seeded reservations for demo/guest account
  const activeBookings = [
    {
      id: "BK-88421",
      service: "Executive Deluxe Suite",
      checkIn: "28 September 2026",
      checkOut: "30 September 2026",
      guests: "2 Adults",
      status: "Confirmed",
      amount: "KES 17,000",
    },
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Guest Account Portal" },
        ]}
      />

      {/* Account Header */}
      <section className="bg-brand-cream/80 py-10 lg:py-14 border-b border-brand-maroon/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-maroon text-brand-amber flex items-center justify-center font-serif font-black text-2xl shadow-md border-2 border-brand-amber">
                {user ? user.name.charAt(0).toUpperCase() : "G"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif font-black text-2xl sm:text-3xl text-brand-maroon">
                    {user ? `Hello, ${user.name}` : "Guest Portal"}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-amber text-brand-maroon text-[10px] font-black uppercase tracking-wider">
                    Kalya Club
                  </span>
                </div>
                <p className="text-xs text-brand-dark/70 mt-0.5">
                  {user ? user.email : "Sign in to access your hotel records"}
                </p>
              </div>
            </div>

            {user ? (
              <button
                onClick={() => logout()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors self-start sm:self-center"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-maroon text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-maroon-dark transition-colors self-start sm:self-center shadow"
              >
                <span>Sign In to Your Account</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Main Account Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Navigation Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-brand-cream/50 rounded-2xl p-4 border border-brand-maroon/10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/50 px-3 py-1 block">
                  Account Management
                </span>
                {[
                  { label: "Dashboard Overview", href: "/account", icon: User, active: true },
                  { label: "My Profile Details", href: "/account/profile", icon: User },
                  { label: "Room Bookings", href: "/account/bookings", icon: Calendar, badge: "1 Active" },
                  { label: "Food Orders", href: "/account/orders", icon: ShoppingBag, badge: `${localOrders.length}` },
                  { label: "Saved Favorites", href: "/account/favorites", icon: Heart },
                  { label: "Account Settings", href: "/account/settings", icon: Settings },
                ].map((tab) => {
                  const IconComp = tab.icon;
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        tab.active
                          ? "bg-brand-maroon text-white shadow-sm"
                          : "text-brand-dark hover:bg-brand-cream hover:text-brand-maroon"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp className={`w-4 h-4 ${tab.active ? "text-brand-amber" : "text-brand-dark/60"}`} />
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge && (
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            tab.active ? "bg-brand-amber text-brand-maroon" : "bg-brand-cream text-brand-dark/70"
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Quick Hotel Desk Card */}
              <div className="bg-white rounded-2xl p-5 border border-brand-maroon/10 shadow-sm space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-maroon block">
                  Front Desk Assistance
                </span>
                <p className="text-xs text-brand-dark/70 leading-relaxed">
                  Need early check-in, dietary adjustments, or airport pickup from Kitale/Eldoret?
                </p>
                <div className="pt-1 flex flex-col gap-2">
                  <a
                    href={`tel:${BRAND.phoneClean}`}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-brand-cream text-brand-maroon text-xs font-bold hover:bg-brand-amber/20 transition-colors"
                  >
                    <span>Call Front Desk ({BRAND.phone})</span>
                  </a>
                  <DirectionsButton size="sm" variant="outline" />
                </div>
              </div>
            </div>

            {/* Dashboard Content (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Upcoming Reservation Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-brand-maroon/10 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-brand-cream pb-3">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-brand-amber" />
                    <h3 className="font-serif font-bold text-lg text-brand-maroon">
                      Upcoming Stay Reservation
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    Confirmed
                  </span>
                </div>

                {activeBookings.map((b) => (
                  <div key={b.id} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-brand-cream/30 p-4 rounded-xl border border-brand-maroon/5">
                      <div>
                        <span className="text-brand-dark/60 block">Accommodation:</span>
                        <strong className="text-brand-maroon text-sm font-serif">{b.service}</strong>
                      </div>
                      <div>
                        <span className="text-brand-dark/60 block">Dates:</span>
                        <span className="font-semibold text-brand-dark">{b.checkIn} – {b.checkOut}</span>
                      </div>
                      <div>
                        <span className="text-brand-dark/60 block">Guests &amp; Rate:</span>
                        <span className="font-semibold text-brand-dark">{b.guests} • {b.amount}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2 text-xs text-brand-dark/70">
                        <MapPin className="w-4 h-4 text-brand-amber-dark" />
                        <span>Hotel Kalya, Kapenguria • Check-in: 12:00 PM</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DirectionsButton size="sm" variant="secondary">
                          Directions to Hotel
                        </DirectionsButton>
                        <Link
                          href="/account/bookings"
                          className="px-3.5 py-1.5 rounded-lg border border-brand-maroon/20 text-xs font-bold text-brand-maroon hover:bg-brand-cream transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-brand-maroon/10 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-brand-cream pb-3">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-brand-amber" />
                    <h3 className="font-serif font-bold text-lg text-brand-maroon">
                      Recent Dining Orders
                    </h3>
                  </div>
                  <Link
                    href="/account/orders"
                    className="text-xs font-bold text-brand-maroon hover:underline flex items-center gap-1"
                  >
                    <span>All Orders ({localOrders.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {localOrders.length === 0 ? (
                  <div className="text-center py-8 bg-brand-cream/30 rounded-xl p-4">
                    <p className="text-xs text-brand-dark/60">No recent digital menu orders placed yet.</p>
                    <Link
                      href="/menu"
                      className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-brand-maroon hover:underline"
                    >
                      <span>Explore Dining Menu &amp; Order</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {localOrders.slice(0, 3).map((ord, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 bg-brand-cream/30 rounded-xl border border-brand-maroon/10 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-brand-maroon">#{ord.id}</span>
                            <span className="text-brand-dark/60">• {ord.date}</span>
                          </div>
                          <p className="text-[11px] text-brand-dark/70 mt-0.5">
                            {ord.type} • {ord.itemsCount} items
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-serif font-bold text-brand-maroon block">
                            KES {ord.total?.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold">{ord.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fast Booking CTA */}
              <div className="bg-gradient-to-r from-brand-maroon to-brand-maroon-dark text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                  <h4 className="font-serif font-bold text-xl">Plan Your Next Visit to Kapenguria</h4>
                  <p className="text-xs text-white/80 mt-1 max-w-md">
                    Reserve executive suites, conference halls, private garden events, or serviced AirBnB apartments.
                  </p>
                </div>
                <Link
                  href="/book"
                  className="px-6 py-3 rounded-xl bg-brand-amber text-brand-maroon font-bold text-xs uppercase tracking-wider hover:bg-brand-amber-dark transition-all whitespace-nowrap shadow"
                >
                  Book New Reservation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
