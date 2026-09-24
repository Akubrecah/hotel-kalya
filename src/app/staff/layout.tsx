"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Bed,
  Sparkles,
  UtensilsCrossed,
  ChefHat,
  Presentation,
  PartyPopper,
  Truck,
  MessageSquare,
  User,
  ShieldCheck,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { cn } from "@/lib/utils";
import { StaffRole } from "@/types/hospitality";

const STAFF_NAV_ITEMS = [
  { label: "Dashboard", href: "/staff/dashboard", icon: LayoutDashboard, roles: ["ALL"] },
  { label: "Front Desk & Arrivals", href: "/staff/reservations", icon: Calendar, roles: ["RECEPTIONIST", "MANAGER", "ADMIN"] },
  { label: "Rooms & Status", href: "/staff/rooms", icon: Bed, roles: ["RECEPTIONIST", "HOUSEKEEPING", "MAINTENANCE", "MANAGER", "ADMIN"] },
  { label: "Housekeeping Board", href: "/staff/housekeeping", icon: Sparkles, roles: ["HOUSEKEEPING", "MANAGER", "ADMIN"] },
  { label: "Waitstaff / Dining", href: "/staff/restaurant", icon: UtensilsCrossed, roles: ["WAITER", "WAITRESS", "RESTAURANT_MANAGER", "ADMIN"] },
  { label: "Kitchen Display (KDS)", href: "/staff/orders", icon: ChefHat, roles: ["CHEF", "RESTAURANT_MANAGER", "ADMIN"] },
  { label: "Conference Halls", href: "/staff/conference", icon: Presentation, roles: ["EVENT_COORDINATOR", "MANAGER", "ADMIN"] },
  { label: "Outside Catering", href: "/staff/catering", icon: Truck, roles: ["CATERING_STAFF", "MANAGER", "ADMIN"] },
  { label: "Garden & Events", href: "/staff/events", icon: PartyPopper, roles: ["EVENT_COORDINATOR", "MANAGER", "ADMIN"] },
  { label: "Guest Messages", href: "/staff/messages", icon: MessageSquare, roles: ["ALL"] },
  { label: "My Shift Profile", href: "/staff/profile", icon: User, roles: ["ALL"] },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<StaffRole>("RECEPTIONIST");

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E0B0F] flex flex-col lg:flex-row print:block print:bg-white">
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
          <span className="font-serif font-bold text-sm tracking-wider">Hotel Kalya Staff Portal</span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value as StaffRole)}
            className="text-[10px] bg-white/20 border border-white/30 text-white rounded-lg px-2 py-1 font-bold focus:outline-none"
          >
            <option value="RECEPTIONIST" className="text-gray-900">Receptionist</option>
            <option value="HOUSEKEEPING" className="text-gray-900">Housekeeping</option>
            <option value="WAITER" className="text-gray-900">Waitstaff</option>
            <option value="CHEF" className="text-gray-900">Chef / Kitchen</option>
            <option value="EVENT_COORDINATOR" className="text-gray-900">Event Coordinator</option>
            <option value="CATERING_STAFF" className="text-gray-900">Catering Staff</option>
            <option value="MANAGER" className="text-gray-900">Duty Manager</option>
          </select>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "w-72 bg-[#1A0609] text-white flex-shrink-0 flex flex-col justify-between fixed lg:sticky top-0 h-screen z-50 transition-transform duration-200 border-r border-brand-maroon/20 print:hidden",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Logo & Operational Badge */}
          <div className="space-y-3">
            <BrandLogo light size="sm" />
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-brand-amber/15 border border-brand-amber/30 text-brand-amber text-[10px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Staff Portal</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-brand-amber text-brand-maroon text-[9px] font-extrabold">
                {activeRole}
              </span>
            </div>
          </div>

          {/* Interactive Role Switcher */}
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
              Active Shift Role (RBAC):
            </label>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as StaffRole)}
              className="w-full text-xs bg-brand-maroon/40 border border-brand-amber/40 text-brand-amber-light rounded-xl px-2.5 py-2 font-bold focus:outline-none focus:ring-1 focus:ring-brand-amber"
            >
              <option value="RECEPTIONIST" className="text-gray-900">Receptionist / Front Desk</option>
              <option value="HOUSEKEEPING" className="text-gray-900">Housekeeping Attendant</option>
              <option value="WAITER" className="text-gray-900">Waiter / Waitress</option>
              <option value="CHEF" className="text-gray-900">Head Chef / Kitchen KDS</option>
              <option value="EVENT_COORDINATOR" className="text-gray-900">Conference &amp; Events</option>
              <option value="CATERING_STAFF" className="text-gray-900">Outside Catering Team</option>
              <option value="MANAGER" className="text-gray-900">Operations Manager</option>
            </select>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1" aria-label="Staff Navigation">
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 px-3 py-1 block">
              Operations Menu
            </span>
            {STAFF_NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              const isRelevant =
                item.roles.includes("ALL") ||
                item.roles.includes(activeRole) ||
                activeRole === "MANAGER" ||
                activeRole === "ADMIN";

              const IconComp = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all",
                    active
                      ? "bg-brand-amber text-brand-maroon shadow-md font-extrabold"
                      : isRelevant
                      ? "text-white/85 hover:bg-white/10 hover:text-white"
                      : "text-white/40 hover:bg-white/5 hover:text-white/60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={cn("w-4 h-4", active ? "text-brand-maroon" : isRelevant ? "text-brand-amber" : "text-gray-500")} />
                    <span>{item.label}</span>
                  </div>
                  {isRelevant && !active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-amber/60" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Cross-links */}
        <div className="p-4 border-t border-white/10 bg-black/40 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-amber text-brand-maroon font-bold flex items-center justify-center text-xs shadow">
              {activeRole.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                Duty Staff Member
              </p>
              <p className="text-[10px] text-brand-amber">{activeRole}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/admin"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-amber" />
              <span>Admin Desk</span>
            </Link>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-amber" />
              <span>Public</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar for Desktop */}
        <header className="hidden lg:flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200/80 sticky top-0 z-30 shadow-sm print:hidden">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-brand-maroon">
              Hotel Kalya Operational Portal
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-cream border border-brand-maroon/20 text-brand-maroon font-bold">
              Role: {activeRole}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Duty Shift Active (Kapenguria)</span>
            </div>

            <Link
              href="/admin/audit-log"
              className="text-xs text-gray-500 hover:text-brand-maroon font-medium flex items-center gap-1"
            >
              <span>Audit Trail</span>
            </Link>
          </div>
        </header>

        {/* Staff Page Body */}
        <div className="p-5 sm:p-8 flex-1 print:p-0 print:m-0">
          {children}
        </div>
      </main>
    </div>
  );
}
