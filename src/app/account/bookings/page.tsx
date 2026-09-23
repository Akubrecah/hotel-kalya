"use client";

import React from "react";
import Link from "next/link";
import { MapPin, ArrowLeft, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DirectionsButton } from "@/components/maps/DirectionsButton";
import { BRAND } from "@/lib/constants";

export default function AccountBookingsPage() {
  const bookings = [
    {
      id: "BK-88421",
      service: "Executive Deluxe Suite",
      dates: "28 Sep 2026 – 30 Sep 2026",
      nights: "2 Nights",
      guests: "2 Adults",
      status: "Confirmed",
      amount: "KES 17,000",
      paymentStatus: "Paid / Guaranteed",
      specialRequests: "High floor facing Kapenguria hills, late check-in at 7:00 PM.",
    },
    {
      id: "BK-76192",
      service: "Main Conference Hall (Workshop)",
      dates: "14 Jul 2026 – 16 Jul 2026",
      nights: "3 Days Full-Day Package",
      guests: "45 Delegates",
      status: "Completed",
      amount: "KES 145,000",
      paymentStatus: "Settled via County Invoice",
      specialRequests: "PA system, dual projectors, 10:00 AM & 4:00 PM outside tea service.",
    },
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/account" },
          { label: "Room & Hall Bookings" },
        ]}
      />

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link
                href="/account"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-maroon hover:underline mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Account Overview</span>
              </Link>
              <h1 className="font-serif font-black text-2xl sm:text-3xl text-brand-maroon">
                Your Reservations &amp; Bookings
              </h1>
            </div>

            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-colors shadow self-start sm:self-center"
            >
              <span>+ Make New Booking</span>
            </Link>
          </div>

          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-brand-maroon/10 shadow-md p-6 sm:p-7 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-cream pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-brand-maroon bg-brand-cream/60 px-2 py-0.5 rounded">
                      Reference: #{b.id}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-brand-maroon mt-1">
                      {b.service}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold self-start sm:self-center ${
                      b.status === "Confirmed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    ● {b.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-brand-cream/30 p-4 rounded-xl">
                  <div>
                    <span className="text-brand-dark/60 block">Dates &amp; Duration:</span>
                    <strong className="text-brand-dark">{b.dates}</strong>
                    <span className="text-[11px] text-brand-dark/60 block">{b.nights}</span>
                  </div>
                  <div>
                    <span className="text-brand-dark/60 block">Party Size:</span>
                    <strong className="text-brand-dark">{b.guests}</strong>
                    <span className="text-[11px] text-brand-dark/60 block">{b.paymentStatus}</span>
                  </div>
                  <div>
                    <span className="text-brand-dark/60 block">Total Rate:</span>
                    <strong className="font-serif font-black text-brand-maroon text-sm">
                      {b.amount}
                    </strong>
                  </div>
                </div>

                {b.specialRequests && (
                  <p className="text-xs text-brand-dark/75 italic">
                    <strong>Special Instructions:</strong> {b.specialRequests}
                  </p>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-brand-cream">
                  <div className="flex items-center gap-2 text-xs text-brand-dark/70">
                    <MapPin className="w-4 h-4 text-brand-amber-dark" />
                    <span>Kapenguria Highway Location • 24/7 Desk Reception</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DirectionsButton size="sm" variant="secondary" />
                    <a
                      href={`tel:${BRAND.phoneClean}`}
                      className="px-3 py-1.5 rounded-lg border border-brand-maroon/20 text-xs font-bold text-brand-maroon hover:bg-brand-cream transition-colors flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-brand-amber" />
                      <span>Call Desk</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
