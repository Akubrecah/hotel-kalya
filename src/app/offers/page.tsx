import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Gift,
  Tag,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sparkles,
  MessageCircle,
  Percent,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getOffers, getHotelSettings } from "@/lib/cms-db";
import { IMAGES } from "@/lib/constants";
import { getStandardWhatsAppUrl } from "@/lib/whatsapp";


export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Special Offers & Hospitality Packages — Hotel Kalya Kapenguria",
  description:
    "Discover seasonal accommodation discounts, weekend getaway packages, wedding photography deals, and corporate conference specials at Hotel Kalya.",
  openGraph: {
    title: "Packages & Special Offers | Hotel Kalya Kapenguria",
    description:
      "Exclusive rates and packages for accommodation, garden banquets, dining, and corporate retreats in Kapenguria, West Pokot.",
    images: [IMAGES.heroExterior],
  },
};

export default async function OffersPage() {
  const [offers, settings] = await Promise.all([
    getOffers(true),
    getHotelSettings(),
  ]);

  const cleanPhone = (settings.officialWhatsApp || settings.phone || "254719766649").replace(/\D/g, "");

  return (
    <div className="bg-white min-h-screen pb-24">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Packages & Special Offers" },
        ]}
      />

      {/* Hero Header */}
      <section className="bg-brand-cream/80 py-12 lg:py-16 border-b border-brand-maroon/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/20 text-brand-maroon text-xs font-bold uppercase tracking-wider mb-3">
              <Gift className="w-3.5 h-3.5 text-brand-amber-dark" />
              <span>Exclusive Seasonal Deals &amp; Value Packages</span>
            </div>
            <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-brand-maroon leading-tight">
              Hospitality Packages &amp; Offers
            </h1>
            <p className="mt-4 text-base sm:text-lg text-brand-dark/80 leading-relaxed">
              Take advantage of our curated getaway deals, honeymoon specials, county workshop discounts, and weekend retreat packages.
            </p>
          </div>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {offers.length === 0 ? (
            <div className="text-center py-20 bg-brand-cream/40 rounded-3xl border border-brand-maroon/10 p-8 max-w-xl mx-auto">
              <Gift className="w-12 h-12 text-brand-maroon/40 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-xl text-brand-maroon">No Active Promotional Offers</h3>
              <p className="text-xs text-brand-dark/60 mt-2">
                We are currently preparing new seasonal packages. Please check back shortly or enquire with our front desk for custom group rates.
              </p>
              <Link
                href="/rooms"
                className="mt-6 inline-block bg-brand-maroon hover:bg-brand-maroon-dark text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
              >
                Browse Standard Accommodation
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map((offer) => {
                const waUrl = getStandardWhatsAppUrl(
                  `Hello Hotel Kalya, I would like to redeem or enquire about the "${offer.title}" package.`,
                  cleanPhone
                );


                return (
                  <div
                    key={offer.id}
                    className="bg-white rounded-3xl overflow-hidden border border-brand-amber-light/90 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Banner */}
                      <div className="relative h-60 w-full overflow-hidden bg-brand-cream">
                        <Image
                          src={offer.image || IMAGES.heroExterior}
                          alt={offer.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                          {offer.discountBadge ? (
                            <span className="bg-brand-amber text-brand-maroon-dark font-black text-xs px-3 py-1 rounded-full shadow flex items-center gap-1 uppercase tracking-wider">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{offer.discountBadge}</span>
                            </span>
                          ) : offer.discountPercentage ? (
                            <span className="bg-brand-amber text-brand-maroon-dark font-black text-xs px-3 py-1 rounded-full shadow flex items-center gap-1 uppercase tracking-wider">
                              <Percent className="w-3.5 h-3.5" />
                              <span>Save {offer.discountPercentage}%</span>
                            </span>
                          ) : null}
                          <span className="bg-brand-maroon text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                            {offer.category}
                          </span>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="font-serif text-xl font-bold text-white drop-shadow">
                            {offer.title}
                          </h3>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-6 space-y-4">
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {offer.description}
                        </p>

                        {/* Inclusions */}
                        {offer.inclusions && offer.inclusions.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] uppercase font-bold text-brand-maroon block">
                              What&apos;s Included:
                            </span>
                            <div className="space-y-1 text-xs text-gray-700">
                              {offer.inclusions.map((inc, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-amber-dark flex-shrink-0" />
                                  <span>{inc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Validity Dates */}
                        {offer.validUntil && (
                          <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 text-[11px] text-gray-500">
                            <Calendar className="w-3.5 h-3.5 text-brand-amber" />
                            <span>Valid until: <strong>{new Date(offer.validUntil).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</strong></span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pricing & Actions */}
                    <div className="p-6 pt-0 border-t border-gray-100 mt-2">
                      <div className="flex items-baseline justify-between py-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-gray-400 block">Offer Price</span>
                          <span className="font-serif text-2xl font-black text-brand-maroon">
                            KES {offer.offerPrice.toLocaleString()}
                          </span>
                        </div>
                        {offer.originalPrice && (
                          <div className="text-right">
                            <span className="text-[10px] font-bold uppercase text-gray-400 block">Standard Rate</span>
                            <span className="text-xs text-gray-400 line-through font-semibold">
                              KES {offer.originalPrice.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Link
                          href={`/book?service=${encodeURIComponent(offer.title)}`}
                          className="flex-1 text-center bg-brand-maroon hover:bg-brand-maroon-dark text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                        >
                          Book Package
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
          )}
        </div>
      </section>
    </div>
  );
}
