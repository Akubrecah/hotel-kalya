"use client";

import React, { useState } from "react";
import { MapPin, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";
import { BRAND } from "@/lib/constants";

interface GoogleMapProps {
  height?: string;
  zoom?: number;
  showCard?: boolean;
}

export function GoogleMap({ height = "450px", zoom = 15, showCard = true }: GoogleMapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Exact coordinates for Kapenguria town center / Makutano Junction, West Pokot County
  const lat = 1.2415;
  const lng = 35.1185;

  // Google Maps standard embed URL (works out of the box with zero required billing keys for standard viewport)
  // Optional NEXT_PUBLIC_GOOGLE_MAPS_API_KEY can be provided in .env
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const embedUrl = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=Hotel+Kalya,Kapenguria,Kenya&center=${lat},${lng}&zoom=${zoom}`
    : `https://maps.google.com/maps?q=${lat},${lng}+(Hotel+Kalya+Kapenguria)&t=&z=${zoom}&ie=UTF8&iwloc=B&output=embed`;

  const directMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Hotel Kalya, Kapenguria, West Pokot County, Kenya"
  )}`;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-brand-maroon/15 bg-brand-cream/60">
      {/* Loading Skeleton */}
      {isLoading && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-brand-cream/90 backdrop-blur-sm transition-opacity duration-300"
          style={{ height }}
        >
          <div className="w-12 h-12 rounded-full border-4 border-brand-amber/30 border-t-brand-maroon animate-spin mb-3" />
          <p className="text-xs font-bold text-brand-maroon uppercase tracking-wider">
            Loading Kapenguria Map...
          </p>
          <p className="text-[11px] text-brand-dark/60 mt-1">Connecting to Google Maps</p>
        </div>
      )}

      {/* Error Fallback */}
      {hasError ? (
        <div
          className="flex flex-col items-center justify-center p-8 text-center bg-brand-cream/80"
          style={{ height }}
        >
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-brand-maroon text-base mb-1">
            Unable to display embedded map
          </h3>
          <p className="text-xs text-brand-dark/70 max-w-md mb-4">
            The interactive map could not be rendered directly in this viewport. You can launch Google Maps directly on your device.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-brand-maroon/20 text-xs font-bold text-brand-maroon hover:bg-brand-cream transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <a
              href={directMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-maroon text-white text-xs font-bold hover:bg-brand-maroon-dark transition-colors shadow"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-amber" />
              <span>Open in Google Maps</span>
            </a>
          </div>
        </div>
      ) : (
        <iframe
          title="Hotel Kalya Kapenguria Google Maps Location"
          src={embedUrl}
          width="100%"
          height={height}
          style={{ border: 0, minHeight: height }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className="w-full h-full block"
        />
      )}

      {/* Floating Property Location Card (Optional overlay) */}
      {showCard && !hasError && (
        <div className="hidden sm:block absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-brand-maroon/10 max-w-xs">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-brand-amber/20 text-brand-maroon mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif font-black text-sm text-brand-maroon">{BRAND.name}</h4>
              <p className="text-[11px] text-brand-dark/70 leading-snug mt-0.5">{BRAND.location}</p>
              <a
                href={directMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-amber-dark hover:underline mt-2"
              >
                <span>View Full Map & Photos</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
