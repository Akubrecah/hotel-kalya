import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import { BRAND, IMAGES } from "@/lib/constants";
import { getStandardWhatsAppUrl } from "@/lib/whatsapp";

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
                href={getStandardWhatsAppUrl("Hello Hotel Kalya, I would like to inquire about booking.")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Direct WhatsApp booking inquiries"
                className="bg-white/10 hover:bg-white/20 border border-white/25 text-white px-6 py-3.5 rounded-full font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Enquiries</span>
              </a>

            </div>
          </div>

          {/* Hero Right: Circular Image Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-4 sm:pt-0">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
              {/* Main Circle — Hotel Exterior */}
              <div className="absolute inset-0 rounded-full border-4 border-brand-amber overflow-hidden shadow-2xl z-10">
                <Image
                  src={IMAGES.heroExterior}
                  alt="Hotel Kalya Kapenguria Exterior"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, 384px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark/80 via-transparent to-transparent flex items-end p-4 sm:p-6">
                  <span className="text-white font-serif font-bold text-xs sm:text-base drop-shadow">
                    Hotel Kalya Main Complex
                  </span>
                </div>
              </div>

              {/* Sub Circle 1: Conference */}
              <div className="absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-8 w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full border-3 sm:border-4 border-brand-amber bg-brand-maroon-dark overflow-hidden shadow-2xl z-20">
                <Image
                  src={IMAGES.conferenceRoom}
                  alt="Conference & Seminar Hall"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 112px, 176px"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="text-[9px] sm:text-xs font-bold text-white bg-brand-maroon/80 px-1.5 sm:px-2 py-0.5 rounded">
                    Conference
                  </span>
                </div>
              </div>

              {/* Sub Circle 2: Events */}
              <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-3 sm:border-4 border-brand-amber bg-brand-maroon-dark overflow-hidden shadow-2xl z-20">
                <Image
                  src={IMAGES.weddingSetup}
                  alt="Events and Dining Seating"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 96px, 160px"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="text-[9px] sm:text-xs font-bold text-white bg-brand-maroon/80 px-1.5 sm:px-2 py-0.5 rounded">
                    Events
                  </span>
                </div>
              </div>

              {/* Decorative accent */}
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-brand-sage flex items-center justify-center text-white shadow-md z-20">
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" />
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
