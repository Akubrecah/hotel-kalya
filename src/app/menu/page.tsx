"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Utensils,
  Search,
  ShoppingBag,
  Flame,
  Coffee,
  Wine,
  Star,
  ArrowRight,
  Clock,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { useCart } from "@/context/CartContext";
import { MenuItem } from "@/types";
import { MenuItemEntity, MenuCategoryEntity } from "@/types/hospitality";

const DIETARY_FILTERS = ["All", "Chef Special", "Halal", "Farm to Table", "Vegetarian", "Gluten-Free"];

type DietaryType = NonNullable<MenuItem["dietary"]>[number];

export default function MenuPage() {
  const { cartCount, total } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDietary, setSelectedDietary] = useState<string>("All");

  const [menuItems, setMenuItems] = useState<MenuItemEntity[]>([]);
  const [categories, setCategories] = useState<MenuCategoryEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [itemsRes, catsRes] = await Promise.all([
          fetch("/api/menu?published=true"),
          fetch("/api/menu/categories"),
        ]);

        if (!itemsRes.ok || !catsRes.ok) {
          throw new Error("Unable to load latest menu from CMS");
        }

        const itemsData = await itemsRes.json();
        const catsData = await catsRes.json();

        setMenuItems(itemsData.items || []);
        setCategories(catsData.categories || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load menu items");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const dynamicTabs = useMemo(() => {
    const tabs = [{ id: "all", label: "All Items", icon: Utensils }];
    categories.forEach((cat) => {
      let icon = Utensils;
      const slug = cat.slug.toLowerCase();
      if (slug.includes("breakfast") || slug.includes("coffee") || slug.includes("tea")) {
        icon = Coffee;
      } else if (slug.includes("dinner") || slug.includes("special") || slug.includes("grill")) {
        icon = Flame;
      } else if (slug.includes("drink") || slug.includes("beverage") || slug.includes("juice")) {
        icon = Wine;
      } else if (slug.includes("chef") || slug.includes("star")) {
        icon = Star;
      }
      tabs.push({
        id: cat.slug,
        label: cat.label,
        icon,
      });
    });
    return tabs;
  }, [categories]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Search matching
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.ingredients && item.ingredients.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase())));

      // Category matching
      const matchesCategory =
        selectedCategory === "all" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      // Dietary matching
      const matchesDietary =
        selectedDietary === "All" ||
        (item.dietary ? item.dietary.includes(selectedDietary as DietaryType) : false);

      return matchesSearch && matchesCategory && matchesDietary;
    });
  }, [menuItems, searchQuery, selectedCategory, selectedDietary]);

  return (
    <div className="bg-white min-h-screen pb-24">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Digital Menu & Food Ordering" },
        ]}
      />

      {/* Hero Header */}
      <section className="bg-brand-cream/80 py-12 lg:py-16 border-b border-brand-maroon/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/20 text-brand-maroon text-xs font-bold uppercase tracking-wider mb-3">
                <Utensils className="w-3.5 h-3.5 text-brand-amber-dark" />
                <span>Hotel Kalya Restaurant • Daily 6:30 AM – 10:00 PM</span>
              </div>
              <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-brand-maroon leading-tight">
                Digital Dining Menu &amp; Ordering
              </h1>
              <p className="mt-4 text-base sm:text-lg text-brand-dark/80 leading-relaxed">
                Experience the authentic flavors of West Pokot. Freshly prepared highland breakfasts, slow-simmered organic Kienyeji chicken, prime charcoal goat Nyama Choma, and refreshing tropical blends.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-all shadow-md active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-brand-amber" />
                <span>View Cart ({cartCount})</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search, Filter Tabs & Dietary Selectors */}
      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-brand-cream py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {/* Search bar & quick category links */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes (e.g. Kienyeji, Nyama Choma, Tea)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-maroon/20 text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber bg-brand-cream/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-dark/50 hover:text-brand-maroon font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-bold text-brand-dark/60 uppercase tracking-wider whitespace-nowrap">
                Dietary:
              </span>
              {DIETARY_FILTERS.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDietary(d)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                    selectedDietary === d
                      ? "bg-brand-amber text-brand-maroon shadow-sm"
                      : "bg-brand-cream/80 text-brand-dark/70 hover:bg-brand-cream"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
            {dynamicTabs.map((tab) => {
              const IconComp = tab.icon;
              const active = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    active
                      ? "bg-brand-maroon text-white shadow-md"
                      : "bg-brand-cream/60 text-brand-dark/80 hover:bg-brand-cream hover:text-brand-maroon"
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${active ? "text-brand-amber" : "text-brand-dark/60"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Menu Cards Grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-brand-dark/60 font-semibold">
              Showing <strong>{filteredItems.length}</strong> freshly prepared dishes
            </p>
            {selectedCategory !== "all" && (
              <Link
                href={`/menu/${selectedCategory}`}
                className="text-xs font-bold text-brand-maroon hover:underline flex items-center gap-1"
              >
                <span>View Dedicated {dynamicTabs.find((t) => t.id === selectedCategory)?.label} Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
                  <div className="bg-gray-200 h-48 rounded-xl w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-8 bg-gray-200 rounded-lg w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-200 p-8">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-lg text-red-800">{error}</h3>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Menu</span>
              </button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-brand-cream/40 rounded-2xl border border-brand-maroon/10 p-8">
              <Utensils className="w-10 h-10 text-brand-dark/40 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-lg text-brand-maroon">No dishes match your filter</h3>
              <p className="text-xs text-brand-dark/60 mt-1 max-w-sm mx-auto">
                Try searching with different terms or reset your category and dietary filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedDietary("All");
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-brand-maroon text-white text-xs font-bold hover:bg-brand-maroon-dark transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredItems.map((item) => (
                <MenuItemCard key={item.id} item={item as unknown as MenuItem} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Floating Bottom Cart Bar if cart has items */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-40 animate-in slide-in-from-bottom-4 duration-300">
          <Link
            href="/cart"
            className="flex items-center justify-between gap-4 bg-brand-maroon text-white px-5 py-3.5 rounded-2xl shadow-2xl hover:bg-brand-maroon-dark transition-all border-2 border-brand-amber active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-brand-amber" />
                <span className="absolute -top-2 -right-2 bg-brand-amber text-brand-maroon text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold block">Your Order</span>
                <span className="text-[11px] text-white/80">{cartCount} items selected</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-serif font-bold text-sm text-brand-amber">
                KES {total.toLocaleString()}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-amber" />
              </span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
