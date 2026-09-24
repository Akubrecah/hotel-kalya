"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Home, Info, Sparkles, PhoneCall } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { BRAND } from "@/lib/constants";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Hotel Kalya App Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-brand-cream/60">
      <div className="max-w-xl w-full text-center space-y-8 bg-white p-8 sm:p-12 rounded-3xl border-2 border-brand-amber-light shadow-xl">
        <div className="flex justify-center">
          <BrandLogo />
        </div>

        <div className="space-y-3">
          <span className="inline-block bg-brand-amber-light text-brand-maroon-dark px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            Something Went Wrong
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-maroon-dark">
            An Unexpected Error Occurred
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
            We apologize for the inconvenience. The page you&apos;re looking for may have
            been relocated or is temporarily unavailable. Our team has been notified.
          </p>
        </div>

        {/* Quick Links */}
        <div className="pt-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">
            Popular Destinations
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { label: "Home", href: "/", icon: Home },
              { label: "About", href: "/about", icon: Info },
              { label: "Services", href: "/services", icon: Sparkles },
              { label: "Contact", href: "/contact", icon: PhoneCall },
            ].map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 p-3 rounded-xl bg-brand-cream hover:bg-brand-amber-light/70 border border-brand-amber-light/60 text-xs font-semibold text-brand-maroon-dark transition-all hover:scale-[1.02]"
                >
                  <Icon className="w-4 h-4 text-brand-amber flex-shrink-0" />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-brand-amber-light/60 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto bg-brand-maroon hover:bg-brand-maroon-dark text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow transition-all flex items-center justify-center gap-2"
          >
            <span>Return to Homepage</span>
          </Link>
          <a
            href={`tel:${BRAND.phone}`}
            className="w-full sm:w-auto border border-brand-maroon text-brand-maroon hover:bg-brand-amber-light/50 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <span>Call Desk ({BRAND.phone})</span>
          </a>
        </div>

        {/* Reset Button */}
        <button
          onClick={reset}
          className="mt-4 w-full sm:w-auto text-xs text-brand-maroon font-bold uppercase tracking-wider hover:text-brand-amber transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}