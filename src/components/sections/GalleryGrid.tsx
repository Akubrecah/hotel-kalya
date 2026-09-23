"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2, Camera, Filter } from "lucide-react";
import { GALLERY_ITEMS, GALLERY_FILTERS, type GalleryItem } from "@/lib/constants";
import { Lightbox } from "@/components/ui/Lightbox";

export function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const filteredItems =
    activeCategory === "all"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const handleOpenLightbox = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  return (
    <div className="space-y-10">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-brand-maroon/70">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </div>
        {GALLERY_FILTERS.map((filter) => {
          const isActive = activeCategory === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => setActiveCategory(filter.value)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                isActive
                  ? "bg-brand-maroon text-brand-amber shadow-md"
                  : "bg-white text-gray-700 hover:bg-brand-amber-light/50 border border-brand-amber-light/70"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleOpenLightbox(item)}
            className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl border-2 border-brand-amber-light/80 transition-all duration-300"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            
            {/* Ambient Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark/90 via-brand-maroon-dark/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Hover Action Badge */}
            <div className="absolute top-4 right-4 bg-brand-maroon/80 backdrop-blur-sm text-brand-amber p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow">
              <Maximize2 className="w-4 h-4" />
            </div>

            {/* Content Details */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform transition-transform duration-300">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-brand-amber text-brand-maroon-dark px-2.5 py-0.5 rounded-full mb-1.5">
                {item.category}
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-brand-amber-light transition-colors">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State fallback */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-brand-cream rounded-2xl border border-brand-amber-light">
          <Camera className="w-12 h-12 text-brand-maroon/40 mx-auto mb-3" />
          <h4 className="font-serif text-lg font-bold text-brand-maroon-dark">
            No photos found in this category
          </h4>
          <p className="text-xs text-gray-600 mt-1">
            Please choose another category above to view our visual showcase.
          </p>
        </div>
      )}

      {/* Lightbox Modal */}
      <Lightbox
        item={selectedItem}
        items={filteredItems}
        isOpen={isLightboxOpen}
        onClose={handleCloseLightbox}
        onSelect={(item) => setSelectedItem(item)}
      />
    </div>
  );
}
