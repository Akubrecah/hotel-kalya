import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Car,
  Plane,
  Compass,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GoogleMap } from "@/components/maps/GoogleMap";
import { LocationCard } from "@/components/maps/LocationCard";
import { DirectionsButton } from "@/components/maps/DirectionsButton";

export const metadata: Metadata = {
  title: "Location & Directions — How to Find Hotel Kalya in Kapenguria, West Pokot",
  description:
    "Find Hotel Kalya along the Kitale-Lodwar Highway in Kapenguria, West Pokot County, Kenya. Interactive Google Map, GPS coordinates, driving directions from Kitale and Eldoret Airport.",
  openGraph: {
    title: "Location & Driving Directions | Hotel Kalya Kapenguria",
    description:
      "Visit Hotel Kalya in Kapenguria, West Pokot. Turn-by-turn navigation via Google Maps, parking information, and travel transit distances.",
  },
};

const TRAVEL_ROUTES = [
  {
    title: "From Kitale Town & Airstrip",
    distance: "42 Kilometers",
    time: "Approx. 45 – 50 Minutes",
    icon: Car,
    directions:
      "Travel north along the smooth A1 tarmac highway towards Lodwar. Pass through Makutano Junction; Hotel Kalya is conveniently situated right on the main access corridor with prominent brand signage.",
  },
  {
    title: "From Eldoret International Airport (EDL)",
    distance: "105 Kilometers",
    time: "Approx. 1 Hour 50 Minutes",
    icon: Plane,
    directions:
      "Take the Eldoret–Kitale highway through Moi's Bridge to Kitale, then proceed on the A1 towards Kapenguria. Airport taxi transfers and private hotel shuttles can be arranged with our front desk upon prior reservation.",
  },
  {
    title: "From Lodwar / Turkana County",
    distance: "285 Kilometers",
    time: "Approx. 4.5 Hours",
    icon: Compass,
    directions:
      "Head south on the A1 highway through Marich Pass and Chepareria into Kapenguria. Hotel Kalya provides the ideal safe, secure rest stop and executive lodging after the North Rift highway journey.",
  },
];

const NEARBY_ATTRACTIONS = [
  {
    name: "Kapenguria Heroes Museum",
    dist: "3.5 km (8 mins)",
    desc: "Historic national site where Kenya's founding fathers (Kapenguria Six including Mzee Jomo Kenyatta) were tried.",
  },
  {
    name: "Makutano Commercial Center",
    dist: "1.2 km (3 mins)",
    desc: "Vibrant business hub with commercial banking halls, county offices, pharmacies, and supermarkets.",
  },
  {
    name: "Cherangani Hills & Escarpment",
    dist: "18 km (25 mins)",
    desc: "Breathtaking highland ridges, indigenous forests, cool mountain air, and premier birdwatching vantage points.",
  },
  {
    name: "Tartar Falls & River Gorge",
    dist: "12 km (18 mins)",
    desc: "Scenic natural waterfalls and lush hiking trails nestled in the surrounding valleys of West Pokot.",
  },
];

export default function LocationPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Location & Directions" },
        ]}
      />

      {/* Hero Header */}
      <section className="bg-brand-cream/80 py-12 lg:py-16 border-b border-brand-maroon/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/20 text-brand-maroon text-xs font-bold uppercase tracking-wider mb-3">
              <MapPin className="w-3.5 h-3.5 text-brand-amber-dark" />
              <span>Kapenguria, West Pokot County</span>
            </div>
            <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-brand-maroon leading-tight">
              Location &amp; Driving Directions
            </h1>
            <p className="mt-4 text-base sm:text-lg text-brand-dark/80 leading-relaxed">
              Hotel Kalya welcomes you to Kapenguria. Positioned right on the primary northern transit corridor, our property pairs peaceful highland tranquility with instant highway convenience.
            </p>
          </div>
        </div>
      </section>

      {/* Main Interactive Map & Details Section */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Interactive Map (8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <h2 className="font-serif font-bold text-xl text-brand-maroon">
                    Interactive Map of Hotel Kalya
                  </h2>
                  <p className="text-xs text-brand-dark/70">
                    Use touch or mouse gestures to pan, zoom, and inspect nearby access roads.
                  </p>
                </div>
                <DirectionsButton size="sm" variant="secondary" />
              </div>

              {/* Embed Map Component */}
              <GoogleMap height="500px" zoom={15} showCard={true} />

              <div className="flex items-center justify-between text-[11px] text-brand-dark/60 pt-2 px-1">
                <span>Coordinates: 1.2415° N, 35.1185° E</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    "Hotel Kalya, Kapenguria, Kenya"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand-maroon font-bold hover:underline"
                >
                  <span>Open Full Screen Map</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Location Card & Desk Contacts (5 cols) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <LocationCard />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Transit Routes */}
      <section className="py-12 bg-brand-cream/50 border-y border-brand-maroon/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-amber font-sans">
              Travel Directions
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-brand-maroon mt-1">
              How to Reach Hotel Kalya
            </h2>
            <p className="text-xs sm:text-sm text-brand-dark/70 mt-2">
              Well-connected by tarmac highways, public transit matatus, and airport transfers from Kitale and Eldoret.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRAVEL_ROUTES.map((route) => {
              const IconComp = route.icon;
              return (
                <div
                  key={route.title}
                  className="bg-white rounded-xl p-6 shadow-md border border-brand-maroon/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-brand-maroon text-brand-amber flex items-center justify-center mb-4">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-base text-brand-maroon mb-1">
                      {route.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-amber-dark mb-3">
                      <span>{route.distance}</span>
                      <span>•</span>
                      <span>{route.time}</span>
                    </div>
                    <p className="text-xs text-brand-dark/75 leading-relaxed">
                      {route.directions}
                    </p>
                  </div>
                  <div className="pt-5 mt-4 border-t border-brand-cream">
                    <DirectionsButton variant="outline" size="sm" className="w-full">
                      Navigate This Route
                    </DirectionsButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nearby Regional Attractions */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-amber font-sans">
                Explore West Pokot
              </span>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-brand-maroon mt-1">
                Nearby Landmarks &amp; Attractions
              </h2>
            </div>
            <Link
              href="/services/garden-experience"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-maroon hover:text-brand-amber-dark transition-colors"
            >
              <span>Explore Kalya Gardens &amp; Grounds</span>
              <ChevronRight className="w-4 h-4 text-brand-amber" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {NEARBY_ATTRACTIONS.map((attraction) => (
              <div
                key={attraction.name}
                className="bg-brand-cream/40 rounded-xl p-5 border border-brand-maroon/10 hover:border-brand-amber transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-amber/20 text-brand-maroon">
                    {attraction.dist}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-brand-maroon mb-1">
                  {attraction.name}
                </h4>
                <p className="text-xs text-brand-dark/70 leading-relaxed">
                  {attraction.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
