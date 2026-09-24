import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { BRAND } from "@/lib/constants";

export function TopBar() {
  return (
    <header className="w-full bg-brand-maroon-dark text-white/90 text-xs border-b border-brand-amber/30 relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row justify-between items-center gap-2">
        {/* Left: Contact Info */}
        <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
          <span className="flex items-center gap-1.5 text-brand-amber-light font-medium">
            <MapPin className="w-3.5 h-3.5 text-brand-amber" />
            {BRAND.location}
          </span>
          <span className="hidden md:inline text-white/40">•</span>
          <a
            href={`tel:${BRAND.phone}`}
            className="flex items-center gap-1.5 hover:text-brand-amber transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-brand-amber" />
            Cell: {BRAND.phone}
          </a>
          <span className="hidden md:inline text-white/40">•</span>
          <a
            href={`mailto:${BRAND.email}`}
            className="flex items-center gap-1.5 hover:text-brand-amber transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-brand-amber" />
            {BRAND.email}
          </a>
        </div>

        {/* Right: Staff Portal link + Destination badge + WhatsApp */}
        <div className="flex items-center gap-3">
          <Link
            href="/staff/dashboard"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] text-brand-amber-light hover:text-brand-amber font-semibold transition-colors"
          >
            <ShieldCheck className="w-3 h-3 text-brand-amber" />
            <span>Staff Portal</span>
          </Link>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="bg-brand-amber text-brand-maroon-dark px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase">
            Kapenguria Destination
          </span>
          <a
            href={`https://wa.me/${BRAND.phoneClean}?text=Hello%20Hotel%20Kalya,%20I%20would%20like%20to%20enquire%20about%20your%20services.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-brand-amber hover:text-white transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Direct</span>
          </a>
        </div>
      </div>
    </header>
  );
}
