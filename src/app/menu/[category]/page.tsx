import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { MENU_ITEMS, MENU_CATEGORIES } from "@/lib/menu-data";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return MENU_CATEGORIES.map((cat) => ({
    category: cat.id,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const catData = MENU_CATEGORIES.find((c) => c.id === category);

  if (!catData) {
    return {
      title: "Menu Category Not Found",
    };
  }

  return {
    title: `${catData.label} Menu — Farm-Fresh Dining in Kapenguria | Hotel Kalya`,
    description: catData.description,
    openGraph: {
      title: `${catData.label} Menu | Hotel Kalya Kapenguria`,
      description: catData.description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const catData = MENU_CATEGORIES.find((c) => c.id === category);

  if (!catData) {
    notFound();
  }

  const categoryItems = MENU_ITEMS.filter((item) => item.category === category);

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Digital Menu", href: "/menu" },
          { label: catData.label },
        ]}
      />

      {/* Category Hero */}
      <section className="bg-brand-cream/80 py-12 lg:py-16 border-b border-brand-maroon/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <Link
                href="/menu"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-maroon hover:text-brand-amber-dark transition-colors mb-3"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Full Digital Menu</span>
              </Link>
              <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-brand-maroon leading-tight">
                {catData.label} Selection
              </h1>
              <p className="mt-3 text-base sm:text-lg text-brand-dark/80 leading-relaxed">
                {catData.description}
              </p>
            </div>

            <Link
              href="/cart"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-all shadow-md self-start md:self-end"
            >
              <ShoppingBag className="w-4 h-4 text-brand-amber" />
              <span>Go to Cart</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Submenu Navigation Tabs */}
      <section className="bg-white border-b border-brand-cream py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <Link
              href="/menu"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-brand-dark/70 hover:bg-brand-cream whitespace-nowrap"
            >
              All Categories
            </Link>
            {MENU_CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/menu/${c.id}`}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  c.id === category
                    ? "bg-brand-maroon text-white shadow-sm"
                    : "text-brand-dark/70 hover:bg-brand-cream hover:text-brand-maroon"
                }`}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Items Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categoryItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
