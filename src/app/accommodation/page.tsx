import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Phone, Wifi, Tv, Coffee, ShieldCheck } from "lucide-react";
import { BRAND, IMAGES, ACCOMMODATION_ROOMS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Accommodation — Executive Rooms, Suites & AirBnB Short-Stays",
  description:
    "Comfortable, secure executive rooms, suites, and AirBnB-style short-stay apartments at Hotel Kalya, Kapenguria, West Pokot County.",
};

const HIGHLIGHTS = [
  { icon: Wifi, label: "Free High-Speed Wi-Fi" },
  { icon: Tv, label: "Flat-screen TV (Satellite)" },
  { icon: Coffee, label: "Complimentary Breakfast" },
  { icon: ShieldCheck, label: "24/7 Security & CCTV" },
];

export default function AccommodationPage() {
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
            url: "https://hotelkalya.co.ke/accommodation",
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
          <span className="text-brand-amber text-xs font-bold uppercase tracking-widest mb-2">
            Rest & Rejuvenate
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Accommodation
          </h1>
          <p className="text-white/80 text-sm mt-2 max-w-xl">
            Executive rooms, premium suites, and self-contained AirBnB
            apartments designed for your comfort in Kapenguria.
          </p>
        </div>
      </section>

      {/* Amenity Highlights Strip */}
      <section className="bg-brand-amber py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6">
          {HIGHLIGHTS.map((h) => {
            const Icon = h.icon;
            return (
              <span key={h.label} className="flex items-center gap-2 text-brand-maroon-dark text-xs font-bold">
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
                <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-brand-amber-light h-72 sm:h-96">
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute top-4 left-4 bg-brand-maroon-dark text-brand-amber px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow">
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
                  <span className="bg-brand-amber-light/50 px-2.5 py-0.5 rounded">{room.capacity}</span>
                  <span className="bg-brand-amber-light/50 px-2.5 py-0.5 rounded">{room.bed}</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {room.desc}
                </p>

                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 text-xs bg-white border border-brand-amber-light text-gray-700 px-3 py-1.5 rounded-lg"
                    >
                      <CheckCircle2 className="w-3 h-3 text-brand-amber" />
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/book"
                    className="bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow"
                  >
                    Book This Room
                  </Link>
                  <a
                    href={`tel:${BRAND.phone}`}
                    className="border border-brand-maroon text-brand-maroon px-5 py-3 rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-brand-amber-light transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> {BRAND.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
