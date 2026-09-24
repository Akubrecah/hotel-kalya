"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Clock,
  KeyRound,
  LogOut,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const STAFF_NAV_ITEMS = [
  { label: "Role Dashboard", href: "/staff/dashboard", icon: LayoutDashboard, roles: ["ALL"] },
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

const AVAILABLE_ROLES = [
  { code: "RECEPTIONIST", label: "Receptionist / Front Desk", dept: "Front Office" },
  { code: "HOUSEKEEPING", label: "Housekeeping Attendant", dept: "Housekeeping" },
  { code: "WAITER", label: "Waitstaff / Service", dept: "Food & Beverage" },
  { code: "CHEF", label: "Head Chef / Kitchen", dept: "Kitchen Operations" },
  { code: "EVENT_COORDINATOR", label: "Conference & Events", dept: "Conferences" },
  { code: "CATERING_STAFF", label: "Outside Catering", dept: "Banqueting" },
  { code: "MAINTENANCE", label: "Maintenance & Repairs", dept: "Engineering" },
  { code: "MANAGER", label: "Duty Manager", dept: "Operations" },
  { code: "ADMIN", label: "Executive Admin", dept: "Management" },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, activeStaffRole, setActiveStaffRole, switchAccount, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [timeStr, setTimeStr] = useState<string>("");

  // Live East Africa Time (EAT) Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-KE", {
          timeZone: "Africa/Nairobi",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleElevateToAdmin = () => {
    switchAccount("admin");
    setActiveStaffRole("ADMIN");
    setAdminModalOpen(false);
    router.push("/admin");
  };

  const currentRoleObj =
    AVAILABLE_ROLES.find((r) => r.code === activeStaffRole) || {
      code: activeStaffRole,
      label: activeStaffRole,
      dept: "Operations",
    };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E0B0F] flex flex-col lg:flex-row print:block print:bg-white font-sans">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-[#1A0609] text-white p-3.5 px-4 flex items-center justify-between shadow-md sticky top-0 z-40 print:hidden border-b border-brand-maroon/30">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? <X className="w-5 h-5 text-brand-amber" /> : <Menu className="w-5 h-5" />}
          </button>
          <BrandLogo light size="sm" />
        </div>

        <div className="flex items-center gap-2">
          {/* Quick role selector */}
          <select
            value={activeStaffRole}
            onChange={(e) => setActiveStaffRole(e.target.value)}
            className="text-[11px] bg-brand-maroon/60 border border-brand-amber/40 text-brand-amber font-bold rounded-lg px-2 py-1 focus:outline-none"
            aria-label="Select active role"
          >
            {AVAILABLE_ROLES.map((r) => (
              <option key={r.code} value={r.code} className="text-gray-900 bg-white">
                {r.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setAdminModalOpen(true)}
            className="p-1.5 rounded-lg bg-brand-amber text-brand-maroon hover:bg-brand-amber-light font-bold text-xs shadow-sm flex items-center gap-1"
            title="Admin Login & Credentials"
          >
            <KeyRound className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "w-72 bg-[#1A0609] text-white flex-shrink-0 flex flex-col justify-between fixed lg:sticky top-0 h-screen z-50 transition-transform duration-200 border-r border-brand-maroon/20 print:hidden",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Logo & Operational Badge */}
          <div className="space-y-3">
            <BrandLogo light size="sm" />
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-brand-amber/15 border border-brand-amber/30 text-brand-amber text-[10px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Staff Operations Portal</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-brand-amber text-brand-maroon text-[9px] font-extrabold tracking-tight">
                LIVE
              </span>
            </div>
          </div>

          {/* Interactive Role Switcher in Sidebar */}
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Active Staff Role
              </label>
              <span className="text-[9px] font-mono text-brand-amber font-semibold">
                {currentRoleObj.dept}
              </span>
            </div>
            <div className="relative">
              <select
                value={activeStaffRole}
                onChange={(e) => setActiveStaffRole(e.target.value)}
                className="w-full text-xs bg-brand-maroon/60 border border-brand-amber/40 text-brand-amber font-bold rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-brand-amber appearance-none cursor-pointer"
              >
                {AVAILABLE_ROLES.map((r) => (
                  <option key={r.code} value={r.code} className="text-gray-900 bg-white">
                    {r.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-brand-amber absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1" aria-label="Staff Navigation">
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">
                Workstation Menu
              </span>
              <span className="text-[9px] text-brand-amber/80 font-mono">
                {activeStaffRole}
              </span>
            </div>

            {STAFF_NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              const isRelevant =
                item.roles.includes("ALL") ||
                item.roles.includes(activeStaffRole) ||
                activeStaffRole === "MANAGER" ||
                activeStaffRole === "ADMIN";

              const IconComp = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group",
                    active
                      ? "bg-brand-amber text-brand-maroon shadow-md font-extrabold"
                      : isRelevant
                      ? "text-white/90 hover:bg-white/10 hover:text-white"
                      : "text-white/40 hover:bg-white/5 hover:text-white/60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <IconComp
                      className={cn(
                        "w-4 h-4 transition-colors",
                        active
                          ? "text-brand-maroon"
                          : isRelevant
                          ? "text-brand-amber group-hover:scale-110"
                          : "text-gray-500"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isRelevant && !active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-amber/70" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card, Admin Quick Details & Exit Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 space-y-3">
          {/* Active staff user */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-amber text-brand-maroon font-black flex items-center justify-center text-xs shadow-md">
              {user ? user.name.charAt(0) : "S"}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {user ? user.name : "Staff Member"}
              </p>
              <p className="text-[10px] text-brand-amber font-mono truncate">
                {activeStaffRole} • {currentRoleObj.dept}
              </p>
            </div>
          </div>

          {/* Admin Credentials Helper Button */}
          <button
            type="button"
            onClick={() => setAdminModalOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-brand-amber/15 hover:bg-brand-amber/25 border border-brand-amber/30 text-brand-amber text-[11px] font-bold transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Admin Login Details</span>
            </span>
            <span className="text-[9px] bg-brand-amber text-brand-maroon px-1.5 py-0.5 rounded font-black">
              PASS
            </span>
          </button>

          {/* Quick links to Admin Console & Public Site */}
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-amber" />
              <span>Admin Desk</span>
            </Link>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-amber" />
              <span>Public</span>
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar for Desktop */}
        <header className="hidden lg:flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200/80 sticky top-0 z-30 shadow-sm print:hidden">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-sm font-black text-brand-maroon tracking-tight flex items-center gap-2">
                <span>Hotel Kalya Staff Portal</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-brand-maroon/10 text-brand-maroon font-bold">
                  {currentRoleObj.dept}
                </span>
              </h2>
              <p className="text-[11px] text-gray-500">
                Kapenguria, West Pokot • Role: <strong className="text-gray-900">{currentRoleObj.label}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Clock */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-xs font-mono font-semibold">
              <Clock className="w-3.5 h-3.5 text-brand-maroon" />
              <span>EAT: {timeStr || "12:00:00 PM"}</span>
            </div>

            {/* Quick Role Switcher Dropdown */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-cream border border-brand-maroon/15 text-xs">
              <span className="text-gray-500 font-bold text-[10px] uppercase">Shift Role:</span>
              <select
                value={activeStaffRole}
                onChange={(e) => setActiveStaffRole(e.target.value)}
                className="bg-transparent font-extrabold text-brand-maroon focus:outline-none cursor-pointer text-xs"
              >
                {AVAILABLE_ROLES.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Admin Login Details Trigger */}
            <button
              type="button"
              onClick={() => setAdminModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-colors shadow-sm"
            >
              <KeyRound className="w-3.5 h-3.5 text-brand-amber" />
              <span>Admin Details</span>
            </button>

            {/* Jump to Admin Console */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-amber text-brand-maroon font-extrabold text-xs hover:bg-brand-amber-light transition-colors shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Desk</span>
            </Link>
          </div>
        </header>

        {/* Staff Page Body */}
        <div className="p-4 sm:p-7 flex-1 print:p-0 print:m-0">
          {children}
        </div>
      </main>

      {/* Admin Login Details & Quick Elevation Modal */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl border border-gray-200 relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-maroon text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-brand-amber" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-maroon">
                    Admin Login Details &amp; Access
                  </h3>
                  <p className="text-xs text-gray-500">
                    Hotel Kalya Executive Management &amp; RBAC Control
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdminModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Credentials Card */}
            <div className="bg-brand-cream/60 rounded-2xl p-4 border border-brand-maroon/15 space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-maroon block">
                Primary Master Administrator Credentials
              </span>

              {/* Email */}
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-200">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block">ADMIN EMAIL</span>
                  <span className="text-xs font-mono font-bold text-gray-800">
                    admin@hotelkalya.com
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy("admin@hotelkalya.com", "email")}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-[11px] font-bold text-gray-700 flex items-center gap-1 transition-colors"
                >
                  {copiedField === "email" ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Copied
                    </span>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </button>
              </div>

              {/* Password */}
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-200">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block">ADMIN PASSWORD</span>
                  <span className="text-xs font-mono font-bold text-gray-800">kalya2026</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy("kalya2026", "pass")}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-[11px] font-bold text-gray-700 flex items-center gap-1 transition-colors"
                >
                  {copiedField === "pass" ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Copied
                    </span>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </button>
              </div>

              {/* Active Admin Details */}
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Executive: Sarah Rotich (General Manager)</span>
                </p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Full permissions: System Settings, Staff CRUD, Role Definition, Audit Logs &amp; Financial Reports.
                </p>
              </div>
            </div>

            {/* Quick 1-Click Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleElevateToAdmin}
                className="w-full py-3 px-4 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-brand-amber" />
                <span>One-Click Switch to Admin &amp; Open Admin Console</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/admin/roles"
                  onClick={() => setAdminModalOpen(false)}
                  className="py-2.5 px-3 rounded-xl bg-brand-cream border border-brand-maroon/20 hover:bg-brand-cream/80 text-brand-maroon font-bold text-xs text-center transition-colors"
                >
                  Manage Roles &amp; RBAC
                </Link>
                <Link
                  href="/admin/staff"
                  onClick={() => setAdminModalOpen(false)}
                  className="py-2.5 px-3 rounded-xl bg-brand-cream border border-brand-maroon/20 hover:bg-brand-cream/80 text-brand-maroon font-bold text-xs text-center transition-colors"
                >
                  Manage Staff Roster
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
