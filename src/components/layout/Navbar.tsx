"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  ChevronRight,
  Bed,
  Utensils,
  Presentation,
  Coffee,
  Sparkles,
  Trees,
  Grid,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { NAV_LINKS, NAV_SERVICES, BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  "/services/accommodation": Bed,
  "/services/food-service": Utensils,
  "/services/conferences": Presentation,
  "/services/outside-catering": Coffee,
  "/services/airbnb": Sparkles,
  "/services/garden-experience": Trees,
};

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Track window scroll for sticky navbar shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  // Handle escape key to close menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setDesktopDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDesktopDropdownOpen(false);
  }, [pathname]);

  const handleMouseEnter = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }
    setDesktopDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setDesktopDropdownOpen(false);
    }, 180);
  };

  // Helper to determine if a route is active
  const isRouteActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/services") {
      return pathname === "/services" || pathname.startsWith("/services/");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav
      className={cn(
        "sticky top-0 w-full z-40 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2.5"
          : "bg-white py-3 sm:py-4 border-b border-brand-amber-light"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center focus:outline-none focus:ring-2 focus:ring-brand-amber rounded-lg p-1"
          aria-label="Hotel Kalya Homepage"
        >
          <BrandLogo />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1.5 xl:gap-3 text-sm font-medium text-brand-maroon-dark">
          {NAV_LINKS.map((link) => {
            const active = isRouteActive(link.href);

            if (link.hasDropdown) {
              return (
                <div
                  key={link.href}
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => setDesktopDropdownOpen((prev) => !prev)}
                    aria-expanded={desktopDropdownOpen}
                    aria-haspopup="true"
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all text-xs uppercase tracking-wider font-semibold focus:outline-none focus:ring-2 focus:ring-brand-amber",
                      active
                        ? "bg-brand-maroon/10 text-brand-maroon font-bold border-b-2 border-brand-amber shadow-xs"
                        : "text-brand-maroon-dark hover:text-brand-amber hover:bg-brand-amber-light/30"
                    )}
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200",
                        desktopDropdownOpen ? "rotate-180" : ""
                      )}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {desktopDropdownOpen && (
                    <div
                      role="menu"
                      className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border-2 border-brand-amber-light p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      {/* Overview Link */}
                      <Link
                        href="/services"
                        role="menuitem"
                        className={cn(
                          "flex items-center gap-3 p-2.5 rounded-xl transition-colors mb-1.5 border border-transparent",
                          pathname === "/services"
                            ? "bg-brand-amber/15 text-brand-maroon-dark font-bold border-brand-amber/40"
                            : "hover:bg-brand-amber-light/40 text-brand-maroon-dark"
                        )}
                      >
                        <div className="w-8 h-8 rounded-lg bg-brand-maroon text-brand-amber flex items-center justify-center flex-shrink-0">
                          <Grid className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider">
                            All Services Overview
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Explore full portfolio of hospitality services
                          </div>
                        </div>
                      </Link>

                      <div className="h-px bg-brand-amber-light/60 my-1" />

                      {/* Sub-Services Links */}
                      <div className="space-y-1">
                        {NAV_SERVICES.map((sub) => {
                          const SubIcon = SERVICE_ICONS[sub.href] || ChevronRight;
                          const isSubActive = pathname === sub.href;

                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              role="menuitem"
                              aria-current={isSubActive ? "page" : undefined}
                              className={cn(
                                "flex items-start gap-3 p-2.5 rounded-xl transition-all",
                                isSubActive
                                  ? "bg-brand-amber-light/80 text-brand-maroon-dark font-bold border-l-4 border-brand-amber shadow-xs"
                                  : "hover:bg-brand-amber-light/40 text-gray-700 hover:text-brand-maroon"
                              )}
                            >
                              <div
                                className={cn(
                                  "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                                  isSubActive
                                    ? "bg-brand-maroon text-brand-amber"
                                    : "bg-brand-cream text-brand-maroon border border-brand-amber-light"
                                )}
                              >
                                <SubIcon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <span className="text-xs font-bold block">
                                  {sub.label}
                                </span>
                                <span className="text-[11px] text-gray-500 line-clamp-1">
                                  {sub.desc}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "px-3.5 py-2 rounded-full transition-all text-xs uppercase tracking-wider font-semibold focus:outline-none focus:ring-2 focus:ring-brand-amber",
                  active
                    ? "bg-brand-maroon/10 text-brand-maroon font-bold border-b-2 border-brand-amber shadow-xs"
                    : "text-brand-maroon-dark hover:text-brand-amber hover:bg-brand-amber-light/30"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Primary CTA (Book Now) */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/book"
            aria-current={pathname === "/book" ? "page" : undefined}
            className={cn(
              "px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow transition-all flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-brand-amber",
              pathname === "/book"
                ? "bg-brand-amber text-brand-maroon-dark ring-2 ring-brand-maroon"
                : "bg-brand-maroon hover:bg-brand-maroon-dark text-white"
            )}
          >
            <span>Book Now</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Trigger Button */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="p-2 text-brand-maroon hover:bg-brand-amber-light/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Off-Canvas Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 bg-black/50 backdrop-blur-xs z-50 flex flex-col"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-white border-t border-brand-amber-light px-6 py-6 shadow-2xl overflow-y-auto max-h-[85vh] animate-in slide-in-from-top-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-1.5">
              {/* Home */}
              <Link
                href="/"
                aria-current={pathname === "/" ? "page" : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "p-3 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-between",
                  pathname === "/"
                    ? "bg-brand-maroon text-brand-amber"
                    : "text-brand-maroon-dark hover:bg-brand-amber-light/40"
                )}
              >
                <span>Home</span>
                {pathname === "/" && <ChevronRight className="w-4 h-4" />}
              </Link>

              {/* About */}
              <Link
                href="/about"
                aria-current={pathname === "/about" ? "page" : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "p-3 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-between",
                  pathname === "/about"
                    ? "bg-brand-maroon text-brand-amber"
                    : "text-brand-maroon-dark hover:bg-brand-amber-light/40"
                )}
              >
                <span>About</span>
                {pathname === "/about" && <ChevronRight className="w-4 h-4" />}
              </Link>

              {/* Services Accordion */}
              <div className="rounded-xl border border-brand-amber-light/80 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen((prev) => !prev)}
                  aria-expanded={mobileServicesOpen}
                  className={cn(
                    "w-full p-3 text-sm font-bold uppercase tracking-wider flex items-center justify-between text-left",
                    pathname.startsWith("/services")
                      ? "bg-brand-maroon/10 text-brand-maroon"
                      : "text-brand-maroon-dark bg-brand-cream/50"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span>Services</span>
                    {pathname.startsWith("/services") && (
                      <span className="text-[10px] bg-brand-amber text-brand-maroon-dark px-2 py-0.5 rounded-full font-bold">
                        Active
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-brand-maroon transition-transform duration-200",
                      mobileServicesOpen ? "rotate-180" : ""
                    )}
                  />
                </button>

                {mobileServicesOpen && (
                  <div className="bg-brand-cream/30 p-2 space-y-1 border-t border-brand-amber-light/60">
                    <Link
                      href="/services"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block p-2.5 rounded-lg text-xs font-bold uppercase tracking-wider",
                        pathname === "/services"
                          ? "bg-brand-amber text-brand-maroon-dark"
                          : "text-brand-maroon-dark hover:bg-brand-amber-light/50"
                      )}
                    >
                      All Services Directory
                    </Link>

                    {NAV_SERVICES.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      const SubIcon = SERVICE_ICONS[sub.href] || ChevronRight;

                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          aria-current={isSubActive ? "page" : undefined}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-medium transition-colors",
                            isSubActive
                              ? "bg-brand-maroon text-brand-amber font-bold"
                              : "text-gray-700 hover:bg-brand-amber-light/50"
                          )}
                        >
                          <SubIcon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Gallery */}
              <Link
                href="/gallery"
                aria-current={pathname === "/gallery" ? "page" : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "p-3 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-between",
                  pathname === "/gallery"
                    ? "bg-brand-maroon text-brand-amber"
                    : "text-brand-maroon-dark hover:bg-brand-amber-light/40"
                )}
              >
                <span>Gallery</span>
                {pathname === "/gallery" && <ChevronRight className="w-4 h-4" />}
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                aria-current={pathname === "/contact" ? "page" : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "p-3 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-between",
                  pathname === "/contact"
                    ? "bg-brand-maroon text-brand-amber"
                    : "text-brand-maroon-dark hover:bg-brand-amber-light/40"
                )}
              >
                <span>Contact</span>
                {pathname === "/contact" && <ChevronRight className="w-4 h-4" />}
              </Link>

              {/* Action Buttons in Drawer */}
              <div className="pt-4 border-t border-brand-amber-light flex flex-col gap-2.5">
                <Link
                  href="/book"
                  aria-current={pathname === "/book" ? "page" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-brand-maroon text-brand-amber py-3.5 rounded-xl text-center font-bold tracking-wider uppercase text-xs shadow-md flex items-center justify-center gap-2"
                >
                  <span>Book / Make Reservation</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <a
                  href={`tel:${BRAND.phone}`}
                  className="w-full border border-brand-maroon text-brand-maroon py-3 rounded-xl text-center font-semibold text-xs flex items-center justify-center gap-2 hover:bg-brand-amber-light/30 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-amber" />
                  <span>Call Front Desk: {BRAND.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
