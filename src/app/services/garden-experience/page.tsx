import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Trees,
  Camera,
  Utensils,
  PartyPopper,
  Sparkles,
  ChevronRight,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { IMAGES } from "@/lib/constants";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getGardens, getHotelSettings } from "@/lib/cms-db";

export const dynamic = "force-dynamic";

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

export default async function GardenExperiencePage() {
  const [gardens, settings] = await Promise.all([
    getGardens(true),
    getHotelSettings(),
  ]);

  const cleanPhone = (settings.officialWhatsApp || settings.phone || "254719766649").replace(/\D/g, "");

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
            Garden Experience &amp; Venues
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

      {/* DYNAMIC GARDENS SHOWCASE FROM CMS */}
      <section className="py-20 bg-brand-cream/40 border-t border-brand-amber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
              Available Garden Venues
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-maroon-dark mt-1">
              Select Your Ideal Garden Space
            </h2>
            <div className="w-16 h-1 bg-brand-amber mx-auto my-3 rounded-full" />
            <p className="text-sm text-gray-600">
              Every garden space is maintained to the highest horticultural standards and dynamically scheduled for private celebrations, dining, or photo sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gardens.map((garden) => {
              const waMsg = encodeURIComponent(
                `Hello Hotel Kalya, I would like to enquire about reserving the "${garden.name}" for an upcoming event or visit.`
              );
              const waUrl = `https://wa.me/${cleanPhone}?text=${waMsg}`;

              return (
                <div
                  key={garden.id}
                  className="bg-white rounded-3xl overflow-hidden border border-brand-amber-light/90 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Garden Image */}
                    <div className="relative h-60 w-full overflow-hidden bg-brand-cream">
                      <Image
                        src={garden.featuredImage || garden.images?.[0] || IMAGES.gardenLandscape}
                        alt={garden.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                      <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                        <span className="bg-brand-maroon-dark/90 text-brand-amber text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow backdrop-blur-sm flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>
                            {garden.capacity?.maxGuests
                              ? `Up to ${garden.capacity.maxGuests} Guests`
                              : "Multi-Guest Capacity"}
                          </span>
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="font-serif text-xl font-bold text-white drop-shadow">
                          {garden.name}
                        </h3>
                        <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-brand-amber" />
                          <span>{garden.location || "Hotel Kalya Grounds, Kapenguria"}</span>
                        </p>
                      </div>
                    </div>

                    {/* Garden Details */}
                    <div className="p-6 space-y-4">
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                        {garden.description}
                      </p>

                      {/* Suitability Pills */}
                      {garden.eventSuitability && garden.eventSuitability.length > 0 && (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">
                            Ideal For:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {garden.eventSuitability.slice(0, 4).map((suit, idx) => (
                              <span
                                key={idx}
                                className="bg-brand-cream text-brand-maroon-dark text-[10px] font-semibold px-2 py-0.5 rounded-md border border-brand-amber/20"
                              >
                                {suit}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Facilities Checklist */}
                      {garden.facilities && garden.facilities.length > 0 && (
                        <div className="pt-2 border-t border-gray-100">
                          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">
                            Features &amp; Facilities:
                          </span>
                          <div className="grid grid-cols-2 gap-1.5 text-[11px] text-gray-600">
                            {garden.facilities.slice(0, 4).map((facility, idx) => (
                              <div key={idx} className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3 h-3 text-brand-amber-dark flex-shrink-0" />
                                <span className="truncate">{facility}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="p-6 pt-0 border-t border-gray-100 mt-2">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-gray-400 block">
                          Day Rate
                        </span>
                        <span className="font-serif text-lg font-bold text-brand-maroon">
                          KES {garden.pricing?.perDay ? garden.pricing.perDay.toLocaleString() : "Custom"}
                        </span>
                      </div>
                      {garden.pricing?.photographySession ? (
                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase text-gray-400 block">
                            Photo Shoot Rate
                          </span>
                          <span className="text-xs font-bold text-gray-700">
                            KES {garden.pricing.photographySession.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <div className="text-right text-[11px] text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand-amber" />
                          <span>{garden.openingHours || "6:00 AM – 7:00 PM"}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Link
                        href={`/book?service=${encodeURIComponent(garden.name)}`}
                        className="flex-1 text-center bg-brand-maroon hover:bg-brand-maroon-dark text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                      >
                        Book Garden
                      </Link>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm flex items-center justify-center"
                        title="Enquire on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Garden Uses Cards */}
      <section className="py-16 sm:py-20 bg-white border-t border-brand-amber-light">
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
                  className="bg-brand-cream/40 p-7 rounded-2xl border border-brand-amber-light/80 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
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
    </>
  );
}
