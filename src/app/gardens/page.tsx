import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Camera, Utensils, PartyPopper, Trees } from "lucide-react";
import { IMAGES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kalya Gardens — Outdoor Events, Photography & Garden Dining",
  description:
    "Explore the beautiful Kalya Gardens in Kapenguria. Perfect for wedding photoshoots, garden dining, outdoor events, and peaceful relaxation.",
};

const GARDEN_USES = [
  { icon: Camera, title: "Photography & Filming", desc: "Professional wedding albums, Instagram content, portrait sessions, and documentary filming." },
  { icon: Utensils, title: "Garden Dining & Tea", desc: "Enjoy outdoor breakfast, afternoon tea, or romantic dinner under the Kapenguria evening sky." },
  { icon: PartyPopper, title: "Outdoor Receptions", desc: "Birthday parties, baby showers, graduation celebrations, and intimate outdoor ceremonies." },
  { icon: Trees, title: "Leisure & Relaxation", desc: "Morning jogs, reading corners, children's play area, and meditative walks through green paths." },
];

export default function GardensPage() {
  return (
    <>
      <section className="relative h-72 sm:h-[420px] bg-brand-maroon-dark">
        <Image src={IMAGES.gardenLandscape} alt="Kalya Gardens" fill className="object-cover opacity-60" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark via-brand-maroon-dark/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <span className="text-brand-amber text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <Trees className="w-4 h-4" /> Outdoor Sanctuary
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">Kalya Gardens</h1>
          <p className="text-white/80 text-sm mt-2 max-w-xl">
            Lush, manicured grounds perfect for garden dining, celebrations, photoshoots, and moments of tranquility.
          </p>
        </div>
      </section>

      {/* Uses */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-extrabold text-brand-maroon-dark text-center mb-12">
            Experience the Gardens
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GARDEN_USES.map((use) => {
              const Icon = use.icon;
              return (
                <div key={use.title} className="bg-brand-cream rounded-2xl p-6 border border-brand-amber-light text-center">
                  <div className="w-14 h-14 rounded-full bg-brand-sage/20 text-brand-sage flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-brand-maroon-dark mb-2">{use.title}</h3>
                  <p className="text-xs text-gray-600">{use.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-brand-amber-light/30 border-t border-brand-amber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { src: IMAGES.gardenLandscape, alt: "Manicured Garden Lawn" },
              { src: IMAGES.gardenTerrace, alt: "Garden Terrace Seating" },
              { src: IMAGES.gardenParty, alt: "Outdoor Party Setup" },
            ].map((img) => (
              <div key={img.alt} className="rounded-2xl overflow-hidden shadow-md border-2 border-brand-amber-light h-64">
                <Image src={img.src} alt={img.alt} width={500} height={350} className="w-full h-full object-cover" sizes="33vw" />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/book" className="bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow">
              Book Garden for Event / Photoshoot
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
