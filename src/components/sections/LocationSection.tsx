import React from "react";
import Link from "next/link";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import { GoogleMap } from "@/components/maps/GoogleMap";
import { DirectionsButton } from "@/components/maps/DirectionsButton";
import { getHotelSettings } from "@/lib/cms-db";
import { BRAND } from "@/lib/constants";

export async function LocationSection() {
  const settings = await getHotelSettings();
  const address = settings.address || BRAND.location;
  const officialPhone = settings.phone || BRAND.phone;
  const cleanPhone = (settings.phoneClean || settings.phone || BRAND.phoneClean).replace(/\D/g, "");

  return (
    <section className="py-16 sm:py-20 bg-brand-cream/60 border-t border-brand-maroon/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Location Content */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/20 text-brand-maroon text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-brand-amber-dark" />
              <span>Visit Hotel Kalya</span>
            </div>

            <h2 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-brand-maroon leading-tight">
              Conveniently Located in Kapenguria, West Pokot
            </h2>

            <p className="text-xs sm:text-sm text-brand-dark/80 leading-relaxed">
              Situated right along the primary Kitale–Lodwar Highway corridor, Hotel Kalya offers swift, secure access whether you are traveling for business, hosting county summits, or seeking a quiet retreat in the scenic North Rift highlands.
            </p>

            <div className="space-y-3 text-xs text-brand-dark/80 bg-white p-4 rounded-xl border border-brand-maroon/10 shadow-sm">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-brand-amber flex-shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-amber flex-shrink-0" />
                <span>Front Desk: 24/7 • Restaurant: 6:30 AM – 10:00 PM</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-amber flex-shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-brand-maroon font-bold">
                  {officialPhone}
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <DirectionsButton size="md" variant="primary" />
              <Link
                href="/location"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-brand-maroon/20 text-xs font-bold text-brand-maroon hover:bg-brand-cream transition-colors"
              >
                <span>Full Transit Guide &amp; Landmarks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Interactive Map Preview */}
          <div className="lg:col-span-7">
            <GoogleMap height="360px" zoom={14} showCard={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
