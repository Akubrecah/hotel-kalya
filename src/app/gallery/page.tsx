import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Camera, ChevronRight, Phone } from "lucide-react";
import { BRAND, IMAGES } from "@/lib/constants";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Photo Gallery — Experience Hotel Kalya in Kapenguria",
  description:
    "Explore our photo gallery featuring executive accommodation, restaurant dining, conference halls, lush Kalya gardens, and event catering in Kapenguria, West Pokot County.",
  openGraph: {
    title: "Photo Gallery | Hotel Kalya Kapenguria",
    description:
      "Take a visual tour of Hotel Kalya — scenic accommodation, conference halls, farm-fresh dining, and Kalya Gardens in West Pokot.",
    images: [IMAGES.buildingFacade],
  },
};

export default function GalleryPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-72 sm:h-96 bg-brand-maroon-dark">
        <Image
          src={IMAGES.buildingFacade}
          alt="Hotel Kalya Visual Gallery"
          fill
          className="object-cover opacity-40"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark via-brand-maroon-dark/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <span className="text-brand-amber text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <Camera className="w-4 h-4" /> Visual Showcase
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Photo Gallery
          </h1>
          <p className="text-white/80 text-sm mt-2 max-w-xl">
            A visual glimpse into our executive rooms, gourmet cuisine, conference
            venues, and tranquil garden landscapes in Kapenguria.
          </p>
        </div>
      </section>

      {/* Breadcrumbs Strip */}
      <section className="bg-brand-cream border-b border-brand-amber-light/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Gallery" }]} />
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="py-16 sm:py-20 bg-brand-cream/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
              Moments & Spaces
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-brand-maroon-dark mt-1">
              Captured at Hotel Kalya
            </h2>
            <div className="w-16 h-1 bg-brand-amber mx-auto my-3 rounded-full" />
            <p className="text-sm text-gray-600">
              Browse through authentic snapshots of our hospitality experience. Click on any
              photograph to view in high definition.
            </p>
          </div>

          <GalleryGrid />
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-brand-maroon-dark text-white border-t border-brand-amber/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-brand-amber text-xs font-bold uppercase tracking-widest">
            Ready to Visit?
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold max-w-2xl mx-auto">
            Experience the Warmth and Elegance of Hotel Kalya in Person
          </h2>
          <p className="text-white/80 text-sm max-w-lg mx-auto">
            Whether for overnight accommodation, executive dining, corporate conferences,
            or an outdoor garden event, we look forward to hosting you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/book"
              className="bg-brand-amber hover:bg-brand-amber-dark text-brand-maroon-dark font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full shadow-lg transition-all flex items-center gap-2"
            >
              <span>Make a Booking / Enquiry</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <a
              href={`tel:${BRAND.phone}`}
              className="border border-white/30 hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-brand-amber" />
              <span>Call Us: {BRAND.phone}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
