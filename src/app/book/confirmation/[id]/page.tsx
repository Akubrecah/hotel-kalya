"use client";

import React, { use } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Printer,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Bed,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DirectionsButton } from "@/components/maps/DirectionsButton";
import { GoogleMap } from "@/components/maps/GoogleMap";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { BRAND } from "@/lib/constants";

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export default function BookingConfirmationPage({ params }: ConfirmationPageProps) {
  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="print:hidden">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Book a Reservation", href: "/book" },
            { label: `Voucher #${bookingId}` },
          ]}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Printable Voucher Card */}
        <div className="bg-white rounded-3xl border border-brand-maroon/15 shadow-xl overflow-hidden print:border-none print:shadow-none">
          {/* Header Banner */}
          <div className="bg-brand-maroon text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-amber text-brand-maroon flex items-center justify-center flex-shrink-0 shadow">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-amber text-brand-maroon text-[10px] font-black uppercase tracking-wider inline-block mb-1">
                  Reservation Confirmed
                </span>
                <h1 className="font-serif font-black text-2xl sm:text-3xl text-white">
                  Booking Voucher
                </h1>
                <p className="text-xs text-white/80 mt-0.5">
                  Hotel Kalya Kapenguria • Official Guest Confirmation
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right bg-white/10 sm:bg-transparent p-4 sm:p-0 rounded-2xl">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-amber block">
                Booking Reference
              </span>
              <span className="font-mono text-2xl font-black text-white tracking-wider">
                #{bookingId}
              </span>
              <p className="text-[11px] text-white/70 mt-0.5">Keep this ID for check-in</p>
            </div>
          </div>

          {/* Voucher Details */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Top Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-brand-maroon/10">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-maroon">
                  Reservation Information
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5 text-brand-dark/80">
                    <Bed className="w-4 h-4 text-brand-amber flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-brand-maroon block">Executive Deluxe Suite / Cottage</span>
                      <span className="text-brand-dark/60">Includes Complimentary Full Breakfast &amp; Wi-Fi</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-brand-dark/80">
                    <Calendar className="w-4 h-4 text-brand-amber flex-shrink-0" />
                    <span>Check-in: <strong>From 12:00 PM</strong> | Check-out: <strong>By 10:00 AM</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-brand-dark/80">
                    <Clock className="w-4 h-4 text-brand-amber flex-shrink-0" />
                    <span>24/7 Reception &amp; Front-Desk Concierge Available</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-maroon">
                  Property Location &amp; Contact
                </h3>
                <div className="space-y-2.5 text-xs text-brand-dark/80">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-brand-amber flex-shrink-0 mt-0.5" />
                    <span>{BRAND.location} (Along Main Tarmac Route / A1 Highway)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-brand-amber flex-shrink-0" />
                    <span>Front Desk: <strong>{BRAND.phone}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-brand-amber flex-shrink-0" />
                    <span>Reservations: <strong>{BRAND.email}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Check-In Instructions */}
            <div className="bg-brand-cream/60 rounded-2xl p-5 border border-brand-maroon/10 space-y-2">
              <h4 className="font-bold text-xs text-brand-maroon uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-amber" />
                <span>Guest Check-In Instructions</span>
              </h4>
              <p className="text-xs text-brand-dark/80 leading-relaxed">
                Please present this voucher or your Booking ID <strong>#{bookingId}</strong> alongside a valid National ID or Passport at the front desk upon arrival. If arriving after 8:00 PM, kindly call our 24/7 reception desk at <strong>{BRAND.phone}</strong> to confirm your estimated arrival time.
              </p>
            </div>

            {/* Mini Map Experience */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-maroon">
                  Property Map &amp; Driving Coordinates
                </h4>
                <DirectionsButton className="py-1 px-3 text-xs" />
              </div>
              <div className="rounded-2xl overflow-hidden border border-brand-maroon/15 shadow-sm">
                <GoogleMap height="240px" zoom={14} />
              </div>
            </div>

            {/* Action Buttons (Hidden on Print) */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 print:hidden border-t border-brand-cream">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-brand-maroon/20 text-brand-maroon text-xs font-bold hover:bg-brand-cream transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4 text-brand-amber" />
                  <span>Print Voucher / Save PDF</span>
                </button>
                <Link
                  href="/account/bookings"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-cream text-brand-maroon text-xs font-bold hover:bg-brand-cream/80 transition-colors"
                >
                  <span>View in My Account</span>
                </Link>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-maroon text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-maroon-dark transition-colors shadow"
              >
                <span>Return to Homepage</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-amber" />
              </Link>
            </div>
          </div>

          {/* Voucher Footer */}
          <div className="bg-brand-cream/80 border-t border-brand-maroon/10 p-4 px-6 flex items-center justify-between text-[11px] text-brand-dark/60">
            <BrandLogo size="sm" />
            <span>Hospitality Redefined • Kapenguria, West Pokot County</span>
          </div>
        </div>
      </div>
    </div>
  );
}
