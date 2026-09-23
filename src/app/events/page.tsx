import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PartyPopper, CheckCircle2 } from "lucide-react";
import { BRAND, IMAGES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Events & Functions — Weddings, Birthdays & Private Celebrations",
  description:
    "Host your wedding, birthday, graduation, family reunion, or corporate function at Hotel Kalya, Kapenguria. Full event planning and management.",
};

const EVENT_TYPES = [
  "Wedding Receptions & Ceremonies",
  "Birthday & Anniversary Celebrations",
  "Graduation Parties",
  "Family Reunions & Homecomings",
  "Corporate Dinners & Awards Nights",
  "Government & County Functions",
  "Church & Religious Conferences",
  "Baby Showers & Engagements",
];

const EVENT_INCLUDES = [
  "Dedicated Event Coordinator",
  "Themed Decorations & Table Settings",
  "Sound System & Microphones",
  "Photography-Ready Venues",
  "Full Buffet or Sit-Down Service",
  "Ample Secure Parking",
];

export default function EventsPage() {
  return (
    <>
      <section className="relative h-72 sm:h-96 bg-brand-maroon-dark">
        <Image src={IMAGES.weddingSetup} alt="Event Setup" fill className="object-cover opacity-50" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark via-brand-maroon-dark/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <span className="text-brand-amber text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <PartyPopper className="w-4 h-4" /> Memorable Gatherings
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">Events & Functions</h1>
          <p className="text-white/80 text-sm mt-2 max-w-xl">
            From intimate celebrations to grand receptions, our team ensures every moment is memorable.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-extrabold text-brand-maroon-dark">Events We Host</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EVENT_TYPES.map((evt) => (
                  <div key={evt} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-brand-amber flex-shrink-0" /> {evt}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-extrabold text-brand-maroon-dark">What We Provide</h2>
              <div className="space-y-3">
                {EVENT_INCLUDES.map((inc) => (
                  <div key={inc} className="flex items-center gap-3 bg-brand-cream p-3 rounded-xl border border-brand-amber-light">
                    <CheckCircle2 className="w-5 h-5 text-brand-maroon flex-shrink-0" />
                    <span className="text-sm text-gray-700 font-medium">{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-16 space-y-4">
            <h3 className="font-serif text-2xl font-bold text-brand-maroon-dark">
              Ready to plan your event?
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/book" className="bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow">
                Start Planning Your Event
              </Link>
              <a href={`https://wa.me/${BRAND.phoneClean}?text=Hello%20Hotel%20Kalya,%20I%20would%20like%20to%20discuss%20hosting%20an%20event.`} target="_blank" rel="noopener noreferrer" className="border border-brand-maroon text-brand-maroon px-6 py-3 rounded-full text-xs font-semibold hover:bg-brand-amber-light transition-colors">
                WhatsApp Events Manager
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
