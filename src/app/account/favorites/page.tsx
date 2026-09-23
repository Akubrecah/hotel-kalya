"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { IMAGES } from "@/lib/constants";

export default function AccountFavoritesPage() {
  const favorites = [
    {
      title: "Executive Deluxe Suite",
      category: "Accommodation",
      rate: "From KES 8,500 / night",
      image: IMAGES.deluxeSuite,
      href: "/services/accommodation",
    },
    {
      title: "Kapenguria Kienyeji Chicken Special",
      category: "Restaurant Specialty",
      rate: "KES 1,400",
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
      href: "/menu",
    },
    {
      title: "Kalya Gardens Photoshoot & Grounds",
      category: "Outdoor Experience",
      rate: "From KES 5,000 / session",
      image: IMAGES.gardenLandscape,
      href: "/services/garden-experience",
    },
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/account" },
          { label: "Saved Favorites" },
        ]}
      />

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-maroon hover:underline mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Account Overview</span>
            </Link>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-brand-maroon">
              Saved Favorites &amp; Bookmarks
            </h1>
            <p className="text-xs text-brand-dark/70 mt-1">
              Your curated list of preferred suites, banquet services, and signature dining dishes at Hotel Kalya.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <div
                key={fav.title}
                className="bg-white rounded-2xl overflow-hidden border border-brand-maroon/10 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-brand-cream">
                    <Image src={fav.image} alt={fav.title} fill className="object-cover" />
                    <button
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-red-500 shadow-sm"
                      title="Saved to favorites"
                    >
                      <Heart className="w-4 h-4 fill-red-500" />
                    </button>
                    <span className="absolute bottom-3 left-3 bg-brand-maroon/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                      {fav.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-1">
                    <h3 className="font-serif font-bold text-base text-brand-maroon">
                      {fav.title}
                    </h3>
                    <p className="text-xs font-serif font-bold text-brand-dark/80">
                      {fav.rate}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    href={fav.href}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-brand-maroon text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-maroon-dark transition-colors"
                  >
                    <span>View &amp; Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
