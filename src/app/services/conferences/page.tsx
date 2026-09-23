import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Presentation,
  Users,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { BRAND, IMAGES } from "@/lib/constants";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Conference Facilities — Seminar Halls & Executive Boardrooms in Kapenguria",
  description:
    "Modern conference rooms, seminar venues, and executive boardrooms at Hotel Kalya, Kapenguria. Audiovisual equipment, high-speed Wi-Fi, delegate catering packages, and ample secure parking.",
  openGraph: {
    title: "Conferences & Meetings | Hotel Kalya Kapenguria",
    description:
      "Fully equipped corporate venues in Kapenguria, West Pokot County. Host board meetings, county workshops, and multi-day seminars.",
    images: [IMAGES.conferenceRoom],
  },
};

const HALL_TYPES = [
  {
    name: "Main Conference Hall",
    capacity: "50–150 Delegates",
    desc: "Our flagship seminar space suited for county conventions, NGO workshops, multi-day trainings, and corporate annual meetings.",
    features: [
      "High-Definition Overhead Projector & Screen",
      "PA Sound System with Wireless Handheld Mics",
      "Presenter Podium & Flip Charts with Markers",
      "Large Windows with Scenic Natural Daylight",
      "Flexible Classroom, Theater & Banquet Layouts",
    ],
    image: IMAGES.conferenceRoom,
  },
  {
    name: "Executive Boardroom",
    capacity: "10–20 Delegates",
    desc: "An intimate, sound-insulated boardroom setting for executive committee meetings, strategic reviews, partner negotiations, and VIP debriefs.",
    features: [
      "Large Screen Smart TV Display & HDMI Connectivity",
      "Executive Ergonomic Leather Chairs",
      "Interactive Whiteboard & Stationery Kits",
      "Private Tea & Refreshment Butler Service",
      "High-Speed Dedicated Wi-Fi Connection",
    ],
    image: IMAGES.boardroom,
  },
];

const PACKAGES = [
  {
    name: "Half-Day Package",
    badge: "Flexible",
    desc: "Ideal for brief morning or afternoon briefings, quarterly team meetings, and executive reviews.",
    includes: [
      "Hall Hire & Setup",
      "Mid-morning or Afternoon Herbal Tea & Snacks",
      "Writing Pads, Executive Pens & Mineral Water",
      "High-Speed Wi-Fi & Projector Screen Access",
    ],
  },
  {
    name: "Full-Day Package",
    badge: "Most Popular",
    desc: "Comprehensive meeting package designed for full-day seminars, county workshops, and NGO conferences.",
    includes: [
      "Full-Day Venue Access (8:00 AM – 5:00 PM)",
      "Morning Tea, Fresh Mandazi & Mountain Brews",
      "Buffet Lunch with Fresh Juice & Salad Bar",
      "Afternoon Tea & Assorted Pastries",
      "PA System, Wireless Mic & Projector Included",
    ],
  },
  {
    name: "Residential Package",
    badge: "All-Inclusive",
    desc: "Total accommodation and conference retreat solution for delegates traveling from across Kenya.",
    includes: [
      "Full-Day Conference Package Amenities",
      "Executive Room Overnight Accommodation",
      "Complimentary Full Breakfast the Next Morning",
      "3-Course Dinner in Hotel Kalya Restaurant",
      "Dedicated Event Coordinator On-Site",
    ],
  },
];

export default function ConferencesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-72 sm:h-96 bg-brand-maroon-dark">
        <Image
          src={IMAGES.conferenceRoom}
          alt="Hotel Kalya Conference Hall"
          fill
          className="object-cover opacity-50"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark via-brand-maroon-dark/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <span className="text-brand-amber text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <Presentation className="w-4 h-4" /> Corporate & Event Venues
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Conference Facilities
          </h1>
          <p className="text-white/80 text-sm mt-2 max-w-xl">
            State-of-the-art conference halls, executive boardrooms, and customized
            delegate packages in Kapenguria, West Pokot.
          </p>
        </div>
      </section>

      {/* Breadcrumbs Strip */}
      <section className="bg-brand-cream border-b border-brand-amber-light/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Services", href: "/services" },
              { label: "Conference Facilities" },
            ]}
          />
        </div>
      </section>

      {/* Hall Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
              Venues & Spaces
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-maroon-dark mt-1">
              Purpose-Built for Productive Meetings
            </h2>
            <div className="w-16 h-1 bg-brand-amber mx-auto my-3 rounded-full" />
            <p className="text-sm text-gray-600">
              Configurable room layouts, modern audiovisual technology, and dedicated banqueting staff to ensure flawless execution.
            </p>
          </div>

          {HALL_TYPES.map((hall, idx) => (
            <div
              key={hall.name}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                idx % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={idx % 2 !== 0 ? "lg:order-2" : ""}>
                <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-brand-amber-light h-72 sm:h-96">
                  <Image
                    src={hall.image}
                    alt={hall.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute top-4 left-4 bg-brand-maroon text-brand-amber px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow">
                    {hall.capacity}
                  </div>
                </div>
              </div>

              <div className={`space-y-4 ${idx % 2 !== 0 ? "lg:order-1" : ""}`}>
                <div className="flex items-center gap-2 text-brand-sage font-bold text-xs uppercase tracking-widest">
                  <Users className="w-4 h-4 text-brand-amber" />
                  <span>{hall.capacity}</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-brand-maroon-dark">
                  {hall.name}
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {hall.desc}
                </p>

                <div className="space-y-2 pt-2">
                  {hall.features.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-amber flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/book?service=Conference&hall=${encodeURIComponent(hall.name)}`}
                    className="bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow transition-all flex items-center gap-2"
                  >
                    <span>Request Conference Quote</span>
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

      {/* Delegate Packages */}
      <section className="py-20 bg-brand-cream/60 border-t border-brand-amber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
              Delegate Packages
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-brand-maroon-dark mt-1">
              Transparent, Value-Packed Packages
            </h2>
            <div className="w-16 h-1 bg-brand-amber mx-auto my-3 rounded-full" />
            <p className="text-sm text-gray-600">
              Choose from half-day, full-day, or all-inclusive residential options tailored to county budgets and corporate standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className="bg-white rounded-3xl p-8 border-2 border-brand-amber-light/80 shadow-md flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-brand-amber-light text-brand-maroon-dark px-3 py-1 rounded-full mb-3">
                    {pkg.badge}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-brand-maroon-dark mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-6">
                    {pkg.desc}
                  </p>

                  <div className="space-y-2.5">
                    {pkg.includes.map((inc, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 text-xs text-gray-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-brand-amber flex-shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-6 border-t border-brand-amber-light/80 text-center">
                  <Link
                    href={`/book?service=Conference&package=${encodeURIComponent(pkg.name)}`}
                    className="w-full bg-brand-cream hover:bg-brand-maroon text-brand-maroon hover:text-brand-amber font-bold text-xs uppercase tracking-wider py-3 rounded-xl border border-brand-amber-light transition-all flex items-center justify-center gap-2"
                  >
                    <span>Select {pkg.name}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
