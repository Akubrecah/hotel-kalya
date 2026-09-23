import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Phone,
  Wifi,
  Tv,
  Coffee,
  ShieldCheck,
  Bed,
  ChevronRight,
  Clock,
} from "lucide-react";
import { BRAND, IMAGES, ACCOMMODATION_ROOMS } from "@/lib/constants";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Accommodation — Executive Suites, Rooms & Cottages in Kapenguria",
  description:
    "Comfortable, secure executive rooms, suites, and cottages at Hotel Kalya, Kapenguria, West Pokot County. High-speed Wi-Fi, satellite TV, complimentary breakfast, and 24/7 security.",
  openGraph: {
    title: "Accommodation & Rooms | Hotel Kalya Kapenguria",
    description:
      "Executive suites, standard rooms, and family cottages designed for restful comfort in Kapenguria, West Pokot County.",
    images: [IMAGES.deluxeSuite],
  },
};

const HIGHLIGHTS = [
  { icon: Wifi, label: "Free High-Speed Wi-Fi" },
  { icon: Tv, label: "Flat-screen TV (Satellite)" },
  { icon: Coffee, label: "Complimentary Breakfast" },
  { icon: ShieldCheck, label: "24/7 Security & CCTV" },
];

const POLICIES = [
  { title: "Check-In Time", detail: "From 12:00 PM (Early check-in subject to room availability)" },
  { title: "Check-Out Time", detail: "Until 10:30 AM" },
  { title: "Breakfast Hours", detail: "6:30 AM – 10:00 AM daily in main restaurant" },
  { title: "Room Service", detail: "Available 24 hours upon request" },
];

export default function AccommodationServicePage() {
  return (
    <>
      {/* LodgingBusiness JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            name: "Hotel Kalya Accommodation",
            description:
              "Executive suites, standard rooms, and serviced AirBnB short-stay apartments in Kapenguria, West Pokot County.",
            url: "https://hotelkalya.co.ke/services/accommodation",
            telephone: BRAND.phone,
            priceRange: "$$",
            amenityFeature: [
              { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi" },
              { "@type": "LocationFeatureSpecification", name: "Complimentary Breakfast" },
              { "@type": "LocationFeatureSpecification", name: "Flat-screen Satellite TV" },
              { "@type": "LocationFeatureSpecification", name: "24/7 Security & CCTV" },
              { "@type": "LocationFeatureSpecification", name: "En-suite Bathrooms" },
            ],
          }),
        }}
      />

      {/* Hero Banner */}
      <section className="relative h-72 sm:h-96 bg-brand-maroon-dark">
        <Image
          src={IMAGES.deluxeSuite}
          alt="Hotel Kalya Executive Suite"
          fill
          className="object-cover opacity-50"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark via-brand-maroon-dark/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <span className="text-brand-amber text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <Bed className="w-4 h-4" /> Accommodation & Stays
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Rooms, Suites & Stays
          </h1>
          <p className="text-white/80 text-sm mt-2 max-w-xl">
            Thoughtfully appointed executive suites and comfortable standard rooms
            designed for unmatched rest in Kapenguria, West Pokot.
          </p>
        </div>
      </section>

      {/* Breadcrumbs Strip */}
      <section className="bg-brand-cream border-b border-brand-amber-light/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Services", href: "/services" },
              { label: "Accommodation" },
            ]}
          />
        </div>
      </section>

      {/* Amenity Highlights Strip */}
      <section className="bg-brand-amber py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6">
          {HIGHLIGHTS.map((h) => {
            const Icon = h.icon;
            return (
              <span
                key={h.label}
                className="flex items-center gap-2 text-brand-maroon-dark text-xs font-bold"
              >
                <Icon className="w-4 h-4" /> {h.label}
              </span>
            );
          })}
        </div>
      </section>

      {/* Room Listings */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {ACCOMMODATION_ROOMS.map((room, idx) => (
            <div
              key={room.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                idx % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={idx % 2 !== 0 ? "lg:order-2" : ""}>
                <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-brand-amber-light h-72 sm:h-96">
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute top-4 left-4 bg-brand-maroon-dark text-brand-amber px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow">
                    {room.tag}
                  </div>
                </div>
              </div>

              <div className={`space-y-4 ${idx % 2 !== 0 ? "lg:order-1" : ""}`}>
                <span className="text-xs font-bold text-brand-sage uppercase tracking-widest">
                  {room.type}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-brand-maroon-dark">
                  {room.name}
                </h2>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span className="bg-brand-amber-light/50 px-2.5 py-0.5 rounded font-medium">
                    {room.capacity}
                  </span>
                  <span className="bg-brand-amber-light/50 px-2.5 py-0.5 rounded font-medium">
                    {room.bed}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {room.desc}
                </p>

                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 text-xs bg-brand-cream border border-brand-amber-light text-gray-700 px-3 py-1.5 rounded-lg"
                    >
                      <CheckCircle2 className="w-3 h-3 text-brand-amber" />
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-3">
                  <Link
                    href={`/book?service=Accommodation&room=${encodeURIComponent(room.name)}`}
                    className="bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow transition-all flex items-center gap-2"
                  >
                    <span>Book This Room</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <a
                    href={`tel:${BRAND.phone}`}
                    className="border border-brand-maroon text-brand-maroon px-5 py-3 rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-brand-amber-light transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call: {BRAND.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guest Policies & Information */}
      <section className="py-16 bg-brand-cream/60 border-t border-brand-amber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-brand-amber" /> Stay Information
            </span>
            <h3 className="font-serif text-2xl font-bold text-brand-maroon-dark mt-1">
              Guest Policies & Convenience
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {POLICIES.map((p) => (
              <div
                key={p.title}
                className="bg-white p-6 rounded-2xl border border-brand-amber-light/80 shadow-xs"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-brand-maroon block mb-1">
                  {p.title}
                </span>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {p.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
