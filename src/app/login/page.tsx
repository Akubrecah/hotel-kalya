"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, UserCheck, AlertCircle, KeyRound } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useAuth } from "@/context/AuthContext";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { BRAND } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, show quick redirect
  if (user) {
    return (
      <div className="bg-white min-h-[75vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4 bg-brand-cream/40 p-8 rounded-2xl border border-brand-maroon/10">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <UserCheck className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-bold text-xl text-brand-maroon">
            You are logged in as {user.name}
          </h2>
          <p className="text-xs text-brand-dark/70">
            Access your reservations, food orders, and personal preferences in the customer portal.
          </p>
          <div className="pt-2">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-colors shadow"
            >
              <span>Go to My Account</span>
              <ArrowRight className="w-4 h-4 text-brand-amber" />
            </Link>
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
      if (email.toLowerCase().includes("admin") || email.toLowerCase().includes("staff")) {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    } else {
      setError(result.error || "Invalid email or password.");
    }
  };

  const handleFillDemo = () => {
    setEmail("guest@hotelkalya.com");
    setPassword("kalya2026");
  };

  const handleFillAdmin = () => {
    setEmail("admin@hotelkalya.com");
    setPassword("kalya2026");
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Sign In to Your Account" },
        ]}
      />

      <div className="max-w-md mx-auto px-4 pt-10 sm:pt-16">
        <div className="bg-white rounded-2xl shadow-xl border border-brand-maroon/10 p-7 sm:p-9 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <BrandLogo size="md" />
            </div>
            <h1 className="font-serif font-black text-2xl text-brand-maroon">
              Welcome Back
            </h1>
            <p className="text-xs text-brand-dark/70">
              Sign in to manage your bookings, food orders, and preferences at {BRAND.name}.
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
                  placeholder="your.email@example.com"
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

          {/* Demo account quick login */}
          <div className="pt-2 border-t border-brand-cream/80 space-y-1.5 text-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/40 block">
              Quick Test Credentials
            </span>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full sm:w-auto px-3 py-1.5 rounded-lg border border-brand-maroon/20 bg-brand-cream/50 text-[11px] font-bold text-brand-maroon hover:bg-brand-cream transition-colors"
              >
                👤 Guest (James)
              </button>
              <button
                type="button"
                onClick={handleFillAdmin}
                className="w-full sm:w-auto px-3 py-1.5 rounded-lg border border-brand-amber bg-brand-amber/15 text-[11px] font-bold text-brand-maroon hover:bg-brand-amber/25 transition-colors"
              >
                🛡️ Staff Manager (Sarah)
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-brand-dark/70">
            <span>Don&apos;t have an account yet? </span>
            <Link href="/signup" className="font-bold text-brand-maroon hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
