"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Clock,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { AdminHeaderProfileMenu } from "@/components/admin/AdminHeaderProfileMenu";
import { useAuth } from "@/context/AuthContext";
import { useMounted } from "@/lib/useMounted";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  desc: string;
  badge?: {
    text: string;
    variant: "amber" | "emerald" | "blue" | "purple" | "neutral";
  };
}

interface NavGroup {
  id: string;
  sectionTitle: string;
  items: NavItem[];
}

const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    id: "operations",
    sectionTitle: "Operations & Front Desk",
    items: [
      {
        label: "Dashboard Overview",
        href: "/admin",
        icon: LayoutDashboard,
        desc: "Executive KPI summary & key alerts",
      },
      {
        label: "Reservations Desk",
        href: "/admin/reservations",
        icon: Calendar,
        desc: "Live check-ins, guest stays & room bookings",
        badge: { text: "Active", variant: "emerald" },
      },
      {
        label: "Housekeeping Status",
        href: "/admin/housekeeping",
        icon: Sparkles,
        desc: "Room turnover, sanitization & inspection",
      },
      {
        label: "Kitchen Display (KDS)",
        href: "/admin/orders",
        icon: UtensilsCrossed,
        desc: "Live restaurant orders & dining preparation",
        badge: { text: "KDS", variant: "amber" },
      },
      {
        label: "Guest Inquiries",
        href: "/admin/inquiries",
        icon: ClipboardList,
        desc: "Customer messages & custom quote requests",
        badge: { text: "Inbox", variant: "blue" },
      },
    ],
  },
  {
    id: "cms",
    sectionTitle: "Hospitality Content & CMS",
    items: [
      {
        label: "Rooms & Suites",
        href: "/admin/rooms",
        icon: Bed,
        desc: "Room inventory, rack rates & amenities",
      },
      {
        label: "Food & Dining Menu",
        href: "/admin/menu",
        icon: ChefHat,
        desc: "Dishes, pricing, categories & specials",
      },
      {
        label: "Conference Halls",
        href: "/admin/conferences",
        icon: Building2,
        desc: "Meeting spaces, DDR packages & equipment",
      },
      {
        label: "Outside Catering",
        href: "/admin/catering",
        icon: UtensilsCrossed,
        desc: "Mobile event catering & banquet packages",
      },
      {
        label: "Gardens & Lawns",
        href: "/admin/gardens",
        icon: Trees,
        desc: "Grounds hire, photoshoot setups & weddings",
      },
      {
        label: "Event Spaces",
        href: "/admin/events",
        icon: PartyPopper,
        desc: "Functions, private dinners & retreats",
      },
      {
        label: "Airbnb / Apartments",
        href: "/admin/airbnb",
        icon: Hotel,
        desc: "Furnished serviced cottages & long stays",
      },
      {
        label: "Special Offers",
        href: "/admin/offers",
        icon: Gift,
        desc: "Promotional packages & holiday discounts",
        badge: { text: "Promo", variant: "amber" },
      },
      {
        label: "Media Library",
        href: "/admin/gallery",
        icon: ImageIcon,
        desc: "Visual photo assets & property gallery",
      },
      {
        label: "Announcements",
        href: "/admin/announcements",
        icon: Megaphone,
        desc: "TopBar announcement banners & alerts",
      },
      {
        label: "Guest Reviews",
        href: "/admin/reviews",
        icon: Star,
        desc: "Verified ratings & testimonials",
      },
    ],
  },
  {
    id: "analytics",
    sectionTitle: "Analytics & Intelligence",
    items: [
      {
        label: "Executive Reports",
        href: "/admin/reports",
        icon: BarChart3,
        desc: "Revenue metrics, occupancy & growth trends",
      },
      {
        label: "Audit Trail & Logs",
        href: "/admin/audit-log",
        icon: History,
        desc: "System changes & employee activity records",
      },
    ],
  },
  {
    id: "system",
    sectionTitle: "System & Administration",
    items: [
      {
        label: "Staff Directory",
        href: "/admin/staff",
        icon: Users,
        desc: "Staff accounts & shift designations",
      },
      {
        label: "User Accounts",
        href: "/admin/users",
        icon: UserCheck,
        desc: "Registered guests & customer accounts",
      },
      {
        label: "Roles & Permissions",
        href: "/admin/roles",
        icon: KeyRound,
        desc: "RBAC security & granular access control",
        badge: { text: "RBAC", variant: "purple" },
      },
      {
        label: "WhatsApp Integrations",
        href: "/admin/services",
        icon: PhoneCall,
        desc: "Central phone routing & direct desk configs",
      },
      {
        label: "Settings & Brand",
        href: "/admin/settings",
        icon: Settings,
        desc: "Hotel profile, GPS coordinates & metadata",
      },
      {
        label: "Project Documentation",
        href: "/admin/documents",
        icon: FileText,
        desc: "Project documentation & printable PDF slips",
        badge: { text: "PDF", variant: "neutral" },
      },
    ],
  },
];

function getActiveAdminModule(pathname: string): { item: NavItem; group: NavGroup } | null {
  for (const group of ADMIN_NAV_GROUPS) {
    for (const item of group.items) {
      if (pathname === item.href) {
        return { item, group };
      }
    }
  }
  // Check prefix match
  for (const group of ADMIN_NAV_GROUPS) {
    for (const item of group.items) {
      if (item.href !== "/admin" && pathname.startsWith(item.href)) {
        return { item, group };
      }
    }
  }
  return null;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded, switchAccount, logout } = useAuth();
  const mounted = useMounted();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
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

  // Restore collapsed sidebar preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kalya_admin_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // Ignore localStorage failure in restricted browser context
    }
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("kalya_admin_sidebar_collapsed", String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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

  // Keyboard shortcut: Toggle sidebar with Alt/Option+B or Ctrl+B
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleCollapsed();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtered navigation items when search query is active
  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return ADMIN_NAV_GROUPS;

    return ADMIN_NAV_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.label.toLowerCase().includes(query) ||
          item.desc.toLowerCase().includes(query) ||
          group.sectionTitle.toLowerCase().includes(query)
      ),
    })).filter((group) => group.items.length > 0);
  }, [searchQuery]);

  // Find active module metadata for top header bar
  const activeModule = getActiveAdminModule(pathname);

  // Safe SSR & initial hydration gate
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
                onClick={async () => {
                  await switchAccount("admin");
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
    <div className="h-screen h-[100dvh] max-h-screen max-h-[100dvh] w-full overflow-hidden bg-[#F8F9FA] text-[#1E0B0F] flex flex-col lg:flex-row print:h-auto print:max-h-none print:overflow-visible font-sans antialiased">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-gradient-to-r from-[#1A070B] via-[#2A0B11] to-[#1A070B] text-white p-3 px-4 flex items-center justify-between shadow-lg flex-shrink-0 z-40 print:hidden border-b border-brand-maroon/40">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 transition-all flex items-center justify-center flex-shrink-0 text-brand-amber border border-white/10"
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-brand-amber" />}
          </button>
          <div className="min-w-0">
            <span className="font-serif font-bold text-sm tracking-wide block truncate text-white">
              {activeModule ? activeModule.item.label : "Hotel Kalya Admin"}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-amber shrink-0" />
              <span className="text-[10px] text-brand-amber-light font-medium truncate">
                Executive Management Console
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/staff/dashboard"
            className="px-2.5 py-1.5 rounded-xl bg-brand-amber/15 hover:bg-brand-amber/25 text-brand-amber text-xs font-bold transition-all border border-brand-amber/30 active:scale-95 flex items-center gap-1"
            title="Open Staff Operations"
          >
            <Users className="w-3 h-3 text-brand-amber" />
            <span>Staff</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors flex items-center justify-center border border-white/10"
            title="Open Live Public Site"
          >
            <ExternalLink className="w-4 h-4 text-brand-amber" />
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Desktop / Mobile Sidebar Navigation */}
      <aside
        className={cn(
          "bg-[#1A070B] text-white flex-shrink-0 flex flex-col h-full z-50 transition-all duration-300 ease-in-out border-r border-[#2C0D13] shadow-2xl print:hidden",
          isCollapsed ? "lg:w-20" : "lg:w-72",
          "fixed inset-y-0 left-0 w-80 max-w-[85vw] lg:static lg:h-full",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Top Header / Branding & Collapse Toggle */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-2 flex-shrink-0 bg-black/20">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 overflow-hidden min-w-0">
              <Link href="/admin" className="focus:outline-none focus:ring-1 focus:ring-brand-amber rounded-lg">
                <BrandLogo light size="sm" />
              </Link>
            </div>
          ) : (
            <div className="mx-auto">
              <Link
                href="/admin"
                className="w-10 h-10 rounded-xl bg-brand-amber text-brand-maroon flex items-center justify-center font-serif font-black text-sm shadow hover:scale-105 transition-transform"
                title="Hotel Kalya Admin Dashboard"
              >
                HK
              </Link>
            </div>
          )}

          {/* Collapse/Expand Toggle on Desktop */}
          <button
            type="button"
            onClick={toggleCollapsed}
            className="hidden lg:flex p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-brand-amber hover:text-white transition-colors"
            title={isCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="lg:hidden p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search / Filter Box (Visible in Expanded Mode) */}
        {!isCollapsed && (
          <div className="px-4 pt-3 pb-1 flex-shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter modules... (e.g. rooms, kds)"
                className="w-full bg-white/5 border border-white/10 focus:border-brand-amber focus:bg-white/10 rounded-xl py-1.5 pl-8 pr-7 text-xs text-white placeholder-white/40 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-0.5"
                  title="Clear filter"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="flex items-center justify-between text-[10px] text-brand-amber pt-1.5 px-1">
                <span>Filtered Results</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="underline hover:text-white"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        )}

        {/* Scrollable Navigation List */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 py-3 space-y-4 overscroll-contain scrollbar-thin scrollbar-thumb-white/20">
          {filteredGroups.length === 0 ? (
            <div className="py-8 px-4 text-center space-y-2">
              <Search className="w-8 h-8 text-white/20 mx-auto" />
              <p className="text-xs text-white/60">No modules matching &quot;{searchQuery}&quot;</p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold text-brand-amber hover:underline"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            filteredGroups.map((group) => {
              const isSectionCollapsed = !searchQuery && collapsedSections[group.id];

              return (
                <div key={group.id} className="space-y-1">
                  {/* Section Title Header */}
                  {!isCollapsed ? (
                    <button
                      type="button"
                      onClick={() => toggleSection(group.id)}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-amber/80 hover:text-brand-amber transition-colors select-none text-left rounded-lg hover:bg-white/5"
                    >
                      <span className="truncate">{group.sectionTitle}</span>
                      <ChevronDown
                        className={cn(
                          "w-3 h-3 text-white/40 transition-transform duration-200",
                          isSectionCollapsed && "-rotate-90"
                        )}
                      />
                    </button>
                  ) : (
                    <div className="h-px bg-white/10 my-2" />
                  )}

                  {/* Section Items */}
                  {!isSectionCollapsed && (
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const active = pathname === item.href;
                        const IconComp = item.icon;

                        if (isCollapsed) {
                          // Collapsed Icon-Rail Item with Floating Tooltip
                          return (
                            <div key={item.href} className="relative group flex justify-center">
                              <Link
                                href={item.href}
                                onClick={() => setMobileNavOpen(false)}
                                className={cn(
                                  "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 relative",
                                  active
                                    ? "bg-brand-amber text-brand-maroon shadow-lg shadow-brand-amber/20 font-bold scale-105"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                                )}
                                aria-label={item.label}
                              >
                                <IconComp className="w-5 h-5 shrink-0" />
                                {item.badge && (
                                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-amber" />
                                )}
                              </Link>

                              {/* Floating Hover Tooltip on Desktop */}
                              <div className="hidden lg:block absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                                <div className="bg-[#120407] text-white border border-brand-maroon/30 shadow-2xl rounded-xl py-1.5 px-3 min-w-[160px] whitespace-nowrap">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-bold text-white">{item.label}</span>
                                    {item.badge && (
                                      <span
                                        className={cn(
                                          "text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded",
                                          item.badge.variant === "emerald" && "bg-emerald-900/60 text-emerald-300",
                                          item.badge.variant === "amber" && "bg-amber-900/60 text-amber-300",
                                          item.badge.variant === "blue" && "bg-blue-900/60 text-blue-300",
                                          item.badge.variant === "purple" && "bg-purple-900/60 text-purple-300",
                                          item.badge.variant === "neutral" && "bg-white/20 text-white"
                                        )}
                                      >
                                        {item.badge.text}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-white/50 mt-0.5">{item.desc}</p>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Expanded Full Item
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileNavOpen(false)}
                            className={cn(
                              "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group",
                              active
                                ? "bg-brand-amber text-brand-maroon font-bold shadow-md shadow-brand-amber/10"
                                : "text-white/80 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={cn(
                                  "p-1.5 rounded-lg transition-colors flex-shrink-0",
                                  active
                                    ? "bg-brand-maroon text-brand-amber"
                                    : "bg-white/5 text-brand-amber group-hover:bg-white/10"
                                )}
                              >
                                <IconComp className="w-4 h-4" />
                              </div>
                              <div className="truncate">
                                <span className="block truncate leading-tight">{item.label}</span>
                                <span
                                  className={cn(
                                    "text-[10px] block truncate leading-tight mt-0.5",
                                    active ? "text-brand-maroon/80" : "text-white/40"
                                  )}
                                >
                                  {item.desc}
                                </span>
                              </div>
                            </div>

                            {item.badge && (
                              <span
                                className={cn(
                                  "text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase shrink-0 ml-1.5",
                                  active
                                    ? "bg-brand-maroon text-brand-amber"
                                    : item.badge.variant === "emerald"
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : item.badge.variant === "amber"
                                    ? "bg-brand-amber/20 text-brand-amber border border-brand-amber/30"
                                    : item.badge.variant === "blue"
                                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                    : item.badge.variant === "purple"
                                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                    : "bg-white/15 text-white/90"
                                )}
                              >
                                {item.badge.text}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* User Card & Actions Footer */}
        <div className="p-3 border-t border-white/10 bg-black/30 flex-shrink-0">
          {!isCollapsed ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-brand-amber text-brand-maroon font-serif font-black flex items-center justify-center text-sm shadow shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden min-w-0">
                    <p className="text-xs font-bold text-white truncate leading-tight">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-[10px] text-brand-amber-light/80 uppercase font-semibold">
                        Administrator
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => logout()}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-300 transition-colors shrink-0"
                  title="Sign Out of Admin Console"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <Link
                  href="/"
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-brand-amber" />
                  <span>Public Site</span>
                </Link>
                <Link
                  href="/staff/dashboard"
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-brand-amber/20 hover:bg-brand-amber/30 text-brand-amber text-[11px] font-bold transition-colors border border-brand-amber/30"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Staff Portal</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <div
                className="w-9 h-9 rounded-xl bg-brand-amber text-brand-maroon font-serif font-black flex items-center justify-center text-sm shadow cursor-pointer"
                title={`${user.name} (Administrator)`}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button
                type="button"
                onClick={() => logout()}
                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-300 transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Pane — Full height, independent scroll area */}
      <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
        {/* Dynamic Top Header Bar for Desktop — Fixed at top of workspace */}
        <header className="hidden lg:flex items-center justify-between h-20 px-8 bg-white border-b border-gray-200/80 flex-shrink-0 shadow-xs z-30 print:hidden">
          <div className="flex items-center gap-3 min-w-0">
            {activeModule && (
              <div className="p-2.5 rounded-xl bg-brand-maroon/5 text-brand-maroon border border-brand-maroon/10 shrink-0">
                <activeModule.item.icon className="w-5 h-5 text-brand-maroon" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-maroon/60">
                  {activeModule ? activeModule.group.sectionTitle : "Management Console"}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-[11px] font-semibold text-gray-500">Hotel Kalya Operations</span>
              </div>
              <h1 className="text-lg font-extrabold text-brand-maroon truncate">
                {activeModule ? activeModule.item.label : "Dashboard Overview"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live East Africa Time (EAT) Clock */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200/80 text-stone-700 text-xs font-mono shadow-xs">
              <Clock className="w-3.5 h-3.5 text-brand-amber-dark" />
              <span className="font-semibold text-stone-800" suppressHydrationWarning>
                {timeStr || "00:00:00"}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-stone-600 font-sans font-bold">EAT</span>
            </div>

            {/* Live Operational Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Operations Live</span>
            </div>

            {/* Notification Bell */}
            <Link
              href="/admin/inquiries"
              className="p-2.5 rounded-xl text-gray-500 hover:text-brand-maroon hover:bg-stone-100 transition-colors relative"
              title="Guest Inquiries & Messages"
              aria-label="Guest Inquiries and Messages"
            >
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 rounded-full bg-brand-amber absolute top-2 right-2 ring-2 ring-white" />
            </Link>

            {/* Quick Link to Guest Public Website */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-brand-maroon text-xs font-bold hover:bg-stone-100 transition-colors shadow-xs"
              title="Open public website in new tab"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-brand-amber-dark" />
            </Link>

            {/* Executive Profile & Control Menu */}
            <AdminHeaderProfileMenu />
          </div>
        </header>

        {/* Nested Page Body — Independently scrollable viewport with overscroll containment */}
        <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-8 print:p-0 print:overflow-visible">
          {children}
        </main>
      </div>
    </div>
  );
}
