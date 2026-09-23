"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone, ChevronRight } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { NAV_LINKS, BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 w-full z-30 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2.5"
          : "bg-white py-4 border-b border-brand-amber-light"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center focus:outline-none" aria-label="Hotel Kalya Home">
          <BrandLogo />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-brand-maroon-dark">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-brand-amber transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Quick CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/book"
            className="bg-brand-maroon hover:bg-brand-maroon-dark text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow transition-all flex items-center gap-2 group"
          >
            <span>Book / Enquire</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-brand-maroon hover:bg-brand-amber-light/50 rounded-lg focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-brand-amber-light/60 px-6 py-5 shadow-xl">
          <div className="flex flex-col space-y-3.5 text-base font-semibold text-brand-maroon-dark">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-left py-1 hover:text-brand-amber"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-brand-amber-light flex flex-col gap-2">
              <Link
                href="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-brand-maroon text-white py-3 rounded-lg text-center font-bold tracking-wider uppercase text-xs shadow"
              >
                Book / Make Enquiry
              </Link>
              <a
                href={`tel:${BRAND.phone}`}
                className="w-full border border-brand-maroon text-brand-maroon py-2.5 rounded-lg text-center font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" /> Call: {BRAND.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
