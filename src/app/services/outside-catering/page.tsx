import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  CheckCircle2,
  Coffee,
  ChevronRight,
  Utensils,
  Users,
  ShieldCheck,
  Truck,
  MessageCircle,
} from "lucide-react";
import { IMAGES } from "@/lib/constants";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getCateringPackages, getHotelSettings } from "@/lib/cms-db";

export const dynamic = "force-dynamic";

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

export default async function OutsideCateringPage() {
  const [packages, settings] = await Promise.all([
    getCateringPackages(true),
    getHotelSettings(),
  ]);

  const cleanPhone = (settings.officialWhatsApp || settings.phone || "254719766649").replace(/\D/g, "");
  const officialPhone = settings.phone || "+254 719 766649";

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
            Outside Catering Packages
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

      {/* DYNAMIC CATERING PACKAGES FROM CMS */}
      <section className="py-20 bg-brand-cream/40 border-t border-brand-amber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
              Catering Tiers &amp; Menus
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-maroon-dark mt-1">
              Select Your Catering Package
            </h2>
            <div className="w-16 h-1 bg-brand-amber mx-auto my-3 rounded-full" />
            <p className="text-sm text-gray-600">
              Transparent per-person pricing including complete hot-chafing equipment, ceramic tableware, and professional uniformed waitstaff.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => {
              const packageName = pkg.name || pkg.title || "Outside Catering Package";
              const waMsg = encodeURIComponent(
                `Hello Hotel Kalya, I would like to enquire about the "${packageName}" catering package for an upcoming event.`
              );
              const waUrl = `https://wa.me/${cleanPhone}?text=${waMsg}`;

              return (
                <div
                  key={pkg.id}
                  className="bg-white rounded-3xl overflow-hidden border border-brand-amber-light/90 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Image */}
                    <div className="relative h-56 w-full overflow-hidden bg-brand-cream">
                      <Image
                        src={pkg.featuredImage || pkg.images?.[0] || IMAGES.cateringBuffet}
                        alt={packageName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                      <div className="absolute top-4 left-4">
                        <span className="bg-brand-maroon text-brand-amber text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>Min {pkg.minGuests} Guests</span>
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="font-serif text-xl font-bold text-white drop-shadow">
                          {packageName}
                        </h3>
                        <p className="text-xs text-brand-amber font-semibold mt-0.5">
                          KES {pkg.pricePerPerson.toLocaleString()} per person
                        </p>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6 space-y-4">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {pkg.description}
                      </p>

                      {/* Menu Selections */}
                      {pkg.menuSelections && pkg.menuSelections.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-bold text-brand-maroon block">
                            Included Culinary Highlights:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {pkg.menuSelections.map((dish, i) => (
                              <span
                                key={i}
                                className="bg-brand-cream text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded-md border border-brand-amber/20"
                              >
                                {dish}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Included Services */}
                      {pkg.includedServices && pkg.includedServices.length > 0 && (
                        <div className="pt-2 border-t border-gray-100 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-gray-400 block">
                            Services &amp; Logistics Included:
                          </span>
                          {pkg.includedServices.map((srv, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                              <CheckCircle2 className="w-3 h-3 text-brand-amber-dark flex-shrink-0" />
                              <span>{srv}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {pkg.deliveryTerms && (
                        <div className="pt-2 text-[10px] text-gray-500 flex items-center gap-1">
                          <Truck className="w-3 h-3 text-brand-amber" />
                          <span>{pkg.deliveryTerms}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 border-t border-gray-100 mt-2">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-gray-400 block">Rate</span>
                        <span className="font-serif text-lg font-bold text-brand-maroon">
                          KES {pkg.pricePerPerson.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-500"> / guest</span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>KEBS Compliant</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Link
                        href={`/book?service=${encodeURIComponent(packageName)}`}
                        className="flex-1 text-center bg-brand-maroon hover:bg-brand-maroon-dark text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                      >
                        Request Quote
                      </Link>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm flex items-center justify-center"
                        title="Enquire on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Events We Cater */}
      <section className="py-16 sm:py-20 bg-white border-t border-brand-amber-light">
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
                className="bg-brand-cream/40 p-7 rounded-2xl border border-brand-amber-light/80 shadow-sm hover:shadow-md transition-all space-y-3"
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
      <section className="py-20 bg-brand-cream/40 border-t border-brand-amber-light">
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
              <div key={step.step} className="space-y-3 relative bg-white p-6 rounded-2xl border border-brand-amber-light shadow-sm">
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
              href={`tel:${cleanPhone}`}
              className="border border-brand-maroon text-brand-maroon px-6 py-3.5 rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-brand-amber-light transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> Call Catering Manager: {officialPhone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
