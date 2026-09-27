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
  ShoppingBag,
  User,
  LogOut,
  Calendar,
  Star,
  Flame,
  Wine,
  ShieldCheck,
  Camera,
  MapPin,
  Layers,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { NAV_LINKS, BRAND, NavLinkItem } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

// Map subItem href to its appropriate icon
const NAV_ICONS: Record<string, React.ElementType> = {
  // Stay & Accommodation
  "/rooms": Bed,
  "/availability": Calendar,
  "/services/airbnb": Sparkles,
  "/offers": Star,
  // Dining
  "/menu": Utensils,
  "/menu/breakfast": Coffee,
  "/menu/lunch": Utensils,
  "/menu/dinner": Flame,
  "/menu/drinks": Wine,
  "/services/outside-catering": Coffee,
  // Events & Services
  "/services": Sparkles,
  "/services/conferences": Presentation,
  "/services/garden-experience": Trees,
  "/events": Calendar,
  // Explore
  "/about": ShieldCheck,
  "/gallery": Camera,
  "/reviews": Star,
  "/location": MapPin,
  "/template": Layers,
  // Fallback
  "/contact": Phone,
};

export function Navbar() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpandedAccordions, setMobileExpandedAccordions] = useState<Record<string, boolean>>({
    stay: true, // Default first accordion open for discoverability
  });
  const [desktopUserMenuOpen, setDesktopUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userTimerRef = useRef<NodeJS.Timeout | null>(null);

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
        setOpenDropdown(null);
        setDesktopUserMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close menus on route change without triggering useEffect setState error
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    setDesktopUserMenuOpen(false);
  }

  // Dropdown hover handlers with slight debounce
  const handleDropdownEnter = (id: string) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setOpenDropdown(id);
  };

  const handleDropdownLeave = () => {
    dropdownTimerRef.current = setTimeout(() => setOpenDropdown(null), 160);
  };

  const handleUserEnter = () => {
    if (userTimerRef.current) clearTimeout(userTimerRef.current);
    setDesktopUserMenuOpen(true);
  };

  const handleUserLeave = () => {
    userTimerRef.current = setTimeout(() => setDesktopUserMenuOpen(false), 160);
  };

  const toggleMobileAccordion = (id: string) => {
    setMobileExpandedAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Helper to determine if a route is active
  const isRouteActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Helper to determine if any sub-item in a dropdown category is active
  const isParentCategoryActive = (link: NavLinkItem) => {
    if (link.href === "/") {
      return pathname === "/";
    }
    if (link.subItems && link.subItems.length > 0) {
      return link.subItems.some((sub) => {
        if (sub.href === "/") return pathname === "/";
        return pathname === sub.href || pathname.startsWith(sub.href + "/");
      });
    }
    return pathname === link.href || pathname.startsWith(link.href + "/");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-brand-maroon/10"
          : "bg-white border-b border-brand-cream/80"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 lg:gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-amber rounded-lg py-1"
            aria-label="Hotel Kalya Home"
          >
            <BrandLogo />
          </Link>

          {/* Desktop Navigation Links — 6 intuitive top-level items with dropdowns */}
          <nav
            className="hidden lg:flex items-center space-x-1 xl:space-x-2 2xl:space-x-3 flex-shrink-0"
            aria-label="Main Navigation"
          >
            {NAV_LINKS.map((link) => {
              const active = isParentCategoryActive(link);
              const isDropdown = Boolean(link.hasDropdown && link.dropdownId && link.subItems);
              const isOpen = openDropdown === link.dropdownId;

              if (isDropdown && link.dropdownId && link.subItems) {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter(link.dropdownId!)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "relative flex items-center gap-1 px-2.5 xl:px-3 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold rounded-md transition-all duration-200 select-none",
                        active
                          ? "text-brand-maroon font-bold bg-brand-amber/15 shadow-xs"
                          : "text-brand-dark/80 hover:text-brand-maroon hover:bg-brand-cream"
                      )}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      aria-current={active ? "page" : undefined}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 transition-transform duration-200",
                          isOpen ? "rotate-180 text-brand-amber" : "text-brand-dark/50"
                        )}
                        aria-hidden="true"
                      />
                      {active && (
                        <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-amber rounded-full" />
                      )}
                    </Link>

                    {/* Categorized Desktop Dropdown Panel */}
                    {isOpen && (
                      <div
                        className={cn(
                          "absolute top-full pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 w-80 xl:w-88 max-w-[calc(100vw-2rem)]",
                          link.dropdownId === "stay" && "left-0",
                          link.dropdownId === "dining" && "left-0",
                          link.dropdownId === "events" && "left-1/2 -translate-x-1/2",
                          link.dropdownId === "explore" && "right-0"
                        )}
                      >
                        <div className="bg-white rounded-xl shadow-xl border border-brand-maroon/10 p-2.5 space-y-1">
                          {/* Overview Link Header */}
                          <Link
                            href={link.href}
                            className={cn(
                              "flex items-center justify-between p-2 rounded-lg text-xs font-bold uppercase tracking-wider text-brand-maroon hover:bg-brand-cream transition-colors",
                              pathname === link.href && "bg-brand-amber/15 text-brand-maroon"
                            )}
                          >
                            <span>Explore All {link.label}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-brand-amber" />
                          </Link>

                          <div className="h-px bg-brand-cream my-1" />

                          {/* SubItems */}
                          {link.subItems.map((subItem) => {
                            const subActive = isRouteActive(subItem.href);
                            const IconComponent = NAV_ICONS[subItem.href] || Sparkles;

                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={cn(
                                  "flex items-start gap-3 p-2.5 rounded-lg transition-colors group",
                                  subActive
                                    ? "bg-brand-amber/15 text-brand-maroon"
                                    : "hover:bg-brand-cream text-brand-dark"
                                )}
                              >
                                <div
                                  className={cn(
                                    "p-1.5 rounded-md mt-0.5 transition-colors flex-shrink-0",
                                    subActive
                                      ? "bg-brand-amber text-brand-maroon"
                                      : "bg-brand-maroon/5 text-brand-maroon group-hover:bg-brand-amber/20"
                                  )}
                                >
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1.5">
                                    <div className="flex items-center gap-1.5 truncate">
                                      <span className="text-xs font-bold leading-snug">{subItem.label}</span>
                                      {subActive && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-amber flex-shrink-0" />
                                      )}
                                    </div>
                                    {subItem.badge && (
                                      <span className="text-[10px] font-black uppercase tracking-wider bg-brand-amber/25 text-brand-maroon px-1.5 py-0.5 rounded flex-shrink-0">
                                        {subItem.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-brand-dark/60 leading-tight mt-0.5 line-clamp-1">
                                    {subItem.desc}
                                  </p>
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

              // Standard Top-Level Link (Home, Contact)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-2.5 xl:px-3 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold rounded-md transition-all duration-200 select-none",
                    active
                      ? "text-brand-maroon font-bold bg-brand-amber/15 shadow-xs"
                      : "text-brand-dark/80 hover:text-brand-maroon hover:bg-brand-cream"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span>{link.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-amber rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs (Cart, Account, Book Now) */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 flex-shrink-0">
            {/* Food Order Cart Button */}
            <Link
              href="/cart"
              className={cn(
                "relative p-2 xl:p-2.5 rounded-full border transition-all duration-200 flex items-center justify-center",
                pathname === "/cart"
                  ? "border-brand-maroon bg-brand-amber/15 text-brand-maroon"
                  : "border-brand-maroon/20 hover:border-brand-maroon hover:bg-brand-cream text-brand-dark/80"
              )}
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-amber text-brand-maroon text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Customer Account / Sign In */}
            {user ? (
              <div
                className="relative"
                onMouseEnter={handleUserEnter}
                onMouseLeave={handleUserLeave}
              >
                <Link
                  href="/account"
                  className={cn(
                    "flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-full border text-xs font-bold transition-all",
                    isRouteActive("/account")
                      ? "border-brand-amber bg-brand-amber/15 text-brand-maroon"
                      : "border-brand-maroon/20 hover:border-brand-maroon bg-white text-brand-dark"
                  )}
                >
                  <div className="w-6 h-6 rounded-full bg-brand-maroon text-brand-amber flex items-center justify-center text-xs font-black">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[80px] xl:max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-brand-dark/60" />
                </Link>

                {desktopUserMenuOpen && (
                  <div className="absolute top-full right-0 w-52 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-white rounded-xl shadow-xl border border-brand-maroon/10 p-2 space-y-1">
                      <div className="px-3 py-2 border-b border-brand-cream">
                        <p className="text-xs font-bold text-brand-maroon truncate">{user.name}</p>
                        <p className="text-[10px] text-brand-dark/60 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/guest/dashboard"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-brand-maroon bg-brand-cream hover:bg-brand-cream/80 transition-colors border border-brand-maroon/10"
                      >
                        <User className="w-3.5 h-3.5 text-brand-amber-dark" />
                        <span>Guest Lounge Portal</span>
                      </Link>
                      <Link
                        href="/staff/dashboard"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-brand-maroon bg-brand-amber/20 hover:bg-brand-amber/30 transition-colors border border-brand-amber/30"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-maroon" />
                        <span>Staff Operations</span>
                      </Link>
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-white bg-brand-maroon hover:bg-brand-maroon-dark transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-amber" />
                        <span>Admin Console</span>
                      </Link>
                      <div className="h-px bg-gray-100 my-1" />
                      <Link
                        href="/guest/bookings"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-brand-dark hover:bg-brand-cream transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5 text-brand-amber" />
                        <span>My Bookings</span>
                      </Link>
                      <Link
                        href="/cart"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-brand-dark hover:bg-brand-cream transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-brand-amber" />
                        <span>Food Orders Cart</span>
                      </Link>
                      <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 xl:py-2 rounded-lg text-xs font-bold text-brand-maroon hover:bg-brand-cream transition-colors border border-brand-maroon/20"
              >
                <User className="w-3.5 h-3.5 text-brand-amber" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Direct Booking CTA */}
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-3.5 xl:px-4 py-2 xl:py-2.5 rounded-lg bg-brand-maroon text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-maroon-dark transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap"
            >
              Reserve Now
            </Link>
          </div>

          {/* Mobile Menu & Cart Trigger (screens < lg) */}
          <div className="flex lg:hidden items-center space-x-2 flex-shrink-0">
            <Link
              href="/cart"
              className="relative p-2 text-brand-dark hover:text-brand-maroon focus:outline-none"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-brand-amber text-brand-maroon text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-brand-maroon hover:bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-amber"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Off-Canvas / Slide-Down Menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 top-20 z-50 bg-brand-dark/50 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-h-[calc(100vh-5rem)] overflow-y-auto px-4 sm:px-6 py-5 space-y-4 shadow-2xl border-t border-brand-maroon/10"
          >
            {/* Quick Actions Bar in Mobile Menu */}
            <div className="flex items-center justify-between p-3 bg-brand-cream/80 rounded-xl">
              {user ? (
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-maroon text-brand-amber flex items-center justify-center text-xs font-black">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-maroon leading-tight">{user.name}</p>
                    <p className="text-[10px] text-brand-dark/60">My Account Portal</p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-brand-maroon text-white text-xs font-bold"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-brand-maroon text-brand-maroon text-xs font-bold"
                  >
                    Register
                  </Link>
                </div>
              )}

              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-amber text-brand-maroon text-xs font-bold"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Cart ({cartCount})</span>
              </Link>
            </div>

            {user && (user.role === "staff" || user.role === "admin") && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-brand-amber/20 border border-brand-amber/40 text-brand-maroon font-bold text-xs"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-maroon" />
                  <span>Front-Desk Operations Dashboard</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}

            {/* Mobile Navigation Links with Accordion Dropdowns */}
            <nav className="space-y-1" aria-label="Mobile Navigation">
              {NAV_LINKS.map((link) => {
                const active = isParentCategoryActive(link);
                const hasDropdown = Boolean(link.hasDropdown && link.dropdownId && link.subItems);
                const isExpanded = Boolean(link.dropdownId && mobileExpandedAccordions[link.dropdownId]);

                if (hasDropdown && link.dropdownId && link.subItems) {
                  return (
                    <div key={link.label} className="border-b border-brand-cream/80 pb-1">
                      <div className="flex items-center justify-between">
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex-1 py-2.5 text-base font-bold transition-colors",
                            active ? "text-brand-maroon" : "text-brand-dark hover:text-brand-maroon"
                          )}
                          aria-current={active ? "page" : undefined}
                        >
                          {link.label}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleMobileAccordion(link.dropdownId!)}
                          className="p-2 text-brand-dark/60 hover:text-brand-maroon focus:outline-none"
                          aria-label={isExpanded ? `Collapse ${link.label}` : `Expand ${link.label}`}
                          aria-expanded={isExpanded}
                        >
                          <ChevronDown
                            className={cn(
                              "w-5 h-5 transition-transform duration-200",
                              isExpanded && "rotate-180 text-brand-amber"
                            )}
                          />
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="pl-3 pr-1 py-1 space-y-1 bg-brand-cream/40 rounded-xl my-1 border-l-2 border-brand-amber">
                          {link.subItems.map((subItem) => {
                            const subActive = isRouteActive(subItem.href);
                            const IconComponent = NAV_ICONS[subItem.href] || Sparkles;

                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                  "flex items-center justify-between py-2 px-2.5 rounded-lg text-xs font-semibold transition-colors",
                                  subActive
                                    ? "bg-brand-amber/20 text-brand-maroon font-bold"
                                    : "text-brand-dark/80 hover:bg-brand-cream hover:text-brand-maroon"
                                )}
                              >
                                <div className="flex items-center gap-2.5 truncate">
                                  <IconComponent className="w-3.5 h-3.5 text-brand-amber flex-shrink-0" />
                                  <span className="truncate">{subItem.label}</span>
                                </div>
                                {subItem.badge && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-amber/30 text-brand-maroon px-1.5 py-0.5 rounded ml-2 flex-shrink-0">
                                    {subItem.badge}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                // Standard Top-Level Link
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block py-2.5 text-base font-bold transition-colors border-b border-brand-cream/80",
                      active ? "text-brand-maroon" : "text-brand-dark hover:text-brand-maroon"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Operational Portals Mobile Bar */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <Link
                href="/guest/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-brand-cream border border-brand-maroon/15 text-brand-maroon font-bold text-xs"
              >
                <User className="w-3.5 h-3.5 text-brand-amber-dark" />
                <span>Guest Lounge</span>
              </Link>
              <Link
                href="/staff/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-brand-amber/20 border border-brand-amber/30 text-brand-maroon font-bold text-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-brand-maroon" />
                <span>Staff Portal</span>
              </Link>
            </div>

            {/* Mobile Booking CTA */}
            <div className="pt-1">
              <Link
                href="/availability"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-maroon text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-md hover:bg-brand-maroon-dark transition-colors"
              >
                <span>Check Live Availability</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Direct Call Button */}
            <a
              href={`tel:${BRAND.phoneClean}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-brand-maroon/20 rounded-xl text-brand-maroon font-semibold text-xs transition-colors hover:bg-brand-cream"
            >
              <Phone className="w-3.5 h-3.5 text-brand-amber" />
              <span>Call Reception ({BRAND.phone})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
