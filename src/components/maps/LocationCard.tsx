import React from "react";
import { MapPin, Phone, Mail, Clock, Compass, ShieldCheck } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { DirectionsButton } from "./DirectionsButton";

export function LocationCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-brand-maroon/10 p-6 sm:p-8 space-y-6">
      <div className="border-b border-brand-cream pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/15 text-brand-maroon text-xs font-bold uppercase tracking-wider mb-2">
          <MapPin className="w-3.5 h-3.5 text-brand-amber-dark" />
          <span>Prime West Pokot Highway Location</span>
        </div>
        <h3 className="font-serif font-black text-2xl text-brand-maroon">
          {BRAND.name}
        </h3>
        <p className="text-sm text-brand-dark/70 mt-1 leading-relaxed">
          Conveniently located along the Kitale–Lodwar Highway in Kapenguria town, West Pokot County.
        </p>
      </div>

      <div className="space-y-4 text-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-brand-cream text-brand-maroon mt-0.5">
            <Compass className="w-4 h-4 text-brand-amber" />
          </div>
          <div>
            <span className="font-bold text-brand-maroon block">Physical Address</span>
            <span className="text-brand-dark/80">
              Kapenguria Town (near Makutano Junction), West Pokot County, Kenya
            </span>
            <span className="text-[11px] text-brand-dark/60 block mt-0.5 font-mono">
              Coordinates: 1.2415° N, 35.1185° E
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-brand-cream text-brand-maroon mt-0.5">
            <Clock className="w-4 h-4 text-brand-amber" />
          </div>
          <div>
            <span className="font-bold text-brand-maroon block">Operating Hours</span>
            <div className="text-brand-dark/80 space-y-0.5 mt-0.5">
              <p>• <strong>Front Desk & Stays:</strong> 24 Hours Daily / 7 Days</p>
              <p>• <strong>Restaurant & Dining:</strong> 6:30 AM – 10:00 PM</p>
              <p>• <strong>Kalya Gardens:</strong> 7:00 AM – 7:00 PM</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-brand-cream text-brand-maroon mt-0.5">
            <Phone className="w-4 h-4 text-brand-amber" />
          </div>
          <div>
            <span className="font-bold text-brand-maroon block">Telephone & Desk Hotline</span>
            <a
              href={`tel:${BRAND.phoneClean}`}
              className="text-brand-maroon font-bold text-sm hover:text-brand-amber-dark transition-colors block mt-0.5"
            >
              {BRAND.phone}
            </a>
            <span className="text-[11px] text-brand-dark/60">WhatsApp & Direct Inquiries</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-brand-cream text-brand-maroon mt-0.5">
            <Mail className="w-4 h-4 text-brand-amber" />
          </div>
          <div>
            <span className="font-bold text-brand-maroon block">Reservations Email</span>
            <a
              href={`mailto:${BRAND.email}`}
              className="text-brand-dark/80 hover:text-brand-maroon transition-colors"
            >
              {BRAND.email}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-brand-cream/60 rounded-xl text-brand-dark/80">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="text-[11px]">Ample secure parking with 24/7 CCTV & perimeter security.</span>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <DirectionsButton className="flex-1" size="lg" />
        <a
          href={`tel:${BRAND.phoneClean}`}
          className="inline-flex items-center justify-center px-4 py-3 border border-brand-maroon/20 rounded-xl text-xs font-bold text-brand-maroon uppercase tracking-wider hover:bg-brand-cream transition-colors"
        >
          Call Desk
        </a>
      </div>
    </div>
  );
}
