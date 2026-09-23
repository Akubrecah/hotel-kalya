import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, CheckCircle2, Coffee } from "lucide-react";
import { BRAND, IMAGES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Outside Catering — Professional Event Catering Services",
  description:
    "Hotel Kalya's professional outside catering services for weddings, corporate events, county functions, and private celebrations in West Pokot and beyond.",
};

const CATERING_FEATURES = [
  "Custom Menu Design (African, Continental, Fusion)",
  "Full Buffet Setup with Chafing & Décor",
  "Professional Waitstaff in Smart Uniforms",
  "Cutlery, Crockery & Glassware Provided",
  "Hygiene-First Food Handling (KEBS Standard)",
  "Dessert & Beverage Station Options",
  "Transport & Setup at Any Venue in West Pokot",
  "Event Coordination & Timing Management",
];

export default function CateringPage() {
  return (
    <>
      <section className="relative h-72 sm:h-96 bg-brand-maroon-dark">
        <Image src={IMAGES.cateringBuffet} alt="Outside Catering" fill className="object-cover opacity-50" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark via-brand-maroon-dark/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <span className="text-brand-amber text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <Coffee className="w-4 h-4" /> Professional Event Catering
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">Outside Catering</h1>
          <p className="text-white/80 text-sm mt-2 max-w-xl">
            Bringing Hotel Kalya&apos;s restaurant-grade culinary excellence directly to your venue for any occasion.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-extrabold text-brand-maroon-dark">
                Full-Service Catering for Every Occasion
              </h2>
              <p className="text-gray-700 leading-relaxed">
                From intimate private dinner parties to large-scale county government banquets,
                church conventions, wedding receptions, and corporate luncheons — our catering
                team delivers impeccable food quality, presentation, and service at your location.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATERING_FEATURES.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-brand-amber flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/book" className="bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow">
                  Request Catering Quote
                </Link>
                <a href={`tel:${BRAND.phone}`} className="border border-brand-maroon text-brand-maroon px-6 py-3 rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-brand-amber-light transition-colors">
                  <Phone className="w-3.5 h-3.5" /> Call Catering Manager
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden shadow-md border-2 border-brand-amber-light">
                <Image src={IMAGES.cateringBuffet} alt="Catering Buffet" width={400} height={300} className="w-full h-48 object-cover" sizes="25vw" />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md border-2 border-brand-amber-light">
                <Image src={IMAGES.weddingSetup} alt="Event Setup" width={400} height={300} className="w-full h-48 object-cover" sizes="25vw" />
              </div>
              <div className="col-span-2 rounded-2xl overflow-hidden shadow-md border-2 border-brand-amber-light">
                <Image src={IMAGES.kenyanBuffet} alt="Buffet Spread" width={800} height={300} className="w-full h-48 object-cover" sizes="50vw" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
