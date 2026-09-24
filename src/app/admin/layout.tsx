"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  UtensilsCrossed,
  Bed,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  Bell,
  FileText,
  ClipboardList,
  Users,
  PhoneCall,
  Sparkles,
  PartyPopper,
  BarChart3,
  History,
  Settings,
  UserCheck,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { label: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Reservations Desk", href: "/admin/reservations", icon: Calendar },
  { label: "Rooms & Inventory", href: "/admin/rooms", icon: Bed },
  { label: "Housekeeping Oversight", href: "/admin/housekeeping", icon: Sparkles },
  { label: "Staff & Human Resources", href: "/admin/staff", icon: Users },
  { label: "Roles & RBAC Permissions", href: "/admin/roles", icon: ShieldCheck },
  { label: "WhatsApp Service Config", href: "/admin/services", icon: PhoneCall },
  { label: "Kitchen Display (KDS)", href: "/admin/orders", icon: UtensilsCrossed },
  { label: "Conferences & Events", href: "/admin/events", icon: PartyPopper },
  { label: "Guest Members Directory", href: "/admin/users", icon: UserCheck },
  { label: "Executive Analytics Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Guest Inquiries & Form Fills", href: "/admin/inquiries", icon: ClipboardList },
  { label: "Operational Audit Trail", href: "/admin/audit-log", icon: History },
  { label: "Brand & Hotel Settings", href: "/admin/settings", icon: Settings },
  { label: "Project Docs & PDF Exports", href: "/admin/documents", icon: FileText },
];


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
          <span className="font-serif font-bold text-sm tracking-wider">Hotel Kalya Admin</span>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-[11px] font-bold transition-colors"
        >
          <span>Live Site</span>
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
              <span>Operations Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-2" aria-label="Admin Navigation">
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 px-3 py-1 block">
              Desk Management
            </span>
            {ADMIN_NAV.map((item) => {
              const active = pathname === item.href;
              const IconComp = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all",
                    active
                      ? "bg-brand-amber text-brand-maroon shadow-md"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <IconComp className={cn("w-4 h-4", active ? "text-brand-maroon" : "text-brand-amber")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Exit Footer */}
        <div className="p-5 border-t border-white/10 bg-black/20 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-amber text-brand-maroon font-bold flex items-center justify-center text-sm shadow">
              {user ? user.name.charAt(0).toUpperCase() : "S"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {user ? user.name : "Duty Desk Manager"}
              </p>
              <p className="text-[10px] text-brand-amber-light/80">Kapenguria Staff</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-amber" />
              <span>Public Website</span>
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
              Hotel Kalya — Front Desk Operations
            </h2>
            <p className="text-xs text-gray-500">
              Kapenguria, West Pokot County • Live Reservation &amp; Dining Console
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Front Desk Online</span>
            </div>

            <div className="p-2 rounded-xl text-gray-400 hover:text-brand-maroon transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 rounded-full bg-brand-amber absolute top-1.5 right-1.5" />
            </div>

            <Link
              href="/staff/dashboard"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-amber text-brand-maroon text-xs font-extrabold hover:bg-brand-amber-light transition-colors shadow-sm"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Staff Portal</span>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-cream border border-brand-maroon/15 text-brand-maroon text-xs font-bold hover:bg-brand-cream/80 transition-colors shadow-sm"
            >
              <span>Back to Guest Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-brand-amber-dark" />
            </Link>
          </div>
        </header>

        {/* Nested Page Body */}
        <div className="p-5 sm:p-8 flex-1 print:p-0 print:m-0">
          {children}
        </div>
      </main>
    </div>
  );
}
