import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Bed,
  Utensils,
  Presentation,
  Coffee,
  Sparkles,
  Trees,
  ChevronRight,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { BRAND, IMAGES, SERVICES_LIST } from "@/lib/constants";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Hospitality Services — Accommodation, Dining, Conferences & Catering",
  description:
    "Explore Hotel Kalya's full range of hospitality services in Kapenguria, West Pokot County: luxury accommodation, restaurant dining, conference halls, outside catering, AirBnB apartments, and lush garden events.",
  openGraph: {
    title: "Hospitality Services Directory | Hotel Kalya Kapenguria",
    description:
      "All services offered at Hotel Kalya: Executive rooms, dining hall, modern conference spaces, outside catering, AirBnB stays, and Kalya Gardens.",
    images: [IMAGES.heroExterior],
  },
};

const SERVICE_ICONS: Record<string, React.ElementType> = {
  bed: Bed,
  utensils: Utensils,
  presentation: Presentation,
  coffee: Coffee,
  sparkles: Sparkles,
  trees: Trees,
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-72 sm:h-96 bg-brand-maroon-dark">
        <Image
          src={IMAGES.heroExterior}
          alt="Hotel Kalya Hospitality Services"
          fill
          className="object-cover opacity-40"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark via-brand-maroon-dark/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <span className="text-brand-amber text-xs font-bold uppercase tracking-widest mb-2">
            What We Offer
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Hospitality Services
          </h1>
          <p className="text-white/80 text-sm mt-2 max-w-xl">
            From restful executive suites and farm-fresh cuisine to high-capacity
            conference facilities and lush garden experiences in Kapenguria.
          </p>
        </div>
      </section>

      {/* Breadcrumbs Strip */}
      <section className="bg-brand-cream border-b border-brand-amber-light/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Services" }]} />
        </div>
      </section>

      {/* Services Directory Grid */}
      <section className="py-16 sm:py-20 bg-brand-cream/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
              Comprehensive Directory
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-brand-maroon-dark mt-1">
              Tailored for Every Occasion
            </h2>
            <div className="w-16 h-1 bg-brand-amber mx-auto my-3 rounded-full" />
            <p className="text-sm text-gray-600">
              Select any of our core offerings below to view full details, menus, packages, photo galleries, and direct reservation options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES_LIST.map((service) => {
              const Icon = SERVICE_ICONS[service.iconName] || ChevronRight;

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl overflow-hidden border-2 border-brand-amber-light/70 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Header */}
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-brand-amber text-brand-maroon-dark px-2.5 py-0.5 rounded-full">
                          {service.tagline}
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-maroon text-brand-amber flex items-center justify-center flex-shrink-0 shadow">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-brand-maroon-dark group-hover:text-brand-maroon transition-colors">
                          {service.title}
                        </h3>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {service.desc}
                      </p>

                      {/* Feature Highlights */}
                      <div className="space-y-1.5 pt-2 border-t border-brand-amber-light/60">
                        {service.features.map((feature, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-xs text-gray-700"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-amber flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA Link */}
                  <div className="p-6 pt-0">
                    <Link
                      href={service.href}
                      className="w-full bg-brand-cream hover:bg-brand-maroon text-brand-maroon hover:text-brand-amber font-bold text-xs uppercase tracking-wider py-3 rounded-xl border border-brand-amber-light/80 hover:border-brand-maroon transition-all flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>{service.cta}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking Quick Strip */}
      <section className="py-14 bg-brand-maroon-dark text-white border-t border-brand-amber/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="text-brand-amber text-xs font-bold uppercase tracking-widest">
            Custom Package or Corporate Enquiry?
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold max-w-xl mx-auto">
            We Create Custom Arrangements for Delegations & Large Groups
          </h2>
          <p className="text-white/80 text-xs sm:text-sm max-w-lg mx-auto">
            Contact our dedicated reservations desk directly to discuss customized conference, catering, or extended stay requirements.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/book"
              className="bg-brand-amber hover:bg-brand-amber-dark text-brand-maroon-dark font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-full shadow-lg transition-all flex items-center gap-2"
            >
              <span>Submit Booking Request</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <a
              href={`tel:${BRAND.phone}`}
              className="border border-white/30 hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-brand-amber" />
              <span>Call: {BRAND.phone}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
