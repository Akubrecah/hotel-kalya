import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Trees,
  Camera,
  Utensils,
  PartyPopper,
  Sparkles,
  Phone,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { BRAND, IMAGES } from "@/lib/constants";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Kalya Gardens — Lush Outdoor Events, Photography & Garden Dining",
  description:
    "Explore the beautiful Kalya Gardens in Kapenguria, West Pokot County. Manicured lawns, mountain backdrops, wedding photoshoots, outdoor dining, and private celebration spaces.",
  openGraph: {
    title: "Kalya Gardens | Outdoor Experiences & Events in Kapenguria",
    description:
      "Serene landscaped gardens in West Pokot County. Ideal for wedding photo sessions, family gatherings, garden tea, and outdoor functions.",
    images: [IMAGES.gardenLandscape],
  },
};

const GARDEN_USES = [
  {
    icon: Camera,
    title: "Photography & Commercial Filming",
    desc: "Captivating green backdrops with manicured flora, decorative rockeries, and open skies for wedding albums, pre-wedding shoots, and documentary filming.",
    badge: "Most Popular",
  },
  {
    icon: Utensils,
    title: "Garden Dining & Afternoon Tea",
    desc: "Savor mountain tea, fresh pastries, or a relaxed barbecue lunch at shaded outdoor tables surrounded by refreshing foliage and birdsong.",
    badge: "Daily Service",
  },
  {
    icon: PartyPopper,
    title: "Outdoor Receptions & Parties",
    desc: "Birthday bashes, baby showers, bridal parties, graduation receptions, and intimate open-air banquets with full catering setup.",
    badge: "Event Ready",
  },
  {
    icon: Sparkles,
    title: "Restful Leisure & Children's Play",
    desc: "Safe, gated, peaceful green grounds where children can play freely and guests can enjoy quiet meditation or afternoon reading.",
    badge: "Family Friendly",
  },
];

const GARDEN_GALLERY = [
  { title: "Manicured Grounds & Mountain Skyline", image: IMAGES.gardenLandscape },
  { title: "Outdoor Garden Terrace Seating", image: IMAGES.gardenTerrace },
  { title: "Celebration & Banquet Setup", image: IMAGES.weddingSetup },
];

export default function GardenExperiencePage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-72 sm:h-96 bg-brand-maroon-dark">
        <Image
          src={IMAGES.gardenLandscape}
          alt="Kalya Gardens Landscape"
          fill
          className="object-cover opacity-60"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark via-brand-maroon-dark/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <span className="text-brand-amber text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <Trees className="w-4 h-4" /> Lush Outdoor Sanctuary
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Garden Experience
          </h1>
          <p className="text-white/80 text-sm mt-2 max-w-xl">
            Lush, manicured green grounds in Kapenguria perfect for garden dining,
            celebrations, memorable photoshoots, and quiet tranquility.
          </p>
        </div>
      </section>

      {/* Breadcrumbs Strip */}
      <section className="bg-brand-cream border-b border-brand-amber-light/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Services", href: "/services" },
              { label: "Garden Experience" },
            ]}
          />
        </div>
      </section>

      {/* Garden Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
                Kapenguria&apos;s Green Jewel
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-maroon-dark leading-tight">
                An Oasis of Calm & Natural Splendor
              </h2>
              <div className="w-16 h-1 bg-brand-amber rounded-full" />
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Tucked into the lush hill slopes of Kapenguria, <strong>Kalya Gardens</strong> offers visitors a peaceful, nature-infused escape. Meticulously landscaped with native flowers, manicured grass, and indigenous shade trees, our gardens provide the ideal setting for romantic afternoons, family recreation, and grand celebrations.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Whether you need an open-air venue for an intimate wedding ceremony, a picturesque backdrop for studio-grade photography, or simply a tranquil haven to enjoy afternoon tea, Kalya Gardens welcomes you.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/book?service=Garden%20Experience"
                  className="bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow transition-all flex items-center gap-2"
                >
                  <span>Book Garden Event</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/gallery"
                  className="border border-brand-maroon text-brand-maroon px-5 py-3 rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-brand-amber-light transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" /> View Photo Gallery
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-brand-amber-light h-96 sm:h-[440px]">
                <Image
                  src={IMAGES.gardenTerrace}
                  alt="Outdoor Garden Terrace Dining"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-brand-amber text-xs uppercase tracking-wider font-bold block">
                    Al Fresco Bliss
                  </span>
                  <p className="font-serif text-lg font-bold mt-1">
                    Breathe in crisp mountain air and savor farm-fresh meals outdoors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Garden Uses Cards */}
      <section className="py-16 sm:py-20 bg-brand-cream/60 border-t border-brand-amber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
              Versatile Grounds
            </span>
            <h3 className="font-serif text-3xl font-extrabold text-brand-maroon-dark mt-1">
              Ways to Experience Kalya Gardens
            </h3>
            <div className="w-16 h-1 bg-brand-amber mx-auto my-3 rounded-full" />
            <p className="text-sm text-gray-600">
              From high-profile wedding photo shoots to tranquil family picnics, Kalya Gardens caters to every special moment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GARDEN_USES.map((use) => {
              const Icon = use.icon;
              return (
                <div
                  key={use.title}
                  className="bg-white p-7 rounded-2xl border border-brand-amber-light/80 shadow-md hover:shadow-xl transition-all space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-brand-maroon text-brand-amber flex items-center justify-center shadow mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-amber-light text-brand-maroon-dark px-2 py-0.5 rounded-full inline-block mb-2">
                      {use.badge}
                    </span>
                    <h4 className="font-serif font-bold text-base text-brand-maroon-dark">
                      {use.title}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed mt-1.5">
                      {use.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Garden Visual Grid */}
      <section className="py-20 bg-white border-t border-brand-amber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="font-serif text-3xl font-extrabold text-brand-maroon-dark">
              Visual Showcase of Kalya Grounds
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Every angle offers a captivating natural perspective of Kapenguria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GARDEN_GALLERY.map((g, i) => (
              <div
                key={i}
                className="relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-md border-2 border-brand-amber-light group"
              >
                <Image
                  src={g.image}
                  alt={g.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="font-serif font-bold text-sm block">
                    {g.title}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/book?service=Garden%20Experience"
              className="bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg transition-all inline-flex items-center gap-2"
            >
              <span>Reserve Kalya Gardens</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
