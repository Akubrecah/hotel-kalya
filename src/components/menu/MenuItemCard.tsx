"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Check, Clock, Sparkles } from "lucide-react";
import { MenuItem } from "@/types";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);

  const handleAdd = () => {
    addToCart(item, 1, instructions);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
    setShowInstructions(false);
    setInstructions("");
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-brand-maroon/10 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Item Image */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-brand-cream">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[80%]">
            {item.featured && (
              <span className="inline-flex items-center gap-1 bg-brand-amber text-brand-maroon text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
                <Sparkles className="w-3 h-3" />
                <span>Featured</span>
              </span>
            )}
            {item.dietary?.map((tag) => (
              <span
                key={tag}
                className="bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded shadow"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Prep time badge */}
          {item.prepTime && (
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-brand-dark text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
              <Clock className="w-3 h-3 text-brand-amber-dark" />
              <span>{item.prepTime}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif font-bold text-base sm:text-lg text-brand-maroon leading-snug group-hover:text-brand-amber-dark transition-colors">
              {item.name}
            </h3>
          </div>

          <p className="text-xs text-brand-dark/70 leading-relaxed line-clamp-3">
            {item.description}
          </p>
        </div>
      </div>

      {/* Footer / Pricing & Cart */}
      <div className="p-5 pt-0 border-t border-brand-cream mt-2">
        {showInstructions && (
          <div className="mb-3 pt-3 animate-in fade-in">
            <label className="block text-[11px] font-bold text-brand-maroon mb-1">
              Special kitchen request (optional):
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Mild chili, no salt, extra kachumbari..."
              className="w-full px-2.5 py-1.5 text-xs rounded border border-brand-maroon/20 focus:outline-none focus:ring-1 focus:ring-brand-amber bg-white"
            />
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/50 block">
              Price
            </span>
            <span className="font-serif font-black text-lg text-brand-maroon">
              KES {item.price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowInstructions(!showInstructions)}
              className="text-[11px] font-semibold text-brand-dark/60 hover:text-brand-maroon underline"
              title="Add special instructions"
            >
              {showInstructions ? "Cancel note" : "+ Note"}
            </button>

            <button
              onClick={handleAdd}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow",
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-brand-maroon text-white hover:bg-brand-maroon-dark"
              )}
              aria-label={`Add ${item.name} to order`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-brand-amber" />
                  <span>Add to Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
