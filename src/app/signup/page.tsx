"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useAuth } from "@/context/AuthContext";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { BRAND } from "@/lib/constants";

export default function SignupPage() {
  const router = useRouter();
  const { signup, user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (user) {
    return (
      <div className="bg-white min-h-[75vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4 bg-brand-cream/40 p-8 rounded-2xl border border-brand-maroon/10">
          <h2 className="font-serif font-bold text-xl text-brand-maroon">
            You are currently logged in as {user.name}
          </h2>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-colors shadow"
          >
            <span>Proceed to Account Dashboard</span>
            <ArrowRight className="w-4 h-4 text-brand-amber" />
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await signup(name, email, password, phone);
    setIsLoading(false);

    if (result.success) {
      router.push("/account");
    } else {
      setError(result.error || "Unable to register. Please check your details.");
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Register New Account" },
        ]}
      />

      <div className="max-w-md mx-auto px-4 pt-10 sm:pt-16">
        <div className="bg-white rounded-2xl shadow-xl border border-brand-maroon/10 p-7 sm:p-9 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <BrandLogo size="md" iconOnly />
            </div>
            <h1 className="font-serif font-black text-2xl text-brand-maroon">
              Create Guest Account
            </h1>
            <p className="text-xs text-brand-dark/70">
              Join {BRAND.name} guest services for expedited room bookings, order history, and exclusive hospitality perks.
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
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kiprono Chebet"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-brand-maroon/20 focus:outline-none focus:ring-2 focus:ring-brand-amber bg-brand-cream/30 text-brand-dark"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-maroon mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kiprono@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-brand-maroon/20 focus:outline-none focus:ring-2 focus:ring-brand-amber bg-brand-cream/30 text-brand-dark"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-maroon mb-1">
                Phone Number (M-Pesa enabled)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0712 345 678"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-brand-maroon/20 focus:outline-none focus:ring-2 focus:ring-brand-amber bg-brand-cream/30 text-brand-dark"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-maroon mb-1">
                Password (min. 6 characters) *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-brand-maroon/20 focus:outline-none focus:ring-2 focus:ring-brand-amber bg-brand-cream/30 text-brand-dark"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{isLoading ? "Creating Account..." : "Create Guest Account"}</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-amber" />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2 p-3 bg-brand-cream/60 rounded-xl text-[11px] text-brand-dark/70">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Your information is protected in accordance with Kenya Data Protection regulations.</span>
          </div>

          <div className="text-center text-xs text-brand-dark/70">
            <span>Already have an account? </span>
            <Link href="/login" className="font-bold text-brand-maroon hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
