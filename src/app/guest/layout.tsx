"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  User,
  ExternalLink,
  Menu,
  X,
  LogOut,
  Bed,
  Utensils,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const GUEST_NAV = [
  { label: "My Dashboard", href: "/guest/dashboard", icon: LayoutDashboard },
  { label: "My Reservations", href: "/guest/bookings", icon: Calendar },
  { label: "Front Desk & Concierge", href: "/guest/messages", icon: MessageSquare },
  { label: "Guest Profile", href: "/guest/profile", icon: User },
];

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E0B0F] flex flex-col lg:flex-row">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-brand-maroon text-white p-4 px-5 flex items-center justify-between shadow-md sticky top-0 z-40 print:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-serif font-bold text-sm tracking-wider">Hotel Kalya Guest Portal</span>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-[11px] font-bold transition-colors"
        >
          <span>Main Site</span>
          <ExternalLink className="w-3 h-3 text-brand-amber" />
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "w-72 bg-brand-maroon-dark text-white flex-shrink-0 flex flex-col justify-between fixed lg:sticky top-0 h-screen z-50 transition-transform duration-200 border-r border-brand-maroon/20 print:hidden",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Logo & Operational Badge */}
          <div className="space-y-3">
            <BrandLogo light size="sm" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-amber/15 border border-brand-amber/30 text-brand-amber text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Guest Member Lounge</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2" aria-label="Guest Navigation">
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 px-3 py-1 block">
              Guest Services
            </span>
            {GUEST_NAV.map((item) => {
              const active = pathname === item.href || (item.href !== "/guest/dashboard" && pathname.startsWith(item.href));
              const IconComp = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all",
                    active
                      ? "bg-brand-amber text-brand-maroon shadow-md font-extrabold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <IconComp className={cn("w-4 h-4", active ? "text-brand-maroon" : "text-brand-amber")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Hospitality Links */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 px-3 py-1 block">
              Explore Kalya
            </span>
            <Link
              href="/availability"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Bed className="w-3.5 h-3.5 text-brand-amber" />
              <span>Book Another Room</span>
            </Link>
            <Link
              href="/menu"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Utensils className="w-3.5 h-3.5 text-brand-amber" />
              <span>Dining &amp; Room Service</span>
            </Link>
            <a
              href="https://wa.me/254719766649"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-brand-amber hover:text-white hover:bg-brand-amber/20 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp Duty Manager</span>
            </a>
          </div>
        </div>

        {/* User Card & Sign Out */}
        <div className="p-5 border-t border-white/10 bg-black/20 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-amber text-brand-maroon font-bold flex items-center justify-center text-sm shadow">
              {user?.name ? user.name.charAt(0).toUpperCase() : "G"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {user ? user.name : "James Chemosit"}
              </p>
              <p className="text-[10px] text-brand-amber-light/80 truncate">
                {user?.email || "guest@hotelkalya.com"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-amber" />
              <span>Hotel Homepage</span>
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar for Desktop */}
        <header className="hidden lg:flex items-center justify-between h-20 px-8 bg-white border-b border-gray-200/80 sticky top-0 z-30 shadow-sm print:hidden">
          <div>
            <h2 className="text-lg font-bold text-brand-maroon">
              Hotel Kalya — Guest Hospitality Lounge
            </h2>
            <p className="text-xs text-gray-500">
              Kapenguria, West Pokot County • Personal Reservations &amp; Stay Preferences
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-brand-amber/30 text-brand-maroon text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-brand-amber animate-pulse" />
              <span>Highland Wi-Fi: <strong className="text-brand-maroon">Kalya@2026</strong></span>
            </div>

            <Link
              href="/rooms"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-maroon text-white text-xs font-bold hover:bg-brand-maroon-dark transition-colors shadow-sm"
            >
              <Bed className="w-3.5 h-3.5 text-brand-amber" />
              <span>Explore All Rooms</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-5 sm:p-8 flex-1 print:p-0 print:m-0">
          {children}
        </div>
      </main>
    </div>
  );
}
