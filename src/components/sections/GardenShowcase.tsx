import Image from "next/image";
import Link from "next/link";
import { Camera, Utensils, PartyPopper } from "lucide-react";
import { IMAGES } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/SectionHeader";

const GARDEN_FEATURES = [
  {
    icon: Camera,
    iconBg: "bg-emerald-100 text-emerald-800",
    title: "Photo Shoots & Filming",
    desc: "Picturesque backdrop for wedding albums, video shoots, model sessions, and family memories.",
  },
  {
    icon: Utensils,
    iconBg: "bg-brand-amber-light text-brand-maroon-dark",
    title: "Garden Dining & Tea",
    desc: "Enjoy fresh Kenyan tea, choma bites, or cold beverages amidst crisp fresh mountain breezes.",
  },
  {
    icon: PartyPopper,
    iconBg: "bg-red-100 text-brand-maroon",
    title: "Outdoor Parties & Receptions",
    desc: "Open garden spaces that comfortably accommodate celebration tents, seating layouts, and live music.",
  },
];

export function GardenShowcase() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Outdoor Sanctuary"
          badgeColor="sage"
          title="The Kalya Garden Experience"
          description="Immerse yourself in lush, manicured greenery. Designed for peaceful outdoor dining, family recreation, wedding photography, and open-air ceremonies."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Large landscape image */}
          <div className="lg:col-span-8">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-brand-amber-light h-96 sm:h-[460px]">
              <Image
                src={IMAGES.gardenLandscape}
                alt="Kalya Gardens Kapenguria"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute inset-0 gradient-overlay-dark flex flex-col justify-end p-6 sm:p-10 text-white">
                <span className="text-brand-amber-light text-xs font-bold uppercase tracking-widest">
                  Scenic Grounds
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
                  Tranquility, Greenery & Celebration
                </h3>
                <p className="text-white/80 text-xs sm:text-sm mt-2 max-w-xl">
                  Ideal for wedding photo sessions, graduation garden luncheons,
                  romantic evening dining, or gentle relaxation under the
                  Kapenguria sky.
                </p>
              </div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="lg:col-span-4 space-y-4">
            {GARDEN_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-brand-cream p-5 rounded-2xl border border-brand-amber-light"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-full ${feat.iconBg} flex items-center justify-center`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-sm text-brand-maroon-dark">
                      {feat.title}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600">{feat.desc}</p>
                </div>
              );
            })}

            <div className="space-y-2 pt-2">
              <Link
                href="/services/garden-experience"
                className="w-full block bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow transition-colors text-center"
              >
                Explore Kalya Gardens →
              </Link>
              <Link
                href="/book?service=Garden%20Experience"
                className="w-full block border border-brand-maroon text-brand-maroon hover:bg-brand-amber-light py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-center"
              >
                Book Garden for Event / Shoot
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
