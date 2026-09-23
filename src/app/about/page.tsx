import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  HeartHandshake,
  MapPin,
  ChevronRight,
  Phone,
  Bed,
  Utensils,
  Presentation,
  Trees,
  Sparkles,
} from "lucide-react";
import { BRAND, IMAGES } from "@/lib/constants";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "About Us — Hospitality Redefined in Kapenguria, West Pokot",
  description:
    "Discover the story of Hotel Kalya in Kapenguria, West Pokot County. Our heritage of warm Kenyan hospitality, executive facilities, farm-fresh cuisine, and tranquil garden landscapes.",
  openGraph: {
    title: "About Hotel Kalya | Hospitality Redefined in Kapenguria",
    description:
      "Learn about Hotel Kalya — Kapenguria's flagship hospitality destination with executive accommodation, conference venues, and manicured gardens.",
    images: [IMAGES.buildingFacade],
  },
};

const VALUES = [
  {
    icon: HeartHandshake,
    title: "Genuine Pokot Warmth",
    desc: "We treat every guest with heartfelt Kenyan courtesy, personal attention, and respect from arrival to departure.",
  },
  {
    icon: ShieldCheck,
    title: "Comfort & Peace of Mind",
    desc: "Gated compound, round-the-clock professional security personnel, CCTV coverage, and secure guest parking.",
  },
  {
    icon: Utensils,
    title: "Farm-to-Table Purity",
    desc: "Our kitchens source fresh farm produce directly from West Pokot farmers, guaranteeing uncompromised flavor and nourishment.",
  },
  {
    icon: Award,
    title: "Unrivaled Standard",
    desc: "Whether hosting a high-level county summit, a family wedding, or an overnight stay, we adhere to the highest hospitality standards.",
  },
];

const MILESTONES = [
  { number: "24/7", label: "Front Desk & Security" },
  { number: "7", label: "Hospitality Verticals" },
  { number: "150+", label: "Conference Delegate Capacity" },
  { number: "100%", label: "Local Farm Freshness" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-72 sm:h-96 bg-brand-maroon-dark">
        <Image
          src={IMAGES.buildingFacade}
          alt="Hotel Kalya Kapenguria Facade"
          fill
          className="object-cover opacity-45"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark via-brand-maroon-dark/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <span className="text-brand-amber text-xs font-bold uppercase tracking-widest mb-2">
            Our Story & Heritage
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            About Hotel Kalya
          </h1>
          <p className="text-white/80 text-sm mt-2 max-w-xl">
            Rooted in the scenic hills of Kapenguria, redefining hospitality with
            elegance, authenticity, and unwavering service excellence.
          </p>
        </div>
      </section>

      {/* Breadcrumbs Strip */}
      <section className="bg-brand-cream border-b border-brand-amber-light/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "About Us" }]} />
        </div>
      </section>

      {/* Main Story & Heritage */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
                Kapenguria’s Signature Destination
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-brand-maroon-dark leading-tight">
                A Welcoming Oasis in the Heart of West Pokot County
              </h2>
              <div className="w-16 h-1 bg-brand-amber rounded-full" />

              <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                <p>
                  Established to meet the growing need for distinguished,
                  world-class hospitality in the North Rift, <strong>Hotel Kalya</strong>{" "}
                  has evolved into Kapenguria&apos;s foremost address for business
                  executives, government leaders, families, and international visitors.
                </p>
                <p>
                  Our location along the tarmac highway connects travelers seamlessly
                  between Kitale, Kapenguria, and the Lake Turkana corridor. Surrounded
                  by the picturesque mountain ridges of West Pokot, Hotel Kalya offers an
                  escape from the everyday bustle while providing every modern convenience
                  demanded by discerning travelers.
                </p>
                <p>
                  From comfortable accommodation and serviced AirBnB apartments to our
                  farm-to-table dining hall, professional conference pavilions, and lush
                  Kalya Gardens, every square meter of our property is dedicated to one
                  singular mission: <em>Hospitality Redefined</em>.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-brand-amber-light">
                {MILESTONES.map((m) => (
                  <div key={m.label} className="p-3 bg-brand-cream rounded-xl text-center">
                    <span className="font-serif text-2xl font-black text-brand-maroon block">
                      {m.number}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-600 block mt-0.5">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-brand-amber-light h-96 sm:h-[460px]">
                <Image
                  src={IMAGES.diningFood}
                  alt="Hotel Kalya Culinary and Service Presentation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-brand-amber text-xs uppercase tracking-wider font-bold block">
                    Our Philosophy
                  </span>
                  <p className="font-serif text-lg font-bold mt-1">
                    &ldquo;Warm hospitality that honors local heritage while meeting international standards.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 sm:py-20 bg-brand-cream/50 border-t border-brand-amber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
              Guiding Principles
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-brand-maroon-dark mt-1">
              Why Guests Choose Hotel Kalya
            </h2>
            <div className="w-16 h-1 bg-brand-amber mx-auto my-3 rounded-full" />
            <p className="text-sm text-gray-600">
              Our core values shape every breakfast served, every seminar hosted, and every peaceful night our guests experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="bg-white p-7 rounded-2xl border border-brand-amber-light/80 shadow-md hover:shadow-xl transition-all duration-300 space-y-3 flex flex-col justify-between"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-maroon text-brand-amber flex items-center justify-center shadow">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-brand-maroon-dark">
                      {val.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-2">
                      {val.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Facilities Overview Grid */}
      <section className="py-16 bg-white border-t border-brand-amber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
              Complete Facilities
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-brand-maroon-dark mt-1">
              Everything Under One Roof
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Explore our full suite of professional services and private amenities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/services/accommodation"
              className="group p-6 rounded-2xl bg-brand-cream/60 hover:bg-brand-amber-light/40 border border-brand-amber-light transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-maroon text-brand-amber flex items-center justify-center flex-shrink-0">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-brand-maroon-dark group-hover:text-brand-maroon">
                  Executive Rooms & Suites
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  En-suite hot showers, satellite TVs, Wi-Fi, and 24/7 room service.
                </p>
              </div>
            </Link>

            <Link
              href="/services/food-service"
              className="group p-6 rounded-2xl bg-brand-cream/60 hover:bg-brand-amber-light/40 border border-brand-amber-light transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-maroon text-brand-amber flex items-center justify-center flex-shrink-0">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-brand-maroon-dark group-hover:text-brand-maroon">
                  Restaurant & Dining
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Farm-fresh Kenyan favorites, barbecue, and continental a la carte dishes.
                </p>
              </div>
            </Link>

            <Link
              href="/services/conferences"
              className="group p-6 rounded-2xl bg-brand-cream/60 hover:bg-brand-amber-light/40 border border-brand-amber-light transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-maroon text-brand-amber flex items-center justify-center flex-shrink-0">
                <Presentation className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-brand-maroon-dark group-hover:text-brand-maroon">
                  Conference Halls
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  AV projectors, sound systems, flipcharts, and tailored delegate catering.
                </p>
              </div>
            </Link>

            <Link
              href="/services/outside-catering"
              className="group p-6 rounded-2xl bg-brand-cream/60 hover:bg-brand-amber-light/40 border border-brand-amber-light transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-maroon text-brand-amber flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-brand-maroon-dark group-hover:text-brand-maroon">
                  Outside Catering
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Full banquet catering delivered to any venue in West Pokot & North Rift.
                </p>
              </div>
            </Link>

            <Link
              href="/services/airbnb"
              className="group p-6 rounded-2xl bg-brand-cream/60 hover:bg-brand-amber-light/40 border border-brand-amber-light transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-maroon text-brand-amber flex items-center justify-center flex-shrink-0">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-brand-maroon-dark group-hover:text-brand-maroon">
                  AirBnB Serviced Stays
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Kitchenettes, private balconies, and homelike freedom for extended stays.
                </p>
              </div>
            </Link>

            <Link
              href="/services/garden-experience"
              className="group p-6 rounded-2xl bg-brand-cream/60 hover:bg-brand-amber-light/40 border border-brand-amber-light transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-maroon text-brand-amber flex items-center justify-center flex-shrink-0">
                <Trees className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-brand-maroon-dark group-hover:text-brand-maroon">
                  Kalya Gardens
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Manicured lawns for wedding photos, garden dining, and tranquil walks.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-brand-maroon-dark text-white border-t border-brand-amber/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-brand-amber text-xs font-bold uppercase tracking-widest">
            Experience Kalya
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold max-w-2xl mx-auto">
            Plan Your Next Stay, Conference, or Function With Us
          </h2>
          <p className="text-white/80 text-sm max-w-lg mx-auto">
            Our team is ready to welcome you with the highest standard of personalized hospitality in Kapenguria.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/book"
              className="bg-brand-amber hover:bg-brand-amber-dark text-brand-maroon-dark font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full shadow-lg transition-all flex items-center gap-2"
            >
              <span>Book Online</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="border border-white/30 hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full transition-all flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-brand-amber" />
              <span>Get Directions</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
