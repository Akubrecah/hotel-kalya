"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bed,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { IMAGES } from "@/lib/constants";

interface RoomTier {
  id: string;
  name: string;
  category: "suite" | "standard" | "airbnb" | "cottage";
  categoryLabel: string;
  pricePerNight: number;
  capacity: string;
  bedType: string;
  size: string;
  image: string;
  description: string;
  amenities: string[];
  featured?: boolean;
}

const ROOMS_DATA: RoomTier[] = [
  {
    id: "deluxe-suite",
    name: "Deluxe Executive Suite",
    category: "suite",
    categoryLabel: "Executive Suites",
    pricePerNight: 8500,
    capacity: "Up to 2 Adults",
    bedType: "King-Size Orthopedic Bed",
    size: "45 m²",
    image: IMAGES.deluxeSuite,
    description:
      "Our premier suite features a separate lounge, scenic balcony overlooking the Kapenguria highlands, luxury en-suite bathroom with walk-in rainfall shower, and full executive amenities.",
    amenities: [
      "High-Speed Wi-Fi",
      "50\" 4K Smart TV with DStv",
      "Executive Work Desk & Ergonomic Chair",
      "Private Scenic Balcony",
      "Complimentary Full Farm Breakfast",
      "24/7 Room Service & Security",
    ],
    featured: true,
  },
  {
    id: "executive-room",
    name: "Executive Standard Room",
    category: "standard",
    categoryLabel: "Standard Rooms",
    pricePerNight: 5500,
    capacity: "Up to 2 Guests",
    bedType: "Queen-Size Bed",
    size: "32 m²",
    image: IMAGES.executiveRoom,
    description:
      "Tailored for traveling executives and NGO field teams seeking comfort, reliable high-speed internet, premium bedding, and a peaceful environment for restful evenings.",
    amenities: [
      "High-Speed Wi-Fi",
      "Flat-Screen TV",
      "Dedicated Laptop Desk",
      "En-suite Hot Shower",
      "Complimentary Breakfast",
      "Secure On-Site Parking",
    ],
    featured: true,
  },
  {
    id: "airbnb-apartment",
    name: "Serviced AirBnB 2-Bedroom Apartment",
    category: "airbnb",
    categoryLabel: "AirBnB Short-Stays",
    pricePerNight: 9500,
    capacity: "Up to 4 Guests",
    bedType: "1 King + 1 Queen Bed",
    size: "78 m²",
    image: IMAGES.airbnbStay,
    description:
      "Fully self-contained short-stay apartment with private kitchen, refrigerator, microwave, furnished living room, and panoramic hill views. Perfect for extended corporate assignments and families.",
    amenities: [
      "Fully Equipped Kitchenette",
      "Furnished Living Room & Dining Area",
      "High-Speed Wi-Fi",
      "Balcony with Mountain Panorama",
      "Housekeeping & Laundry Options",
      "Dedicated Private Parking",
    ],
    featured: true,
  },
  {
    id: "garden-cottage",
    name: "Kalya Highland Garden Cottage",
    category: "cottage",
    categoryLabel: "Garden Cottages",
    pricePerNight: 6500,
    capacity: "Up to 2 Adults",
    bedType: "Queen-Size Bed",
    size: "38 m²",
    image: IMAGES.standardRoom,
    description:
      "Nestled adjacent to our manicured Kalya Gardens, offering tranquil garden views, outdoor veranda seating, fresh mountain air, and peaceful retreat ambience.",
    amenities: [
      "Private Garden Veranda",
      "En-suite Bathroom",
      "Wi-Fi & Room Intercom",
      "Farm-Fresh Breakfast Included",
      "Direct Lawn & Gazebo Access",
      "24/7 Gated Security",
    ],
  },
];

export default function RoomsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredRooms =
    selectedCategory === "all"
      ? ROOMS_DATA
      : ROOMS_DATA.filter((r) => r.category === selectedCategory);

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Rooms & Accommodation" },
        ]}
      />

      {/* Hero Header */}
      <section className="bg-brand-cream/80 py-12 lg:py-16 border-b border-brand-maroon/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/20 text-brand-maroon text-xs font-bold uppercase tracking-wider mb-3">
                <Bed className="w-3.5 h-3.5 text-brand-amber-dark" />
                <span>Executive Accommodations in Kapenguria</span>
              </div>
              <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-brand-maroon leading-tight">
                Rooms, Suites &amp; Cottages
              </h1>
              <p className="mt-4 text-base sm:text-lg text-brand-dark/80 leading-relaxed">
                Discover exceptional lodging designed for peaceful nights and productive mornings. Every room combines modern amenities, complimentary breakfast, fast Wi-Fi, and 24/7 desk hospitality.
              </p>
            </div>

            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-all shadow-md active:scale-95 self-start md:self-end"
            >
              <span>Check General Availability</span>
              <ArrowRight className="w-4 h-4 text-brand-amber" />
            </Link>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white border-b border-brand-cream py-4 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-xs font-bold text-brand-dark/60 mr-2 uppercase tracking-wider whitespace-nowrap">
              Filter By Type:
            </span>
            {[
              { id: "all", label: "All Accommodations" },
              { id: "suite", label: "Executive Suites" },
              { id: "standard", label: "Standard Rooms" },
              { id: "airbnb", label: "AirBnB Serviced Apartments" },
              { id: "cottage", label: "Garden Cottages" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === tab.id
                    ? "bg-brand-maroon text-white shadow-sm"
                    : "bg-brand-cream/80 text-brand-dark/80 hover:bg-brand-cream hover:text-brand-maroon"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Showcase Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-2xl overflow-hidden border border-brand-maroon/10 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image with badges */}
                  <div className="relative h-64 sm:h-72 w-full bg-brand-cream">
                    <Image
                      src={room.image}
                      alt={room.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-brand-maroon/90 text-white text-xs font-bold backdrop-blur-sm">
                        {room.categoryLabel}
                      </span>
                      {room.featured && (
                        <span className="px-3 py-1 rounded-full bg-brand-amber text-brand-maroon text-xs font-black uppercase tracking-wider shadow">
                          Popular
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <div className="text-xs font-semibold drop-shadow">
                        <span>{room.size}</span> • <span>{room.capacity}</span>
                      </div>
                      <span className="font-serif font-black text-xl text-brand-amber drop-shadow">
                        KES {room.pricePerNight.toLocaleString()}{" "}
                        <span className="text-xs text-white/80 font-normal">/ night</span>
                      </span>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-serif font-black text-xl text-brand-maroon">
                        {room.name}
                      </h3>
                      <p className="text-xs text-brand-dark/60 font-semibold mt-0.5">
                        {room.bedType}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-brand-dark/75 leading-relaxed">
                      {room.description}
                    </p>

                    {/* Amenities list */}
                    <div className="pt-2 border-t border-brand-cream">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-maroon block mb-2">
                        Included Amenities:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {room.amenities.map((am) => (
                          <div key={am} className="flex items-center gap-2 text-xs text-brand-dark/80">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-amber-dark flex-shrink-0" />
                            <span>{am}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="p-6 pt-0 border-t border-brand-cream flex items-center justify-between gap-4 mt-4">
                  <div className="text-xs text-brand-dark/60">
                    <span>Includes 24/7 desk &amp; parking</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/services/accommodation"
                      className="px-4 py-2.5 rounded-xl border border-brand-maroon/20 text-xs font-bold text-brand-maroon hover:bg-brand-cream transition-colors"
                    >
                      Room Details
                    </Link>
                    <Link
                      href={`/book?service=accommodation&room=${encodeURIComponent(room.name)}`}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-all shadow active:scale-95"
                    >
                      <span>Reserve Room</span>
                      <ArrowRight className="w-3.5 h-3.5 text-brand-amber" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Booking Policies Strip */}
          <div className="bg-brand-cream/60 rounded-2xl border border-brand-maroon/10 p-6 sm:p-8 space-y-4">
            <h4 className="font-serif font-bold text-base text-brand-maroon">
              Hospitality &amp; Check-In Policies
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-brand-dark/80">
              <div>
                <strong className="text-brand-maroon block mb-1">Check-in &amp; Check-out</strong>
                <p>Check-in from <strong>12:00 PM</strong> daily. Check-out is by <strong>10:00 AM</strong>. Early check-in or late departure can be arranged upon prior notice.</p>
              </div>
              <div>
                <strong className="text-brand-maroon block mb-1">Breakfast Inclusions</strong>
                <p>Rates include complimentary chef-prepared farm breakfast served in our main dining room or garden terrace from <strong>6:30 AM to 10:00 AM</strong>.</p>
              </div>
              <div>
                <strong className="text-brand-maroon block mb-1">Gated 24/7 Security</strong>
                <p>Continuous perimeter security, CCTV monitoring, and dedicated illuminated guest parking for private vehicles, pickups, and tour vans.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
