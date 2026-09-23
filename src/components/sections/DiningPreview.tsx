import Image from "next/image";
import Link from "next/link";
import { Utensils, CheckCircle2, Phone } from "lucide-react";
import { BRAND, IMAGES } from "@/lib/constants";

export function DiningPreview() {
  return (
    <section className="py-20 bg-brand-amber-light/30 border-t border-b border-brand-amber-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-brand-maroon font-bold text-xs tracking-widest uppercase">
              <Utensils className="w-4 h-4 text-brand-amber" />
              Food Service & Restaurant
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-maroon-dark leading-tight">
              Authentic Flavors, Fresh Ingredients & Hearty Dining
            </h2>

            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Hotel Kalya&apos;s dining experience is grounded in quality,
              cleanliness, and comforting hospitality. Whether you&apos;re
              starting your morning with hot mountain tea and eggs or convening
              for a group buffet luncheon, our culinary staff prepares every dish
              with care.
            </p>

            {/* Feature List */}
            <div className="space-y-3.5">
              {[
                {
                  title: "Farm-to-Table Freshness",
                  desc: "Fresh vegetable harvests, high quality poultry, beef, and local grains.",
                },
                {
                  title: "Kenyan & Continental Specialties",
                  desc: "Authentic choma platters, ugali with traditional greens, pilau, pastas, and savory snacks.",
                },
                {
                  title: "Warm & Welcoming Dining Hall",
                  desc: "Spacious seating suitable for private couple meals, business talks, or family celebrations.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-maroon text-brand-amber flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-maroon-dark">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/book"
                className="bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow"
              >
                Reserve a Table
              </Link>
              <a
                href={`tel:${BRAND.phone}`}
                className="border border-brand-maroon text-brand-maroon px-6 py-3 rounded-full text-xs font-semibold hover:bg-brand-amber-light transition-colors flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" /> Order Ahead: {BRAND.phone}
              </a>
            </div>
          </div>

          {/* Image Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-md border-2 border-brand-amber-light">
                <Image
                  src={IMAGES.restaurantHall}
                  alt="Dining Hall Ambiance"
                  width={450}
                  height={280}
                  className="w-full h-56 object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md border-2 border-brand-amber-light">
                <Image
                  src={IMAGES.diningFood}
                  alt="Delightful Food Dishes"
                  width={450}
                  height={220}
                  className="w-full h-44 object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="rounded-2xl overflow-hidden shadow-md border-2 border-brand-amber-light">
                <Image
                  src={IMAGES.kenyanBuffet}
                  alt="Kenyan Buffet Spread"
                  width={450}
                  height={220}
                  className="w-full h-44 object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="bg-brand-maroon-dark rounded-2xl p-5 text-white border-2 border-brand-amber flex flex-col justify-center">
                <span className="text-brand-amber-light font-serif font-bold text-lg">
                  Daily Specials
                </span>
                <p className="text-xs text-brand-amber-light/80 mt-1">
                  Ask our head chef for seasonal Pokot farm favorites and fresh
                  breakfast spreads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
