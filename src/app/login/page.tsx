"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Calendar,
  Sparkles,
  UtensilsCrossed,
  ChefHat,
  Presentation,
  Truck,
  User,
  Copy,
  Check,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useAuth } from "@/context/AuthContext";
import { useMounted } from "@/lib/useMounted";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { BRAND } from "@/lib/constants";

const QUICK_STAFF_ACCOUNTS = [
  {
    key: "admin",
    name: "Sarah Rotich",
    roleLabel: "General Manager / Admin",
    email: "admin@hotelkalya.com",
    roleCode: "ADMIN",
    icon: ShieldCheck,
    badgeColor: "bg-red-100 text-red-800 border-red-200",
    dest: "/admin",
  },
  {
    key: "receptionist",
    name: "Dennis Kiplagat",
    roleLabel: "Front Desk & Arrivals",
    email: "reception@hotelkalya.com",
    roleCode: "RECEPTIONIST",
    icon: Calendar,
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    dest: "/staff/dashboard",
  },
  {
    key: "housekeeping",
    name: "Denis Limo",
    roleLabel: "Housekeeping Supervisor",
    email: "housekeeping@hotelkalya.com",
    roleCode: "HOUSEKEEPING",
    icon: Sparkles,
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    dest: "/staff/dashboard",
  },
  {
    key: "waiter",
    name: "Faith Jepchirchir",
    roleLabel: "Waitstaff / Service",
    email: "waiter@hotelkalya.com",
    roleCode: "WAITER",
    icon: UtensilsCrossed,
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    dest: "/staff/dashboard",
  },
  {
    key: "chef",
    name: "Patrick Mwangi",
    roleLabel: "Head Chef / KDS Line",
    email: "kitchen@hotelkalya.com",
    roleCode: "CHEF",
    icon: ChefHat,
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dest: "/staff/dashboard",
  },
  {
    key: "event_coordinator",
    name: "Kevin Lokor",
    roleLabel: "Conferences & Events",
    email: "events@hotelkalya.com",
    roleCode: "EVENT_COORDINATOR",
    icon: Presentation,
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    dest: "/staff/dashboard",
  },
  {
    key: "catering",
    name: "Grace Chepkorir",
    roleLabel: "Outside Catering Team",
    email: "catering@hotelkalya.com",
    roleCode: "CATERING_STAFF",
    icon: Truck,
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
    dest: "/staff/dashboard",
  },
  {
    key: "guest",
    name: "James Chemosit",
    roleLabel: "Verified Hotel Guest",
    email: "guest@hotelkalya.com",
    roleCode: "GUEST",
    icon: User,
    badgeColor: "bg-gray-100 text-gray-800 border-gray-200",
    dest: "/account",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, switchAccount, setActiveStaffRole, user, isLoaded } = useAuth();
  const mounted = useMounted();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // If already logged in, show quick portal entry only after hydration is fully complete
  if (mounted && isLoaded && user) {
    return (
      <div className="bg-white min-h-[75vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4 bg-brand-cream/40 p-8 rounded-3xl border border-brand-maroon/10 shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <UserCheck className="w-7 h-7" />
          </div>
          <h2 className="font-serif font-bold text-xl text-brand-maroon">
            Signed In as {user.name}
          </h2>
          <p className="text-xs text-brand-dark/70 font-mono">
            {user.email} • Role: <strong>{user.staffRole || user.role}</strong>
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            {user.role === "admin" || user.staffRole ? (
              <>
                <Link
                  href="/staff/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-colors shadow"
                >
                  <span>Staff Workstation</span>
                  <ArrowRight className="w-4 h-4 text-brand-amber" />
                </Link>
                <Link
                  href="/admin"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-amber text-brand-maroon font-bold text-xs uppercase tracking-wider hover:bg-brand-amber-light transition-colors shadow"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Console</span>
                </Link>
              </>
            ) : (
              <Link
                href="/account"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-colors shadow"
              >
                <span>Guest Account</span>
                <ArrowRight className="w-4 h-4 text-brand-amber" />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      if (email.toLowerCase().includes("admin")) {
        router.push("/admin");
      } else if (email.toLowerCase().includes("staff") || email.toLowerCase().includes("reception") || email.toLowerCase().includes("housekeeping") || email.toLowerCase().includes("waiter") || email.toLowerCase().includes("kitchen") || email.toLowerCase().includes("events") || email.toLowerCase().includes("catering")) {
        router.push("/staff/dashboard");
      } else {
        router.push("/account");
      }
    } else {
      setError(result.error || "Invalid email or password.");
    }
  };

  const handleInstantQuickLogin = (accountKey: string, dest: string, roleCode?: string) => {
    switchAccount(accountKey);
    if (roleCode && roleCode !== "GUEST") {
      setActiveStaffRole(roleCode);
    }
    router.push(dest);
  };

  const handleCopyCredentials = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account & Staff Portal Login" },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 pt-8 sm:pt-12 space-y-10">
        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="flex justify-center mb-3">
            <BrandLogo size="md" iconOnly />
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-brand-maroon">
            Sign In to {BRAND.name}
          </h1>
          <p className="text-xs text-brand-dark/70">
            Access your customer reservations, dining folios, or log in to the staff operations management workstations.
          </p>
        </div>

        {/* Master Two-Column Grid: Left is One-Click Roles, Right is Standard Sign-In */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Quick Staff & Admin Access Station (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-brand-maroon/10 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-maroon text-white flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4 text-brand-amber" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-base text-brand-maroon">
                    One-Click Staff &amp; Admin Workstations
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    All accounts use password: <strong className="font-mono text-gray-800">kalya2026</strong>
                  </p>
                </div>
              </div>

              {/* Copy Master Password */}
              <button
                type="button"
                onClick={() => handleCopyCredentials("kalya2026", "master-pass")}
                className="px-2.5 py-1 rounded-lg bg-brand-cream border border-brand-maroon/15 text-[11px] font-bold text-brand-maroon hover:bg-brand-cream/80 flex items-center gap-1 transition-colors"
              >
                {copiedKey === "master-pass" ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Copied
                  </span>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Pass: kalya2026
                  </>
                )}
              </button>
            </div>

            {/* Quick Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUICK_STAFF_ACCOUNTS.map((acc) => {
                const IconComp = acc.icon;
                const isMasterAdmin = acc.key === "admin";
                return (
                  <div
                    key={acc.key}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2.5 ${
                      isMasterAdmin
                        ? "bg-amber-50/70 border-brand-amber hover:border-brand-maroon shadow-xs"
                        : "bg-gray-50/70 border-gray-200 hover:bg-white hover:border-brand-maroon/40 hover:shadow-xs"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                          <IconComp className={`w-3.5 h-3.5 ${isMasterAdmin ? "text-brand-maroon" : "text-brand-amber-dark"}`} />
                          <span>{acc.name}</span>
                        </span>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${acc.badgeColor}`}
                        >
                          {acc.roleCode}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-medium">
                        {acc.roleLabel}
                      </p>
                      <p className="text-[10px] font-mono text-gray-600 truncate">
                        {acc.email}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleInstantQuickLogin(acc.key, acc.dest, acc.roleCode)}
                      className={`w-full py-1.5 px-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                        isMasterAdmin
                          ? "bg-brand-maroon hover:bg-brand-maroon-dark text-white font-extrabold"
                          : "bg-white hover:bg-brand-cream border border-gray-200 text-brand-maroon"
                      }`}
                    >
                      <span>1-Click Launch</span>
                      <ArrowRight className="w-3 h-3 text-brand-amber" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Admin Credentials Callout */}
            <div className="p-3.5 rounded-2xl bg-brand-cream/80 border border-brand-maroon/15 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-brand-maroon flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-maroon" />
                  <span>Master Administrator Credentials</span>
                </span>
                <span className="font-mono text-[10px] text-gray-500">Full System Access</span>
              </div>
              <p className="text-[11px] text-gray-700">
                Email: <strong className="font-mono text-brand-maroon">admin@hotelkalya.com</strong> • Password: <strong className="font-mono text-brand-maroon">kalya2026</strong>
              </p>
            </div>
          </div>

          {/* RIGHT: Standard Email/Password Sign-In Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl shadow-lg border border-brand-maroon/10 p-6 sm:p-7 space-y-5">
            <div>
              <h2 className="font-serif font-bold text-lg text-brand-maroon">
                Custom Account Login
              </h2>
              <p className="text-xs text-gray-500">
                Enter your registered personal credentials to sign in
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="e.g. your.email@hotelkalya.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-brand-maroon/20 focus:outline-none focus:ring-2 focus:ring-brand-amber bg-brand-cream/30 text-brand-dark"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-brand-maroon">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-semibold text-brand-amber-dark hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-brand-maroon/20 focus:outline-none focus:ring-2 focus:ring-brand-amber bg-brand-cream/30 text-brand-dark"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <KeyRound className="w-3.5 h-3.5 text-brand-amber" />
                <span>{isLoading ? "Signing in..." : "Sign In to Account"}</span>
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-brand-dark/70 border-t border-gray-100">
              <span>Don&apos;t have an account yet? </span>
              <Link href="/signup" className="font-bold text-brand-maroon hover:underline">
                Create Guest Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
