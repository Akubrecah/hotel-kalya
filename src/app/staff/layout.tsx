"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Bed,
  Sparkles,
  UtensilsCrossed,
  ChefHat,
  Building2,
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
  Layers,
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  Users,
  History,
  Trees,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useMounted } from "@/lib/useMounted";
import { DepartmentAccessGuard } from "@/components/staff/DepartmentAccessGuard";
import { StaffHeaderProfileMenu } from "@/components/staff/StaffHeaderProfileMenu";
import { canAccessRoute, hasPermission, hasDepartmentAccess } from "@/lib/rbac";
import { UserProfile } from "@/types";

interface StaffNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  desc: string;
  badge?: {
    text: string;
    variant: "amber" | "emerald" | "blue" | "purple" | "neutral";
  };
  /** Explicit roles authorized, or empty for automatic RBAC evaluation */
  allowedRoles?: string[];
  requiredPermission?: string;
}

interface StaffNavGroup {
  id: string;
  sectionTitle: string;
  items: StaffNavItem[];
}

const STAFF_NAV_GROUPS: StaffNavGroup[] = [
  {
    id: "operations",
    sectionTitle: "Operations & Front Desk",
    items: [
      {
        label: "My Role Dashboard",
        href: "/staff/dashboard",
        icon: LayoutDashboard,
        desc: "Personal shift overview & quick metrics",
        allowedRoles: ["ALL"],
      },
      {
        label: "Reservations Desk",
        href: "/staff/reservations",
        icon: Calendar,
        desc: "Live check-ins, guest stays & room folios",
        badge: { text: "Active", variant: "emerald" },
        allowedRoles: ["RECEPTIONIST", "MANAGER", "ADMIN"],
        requiredPermission: "reservations:read",
      },
      {
        label: "Housekeeping Board",
        href: "/staff/housekeeping",
        icon: Sparkles,
        desc: "Room turnover, sanitization & inspection",
        badge: { text: "Board", variant: "amber" },
        allowedRoles: ["HOUSEKEEPING", "MANAGER", "ADMIN"],
        requiredPermission: "housekeeping:read",
      },
      {
        label: "Kitchen Display (KDS)",
        href: "/staff/orders",
        icon: ChefHat,
        desc: "Live kitchen tickets & food progression",
        badge: { text: "KDS", variant: "amber" },
        allowedRoles: ["CHEF", "RESTAURANT_MANAGER", "MANAGER", "ADMIN"],
        requiredPermission: "kitchen:kds",
      },
      {
        label: "Waitstaff / Dining",
        href: "/staff/restaurant",
        icon: UtensilsCrossed,
        desc: "Restaurant tables, dining orders & bills",
        badge: { text: "F&B", variant: "purple" },
        allowedRoles: ["WAITER", "WAITRESS", "CHEF", "RESTAURANT_MANAGER", "MANAGER", "ADMIN"],
        requiredPermission: "restaurant:orders",
      },
      {
        label: "Guest Messages",
        href: "/staff/messages",
        icon: MessageSquare,
        desc: "Customer inquiries & front desk messages",
        badge: { text: "Inbox", variant: "blue" },
        allowedRoles: ["ALL"],
      },
    ],
  },
  {
    id: "venues",
    sectionTitle: "Hospitality Venues & Logistics",
    items: [
      {
        label: "Room Inventory & Status",
        href: "/staff/rooms",
        icon: Bed,
        desc: "Room rack rates, key cards & occupancy",
        allowedRoles: ["RECEPTIONIST", "HOUSEKEEPING", "MAINTENANCE", "MANAGER", "ADMIN"],
        requiredPermission: "rooms:read",
      },
      {
        label: "Conference & Meeting Halls",
        href: "/staff/conference",
        icon: Building2,
        desc: "Mount Elgon & Cherang'any plenary halls",
        allowedRoles: ["EVENT_COORDINATOR", "MANAGER", "ADMIN"],
        requiredPermission: "conference:manage",
      },
      {
        label: "Outside Catering Logistics",
        href: "/staff/catering",
        icon: Truck,
        desc: "County summit banquets & dispatch logs",
        allowedRoles: ["CATERING_STAFF", "CHEF", "MANAGER", "ADMIN"],
        requiredPermission: "catering:manage",
      },
      {
        label: "Garden Experiences & Events",
        href: "/staff/events",
        icon: Trees,
        desc: "Botanical grounds hire & wedding setups",
        allowedRoles: ["EVENT_COORDINATOR", "MANAGER", "ADMIN"],
        requiredPermission: "events:manage",
      },
    ],
  },
  {
    id: "executive",
    sectionTitle: "Executive Management",
    items: [
      {
        label: "Executive Admin Console",
        href: "/admin",
        icon: ShieldCheck,
        desc: "Central administration & full platform control",
        badge: { text: "Executive", variant: "purple" },
        allowedRoles: ["ADMIN", "MANAGER"],
      },
      {
        label: "Financial & ADR Reports",
        href: "/admin/reports",
        icon: BarChart3,
        desc: "Revenue metrics, occupancy & growth trends",
        allowedRoles: ["ADMIN", "MANAGER", "ACCOUNTANT"],
        requiredPermission: "reports:view",
      },
      {
        label: "Staff Directory",
        href: "/admin/staff",
        icon: Users,
        desc: "Employee accounts & shift designations",
        allowedRoles: ["ADMIN", "MANAGER"],
        requiredPermission: "staff:manage",
      },
      {
        label: "Roles & Permissions (RBAC)",
        href: "/admin/roles",
        icon: KeyRound,
        desc: "RBAC security & granular access policies",
        badge: { text: "RBAC", variant: "purple" },
        allowedRoles: ["ADMIN"],
        requiredPermission: "roles:manage",
      },
      {
        label: "System Audit Trail",
        href: "/admin/audit-log",
        icon: History,
        desc: "System changes & employee activity records",
        allowedRoles: ["ADMIN", "MANAGER", "ACCOUNTANT"],
        requiredPermission: "audit:view",
      },
    ],
  },
  {
    id: "account",
    sectionTitle: "Shift & Workstation Tools",
    items: [
      {
        label: "My Shift Profile",
        href: "/staff/profile",
        icon: User,
        desc: "Assigned duties, shift hours & PIN credentials",
        allowedRoles: ["ALL"],
      },
    ],
  },
];

const AVAILABLE_ROLES = [
  { code: "RECEPTIONIST", label: "Receptionist / Front Desk", dept: "Front Office", name: "Dennis Kiplagat" },
  { code: "HOUSEKEEPING", label: "Housekeeping Attendant", dept: "Housekeeping & Laundry", name: "Denis Limo" },
  { code: "WAITER", label: "Waitstaff / Service", dept: "Food & Beverage", name: "Faith Jepchirchir" },
  { code: "CHEF", label: "Head Chef / Kitchen", dept: "Kitchen Operations", name: "Chef Patrick Mwangi" },
  { code: "EVENT_COORDINATOR", label: "Conference & Events", dept: "Conferences & Grounds", name: "Kevin Lokor" },
  { code: "CATERING_STAFF", label: "Outside Catering", dept: "Outside Banqueting", name: "Catering Logistics" },
  { code: "MAINTENANCE", label: "Maintenance & Repairs", dept: "Engineering & Facilities", name: "Facilities Engineer" },
  { code: "ACCOUNTANT", label: "Financial Controller", dept: "Finance & Accounts", name: "Accounts Auditor" },
  { code: "MANAGER", label: "Operations Duty Manager", dept: "Operations Management", name: "Operations Supervisor" },
  { code: "ADMIN", label: "Executive General Manager", dept: "Executive Management", name: "Sarah Rotich" },
];

/**
 * Checks whether an authenticated staff member is permitted to see/access a specific nav item.
 */
function isItemAuthorizedForStaff(user: UserProfile | null, item: StaffNavItem): boolean {
  if (!user) return false;

  // Super admin has unrestricted access to all links
  if (user.role === "admin" || user.staffRole === "ADMIN") {
    return true;
  }

  const userRole = (user.staffRole || "STAFF").toUpperCase();

  // If item is marked for "ALL" staff roles
  if (item.allowedRoles && item.allowedRoles.includes("ALL")) {
    return true;
  }

  // If explicit roles listed, check user's role
  if (item.allowedRoles && item.allowedRoles.includes(userRole)) {
    return true;
  }

  // If specific granular permission required
  if (item.requiredPermission) {
    if (hasPermission(user, item.requiredPermission)) {
      return true;
    }
  }

  // Fallback to route permission checker
  const routeCheck = canAccessRoute(user, item.href);
  if (routeCheck.allowed) {
    return true;
  }

  return false;
}

function getActiveStaffModule(pathname: string): { item: StaffNavItem; group: StaffNavGroup } | null {
  for (const group of STAFF_NAV_GROUPS) {
    for (const item of group.items) {
      if (pathname === item.href) {
        return { item, group };
      }
    }
  }
  // Prefix match
  for (const group of STAFF_NAV_GROUPS) {
    for (const item of group.items) {
      if (item.href !== "/staff" && item.href !== "/staff/dashboard" && pathname.startsWith(item.href)) {
        return { item, group };
      }
    }
  }
  return null;
}

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded, switchAccount, switchWorkspaceDepartment, logout } = useAuth();
  const mounted = useMounted();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [timeStr, setTimeStr] = useState<string>("");

  // Restore collapsed sidebar preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kalya_staff_sidebar_collapsed");
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
        localStorage.setItem("kalya_staff_sidebar_collapsed", String(next));
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

  // Close mobile nav on route transition
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

  // Filter navigation items strictly by role permissions and active search query
  const filteredGroups = useMemo(() => {
    if (!user) return [];
    const query = searchQuery.trim().toLowerCase();

    return STAFF_NAV_GROUPS.map((group) => {
      // 1. Filter items authorized for this specific staff role
      const authorizedItems = group.items.filter((item) =>
        isItemAuthorizedForStaff(user, item)
      );

      // 2. Filter by search query if present
      const searchedItems = query
        ? authorizedItems.filter(
            (item) =>
              item.label.toLowerCase().includes(query) ||
              item.desc.toLowerCase().includes(query) ||
              group.sectionTitle.toLowerCase().includes(query)
          )
        : authorizedItems;

      return {
        ...group,
        items: searchedItems,
      };
    }).filter((group) => group.items.length > 0);
  }, [user, searchQuery]);

  // Total authorized modules count for this role
  const totalAuthorizedCount = useMemo(() => {
    if (!user) return 0;
    return STAFF_NAV_GROUPS.reduce((acc, g) => {
      return acc + g.items.filter((item) => isItemAuthorizedForStaff(user, item)).length;
    }, 0);
  }, [user]);

  // Find active module metadata for top header bar
  const activeModule = getActiveStaffModule(pathname);

  // Safe SSR & initial hydration gate
  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-maroon/20 border-t-brand-maroon rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-500 font-mono">
            Loading Hotel Kalya Staff Operations Portal...
          </p>
        </div>
      </div>
    );
  }

  // Auth gate: If user is not authenticated or is a guest, prompt to sign in
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
                  <span className="text-xs font-bold text-emerald-900 block truncate">Chef Patrick Mwangi</span>
                  <span className="text-[10px] text-emerald-700 font-mono font-semibold">Head Chef / KDS</span>
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

  // Active role is strictly derived from the authenticated staff member
  const effectiveRole = (user.staffRole || (user.role === "admin" ? "ADMIN" : "RECEPTIONIST")).toUpperCase();
  const currentRoleObj =
    AVAILABLE_ROLES.find((r) => r.code === effectiveRole) || {
      code: effectiveRole,
      label: effectiveRole,
      dept: user.department || "Operations",
      name: user.name,
    };

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
              {activeModule ? activeModule.item.label : "Staff Operations"}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-[10px] text-brand-amber font-medium truncate">
                {currentRoleObj.label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setRoleSwitcherOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-brand-amber/15 hover:bg-brand-amber/25 text-brand-amber text-xs font-bold transition-all border border-brand-amber/30 active:scale-95 flex items-center gap-1"
            title="Switch Demo Role"
          >
            <Sparkles className="w-3 h-3 text-brand-amber" />
            <span>Role</span>
          </button>
          <button
            type="button"
            onClick={() => logout()}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-red-300 transition-colors flex items-center justify-center border border-white/10"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
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

      {/* Desktop / Mobile Sidebar Navigation — Matches Admin Luxury Design */}
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
              <Link href="/staff/dashboard" className="focus:outline-none focus:ring-1 focus:ring-brand-amber rounded-lg">
                <BrandLogo light size="sm" />
              </Link>
            </div>
          ) : (
            <div className="mx-auto">
              <Link
                href="/staff/dashboard"
                className="w-10 h-10 rounded-xl bg-brand-amber text-brand-maroon flex items-center justify-center font-serif font-black text-sm shadow hover:scale-105 transition-transform"
                title="Hotel Kalya Staff Portal"
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

        {/* Assigned Duty Role Banner (Visible in Expanded Mode) */}
        {!isCollapsed && (
          <div className="px-4 pt-3 pb-1 flex-shrink-0">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Duty Station
                </span>
                <span className="text-[9px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ON SHIFT
                </span>
              </div>
              <p className="text-xs font-black text-brand-amber truncate">
                {currentRoleObj.label}
              </p>
              <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                <span className="truncate">{currentRoleObj.dept}</span>
                <span className="text-brand-amber-light/80 font-bold shrink-0">
                  {totalAuthorizedCount} modules
                </span>
              </div>
            </div>

            {/* Cross-Department Workspace Switcher (if multi-assigned) */}
            {user.additionalDepartments && user.additionalDepartments.length > 0 && (
              <div className="mt-2 p-2.5 bg-amber-950/40 rounded-xl border border-brand-amber/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-brand-amber tracking-wider flex items-center gap-1">
                    <Layers className="w-3 h-3 text-brand-amber" />
                    <span>Workspace Switcher</span>
                  </span>
                </div>
                <div className="space-y-1">
                  {[user.department || "Operations", ...user.additionalDepartments].map((dept) => {
                    const isCurrent = (user.activeWorkspaceDepartment || user.department) === dept;
                    return (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => switchWorkspaceDepartment(dept)}
                        className={cn(
                          "w-full text-left px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-between",
                          isCurrent
                            ? "bg-brand-amber text-brand-maroon font-black shadow-xs"
                            : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <span className="truncate">{dept}</span>
                        {isCurrent && <Check className="w-3 h-3 text-brand-maroon stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search / Filter Box (Visible in Expanded Mode) */}
        {!isCollapsed && (
          <div className="px-4 pt-2 pb-1 flex-shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter workstation menu..."
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
                <span>Authorized Results</span>
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

        {/* Scrollable Navigation List with Overscroll Containment */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 py-3 space-y-4 overscroll-contain scrollbar-thin scrollbar-thumb-white/20">
          {filteredGroups.length === 0 ? (
            <div className="py-8 px-4 text-center space-y-2">
              <Search className="w-8 h-8 text-white/20 mx-auto" />
              <p className="text-xs text-white/60">
                No authorized modules matching &quot;{searchQuery}&quot;
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold text-brand-amber hover:underline"
              >
                Clear filter
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

        {/* Pinned User Card & Quick Actions Footer */}
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
                      <span className="text-[10px] text-brand-amber font-mono uppercase font-semibold truncate">
                        {effectiveRole} • {currentRoleObj.dept}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => logout()}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-300 transition-colors shrink-0"
                  title="Sign Out of Staff Portal"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Quick links to Admin Console & Public Site */}
              <div className="flex items-center gap-2 pt-0.5">
                {(user.role === "admin" || effectiveRole === "ADMIN" || effectiveRole === "MANAGER") && (
                  <Link
                    href="/admin"
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-brand-amber/20 hover:bg-brand-amber/30 text-brand-amber text-[11px] font-bold transition-colors border border-brand-amber/30"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Desk</span>
                  </Link>
                )}
                <Link
                  href="/"
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-brand-amber" />
                  <span>Public Site</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <div
                className="w-9 h-9 rounded-xl bg-brand-amber text-brand-maroon font-serif font-black flex items-center justify-center text-sm shadow cursor-pointer"
                title={`${user.name} (${effectiveRole})`}
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

      {/* Main Content Workspace — Full height, independent scroll area */}
      <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
        {/* Dynamic Top Header Bar for Desktop — Fixed at top of workspace */}
        <header className="hidden lg:flex items-center justify-between h-20 px-8 bg-white border-b border-gray-200/80 flex-shrink-0 shadow-2xs z-30 print:hidden">
          <div className="flex items-center gap-3.5 min-w-0">
            {activeModule && (
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-maroon/10 to-brand-maroon/5 text-brand-maroon border border-brand-maroon/15 flex items-center justify-center shrink-0 shadow-2xs">
                <activeModule.item.icon className="w-5 h-5 text-brand-maroon" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-maroon/70">
                  {activeModule ? activeModule.group.sectionTitle : "Staff Operations"}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-[11px] font-semibold text-gray-500">Hotel Kalya Operations</span>
              </div>
              <h1 className="text-xl font-extrabold text-brand-maroon truncate tracking-tight font-serif">
                {activeModule ? activeModule.item.label : "Duty Dashboard"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live East Africa Time Clock */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50/80 border border-gray-200/80 text-gray-700 text-xs font-mono font-medium shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-brand-maroon/70" />
              <span suppressHydrationWarning>EAT: {timeStr || "12:00:00 PM"}</span>
            </div>

            {/* Shift Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate">Shift Active • {currentRoleObj.label}</span>
            </div>

            {/* Jump to Admin Console if Manager or Admin */}
            {(user.role === "admin" || effectiveRole === "ADMIN" || effectiveRole === "MANAGER") && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-all shadow-xs hover:shadow-sm"
                title="Open Executive Admin Console"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-brand-amber" />
                <span>Admin Desk</span>
              </Link>
            )}

            {/* Consolidated Staff Profile Menu */}
            <StaffHeaderProfileMenu
              currentRoleObj={currentRoleObj}
              onOpenRoleSwitcher={() => setRoleSwitcherOpen(true)}
              onOpenAdminDetails={() => setAdminModalOpen(true)}
            />
          </div>
        </header>

        {/* Nested Page Body — Independently scrollable viewport with overscroll containment */}
        <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-8 print:p-0 print:overflow-visible">
          <DepartmentAccessGuard>
            {children}
          </DepartmentAccessGuard>
        </main>
      </div>

      {/* Switch Demo Role Modal — Allows immediate testing of role limitations */}
      {roleSwitcherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl border border-gray-200 relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-maroon text-white flex items-center justify-center font-bold">
                  <Users className="w-5 h-5 text-brand-amber" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-maroon">
                    Simulate Staff Duty Roles
                  </h3>
                  <p className="text-xs text-gray-500">
                    Switch roles to observe how navigation links adapt dynamically based on RBAC permissions
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRoleSwitcherOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
                Select a Staff Persona to Test:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {AVAILABLE_ROLES.map((role) => {
                  const isCurrent = effectiveRole === role.code;
                  return (
                    <button
                      key={role.code}
                      type="button"
                      onClick={() => {
                        // Map role code to authContext switchAccount keys
                        const keyMap: Record<string, string> = {
                          ADMIN: "admin",
                          MANAGER: "manager",
                          RECEPTIONIST: "receptionist",
                          CHEF: "chef",
                          HOUSEKEEPING: "housekeeping",
                          WAITER: "waiter",
                          EVENT_COORDINATOR: "event_coordinator",
                          CATERING_STAFF: "catering",
                          MAINTENANCE: "maintenance",
                          ACCOUNTANT: "accountant",
                        };
                        const targetKey = keyMap[role.code] || "staff";
                        switchAccount(targetKey);
                        setRoleSwitcherOpen(false);
                      }}
                      className={cn(
                        "p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-1.5",
                        isCurrent
                          ? "bg-brand-maroon text-white border-brand-maroon shadow-md"
                          : "bg-gray-50/80 hover:bg-white border-gray-200 hover:border-brand-amber text-gray-800"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className={cn("text-xs font-black truncate", isCurrent ? "text-brand-amber" : "text-gray-900")}>
                          {role.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-amber text-brand-maroon font-extrabold uppercase">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className={cn("font-medium", isCurrent ? "text-white/80" : "text-gray-600")}>
                          {role.name}
                        </span>
                        <span className={cn("font-mono font-semibold", isCurrent ? "text-brand-amber-light" : "text-gray-400")}>
                          {role.dept}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setRoleSwitcherOpen(false)}
                className="py-2.5 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
              >
                Close Switcher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Login Details & Quick Elevation Modal */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl border border-gray-200 relative">
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
