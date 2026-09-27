"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BrandLogo } from "@/components/layout/BrandLogo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Sign In", href: "/login" },
          { label: "Password Recovery" },
        ]}
      />

      <div className="max-w-md mx-auto px-4 pt-10 sm:pt-16">
        <div className="bg-white rounded-2xl shadow-xl border border-brand-maroon/10 p-7 sm:p-9 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <BrandLogo size="md" iconOnly />
            </div>
            <h1 className="font-serif font-black text-2xl text-brand-maroon">
              Reset Your Password
            </h1>
            <p className="text-xs text-brand-dark/70">
              Enter your registered guest email address. We will send you instructions to securely reset your credentials.
            </p>
          </div>

          {submitted ? (
            <div className="bg-brand-cream/60 rounded-xl p-6 text-center space-y-3 border border-emerald-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-brand-maroon">
                Password Reset Email Dispatched
              </h3>
              <p className="text-xs text-brand-dark/75 leading-relaxed">
                If an account exists under <strong>{email}</strong>, a recovery link has been sent. Check your inbox or spam folder.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-maroon hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-maroon mb-1">
                  Registered Email Address *
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

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5 text-brand-amber" />
                <span>Send Password Reset Link</span>
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-dark/70 hover:text-brand-maroon"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
