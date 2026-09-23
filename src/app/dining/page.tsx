import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, CheckCircle2, Utensils, Clock } from "lucide-react";
import { BRAND, IMAGES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Dining & Restaurant — Farm-Fresh Kenyan & Continental Cuisine",
  description:
    "Experience authentic Kenyan culinary excellence at Hotel Kalya's restaurant in Kapenguria. Fresh farm produce, buffet spreads, and warm hospitality.",
};

const MENU_HIGHLIGHTS = [
  {
    category: "Breakfast Classics",
    items: ["Mountain Tea & Fresh Mandazi", "Eggs to Order with Toast", "Fruit Platter & Freshly Squeezed Juice", "Porridge & Chapati"],
  },
  {
    category: "Lunch / Dinner Favorites",
    items: ["Nyama Choma (Grilled Beef / Goat)", "Ugali with Sukuma Wiki / Managu", "Chicken Stew with Pilau Rice", "Continental Pastas & Salads"],
  },
  {
    category: "Beverages & Extras",
    items: ["Kenyan Tea & Coffee", "Fresh Fruit Juices", "Soft Drinks & Water", "Assorted Snacks & Samosas"],
  },
];

export default function DiningPage() {
  return (
    <>
      {/* Restaurant JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: "Hotel Kalya Restaurant",
            description:
              "Authentic Kenyan and Continental cuisine, farm-fresh ingredients, breakfast spreads, and hearty grilled specials in Kapenguria.",
            image: IMAGES.diningFood,
            telephone: BRAND.phone,
            servesCuisine: ["Kenyan", "African", "Continental", "Barbecue"],
            priceRange: "$$",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Main Highway Corridor",
              addressLocality: "Kapenguria",
              addressRegion: "West Pokot County",
              addressCountry: "KE",
            },
            openingHours: "Mo-Su 06:30-22:00",
          }),
        }}
      />

      {/* Hero Banner */}
      <section className="relative h-72 sm:h-96 bg-brand-maroon-dark">
        <Image
          src={IMAGES.restaurantHall}
          alt="Hotel Kalya Restaurant Dining Hall"
          fill
          className="object-cover opacity-50"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark via-brand-maroon-dark/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <span className="text-brand-amber text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <Utensils className="w-4 h-4" /> Food Service & Restaurant
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Dining at Hotel Kalya
          </h1>
          <p className="text-white/80 text-sm mt-2 max-w-xl">
            Farm-to-table freshness, Kenyan authenticity, and heartwarming
            hospitality in every meal.
          </p>
        </div>
      </section>

      {/* Hours Strip */}
      <section className="bg-brand-amber py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6 text-xs font-bold text-brand-maroon-dark">
          <Clock className="w-4 h-4" />
          <span>Restaurant Open: {BRAND.operatingHours.restaurant}</span>
          <span className="text-brand-maroon/50">•</span>
          <span>Breakfast • Lunch • Dinner • Takeaway</span>
        </div>
      </section>

      {/* Menu Highlights */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
              Our Kitchen Menu
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-maroon-dark mt-2">
              Select Culinary Highlights
            </h2>
            <p className="text-gray-600 text-sm mt-2 max-w-xl mx-auto">
              A taste of what we prepare daily. Full seasonal menus available
              from our kitchen staff.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MENU_HIGHLIGHTS.map((section) => (
              <div
                key={section.category}
                className="bg-brand-cream rounded-2xl p-6 border border-brand-amber-light"
              >
                <h3 className="font-serif text-lg font-bold text-brand-maroon-dark mb-4 border-b border-brand-amber-light pb-2">
                  {section.category}
                </h3>
                <ul className="space-y-2.5">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-amber flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Dining Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              { src: IMAGES.restaurantHall, alt: "Restaurant Interior" },
              { src: IMAGES.diningFood, alt: "Prepared Dishes" },
              { src: IMAGES.kenyanBuffet, alt: "Kenyan Buffet Spread" },
            ].map((img) => (
              <div
                key={img.alt}
                className="rounded-2xl overflow-hidden shadow-md border-2 border-brand-amber-light h-52"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={500}
                  height={300}
                  className="w-full h-full object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/book"
              className="bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow"
            >
              Reserve a Table
            </Link>
            <a
              href={`tel:${BRAND.phone}`}
              className="border border-brand-maroon text-brand-maroon px-6 py-3 rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-brand-amber-light transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> Order: {BRAND.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
