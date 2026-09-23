import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, CheckCircle2, Utensils, Clock, ChevronRight, Sparkles } from "lucide-react";
import { BRAND, IMAGES } from "@/lib/constants";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Food Service & Dining — Restaurant, Farm-Fresh Kenyan & Continental Cuisine",
  description:
    "Experience farm-to-table Kenyan culinary excellence at Hotel Kalya's dining hall in Kapenguria. Hearty breakfasts, grilled Nyama Choma, local West Pokot dishes, and refreshing drinks.",
  openGraph: {
    title: "Dining & Food Service | Hotel Kalya Kapenguria",
    description:
      "Farm-fresh dining at Hotel Kalya in Kapenguria. Open daily from 6:30 AM to 10:00 PM. A la carte menus, buffets, and private dining.",
    images: [IMAGES.diningFood],
  },
};

const MENU_HIGHLIGHTS = [
  {
    category: "Breakfast Classics",
    desc: "Energize your morning with freshly brewed Kenyan mountain tea, farm eggs, and oven-fresh pastries.",
    items: [
      "Mountain Tea & Fresh Mandazi",
      "Eggs to Order with Toast & Sausage",
      "Fresh Tropical Fruit Platter",
      "Traditional Porridge & Layered Chapati",
    ],
  },
  {
    category: "Lunch & Dinner Favorites",
    desc: "Hearty, nourishing meals prepared with fresh ingredients sourced from surrounding West Pokot farms.",
    items: [
      "Nyama Choma (Char-Grilled Beef / Goat)",
      "Traditional Ugali with Sukuma Wiki & Managu",
      "Kienyeji Chicken Stew with Spiced Pilau",
      "Continental Pastas, Steaks & Fresh Garden Salads",
    ],
  },
  {
    category: "Beverages, Desserts & Extras",
    desc: "Refreshing cold and hot beverages to accompany your meal or business conversation.",
    items: [
      "Kenyan Highland Coffee & Masala Tea",
      "Freshly Squeezed Passion & Mango Juices",
      "Chilled Soft Drinks & Mineral Water",
      "Crispy Beef & Vegetable Samosas",
    ],
  },
];

const DINING_EXPERIENCES = [
  {
    title: "Main Restaurant Hall",
    desc: "Spacious, well-ventilated indoor dining hall suited for hotel guests, traveling road executives, and corporate delegations.",
  },
  {
    title: "Terrace & Garden Dining",
    desc: "Dine al fresco amidst the manicured tropical grounds of Kalya Gardens under the cool Kapenguria hill breezes.",
  },
  {
    title: "Express Takeaways",
    desc: "Quick, hygienic takeaway packaging for travelers en route to Kitale, Marich Pass, or Lodwar.",
  },
];

export default function FoodServicePage() {
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
            <Utensils className="w-4 h-4" /> Culinary Excellence
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Food Service & Dining
          </h1>
          <p className="text-white/80 text-sm mt-2 max-w-xl">
            Farm-to-table freshness, Kenyan culinary heritage, and heartwarming
            hospitality in every dish served in Kapenguria.
          </p>
        </div>
      </section>

      {/* Breadcrumbs Strip */}
      <section className="bg-brand-cream border-b border-brand-amber-light/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Services", href: "/services" },
              { label: "Food Service & Dining" },
            ]}
          />
        </div>
      </section>

      {/* Operating Hours Strip */}
      <section className="bg-brand-amber py-3.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6 text-xs sm:text-sm font-bold text-brand-maroon-dark">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Restaurant Hours: {BRAND.operatingHours.restaurant} Daily</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Breakfast • Lunch • Dinner • Afternoon Tea</span>
        </div>
      </section>

      {/* Menu Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
              From Our Kitchen
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-maroon-dark mt-1">
              Menu Highlights & Culinary Traditions
            </h2>
            <div className="w-16 h-1 bg-brand-amber mx-auto my-3 rounded-full" />
            <p className="text-sm text-gray-600">
              Our chefs take pride in crafting nutritious, flavorful meals using locally harvested produce, free-range poultry, and tender cuts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {MENU_HIGHLIGHTS.map((menu) => (
              <div
                key={menu.category}
                className="bg-brand-cream/60 rounded-3xl p-8 border-2 border-brand-amber-light flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-brand-maroon text-brand-amber flex items-center justify-center mb-4 shadow">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-brand-maroon-dark mb-2">
                    {menu.category}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-6">
                    {menu.desc}
                  </p>

                  <div className="space-y-3">
                    {menu.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-800 bg-white p-3 rounded-xl border border-brand-amber-light/70 shadow-2xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-brand-amber flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-brand-amber-light text-center">
                  <span className="text-[11px] font-bold text-brand-maroon uppercase tracking-wider">
                    Available A La Carte & Buffet
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dining Experiences */}
      <section className="py-16 bg-brand-cream/50 border-t border-brand-amber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-amber" /> Atmosphere
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon-dark mt-1">
              Dining Spaces & Service Options
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DINING_EXPERIENCES.map((exp) => (
              <div
                key={exp.title}
                className="bg-white p-7 rounded-2xl border border-brand-amber-light shadow-sm space-y-3"
              >
                <h4 className="font-serif font-bold text-lg text-brand-maroon-dark">
                  {exp.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {exp.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="text-center mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/book?service=Food%20Service"
              className="bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow transition-all flex items-center gap-2"
            >
              <span>Reserve a Table</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <a
              href={`tel:${BRAND.phone}`}
              className="border border-brand-maroon text-brand-maroon px-6 py-3.5 rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-brand-amber-light transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> Call Restaurant: {BRAND.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
