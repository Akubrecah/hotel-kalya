"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Phone, Mail, MapPin, MessageCircle, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { BRAND, NAV_LINKS, LEGAL_LINKS } from "@/lib/constants";
import { getStandardWhatsAppUrl } from "@/lib/whatsapp";
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
  const location = settings?.address || BRAND.address || BRAND.location;
  const whatsAppNumber = (settings?.officialWhatsApp || settings?.phone || BRAND.phoneClean).replace(/\D/g, "");

  return (
    <footer className="bg-brand-maroon-dark text-white pt-16 pb-12 border-t-4 border-brand-amber select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand & About Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo light />
            <p className="text-xs text-white/75 leading-relaxed pt-2">
              Kapenguria&apos;s distinguished destination for executive
              accommodation, culinary excellence, professional conferences,
              outside catering, and garden tranquility.
            </p>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-brand-amber block mb-2.5">
                Connect With Us
              </span>
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <a
                  href={BRAND.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hotel Kalya on Facebook"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-amber hover:text-brand-maroon-dark text-white flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href={BRAND.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hotel Kalya on Instagram"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-amber hover:text-brand-maroon-dark text-white flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href={BRAND.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hotel Kalya on X / Twitter"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-amber hover:text-brand-maroon-dark text-white flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* WhatsApp Direct */}
                <a
                  href={getStandardWhatsAppUrl("Hello Hotel Kalya Front Desk, I am reaching out from your website.", whatsAppNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with Hotel Kalya on WhatsApp"
                  className="w-9 h-9 rounded-full bg-emerald-600/80 hover:bg-emerald-500 text-white flex items-center justify-center transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold text-brand-amber uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand-amber transition-colors">
                    {link.label === "Stay"
                      ? "Rooms & Suites"
                      : link.label === "Dining"
                      ? "Restaurant & Menu"
                      : link.label === "Events & Services"
                      ? "Services & Events"
                      : link.label === "Explore"
                      ? "About & Gallery"
                      : link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/template" className="inline-flex items-center gap-1 text-brand-amber hover:underline font-bold">
                  <Sparkles className="w-3 h-3 text-brand-amber" />
                  <span>Client Template Pack</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
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

          {/* Direct Contacts & Hours (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-brand-amber uppercase tracking-wider">
              Contact &amp; Desk
            </h4>
            <div className="space-y-2.5 text-xs text-white/80">
              <p className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-amber flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white block">Call Desk:</strong>
                  <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-brand-amber transition-colors">
                    {phone}
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white block">WhatsApp Direct:</strong>
                  <a
                    href={getStandardWhatsAppUrl("Hello Hotel Kalya Front Desk, I would like to inquire about booking.", whatsAppNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    +{whatsAppNumber}
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-amber flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white block">Email:</strong>
                  <a href={`mailto:${email}`} className="hover:text-brand-amber transition-colors">
                    {email}
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-amber flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white block">Location:</strong>
                  {location}
                </span>
              </p>
              <div className="pt-2 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-amber flex-shrink-0" />
                <span className="inline-block bg-brand-amber text-brand-maroon-dark text-[10px] font-bold px-2 py-0.5 rounded">
                  Open Daily 24 Hours
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer with Copyright, Legal Links, and Portal Links */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/60 gap-4 text-center md:text-left">
          <p>© {new Date().getFullYear()} Hotel Kalya Kapenguria. All rights reserved.</p>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-brand-amber transition-colors underline-offset-2 hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Portals */}
          <div className="flex items-center gap-4">
            <Link href="/staff/login" className="hover:text-brand-amber transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-amber" />
              <span>Staff Portal</span>
            </Link>
            <span>•</span>
            <Link href="/admin/rooms" className="hover:text-brand-amber transition-colors">
              CMS Console
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
