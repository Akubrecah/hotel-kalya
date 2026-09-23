import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, Presentation, Users, CheckCircle2 } from "lucide-react";
import { BRAND, IMAGES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Conference Facilities — Seminar Halls & Boardrooms",
  description:
    "Modern conference rooms, seminar halls, and executive boardrooms at Hotel Kalya, Kapenguria. Full AV equipment, delegate catering, and Wi-Fi.",
};

const HALL_TYPES = [
  {
    name: "Main Conference Hall",
    capacity: "50–150 delegates",
    desc: "Our flagship seminar space with classroom, theater, and U-shape layouts.",
    features: ["HD Projector & Screen", "PA System & Wireless Mic", "Podium & Flip Charts", "Natural Lighting"],
    image: IMAGES.conferenceRoom,
  },
  {
    name: "Executive Boardroom",
    capacity: "10–20 delegates",
    desc: "Intimate, quiet setting for executive meetings, board reviews, and signing ceremonies.",
    features: ["TV Display", "Whiteboard", "Private Catering", "Sound Insulation"],
    image: IMAGES.boardroom,
  },
];

const PACKAGES = [
  { name: "Half-Day Package", includes: "Hall Hire • Morning/Afternoon Tea • Writing Materials" },
  { name: "Full-Day Package", includes: "Hall Hire • Morning & Afternoon Tea • Buffet Lunch • Writing Materials" },
  { name: "Residential Package", includes: "Full-Day Conference • Bed & Breakfast • Dinner • Writing Materials" },
];

export default function ConferencePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-72 sm:h-96 bg-brand-maroon-dark">
        <Image src={IMAGES.conferenceRoom} alt="Conference Hall" fill className="object-cover opacity-50" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark via-brand-maroon-dark/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <span className="text-brand-amber text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <Presentation className="w-4 h-4" /> Corporate & NGO Hub
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">Conference Facilities</h1>
          <p className="text-white/80 text-sm mt-2 max-w-xl">
            Professional seminar halls and boardrooms for workshops, trainings, and strategic retreats in Kapenguria.
          </p>
        </div>
      </section>

      {/* Halls */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {HALL_TYPES.map((hall, idx) => (
            <div key={hall.name} className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center`}>
              <div className={idx % 2 !== 0 ? "lg:order-2" : ""}>
                <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-brand-amber-light h-72 sm:h-80">
                  <Image src={hall.image} alt={hall.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                </div>
              </div>
              <div className={`space-y-4 ${idx % 2 !== 0 ? "lg:order-1" : ""}`}>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-brand-amber" />
                  <span className="text-xs font-bold text-brand-sage uppercase tracking-wider">{hall.capacity}</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-brand-maroon-dark">{hall.name}</h2>
                <p className="text-gray-700 leading-relaxed">{hall.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {hall.features.map((f) => (
                    <span key={f} className="flex items-center gap-1.5 text-xs bg-brand-amber-light/50 border border-brand-amber-light text-gray-700 px-3 py-1.5 rounded-lg">
                      <CheckCircle2 className="w-3 h-3 text-brand-amber" /> {f}
                    </span>
                  ))}
                </div>
                <Link href="/book" className="inline-block bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow">
                  Request Quotation
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Delegate Packages */}
      <section className="py-16 bg-brand-amber-light/30 border-t border-b border-brand-amber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-brand-maroon-dark text-center mb-10">Delegate Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => (
              <div key={pkg.name} className="bg-white rounded-2xl p-6 border border-brand-amber-light shadow-sm text-center space-y-3">
                <h3 className="font-serif text-lg font-bold text-brand-maroon">{pkg.name}</h3>
                <p className="text-xs text-gray-600">{pkg.includes}</p>
                <span className="block text-xs text-brand-maroon font-bold uppercase">Enquire for Rates</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/book" className="bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow">
              Book Conference Now
            </Link>
            <a
              href={`tel:${BRAND.phone}`}
              className="border border-brand-maroon text-brand-maroon px-6 py-3 rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-brand-amber-light transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> Call: {BRAND.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
