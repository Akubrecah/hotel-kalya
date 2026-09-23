import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { BRAND } from "@/lib/constants";
import { Bed, Utensils, Presentation, Trees, Camera, Phone, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const quickLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "About", href: "/about", icon: Home },
    { label: "All Services", href: "/services", icon: Bed },
    { label: "Accommodation", href: "/services/accommodation", icon: Bed },
    { label: "Dining & Cuisine", href: "/services/food-service", icon: Utensils },
    { label: "Conferences", href: "/services/conferences", icon: Presentation },
    { label: "Outside Catering", href: "/services/outside-catering", icon: Utensils },
    { label: "AirBnB Stays", href: "/services/airbnb", icon: Bed },
    { label: "Kalya Gardens", href: "/services/garden-experience", icon: Trees },
    { label: "Photo Gallery", href: "/gallery", icon: Camera },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-brand-cream/60">
      <div className="max-w-xl w-full text-center space-y-8 bg-white p-8 sm:p-12 rounded-3xl border-2 border-brand-amber-light shadow-xl">
        <div className="flex justify-center">
          <BrandLogo />
        </div>

        <div className="space-y-3">
          <span className="inline-block bg-brand-amber-light text-brand-maroon-dark px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            Error 404
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-maroon-dark">
            Room or Page Not Found
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
            The destination you are looking for may have been relocated, renamed, or is currently unavailable. Let us guide you back to our comfortable spaces.
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="pt-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">
            Popular Destinations
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 p-3 rounded-xl bg-brand-cream hover:bg-brand-amber-light/70 border border-brand-amber-light/60 text-xs font-semibold text-brand-maroon-dark transition-all hover:scale-[1.02]"
                >
                  <Icon className="w-4 h-4 text-brand-amber flex-shrink-0" />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-brand-amber-light/60 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto bg-brand-maroon hover:bg-brand-maroon-dark text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <a
            href={`tel:${BRAND.phone}`}
            className="w-full sm:w-auto border border-brand-maroon text-brand-maroon hover:bg-brand-amber-light/50 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Call Desk ({BRAND.phone})</span>
          </a>
        </div>
      </div>
    </div>
  );
}
