"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  KeyRound,
  Trees,
  Building2,
  ChefHat,
  Gift,
  ImageIcon,
  Megaphone,
  Star,
  Hotel,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { useAuth } from "@/context/AuthContext";
import { useMounted } from "@/lib/useMounted";
import { cn } from "@/lib/utils";

interface NavGroup {
  sectionTitle: string;
  items: {
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    sectionTitle: "Executive & Operations",
    items: [
      { label: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
      { label: "Reservations Desk", href: "/admin/reservations", icon: Calendar },
      { label: "Housekeeping Status", href: "/admin/housekeeping", icon: Sparkles },
      { label: "Kitchen Display (KDS)", href: "/admin/orders", icon: UtensilsCrossed },
      { label: "Guest Inquiries", href: "/admin/inquiries", icon: ClipboardList },
      { label: "Operational Audit Trail", href: "/admin/audit-log", icon: History },
      { label: "Analytics & Reports", href: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    sectionTitle: "Dynamic Hospitality CMS",
    items: [
      { label: "Rooms & Accommodation", href: "/admin/rooms", icon: Bed, badge: "Live" },
      { label: "Restaurant Food Menu", href: "/admin/menu", icon: UtensilsCrossed, badge: "Live" },
      { label: "Gardens & Lawns", href: "/admin/gardens", icon: Trees, badge: "Live" },
      { label: "Conference Halls", href: "/admin/conferences", icon: Building2, badge: "Live" },
      { label: "Event & Function Spaces", href: "/admin/events", icon: PartyPopper, badge: "Live" },
      { label: "Outside Catering", href: "/admin/catering", icon: ChefHat, badge: "Live" },
      { label: "Airbnb / Apartments", href: "/admin/airbnb", icon: Hotel, badge: "Live" },
      { label: "Packages & Offers", href: "/admin/offers", icon: Gift, badge: "Live" },
      { label: "Gallery & Media Library", href: "/admin/gallery", icon: ImageIcon, badge: "Live" },
      { label: "Announcements & Banners", href: "/admin/announcements", icon: Megaphone, badge: "Live" },
      { label: "Guest Reviews", href: "/admin/reviews", icon: Star, badge: "Live" },
    ],
  },
  {
    sectionTitle: "Settings & Administration",
    items: [
      { label: "Staff & Human Resources", href: "/admin/staff", icon: Users },
      { label: "Roles & RBAC Permissions", href: "/admin/roles", icon: ShieldCheck },
      { label: "WhatsApp Service Config", href: "/admin/services", icon: PhoneCall },
      { label: "Brand, Maps & Settings", href: "/admin/settings", icon: Settings },
      { label: "Project Docs & PDF Exports", href: "/admin/documents", icon: FileText },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded, switchAccount, logout } = useAuth();
  const mounted = useMounted();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Lock body scroll when mobile nav drawer is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileNavOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  // Safe SSR & initial hydration gate: identical render output on server and first client frame
  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-maroon/20 border-t-brand-maroon rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-500 font-mono">
            Loading Hotel Kalya Administration Console...
          </p>
        </div>
      </div>
    );
  }

  // Admin access gate: Only administrators can view /admin/* routes
  if (!user || user.role !== "admin") {
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

        <div className="max-w-md mx-auto px-4 py-12 w-full">
          <div className="bg-white rounded-3xl p-7 sm:p-9 border border-gray-200 shadow-xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-maroon text-brand-amber flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-extrabold uppercase tracking-wider">
                Restricted Executive Access
              </span>
              <h1 className="font-serif text-2xl font-black text-brand-maroon">
                Administrator Sign In Required
              </h1>
              <p className="text-xs text-gray-600 leading-relaxed">
                The Hotel Kalya Management Console is reserved for general managers and executive staff. Please sign in with administrator credentials.
              </p>
            </div>

            <div className="p-3 bg-brand-cream/60 rounded-2xl border border-brand-maroon/15 text-left space-y-1">
              <span className="text-[10px] uppercase font-bold text-brand-maroon block">
                Executive Admin Account:
              </span>
              <p className="text-xs font-mono font-bold text-gray-800">admin@hotelkalya.com</p>
              <p className="text-[11px] text-gray-500 font-mono">Password: kalya2026</p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  switchAccount("admin");
                  router.push("/admin");
                }}
                className="w-full py-3 px-4 rounded-xl bg-brand-maroon text-white font-extrabold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-all shadow-md flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-brand-amber" />
                <span>One-Click Launch as Admin</span>
              </button>

              <Link
                href="/login"
                className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs text-center transition-colors"
              >
                Go to Standard Sign In
              </Link>
            </div>
          </div>
        </div>

        <div className="p-4 text-center text-xs text-gray-400">
          Hotel Kalya Operations Platform • Kapenguria, West Pokot County
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E0B0F] flex flex-col lg:flex-row print:block print:bg-white font-sans">
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

      {/* Mobile Drawer Backdrop */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

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
            <div className="flex items-center justify-between">
              <BrandLogo light size="sm" />
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="lg:hidden p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-amber/15 border border-brand-amber/30 text-brand-amber text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Operations Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-5 pt-2" aria-label="Admin Navigation">
            {ADMIN_NAV_GROUPS.map((group) => (
              <div key={group.sectionTitle} className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-amber/70 px-3 py-1 block">
                  {group.sectionTitle}
                </span>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const active = pathname === item.href;
                    const IconComp = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileNavOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all",
                          active
                            ? "bg-brand-amber text-brand-maroon shadow-md"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <IconComp className={cn("w-4 h-4 shrink-0", active ? "text-brand-maroon" : "text-brand-amber")} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={cn(
                            "text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase",
                            active ? "bg-brand-maroon text-brand-amber" : "bg-white/15 text-brand-amber"
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User Card & Exit Footer */}
        <div className="p-5 border-t border-white/10 bg-black/20 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-amber text-brand-maroon font-black flex items-center justify-center text-sm shadow">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-brand-amber-light/80">Kapenguria Staff • Admin</p>
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
