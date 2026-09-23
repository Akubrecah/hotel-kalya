import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { BRAND, IMAGES } from "@/lib/constants";

export function CateringBanner() {
  return (
    <section className="py-20 bg-brand-maroon-dark text-white relative overflow-hidden">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-10 pattern-dots" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/20 text-brand-amber text-xs font-bold uppercase tracking-wider border border-brand-amber/30">
              Professional Event Catering
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white">
              Outside Catering & Event Banquets
            </h2>

            <p className="text-white/85 text-sm sm:text-base leading-relaxed">
              Planning a wedding ceremony, county government banquet, church
              convention, anniversary, or private estate gathering in West Pokot?
              Hotel Kalya brings full-service restaurant excellence directly to
              your designated venue.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white/10 p-4 rounded-xl border border-white/15">
                <h4 className="font-bold text-sm text-brand-amber mb-1">
                  Tailored Banquet Menus
                </h4>
                <p className="text-xs text-white/80">
                  From African traditional delicacies to upscale multi-course menus.
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/15">
                <h4 className="font-bold text-sm text-brand-amber mb-1">
                  Complete Equipment & Crew
                </h4>
                <p className="text-xs text-white/80">
                  Chafing warmers, tableware, cutlery, and smartly uniformed
                  waitstaff.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/services/outside-catering"
                className="bg-brand-amber hover:bg-brand-amber-dark text-brand-maroon-dark px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow flex items-center gap-1.5 transition-all"
              >
                <span>Explore Catering Services</span>
                <span>→</span>
              </Link>
              <Link
                href="/book?service=Outside%20Catering"
                className="bg-transparent border border-white/40 hover:bg-white/10 text-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
              >
                Request Quote
              </Link>
              <a
                href={`tel:${BRAND.phone}`}
                className="text-xs font-semibold text-white/80 hover:text-brand-amber flex items-center gap-1.5 py-2"
              >
                <Phone className="w-3.5 h-3.5 text-brand-amber" /> Call: {BRAND.phone}
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-brand-amber">
                <Image
                  src={IMAGES.cateringBuffet}
                  alt="Hotel Kalya Outside Catering Buffet Setup"
                  width={600}
                  height={400}
                  className="w-full h-80 object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-brand-sage text-white p-3 rounded-xl shadow-lg text-xs font-bold">
                Corporate & Private Events
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
