import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import { BRAND, IMAGES } from "@/lib/constants";

const SERVICE_BADGES = [
  { label: "Accommodation", href: "/services/accommodation" },
  { label: "Food Service", href: "/services/food-service" },
  { label: "Conference", href: "/services/conferences" },
  { label: "Outside Catering", href: "/services/outside-catering" },
  { label: "AirBnB", href: "/services/airbnb" },
  { label: "Kalya Gardens", href: "/services/garden-experience" },
];

export function HeroSection() {
  return (
    <section className="relative bg-brand-maroon-dark text-white overflow-hidden">
      {/* Subtle geometric pattern matching flyer chevron */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-[140%] h-[500px] -rotate-6 -translate-y-24 bg-gradient-to-r from-brand-amber via-brand-sage to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-16 lg:pb-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-amber/20 border border-brand-amber/40 text-brand-amber text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Kapenguria&apos;s Signature Hospitality Destination
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
              Stay. Dine. Meet. Celebrate.{" "}
              <br className="hidden sm:inline" />
              <span className="text-brand-amber">Experience Kalya.</span>
            </h1>

            <p className="text-white/85 text-base sm:text-lg max-w-xl font-light leading-relaxed">
              Welcome to Hotel Kalya, where Western Kenya hospitality is
              redefined. From executive accommodation and authentic
              farm-to-table dining to state-of-the-art conference facilities
              and picturesque garden retreats.
            </p>

            {/* Service Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {SERVICE_BADGES.map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="text-xs bg-brand-maroon border border-brand-amber/50 hover:border-brand-amber px-3 py-1 rounded-md text-brand-amber-light hover:text-white font-medium transition-colors"
                >
                  {tag.label}
                </Link>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                href="/book"
                className="bg-brand-amber hover:bg-brand-amber-dark text-brand-maroon-dark px-7 py-3.5 rounded-full font-bold text-sm tracking-wider uppercase shadow-lg transition-transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>Book Your Stay</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${BRAND.phoneClean}?text=Hello%20Hotel%20Kalya,%20I%20would%20like%20to%20inquire%20about%20booking.`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 border border-white/25 text-white px-6 py-3.5 rounded-full font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Enquiries</span>
              </a>
            </div>
          </div>

          {/* Hero Right: Circular Image Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              {/* Main Circle — Hotel Exterior */}
              <div className="absolute inset-0 rounded-full border-4 border-brand-amber overflow-hidden shadow-2xl z-10">
                <Image
                  src={IMAGES.heroExterior}
                  alt="Hotel Kalya Kapenguria Exterior"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width: 640px) 288px, 384px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark/80 via-transparent to-transparent flex items-end p-6">
                  <span className="text-white font-serif font-bold text-base drop-shadow">
                    Hotel Kalya Main Complex
                  </span>
                </div>
              </div>

              {/* Sub Circle 1: Conference */}
              <div className="absolute -bottom-6 -left-6 sm:-left-10 w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-brand-amber bg-brand-maroon-dark overflow-hidden shadow-2xl z-20">
                <Image
                  src={IMAGES.conferenceRoom}
                  alt="Conference & Seminar Hall"
                  fill
                  className="object-cover"
                  sizes="176px"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs font-bold text-white bg-brand-maroon/80 px-2 py-0.5 rounded">
                    Conference
                  </span>
                </div>
              </div>

              {/* Sub Circle 2: Events */}
              <div className="absolute -bottom-4 -right-4 sm:-right-8 w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-brand-amber bg-brand-maroon-dark overflow-hidden shadow-2xl z-20">
                <Image
                  src={IMAGES.weddingSetup}
                  alt="Events and Dining Seating"
                  fill
                  className="object-cover"
                  sizes="160px"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs font-bold text-white bg-brand-maroon/80 px-2 py-0.5 rounded">
                    Events
                  </span>
                </div>
              </div>

              {/* Decorative accent */}
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-brand-sage flex items-center justify-center text-white shadow-md z-20">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accent strips */}
      <div className="w-full h-4 bg-brand-sage" />
      <div className="w-full h-3 bg-brand-amber" />
    </section>
  );
}
