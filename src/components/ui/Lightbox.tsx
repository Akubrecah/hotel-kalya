"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem } from "@/lib/constants";

interface LightboxProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: GalleryItem) => void;
}

export function Lightbox({
  item,
  items,
  isOpen,
  onClose,
  onSelect,
}: LightboxProps) {
  const currentIndex = item ? items.findIndex((i) => i.id === item.id) : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelect(items[currentIndex - 1]);
    } else {
      onSelect(items[items.length - 1]);
    }
  }, [currentIndex, items, onSelect]);

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      onSelect(items[currentIndex + 1]);
    } else {
      onSelect(items[0]);
    }
  }, [currentIndex, items, onSelect]);

  // Handle keyboard events (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Lock scroll on background
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300 p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Top Bar with Info and Close */}
      <div
        className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between text-white z-20 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-medium text-white/80 bg-white/10 px-3 py-1 rounded-full border border-white/10">
            {currentIndex + 1} of {items.length}
          </span>
          <span className="text-xs sm:text-sm font-semibold capitalize text-brand-amber">
            {item.category}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-amber"
          aria-label="Close lightbox"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Prev Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/50 hover:bg-brand-maroon text-white transition-all focus:outline-none focus:ring-2 focus:ring-brand-amber"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      {/* Main Image Container */}
      <div
        className="relative max-w-5xl max-h-[80vh] w-full h-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[65vh] sm:h-[75vh] rounded-xl overflow-hidden shadow-2xl">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-contain"
            sizes="(max-width: 1280px) 100vw, 1200px"
            priority
          />
        </div>

        {/* Caption */}
        <div className="mt-4 text-center max-w-xl px-4">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
            {item.title}
          </h3>
          <p className="text-xs text-white/70 mt-1">
            Hotel Kalya — Kapenguria, West Pokot County
          </p>
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/50 hover:bg-brand-maroon text-white transition-all focus:outline-none focus:ring-2 focus:ring-brand-amber"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>
    </div>
  );
}
