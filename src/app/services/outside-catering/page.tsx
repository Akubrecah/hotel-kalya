import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  CheckCircle2,
  Coffee,
  ChevronRight,
  Utensils,
} from "lucide-react";
import { BRAND, IMAGES } from "@/lib/constants";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Outside Catering — Professional Event Banqueting in West Pokot & North Rift",
  description:
    "Hotel Kalya's professional outside catering services for weddings, county summits, corporate luncheons, and private celebrations across Kapenguria and West Pokot.",
  openGraph: {
    title: "Outside Catering Services | Hotel Kalya Kapenguria",
    description:
      "Full banquet mobile catering: chafing equipment, uniformed waitstaff, custom African and continental menus delivered to your venue.",
    images: [IMAGES.cateringBuffet],
  },
};

const EVENT_TYPES = [
  {
    title: "Weddings & Traditional Ceremonies",
    desc: "Grand wedding banquets, dowry celebrations (Koito), and evening receptions with live buffet stations.",
  },
  {
    title: "County & Government Functions",
    desc: "High-level state visits, county assembly summits, public stakeholder barazas, and ministerial luncheons.",
  },
  {
    title: "Corporate Luncheons & Seminars",
    desc: "Executive tea breaks, working boxed lunches, or full buffet spreads at corporate offices or remote field sites.",
  },
  {
    title: "Graduations & Family Reunions",
    desc: "Festive home celebrations honoring achievements with wholesome, generous meals that delight every relative.",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Consultation & Headcount",
    desc: "Share your date, location, expected number of guests, and culinary preferences with our catering manager.",
  },
  {
    step: "02",
    title: "Custom Menu Formulation",
    desc: "We propose tailored menu options covering meats, carbohydrates, vegetable medleys, beverages, and desserts.",
  },
  {
    step: "03",
    title: "Logistics & Site Setup",
    desc: "Our logistics team arrives early with chafing dishes, linen, crockery, and clean serving stations.",
  },
  {
    step: "04",
    title: "Flawless Service Delivery",
    desc: "Smartly uniformed crew ensure warm food, attentive service, and meticulous post-event cleanup.",
  },
];

const CATERING_INCLUSIONS = [
  "Custom Menu Design (Traditional Kenyan, Continental & Fusion)",
  "Full Chafing Dish & Hot-Holding Setup",
  "Professional Waitstaff in Smart Uniforms",
  "Ceramic Plates, Cutlery & Water Tumblers",
  "Dessert & Beverage Dispenser Stations",
  "Strict KEBS Hygiene & Food Safety Compliance",
  "Transport to Venues Across West Pokot & Kitale",
  "Dedicated Banquet Captain On-Site Throughout Event",
];

export default function OutsideCateringPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-72 sm:h-96 bg-brand-maroon-dark">
        <Image
          src={IMAGES.cateringBuffet}
          alt="Outside Catering Setup"
          fill
          className="object-cover opacity-50"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark via-brand-maroon-dark/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <span className="text-brand-amber text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <Coffee className="w-4 h-4" /> Professional Mobile Banqueting
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Outside Catering
          </h1>
          <p className="text-white/80 text-sm mt-2 max-w-xl">
            Bringing Hotel Kalya&apos;s restaurant-grade culinary excellence and
            impeccable service directly to your venue of choice.
          </p>
        </div>
      </section>

      {/* Breadcrumbs Strip */}
      <section className="bg-brand-cream border-b border-brand-amber-light/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Services", href: "/services" },
              { label: "Outside Catering" },
            ]}
          />
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
                Culinary Standards Anywhere
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-maroon-dark leading-tight">
                Hotel Kalya Hospitality at Your Own Venue
              </h2>
              <div className="w-16 h-1 bg-brand-amber rounded-full" />
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Whether you are hosting an intimate 50-guest family luncheon or a 1,500-delegate county symposium, Hotel Kalya&apos;s outside catering team delivers restaurant-quality freshness, elegant buffet presentations, and warm service.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                We bring everything: chafing dishes, table linens, crockery, glassware, cutlery, and an attentive crew of experienced servers so you can focus entirely on your guests.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                {CATERING_INCLUSIONS.map((inc, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-gray-800">
                    <CheckCircle2 className="w-4 h-4 text-brand-amber flex-shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-brand-amber-light h-96 sm:h-[440px]">
                <Image
                  src={IMAGES.diningFood}
                  alt="Outside Catering Food Spread"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-brand-amber text-xs uppercase tracking-wider font-bold block">
                    Zero Compromise
                  </span>
                  <p className="font-serif text-lg font-bold mt-1">
                    Hot food kept piping hot, cold refreshments served ice cold, and every guest treated with dignity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events We Cater */}
      <section className="py-16 sm:py-20 bg-brand-cream/60 border-t border-brand-amber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
              Event Portfolio
            </span>
            <h3 className="font-serif text-3xl font-extrabold text-brand-maroon-dark mt-1">
              Events We Cater Across the Region
            </h3>
            <div className="w-16 h-1 bg-brand-amber mx-auto my-3 rounded-full" />
            <p className="text-sm text-gray-600">
              Trusted by government agencies, non-profits, institutions, and families across West Pokot and Trans-Nzoia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EVENT_TYPES.map((evt) => (
              <div
                key={evt.title}
                className="bg-white p-7 rounded-2xl border border-brand-amber-light/80 shadow-md hover:shadow-xl transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-maroon text-brand-amber flex items-center justify-center shadow">
                  <Utensils className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-brand-maroon-dark">
                  {evt.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {evt.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="py-20 bg-white border-t border-brand-amber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
              How It Works
            </span>
            <h3 className="font-serif text-3xl font-extrabold text-brand-maroon-dark mt-1">
              Simple 4-Step Booking Process
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              From your initial request to final plate service, we make outside catering effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {PROCESS_STEPS.map((step) => (
              <div key={step.step} className="space-y-3 relative">
                <span className="font-serif text-4xl font-black text-brand-amber block">
                  {step.step}
                </span>
                <h4 className="font-serif font-bold text-lg text-brand-maroon-dark">
                  {step.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="text-center mt-16 flex flex-wrap justify-center gap-4">
            <Link
              href="/book?service=Outside%20Catering"
              className="bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow transition-all flex items-center gap-2"
            >
              <span>Request Catering Quote</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <a
              href={`tel:${BRAND.phone}`}
              className="border border-brand-maroon text-brand-maroon px-6 py-3.5 rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-brand-amber-light transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> Call Catering Manager: {BRAND.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
