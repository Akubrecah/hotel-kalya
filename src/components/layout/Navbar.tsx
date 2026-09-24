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
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { NAV_LINKS, NAV_SERVICES, NAV_MENU_ITEMS, BRAND } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  "/services/accommodation": Bed,
  "/services/food-service": Utensils,
  "/services/conferences": Presentation,
  "/services/outside-catering": Coffee,
  "/services/airbnb": Sparkles,
  "/services/garden-experience": Trees,
};

const MENU_ICONS: Record<string, React.ElementType> = {
  "/menu": Utensils,
  "/menu/breakfast": Coffee,
  "/menu/lunch": Utensils,
  "/menu/dinner": Flame,
  "/menu/drinks": Wine,
  "/menu/specials": Star,
};

export function Navbar() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileMenuCatOpen, setMobileMenuCatOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [desktopUserMenuOpen, setDesktopUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const servicesTimerRef = useRef<NodeJS.Timeout | null>(null);
  const menuTimerRef = useRef<NodeJS.Timeout | null>(null);
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
        setDesktopServicesOpen(false);
        setDesktopMenuOpen(false);
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
    setDesktopServicesOpen(false);
    setDesktopMenuOpen(false);
    setDesktopUserMenuOpen(false);
  }

  // Dropdown hover handlers with slight debounce
  const handleServicesEnter = () => {
    if (servicesTimerRef.current) clearTimeout(servicesTimerRef.current);
    setDesktopServicesOpen(true);
  };
  const handleServicesLeave = () => {
    servicesTimerRef.current = setTimeout(() => setDesktopServicesOpen(false), 160);
  };

  const handleMenuEnter = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    setDesktopMenuOpen(true);
  };
  const handleMenuLeave = () => {
    menuTimerRef.current = setTimeout(() => setDesktopMenuOpen(false), 160);
  };

  const handleUserEnter = () => {
    if (userTimerRef.current) clearTimeout(userTimerRef.current);
    setDesktopUserMenuOpen(true);
  };
  const handleUserLeave = () => {
    userTimerRef.current = setTimeout(() => setDesktopUserMenuOpen(false), 160);
  };

  // Helper to determine if a route is active
  const isRouteActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/services") {
      return pathname === "/services" || pathname.startsWith("/services/");
    }
    if (href === "/menu") {
      return pathname === "/menu" || pathname.startsWith("/menu/");
    }
    if (href === "/account") {
      return pathname === "/account" || pathname.startsWith("/account/");
    }
    return pathname === href;
  };

  // Helper to determine if services parent is active (when on child route)
  const isServicesParentActive = () => {
    return pathname === "/services" || pathname.startsWith("/services/");
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
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-brand-amber rounded-lg py-1"
            aria-label="Hotel Kalya Home"
          >
            <BrandLogo />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden xl:flex items-center space-x-1 lg:space-x-2"
            aria-label="Main Navigation"
          >
            {NAV_LINKS.map((link) => {
              const active = isRouteActive(link.href);
              const isServicesParent = link.dropdownType === "services" && isServicesParentActive();

              // Services Dropdown Item
              if (link.dropdownType === "services") {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={handleServicesEnter}
                    onMouseLeave={handleServicesLeave}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "relative flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200",
                        isServicesParent
                          ? "text-brand-maroon font-bold bg-brand-amber/10"
                          : active
                          ? "text-brand-maroon font-bold bg-brand-amber/10"
                          : "text-brand-dark/80 hover:text-brand-maroon hover:bg-brand-cream"
                      )}
                      aria-haspopup="true"
                      aria-expanded={desktopServicesOpen}
                      aria-current={isServicesParent ? "page" : active ? "page" : undefined}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 transition-transform duration-200",
                          desktopServicesOpen ? "rotate-180 text-brand-amber" : "text-brand-dark/50"
                        )}
                        aria-hidden="true"
                      />
                      {(isServicesParent || active) && (
                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-amber rounded-full" />
                      )}
                    </Link>

                    {/* Services Dropdown Menu */}
                    {desktopServicesOpen && (
                      <div className="absolute top-full left-0 w-80 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="bg-white rounded-xl shadow-xl border border-brand-maroon/10 p-2.5 space-y-1">
                          <Link
                            href="/services"
                            className={cn(
                              "flex items-center justify-between p-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-brand-maroon hover:bg-brand-cream transition-colors",
                              pathname === "/services" && "bg-brand-amber/15 text-brand-maroon font-bold"
                            )}
                          >
                            <span>Services Directory Overview</span>
                            <ChevronRight className="w-3.5 h-3.5 text-brand-amber" />
                          </Link>
                          <div className="h-px bg-brand-cream my-1" />
                          {NAV_SERVICES.map((subItem) => {
                            const subActive = pathname === subItem.href;
                            const IconComponent = SERVICE_ICONS[subItem.href] || Sparkles;
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
                                    "p-1.5 rounded-md mt-0.5 transition-colors",
                                    subActive
                                      ? "bg-brand-amber text-brand-maroon"
                                      : "bg-brand-maroon/5 text-brand-maroon group-hover:bg-brand-amber/20"
                                  )}
                                >
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold leading-snug">{subItem.label}</span>
                                    {subActive && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-brand-amber" />
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

              // Menu Dropdown Item
              if (link.dropdownType === "menu") {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={handleMenuEnter}
                    onMouseLeave={handleMenuLeave}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "relative flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200",
                        active
                          ? "text-brand-maroon font-bold bg-brand-amber/10"
                          : "text-brand-dark/80 hover:text-brand-maroon hover:bg-brand-cream"
                      )}
                      aria-haspopup="true"
                      aria-expanded={desktopMenuOpen}
                      aria-current={active ? "page" : undefined}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 transition-transform duration-200",
                          desktopMenuOpen ? "rotate-180 text-brand-amber" : "text-brand-dark/50"
                        )}
                        aria-hidden="true"
                      />
                      {active && (
                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-amber rounded-full" />
                      )}
                    </Link>

                    {/* Menu Dropdown Panel */}
                    {desktopMenuOpen && (
                      <div className="absolute top-full left-0 w-80 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="bg-white rounded-xl shadow-xl border border-brand-maroon/10 p-2.5 space-y-1">
                          <Link
                            href="/menu"
                            className={cn(
                              "flex items-center justify-between p-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-brand-maroon hover:bg-brand-cream transition-colors",
                              pathname === "/menu" && "bg-brand-amber/15 text-brand-maroon font-bold"
                            )}
                          >
                            <span>Explore Full Digital Menu</span>
                            <ChevronRight className="w-3.5 h-3.5 text-brand-amber" />
                          </Link>
                          <div className="h-px bg-brand-cream my-1" />
                          {NAV_MENU_ITEMS.slice(1).map((subItem) => {
                            const subActive = pathname === subItem.href;
                            const IconComponent = MENU_ICONS[subItem.href] || Utensils;
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={cn(
                                  "flex items-start gap-3 p-2 rounded-lg transition-colors group",
                                  subActive
                                    ? "bg-brand-amber/15 text-brand-maroon"
                                    : "hover:bg-brand-cream text-brand-dark"
                                )}
                              >
                                <div
                                  className={cn(
                                    "p-1.5 rounded-md mt-0.5 transition-colors",
                                    subActive
                                      ? "bg-brand-amber text-brand-maroon"
                                      : "bg-brand-maroon/5 text-brand-maroon group-hover:bg-brand-amber/20"
                                  )}
                                >
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold leading-snug">{subItem.label}</span>
                                    {subActive && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-brand-amber" />
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

              // Standard Top-Level Nav Link
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200",
                    active
                      ? "text-brand-maroon font-bold bg-brand-amber/10"
                      : "text-brand-dark/80 hover:text-brand-maroon hover:bg-brand-cream"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span>{link.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-amber rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs (Cart, Account, Book Now) */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Food Order Cart Button */}
            <Link
              href="/cart"
              className={cn(
                "relative p-2.5 rounded-full border transition-all duration-200 flex items-center justify-center",
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
                    "flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-bold transition-all",
                    isRouteActive("/account")
                      ? "border-brand-amber bg-brand-amber/15 text-brand-maroon"
                      : "border-brand-maroon/20 hover:border-brand-maroon bg-white text-brand-dark"
                  )}
                >
                  <div className="w-6 h-6 rounded-full bg-brand-maroon text-brand-amber flex items-center justify-center text-xs font-black">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[90px] truncate">{user.name.split(" ")[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-brand-dark/60" />
                </Link>

                {desktopUserMenuOpen && (
                  <div className="absolute top-full right-0 w-52 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-white rounded-xl shadow-xl border border-brand-maroon/10 p-2 space-y-1">
                      <div className="px-3 py-2 border-b border-brand-cream">
                        <p className="text-xs font-bold text-brand-maroon truncate">{user.name}</p>
                        <p className="text-[10px] text-brand-dark/60 truncate">{user.email}</p>
                      </div>
                      {(user.role === "staff" || user.role === "admin") && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-brand-maroon bg-brand-amber/25 hover:bg-brand-amber/35 transition-colors border border-brand-amber/40"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-brand-maroon" />
                          <span>Admin Portal</span>
                        </Link>
                      )}
                      <Link
                        href="/account/profile"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-brand-dark hover:bg-brand-cream transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-brand-amber" />
                        <span>Profile Details</span>
                      </Link>
                      <Link
                        href="/account/bookings"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-brand-dark hover:bg-brand-cream transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5 text-brand-amber" />
                        <span>My Bookings</span>
                      </Link>
                      <Link
                        href="/account/orders"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-brand-dark hover:bg-brand-cream transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-brand-amber" />
                        <span>Food Orders</span>
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
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-brand-maroon hover:bg-brand-cream transition-colors border border-brand-maroon/20"
              >
                <User className="w-3.5 h-3.5 text-brand-amber" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Direct Booking CTA */}
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-brand-maroon text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-maroon-dark transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              Reserve Now
            </Link>
          </div>

          {/* Mobile Menu & Cart Trigger */}
          <div className="flex xl:hidden items-center space-x-2">
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
        <div className="xl:hidden fixed inset-0 top-20 z-50 bg-brand-dark/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-h-[calc(100vh-5rem)] overflow-y-auto px-5 py-6 space-y-4 shadow-2xl border-t border-brand-maroon/10">
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

            {/* Navigation Links */}
            <nav className="space-y-1" aria-label="Mobile Navigation">
              {NAV_LINKS.map((link) => {
                const active = isRouteActive(link.href);

                // Mobile Services Accordion
                if (link.dropdownType === "services") {
                  return (
                    <div key={link.href} className="border-b border-brand-cream/80 pb-1">
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
                          onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                          className="p-2 text-brand-dark/60 hover:text-brand-maroon focus:outline-none"
                          aria-label={mobileServicesOpen ? "Collapse Services" : "Expand Services"}
                          aria-expanded={mobileServicesOpen}
                        >
                          <ChevronDown
                            className={cn(
                              "w-5 h-5 transition-transform duration-200",
                              mobileServicesOpen && "rotate-180 text-brand-amber"
                            )}
                          />
                        </button>
                      </div>

                      {mobileServicesOpen && (
                        <div className="pl-3 pr-1 py-1 space-y-1 bg-brand-cream/40 rounded-xl my-1 border-l-2 border-brand-amber">
                          {NAV_SERVICES.map((subItem) => {
                            const subActive = pathname === subItem.href;
                            const IconComponent = SERVICE_ICONS[subItem.href] || Sparkles;
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                  "flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-colors",
                                  subActive
                                    ? "bg-brand-amber/20 text-brand-maroon font-bold"
                                    : "text-brand-dark/80 hover:bg-brand-cream hover:text-brand-maroon"
                                )}
                              >
                                <IconComponent className="w-3.5 h-3.5 text-brand-amber" />
                                <span>{subItem.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                // Mobile Menu Accordion
                if (link.dropdownType === "menu") {
                  return (
                    <div key={link.href} className="border-b border-brand-cream/80 pb-1">
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
                          onClick={() => setMobileMenuCatOpen(!mobileMenuCatOpen)}
                          className="p-2 text-brand-dark/60 hover:text-brand-maroon focus:outline-none"
                          aria-label={mobileMenuCatOpen ? "Collapse Menu Categories" : "Expand Menu Categories"}
                          aria-expanded={mobileMenuCatOpen}
                        >
                          <ChevronDown
                            className={cn(
                              "w-5 h-5 transition-transform duration-200",
                              mobileMenuCatOpen && "rotate-180 text-brand-amber"
                            )}
                          />
                        </button>
                      </div>

                      {mobileMenuCatOpen && (
                        <div className="pl-3 pr-1 py-1 space-y-1 bg-brand-cream/40 rounded-xl my-1 border-l-2 border-brand-amber">
                          {NAV_MENU_ITEMS.map((subItem) => {
                            const subActive = pathname === subItem.href;
                            const IconComponent = MENU_ICONS[subItem.href] || Utensils;
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                  "flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-colors",
                                  subActive
                                    ? "bg-brand-amber/20 text-brand-maroon font-bold"
                                    : "text-brand-dark/80 hover:bg-brand-cream hover:text-brand-maroon"
                                )}
                              >
                                <IconComponent className="w-3.5 h-3.5 text-brand-amber" />
                                <span>{subItem.label}</span>
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

            {/* Mobile Booking CTA */}
            <div className="pt-2">
              <Link
                href="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-maroon text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-md hover:bg-brand-maroon-dark transition-colors"
              >
                <span>Book a Reservation</span>
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
