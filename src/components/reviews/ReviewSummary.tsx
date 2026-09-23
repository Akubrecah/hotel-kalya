import React from "react";
import { ShieldCheck, MapPin, ExternalLink } from "lucide-react";

export function ReviewSummary() {
  const googleSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Hotel Kalya, Kapenguria, West Pokot County, Kenya"
  )}`;

  return (
    <div className="bg-brand-cream/80 border border-brand-maroon/10 rounded-2xl p-6 sm:p-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border border-brand-maroon/15 flex items-center justify-center shadow-sm">
            <span className="font-serif font-black text-xl text-brand-maroon">G</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-serif font-bold text-base text-brand-maroon">
                Google Business Profile
              </h4>
              <span title="Verified Property Listing">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </span>
            </div>
            <p className="text-xs text-brand-dark/70 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-brand-amber-dark" />
              <span>Kapenguria, West Pokot County, Kenya</span>
            </p>
          </div>
        </div>

        <a
          href={googleSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-brand-maroon/20 text-xs font-bold text-brand-maroon hover:bg-brand-cream transition-colors self-start sm:self-center shadow-sm"
        >
          <span>View Verified Listing</span>
          <ExternalLink className="w-3.5 h-3.5 text-brand-amber-dark" />
        </a>
      </div>

      <p className="text-xs text-brand-dark/75 leading-relaxed pt-1">
        We value complete transparency and guest trust. Hotel Kalya does not fabricate testimonials or star counts. Real ratings and comments are published directly by visitors on our official Google Business presence.
      </p>
    </div>
  );
}
