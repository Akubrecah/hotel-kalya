import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Presentation,
  Users,
  CheckCircle2,
  ChevronRight,
  Maximize,
  Clock,
  Layers,
  MessageCircle,
} from "lucide-react";
import { IMAGES } from "@/lib/constants";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getConferenceHalls, getHotelSettings } from "@/lib/cms-db";
import { getStandardWhatsAppUrl } from "@/lib/whatsapp";


export const dynamic = "force-dynamic";

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

export default async function ConferencesPage() {
  const [halls, settings] = await Promise.all([
    getConferenceHalls(true),
    getHotelSettings(),
  ]);

  const cleanPhone = (settings.officialWhatsApp || settings.phone || "254719766649").replace(/\D/g, "");
  const officialPhone = settings.phone || "+254 719 766649";

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

      {/* Dynamic Hall Types From CMS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
              Venues &amp; Spaces
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-maroon-dark mt-1">
              Purpose-Built for Productive Meetings
            </h2>
            <div className="w-16 h-1 bg-brand-amber mx-auto my-3 rounded-full" />
            <p className="text-sm text-gray-600">
              Configurable room layouts, modern audiovisual technology, and dedicated banqueting staff to ensure flawless execution.
            </p>
          </div>

          {halls.map((hall, idx) => {
            const waUrl = getStandardWhatsAppUrl(
              `Hello Hotel Kalya, I would like to enquire about booking the "${hall.name}" for an upcoming conference/seminar.`,
              cleanPhone
            );


            return (
              <div
                key={hall.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 rounded-3xl bg-brand-cream/30 border border-brand-amber-light/80 shadow-sm`}
              >
                <div className={`lg:col-span-5 ${idx % 2 !== 0 ? "lg:order-2" : ""}`}>
                  <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-brand-amber-light h-72 sm:h-96">
                    <Image
                      src={hall.featuredImage || hall.images?.[0] || IMAGES.conferenceRoom}
                      alt={hall.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute top-4 left-4 bg-brand-maroon text-brand-amber px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow">
                      {hall.capacity?.maxGuests ? `Up to ${hall.capacity.maxGuests} Delegates` : "Delegates"}
                    </div>
                  </div>
                </div>

                <div className={`lg:col-span-7 space-y-5 ${idx % 2 !== 0 ? "lg:order-1" : ""}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 text-brand-maroon font-bold text-xs uppercase tracking-wider bg-brand-amber-light/80 px-3 py-1 rounded-full">
                      <Users className="w-3.5 h-3.5" />
                      <span>{hall.capacity?.minGuests || 10} – {hall.capacity?.maxGuests || 150} Delegates</span>
                    </span>
                    {hall.dimensions && (
                      <span className="inline-flex items-center gap-1 text-gray-500 text-xs font-semibold">
                        <Maximize className="w-3.5 h-3.5 text-brand-amber" />
                        <span>{hall.dimensions}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-brand-maroon-dark">
                    {hall.name}
                  </h3>

                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {hall.description}
                  </p>

                  {/* Seating Configurations */}
                  {hall.seatingConfigurations && hall.seatingConfigurations.length > 0 && (
                    <div className="bg-white p-4 rounded-2xl border border-brand-amber/20 shadow-sm space-y-2">
                      <span className="text-[11px] uppercase font-bold text-brand-maroon block flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-brand-amber" />
                        Available Seating Configurations:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {hall.seatingConfigurations.map((cfg, cIdx) => (
                          <div key={cIdx} className="bg-brand-cream/60 px-3 py-1.5 rounded-lg text-xs flex justify-between items-center">
                            <span className="font-semibold text-brand-dark">{cfg.layout}</span>
                            <span className="text-brand-maroon font-bold text-[11px]">{cfg.capacity} pax</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Equipment Checklist */}
                  {hall.equipment && hall.equipment.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">
                        Included Audiovisual &amp; Hall Equipment:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                        {hall.equipment.map((f, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-amber flex-shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pricing Tiers & Action Buttons */}
                  <div className="pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-baseline gap-4">
                      {hall.pricing?.fullDay ? (
                        <div>
                          <span className="text-[10px] uppercase text-gray-400 font-bold block">Full Day</span>
                          <span className="font-serif text-lg font-bold text-brand-maroon">
                            KES {hall.pricing.fullDay.toLocaleString()}
                          </span>
                        </div>
                      ) : null}
                      {hall.pricing?.halfDay ? (
                        <div>
                          <span className="text-[10px] uppercase text-gray-400 font-bold block">Half Day</span>
                          <span className="font-serif text-base font-bold text-gray-700">
                            KES {hall.pricing.halfDay.toLocaleString()}
                          </span>
                        </div>
                      ) : null}
                      {hall.pricing?.hourly ? (
                        <div>
                          <span className="text-[10px] uppercase text-gray-400 font-bold block">Hourly</span>
                          <span className="font-serif text-sm font-semibold text-gray-600">
                            KES {hall.pricing.hourly.toLocaleString()}/hr
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      <Link
                        href={`/book?service=Conference&hall=${encodeURIComponent(hall.name)}`}
                        className="bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow transition-all flex items-center gap-1.5"
                      >
                        <span>Request Quote</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow transition-all flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp Enquiry</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
