"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { BRAND, NAV_LINKS } from "@/lib/constants";
import { HotelSettings } from "@/types/hospitality";

const FOOTER_SERVICES = [
  { label: "Executive Accommodation", href: "/services/accommodation" },
  { label: "Restaurant & Food Service", href: "/menu" },
  { label: "Conference & Seminar Halls", href: "/services/conferences" },
  { label: "Outside Event Catering", href: "/services/outside-catering" },
  { label: "AirBnB Short-Stays", href: "/services/airbnb" },
  { label: "Kalya Garden Experience", href: "/services/garden-experience" },
  { label: "Packages & Special Offers", href: "/offers" },
];

export function Footer() {
  const [settings, setSettings] = useState<HotelSettings | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const phone = settings?.phone || BRAND.phone;
  const email = settings?.email || BRAND.email;
  const location = settings?.address || BRAND.location;

  return (
    <footer className="bg-brand-maroon-dark text-white pt-16 pb-8 border-t-4 border-brand-amber">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand column */}
          <div className="space-y-4">
            <BrandLogo light />
            <p className="text-xs text-white/75 leading-relaxed pt-2">
              Kapenguria&apos;s distinguished destination for executive
              accommodation, culinary excellence, professional conferences,
              outside catering, and garden tranquility.
            </p>
            <div className="text-xs text-brand-amber-light font-serif italic">
              &ldquo;Hospitality Redefined&rdquo;
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-brand-amber uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand-amber transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brochure Services */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-brand-amber uppercase tracking-wider">
              Featured Services
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              {FOOTER_SERVICES.map((svc) => (
                <li key={svc.label}>
                  <Link
                    href={svc.href}
                    className="flex items-center gap-1.5 hover:text-brand-amber transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 text-brand-amber flex-shrink-0" />
                    <span>{svc.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Contacts */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-brand-amber uppercase tracking-wider">
              Contact &amp; Desk
            </h4>
            <div className="space-y-2.5 text-xs text-white/80">
              <p>
                <strong className="text-white block">Cell / Telephone:</strong>
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-brand-amber">
                  {phone}
                </a>
              </p>
              <p>
                <strong className="text-white block">Email:</strong>
                <a href={`mailto:${email}`} className="hover:text-brand-amber">
                  {email}
                </a>
              </p>
              <p>
                <strong className="text-white block">Town / Location:</strong>
                {location}
              </p>
              <div className="pt-2">
                <span className="inline-block bg-brand-amber text-brand-maroon-dark text-[10px] font-bold px-2 py-0.5 rounded">
                  Open Daily 24 Hours
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Hotel Kalya Kapenguria. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/staff/login" className="hover:text-brand-amber transition-colors">
              Staff Portal
            </Link>
            <span>•</span>
            <Link href="/admin/rooms" className="hover:text-brand-amber transition-colors">
              CMS Management
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
