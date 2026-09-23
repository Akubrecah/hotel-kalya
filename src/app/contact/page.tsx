import type { Metadata } from "next";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ShieldCheck,
  Car,
  Compass,
} from "lucide-react";
import { BRAND, IMAGES } from "@/lib/constants";
import { ContactForm } from "@/components/sections/ContactForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GoogleMap } from "@/components/maps/GoogleMap";
import { DirectionsButton } from "@/components/maps/DirectionsButton";

export const metadata: Metadata = {
  title: "Contact & Location — Directions & Inquiries",
  description:
    "Contact Hotel Kalya in Kapenguria, West Pokot County. Call +254 719 766649 or chat on WhatsApp. Get directions, maps, service hours, and direct booking inquiries.",
  openGraph: {
    title: "Contact Hotel Kalya | Kapenguria, West Pokot",
    description:
      "Get in touch with Hotel Kalya. Direct cell: +254 719 766649, email: hotelkalya@gmail.com. Located in Kapenguria, West Pokot County, Kenya.",
    images: [IMAGES.heroExterior],
  },
};

export default function ContactPage() {
  return (
    <>
      {/* LocalBusiness JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            name: BRAND.name,
            alternateName: "Hotel Kalya Kapenguria",
            description:
              "Premier hospitality destination in Kapenguria, West Pokot County offering executive rooms, dining, conferences, catering, and garden functions.",
            url: "https://hotelkalya.co.ke",
            telephone: BRAND.phone,
            email: BRAND.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: "Main Tarmac Route (A1 Highway)",
              addressLocality: "Kapenguria",
              addressRegion: "West Pokot County",
              addressCountry: "KE",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 1.2389,
              longitude: 35.1119,
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "00:00",
                closes: "23:59",
              },
            ],
            priceRange: "$$",
            amenityFeature: [
              { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi" },
              { "@type": "LocationFeatureSpecification", name: "Restaurant" },
              { "@type": "LocationFeatureSpecification", name: "Conference Rooms" },
              { "@type": "LocationFeatureSpecification", name: "Lush Gardens" },
              { "@type": "LocationFeatureSpecification", name: "Secure Parking" },
            ],
          }),
        }}
      />

      {/* Hero Banner */}
      <section className="relative h-72 sm:h-96 bg-brand-maroon-dark">
        <Image
          src={IMAGES.heroExterior}
          alt="Hotel Kalya Kapenguria"
          fill
          className="object-cover opacity-45"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark via-brand-maroon-dark/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <span className="text-brand-amber text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Kapenguria, West Pokot County
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Contact & Directions
          </h1>
          <p className="text-white/80 text-sm mt-2 max-w-xl">
            We are always happy to hear from you. Reach our front desk team 24/7
            for reservations, inquiries, or directions.
          </p>
        </div>
      </section>

      {/* Breadcrumbs Strip */}
      <section className="bg-brand-cream border-b border-brand-amber-light/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Contact & Location" }]} />
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 sm:py-20 bg-brand-cream/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12">
            {/* Left: Contact Info + Quick Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Primary Contact Card */}
              <div className="bg-brand-maroon-dark text-white rounded-3xl p-8 border-2 border-brand-amber shadow-xl">
                <span className="text-brand-amber text-xs font-bold uppercase tracking-widest block mb-2">
                  Get In Touch
                </span>
                <h2 className="font-serif text-2xl font-bold text-white mb-6">
                  Front Desk & Reservations
                </h2>

                <div className="space-y-5">
                  <a
                    href={`tel:${BRAND.phone}`}
                    className="flex items-start gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-amber text-brand-maroon-dark flex items-center justify-center flex-shrink-0 shadow">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-brand-amber-light font-semibold block">
                        Telephone / Mobile
                      </span>
                      <span className="font-bold text-base sm:text-lg">
                        {BRAND.phone}
                      </span>
                      <p className="text-[11px] text-white/60">
                        Available 24 hours for calls & inquiries
                      </p>
                    </div>
                  </a>

                  <a
                    href={`https://wa.me/${BRAND.phoneClean}?text=Hello%20Hotel%20Kalya%20Front%20Desk,%20I%20have%20an%20inquiry`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 hover:bg-emerald-950 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold block">
                        WhatsApp Chat
                      </span>
                      <span className="font-bold text-base sm:text-lg text-emerald-100">
                        Instant Messaging
                      </span>
                      <p className="text-[11px] text-emerald-300/80">
                        Quick rates, photos & booking confirmation
                      </p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${BRAND.email}`}
                    className="flex items-start gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-amber text-brand-maroon-dark flex items-center justify-center flex-shrink-0 shadow">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-brand-amber-light font-semibold block">
                        Official Email
                      </span>
                      <span className="font-bold text-sm sm:text-base break-all">
                        {BRAND.email}
                      </span>
                      <p className="text-[11px] text-white/60">
                        Corporate inquiries, RFPs & invoices
                      </p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-3 rounded-2xl bg-white/5">
                    <div className="w-10 h-10 rounded-xl bg-brand-amber text-brand-maroon-dark flex items-center justify-center flex-shrink-0 shadow">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-brand-amber-light font-semibold block">
                        Physical Address
                      </span>
                      <span className="font-medium text-sm text-white">
                        {BRAND.location}
                      </span>
                      <p className="text-[11px] text-white/60">
                        Main Tarmac Highway, Kapenguria Town
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 rounded-2xl bg-white/5">
                    <div className="w-10 h-10 rounded-xl bg-brand-amber text-brand-maroon-dark flex items-center justify-center flex-shrink-0 shadow">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-brand-amber-light font-semibold block">
                        Hours of Operation
                      </span>
                      <span className="font-medium text-sm text-white block">
                        Reception: <strong>{BRAND.operatingHours.reception}</strong>
                      </span>
                      <span className="font-medium text-sm text-white/90">
                        Restaurant: <strong>{BRAND.operatingHours.restaurant}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security & Amenity Guarantee */}
              <div className="bg-white rounded-3xl p-6 border border-brand-amber-light shadow-md flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-amber-light flex items-center justify-center text-brand-maroon-dark flex-shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-brand-maroon-dark">
                    Secure & Gated Compound
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    24/7 security guard personnel, CCTV monitoring, and ample enclosed parking for all guests.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Contact / Message Form (7 cols) */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map & Travel Directions Section */}
      <section className="py-16 bg-white border-t border-brand-amber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest flex items-center justify-center gap-2">
              <Compass className="w-4 h-4 text-brand-amber" /> Finding Us
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-brand-maroon-dark mt-1">
              Location & Directions
            </h2>
            <div className="w-16 h-1 bg-brand-amber mx-auto my-3 rounded-full" />
            <p className="text-sm text-gray-600">
              Conveniently situated in Kapenguria, West Pokot County, along the major highway corridor connecting North Rift to Turkana.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Interactive Map Visual */}
            <div className="lg:col-span-7 bg-brand-cream rounded-3xl p-4 sm:p-6 border-2 border-brand-amber-light shadow-lg flex flex-col justify-between space-y-4">
              <GoogleMap height="380px" zoom={14} showCard={false} />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-gray-700">
                  <span className="font-bold text-brand-maroon-dark">
                    GPS Coordinates:
                  </span>{" "}
                  1.2415° N, 35.1185° E (Kapenguria Highway)
                </div>
                <DirectionsButton size="sm" variant="primary" />
              </div>
            </div>

            {/* Travel Directions Cards */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              <div className="bg-brand-cream/80 p-6 rounded-2xl border border-brand-amber-light space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-maroon text-brand-amber flex items-center justify-center text-xs font-bold">
                    <Car className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-brand-maroon-dark">
                    From Kitale Town
                  </h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Take the A1 Highway north towards Kapenguria / Lodwar. It is an easy, scenic 38 km drive (approx. 40–50 minutes on smooth tarmac). Hotel Kalya is conveniently located as you approach Kapenguria.
                </p>
              </div>

              <div className="bg-brand-cream/80 p-6 rounded-2xl border border-brand-amber-light space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-maroon text-brand-amber flex items-center justify-center text-xs font-bold">
                    <Car className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-brand-maroon-dark">
                    From Eldoret International Airport
                  </h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Drive from Eldoret via Kitale (approx. 110 km, ~2.5 hours total). Direct matatus, shuttles, and private car services frequently operate on this route.
                </p>
              </div>

              <div className="bg-brand-cream/80 p-6 rounded-2xl border border-brand-amber-light space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-maroon text-brand-amber flex items-center justify-center text-xs font-bold">
                    <Car className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-brand-maroon-dark">
                    From Lodwar / Turkana
                  </h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Heading south along the newly refurbished A1 tarmac corridor through Marich Pass. Hotel Kalya provides the ideal, secure resting stop as you arrive in Kapenguria.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
