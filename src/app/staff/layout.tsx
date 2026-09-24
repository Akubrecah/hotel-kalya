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
  Lock,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useMounted } from "@/lib/useMounted";

const STAFF_NAV_ITEMS = [
  { label: "My Role Dashboard", href: "/staff/dashboard", icon: LayoutDashboard, roles: ["ALL"] },
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
  const { user, isLoaded, switchAccount, logout } = useAuth();
  const mounted = useMounted();
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
    const timer = setTimeout(updateTime, 0);
    const interval = setInterval(updateTime, 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleElevateToAdmin = () => {
    switchAccount("admin");
    setAdminModalOpen(false);
    router.push("/admin");
  };

  // Safe SSR & initial hydration gate: identical render output on server and first client frame
  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-maroon/20 border-t-brand-maroon rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-500 font-mono">
            Loading Hotel Kalya Staff Portal...
          </p>
        </div>
      </div>
    );
  }

  // Auth gate: If user is not authenticated or is a guest, do not render operational dashboard
  if (!user || user.role === "guest") {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-between font-sans">
        <div className="p-4 sm:px-8 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between">
          <BrandLogo size="sm" />
          <Link
            href="/"
            className="text-xs font-bold text-brand-maroon hover:underline flex items-center gap-1.5"
          >
            <span>Return to Public Hotel Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="max-w-xl mx-auto px-4 py-12 w-full">
          <div className="bg-white rounded-3xl p-7 sm:p-9 border border-gray-200 shadow-xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-maroon/10 text-brand-maroon flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8 text-brand-maroon" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-brand-maroon/10 text-brand-maroon text-[10px] font-extrabold uppercase tracking-wider">
                Staff Authentication Gate
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-brand-maroon">
                Staff Workstation Access
              </h1>
              <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
                The Hotel Kalya operational terminal is restricted to authorized personnel. Each staff member must sign in with their assigned role credentials to access their operational workstation.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-maroon text-white font-extrabold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-all shadow-md"
              >
                <KeyRound className="w-4 h-4 text-brand-amber" />
                <span>Go to Staff Sign In</span>
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-colors"
              >
                <span>Back to Home</span>
              </Link>
            </div>

            {/* Quick Demo Staff Launchers */}
            <div className="border-t border-gray-100 pt-5 space-y-3 text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block text-center">
                Launch with demo staff role:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    switchAccount("receptionist");
                    router.push("/staff/dashboard");
                  }}
                  className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left transition-colors"
                >
                  <span className="text-xs font-bold text-blue-900 block truncate">Dennis Kiplagat</span>
                  <span className="text-[10px] text-blue-700 font-mono font-semibold">Front Desk</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchAccount("chef");
                    router.push("/staff/dashboard");
                  }}
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition-colors"
                >
                  <span className="text-xs font-bold text-emerald-900 block truncate">Patrick Mwangi</span>
                  <span className="text-[10px] text-emerald-700 font-mono font-semibold">Chef / KDS</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchAccount("housekeeping");
                    router.push("/staff/dashboard");
                  }}
                  className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-colors"
                >
                  <span className="text-xs font-bold text-amber-900 block truncate">Denis Limo</span>
                  <span className="text-[10px] text-amber-700 font-mono font-semibold">Housekeeping</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchAccount("waiter");
                    router.push("/staff/dashboard");
                  }}
                  className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition-colors"
                >
                  <span className="text-xs font-bold text-purple-900 block truncate">Faith Jepchirchir</span>
                  <span className="text-[10px] text-purple-700 font-mono font-semibold">Waitstaff</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchAccount("event_coordinator");
                    router.push("/staff/dashboard");
                  }}
                  className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-left transition-colors"
                >
                  <span className="text-xs font-bold text-indigo-900 block truncate">Kevin Lokor</span>
                  <span className="text-[10px] text-indigo-700 font-mono font-semibold">Conferences</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchAccount("admin");
                    router.push("/staff/dashboard");
                  }}
                  className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-left transition-colors"
                >
                  <span className="text-xs font-bold text-red-900 block truncate">Sarah Rotich</span>
                  <span className="text-[10px] text-red-700 font-mono font-semibold">Executive Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 text-center text-xs text-gray-400">
          Hotel Kalya Operations Platform • Kapenguria, West Pokot County
        </div>
      </div>
    );
  }

  // Active role is strictly derived from the authenticated staff member - no on-dashboard switching
  const effectiveRole = user.staffRole || (user.role === "admin" ? "ADMIN" : "RECEPTIONIST");
  const currentRoleObj =
    AVAILABLE_ROLES.find((r) => r.code === effectiveRole) || {
      code: effectiveRole,
      label: effectiveRole,
      dept: user.department || "Operations",
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
          {/* Active Logged-in Staff Role Display (No dropdown switching) */}
          <span className="text-[11px] bg-brand-maroon/80 border border-brand-amber/40 text-brand-amber font-bold rounded-lg px-2.5 py-1">
            {currentRoleObj.label}
          </span>

          <button
            type="button"
            onClick={() => logout()}
            className="p-1.5 rounded-lg bg-white/10 text-white/80 hover:text-red-400 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
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
                ACTIVE
              </span>
            </div>
          </div>

          {/* Locked Assigned Workstation Info (Replaces interactive select dropdown) */}
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Assigned Duty Role
              </span>
              <span className="text-[9px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ON SHIFT
              </span>
            </div>
            <p className="text-xs font-black text-brand-amber truncate">
              {currentRoleObj.label}
            </p>
            <p className="text-[10px] text-gray-400 font-mono truncate">
              Department: {currentRoleObj.dept}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1" aria-label="Staff Navigation">
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">
                Workstation Menu
              </span>
              <span className="text-[9px] text-brand-amber/80 font-mono">
                {effectiveRole}
              </span>
            </div>

            {STAFF_NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              const isRelevant =
                item.roles.includes("ALL") ||
                item.roles.includes(effectiveRole) ||
                effectiveRole === "MANAGER" ||
                effectiveRole === "ADMIN";

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
          {/* Active staff user identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-amber text-brand-maroon font-black flex items-center justify-center text-xs shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-brand-amber font-mono truncate">
                {effectiveRole} • {currentRoleObj.dept}
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
            {(user.role === "admin" || effectiveRole === "ADMIN" || effectiveRole === "MANAGER") && (
              <Link
                href="/admin"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-brand-amber" />
                <span>Admin Desk</span>
              </Link>
            )}
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
            {/* Live Clock with suppressHydrationWarning */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-xs font-mono font-semibold">
              <Clock className="w-3.5 h-3.5 text-brand-maroon" />
              <span suppressHydrationWarning>EAT: {timeStr || "12:00:00 PM"}</span>
            </div>

            {/* Static Duty Station Badge (No dropdown switcher) */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-cream border border-brand-maroon/15 text-xs">
              <span className="text-gray-500 font-bold text-[10px] uppercase">Duty Station:</span>
              <span className="font-extrabold text-brand-maroon">{currentRoleObj.label}</span>
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

            {/* Jump to Admin Console if Manager or Admin */}
            {(user.role === "admin" || effectiveRole === "ADMIN" || effectiveRole === "MANAGER") && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-amber text-brand-maroon font-extrabold text-xs hover:bg-brand-amber-light transition-colors shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Desk</span>
              </Link>
            )}

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={() => logout()}
              className="p-2 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
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
