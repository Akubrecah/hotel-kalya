"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, Sparkles, ArrowRight, X } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { getStandardWhatsAppUrl } from "@/lib/whatsapp";
import { Announcement, HotelSettings } from "@/types/hospitality";


export function TopBar() {
  const [settings, setSettings] = useState<HotelSettings | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, annRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/announcements?published=true"),
        ]);

        if (settingsRes.ok) {
          const sData = await settingsRes.json();
          if (sData.settings) setSettings(sData.settings);
        }

        if (annRes.ok) {
          const aData = await annRes.json();
          if (aData.announcements && Array.isArray(aData.announcements)) {
            // Find active announcement
            const now = new Date();
            const active = aData.announcements.filter((a: Announcement) => {
              if (a.publishStatus !== "published" || !a.active) return false;
              if (a.startDate && new Date(a.startDate) > now) return false;
              if (a.endDate && new Date(a.endDate) < now) return false;
              return true;
            });
            setAnnouncements(active);
          }
        }
      } catch {
        // Fallback to static defaults
      }
    }

    loadData();
  }, []);

  const phone = settings?.phone || BRAND.phone;
  const email = settings?.email || BRAND.email;
  const location = settings?.address || BRAND.location;
  const whatsAppNumber = (settings?.officialWhatsApp || settings?.phone || BRAND.phoneClean).replace(/\D/g, "");

  const activePromo = announcements.length > 0 ? announcements[0] : null;

  return (
    <>
      {/* Promotional Top Banner (if active) */}
      {activePromo && !bannerDismissed && (
        <div className="w-full bg-brand-amber text-brand-maroon-dark text-xs font-bold py-1.5 px-4 shadow-sm border-b border-brand-amber-dark/20 relative z-50 overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 overflow-hidden mx-auto min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-brand-maroon flex-shrink-0 animate-pulse" />
              <span className="truncate text-[11px] sm:text-xs">{activePromo.message}</span>
              {activePromo.ctaLink && (
                <Link
                  href={activePromo.ctaLink}
                  className="underline hover:text-brand-maroon flex items-center gap-1 font-extrabold whitespace-nowrap ml-1 text-[11px] sm:text-xs"
                >
                  <span>{activePromo.ctaText || "Learn More"}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
            <button
              onClick={() => setBannerDismissed(true)}
              className="text-brand-maroon-dark/60 hover:text-brand-maroon-dark p-0.5 flex-shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Top Bar */}
      <div
        role="region"
        aria-label="Quick Contacts & Destination Info"
        className="w-full bg-brand-maroon-dark text-white/90 text-xs border-b border-brand-amber/30 relative z-40 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row justify-between items-center gap-2">
          {/* Left: Contact Info */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center sm:justify-start text-center sm:text-left">
            <span className="flex items-center gap-1.5 text-brand-amber-light font-medium whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5 text-brand-amber flex-shrink-0" />
              <span>{location}</span>
            </span>
            <span className="hidden md:inline text-white/40">•</span>
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-1.5 hover:text-brand-amber transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-brand-amber flex-shrink-0" />
              <span>Cell: {phone}</span>
            </a>
            <span className="hidden md:inline text-white/40">•</span>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 hover:text-brand-amber transition-colors whitespace-nowrap"
            >
              <Mail className="w-3.5 h-3.5 text-brand-amber flex-shrink-0" />
              <span>{email}</span>
            </a>
          </div>

          {/* Right: Staff Portal link + Destination badge + WhatsApp */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-end">
            <Link
              href="/staff/dashboard"
              className="hidden sm:inline-flex items-center gap-1 text-[11px] text-brand-amber-light hover:text-brand-amber font-semibold transition-colors whitespace-nowrap"
            >
              <ShieldCheck className="w-3 h-3 text-brand-amber flex-shrink-0" />
              <span>Staff Portal</span>
            </Link>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="bg-brand-amber text-brand-maroon-dark px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase whitespace-nowrap">
              Kapenguria Destination
            </span>
            <a
              href={getStandardWhatsAppUrl(
                "Hello Hotel Kalya, I would like to enquire about your services.",
                whatsAppNumber
              )}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact Hotel Kalya via WhatsApp"
              className="inline-flex items-center gap-1 text-brand-amber hover:text-white transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

