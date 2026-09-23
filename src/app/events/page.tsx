import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Presentation,
  PartyPopper,
  ArrowRight,
  Coffee,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { IMAGES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Events, Conferences & Banqueting Venues in Kapenguria | Hotel Kalya",
  description:
    "Host corporate conferences, county workshops, garden weddings, and private banquets at Hotel Kalya in Kapenguria, West Pokot County. Flexible venues, modern AV, and full outside catering.",
  openGraph: {
    title: "Events & Meetings at Hotel Kalya Kapenguria",
    description:
      "Host county summits, executive board meetings, and picturesque garden celebrations with our complete hospitality packages.",
  },
};

const VENUE_CAPACITIES = [
  {
    name: "Main Conference Hall",
    theatre: "150 Delegates",
    classroom: "80 Delegates",
    uShape: "50 Delegates",
    banquet: "100 Guests",
    idealFor: "Regional summits, county workshops, corporate training seminars",
  },
  {
    name: "Executive VIP Boardroom",
    theatre: "25 Delegates",
    classroom: "20 Delegates",
    uShape: "16 Delegates",
    banquet: "15 Guests",
    idealFor: "Board meetings, confidential negotiations, high-level interviews",
  },
  {
    name: "Kalya Garden Lawns",
    theatre: "500 Guests",
    classroom: "300 Guests",
    uShape: "200 Guests",
    banquet: "400 Guests",
    idealFor: "Outdoor weddings, product launches, family celebrations, banqueting",
  },
];

const EVENT_PILLARS = [
  {
    title: "Corporate Conferences & Seminars",
    desc: "Equipped with dual multimedia projectors, high-output PA audio, wireless microphones, high-speed Wi-Fi, and continuous backup power generator.",
    image: IMAGES.conferenceRoom,
    icon: Presentation,
    link: "/services/conferences",
  },
  {
    title: "Garden Weddings & Receptions",
    desc: "Exchange vows on our manicured green lawns framed by scenic Kapenguria highland views. Ample room for marquee tents, buffet stations, and dance floors.",
    image: IMAGES.weddingSetup,
    icon: PartyPopper,
    link: "/services/garden-experience",
  },
  {
    title: "Outside Mobile Catering",
    desc: "Let Hotel Kalya bring culinary excellence to your private venue across West Pokot and North Rift. Full chafing dishes, uniformed service staff, and custom menus.",
    image: IMAGES.cateringBuffet,
    icon: Coffee,
    link: "/services/outside-catering",
  },
];

export default function EventsPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Events & Conferences" },
        ]}
      />

      {/* Hero Header */}
      <section className="bg-brand-cream/80 py-12 lg:py-16 border-b border-brand-maroon/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/20 text-brand-maroon text-xs font-bold uppercase tracking-wider mb-3">
                <Presentation className="w-3.5 h-3.5 text-brand-amber-dark" />
                <span>Premier Meeting &amp; Event Venues</span>
              </div>
              <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-brand-maroon leading-tight">
                Corporate Meetings &amp; Celebrations
              </h1>
              <p className="mt-4 text-base sm:text-lg text-brand-dark/80 leading-relaxed">
                Whether you are hosting an executive board retreat, a multi-day county workshop, an outdoor garden wedding, or a private celebratory dinner, Hotel Kalya offers the ideal venue and catering in Kapenguria.
              </p>
            </div>

            <Link
              href="/book?service=conference"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-all shadow-md active:scale-95 self-start md:self-end"
            >
              <span>Inquire for Event Venue</span>
              <ArrowRight className="w-4 h-4 text-brand-amber" />
            </Link>
          </div>
        </div>
      </section>

      {/* Event Pillars */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {EVENT_PILLARS.map((pillar) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-white rounded-2xl overflow-hidden border border-brand-maroon/10 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-52 w-full bg-brand-cream">
                      <Image
                        src={pillar.image}
                        alt={pillar.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 p-2 rounded-xl bg-brand-maroon/90 text-brand-amber backdrop-blur-sm shadow">
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="p-6 space-y-2">
                      <h3 className="font-serif font-bold text-lg text-brand-maroon">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-brand-dark/75 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={pillar.link}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-maroon hover:text-brand-amber-dark transition-colors"
                    >
                      <span>Explore Packages &amp; Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Venue Capacities Table */}
          <div className="bg-brand-cream/40 rounded-2xl border border-brand-maroon/10 p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-amber font-sans">
                Room Configurations
              </span>
              <h3 className="font-serif font-black text-2xl text-brand-maroon mt-1">
                Venue Capacities &amp; Seating Layouts
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-brand-maroon text-brand-maroon font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Venue Space</th>
                    <th className="py-3 px-4">Theatre Style</th>
                    <th className="py-3 px-4">Classroom</th>
                    <th className="py-3 px-4">U-Shape</th>
                    <th className="py-3 px-4">Banquet / Round</th>
                    <th className="py-3 px-4">Ideal Function</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cream">
                  {VENUE_CAPACITIES.map((vc) => (
                    <tr key={vc.name} className="hover:bg-white/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-brand-maroon">{vc.name}</td>
                      <td className="py-3.5 px-4">{vc.theatre}</td>
                      <td className="py-3.5 px-4">{vc.classroom}</td>
                      <td className="py-3.5 px-4">{vc.uShape}</td>
                      <td className="py-3.5 px-4">{vc.banquet}</td>
                      <td className="py-3.5 px-4 text-brand-dark/70 italic">{vc.idealFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delegate Packages Strip */}
          <div className="bg-white rounded-2xl border border-brand-maroon/15 p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-brand-amber/20 text-brand-maroon text-xs font-bold">
                <Coffee className="w-3.5 h-3.5" />
                <span>Full-Day &amp; Half-Day Delegate Packages</span>
              </div>
              <h4 className="font-serif font-black text-xl text-brand-maroon">
                Need Comprehensive Workshop Catering?
              </h4>
              <p className="text-xs text-brand-dark/75 leading-relaxed">
                Includes morning and afternoon brewed tea with bitings, executive 3-course buffet lunch with soft drink, writing pads, pens, mineral water, and AV technician support.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <Link
                href="/book?service=conference"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-all shadow"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-4 h-4 text-brand-amber" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
