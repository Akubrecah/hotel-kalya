"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Utensils, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

interface DisplayOrder {
  id: string;
  date: string;
  type: string;
  itemsCount: number;
  total: number;
  status: string;
}

export default function AccountOrdersPage() {
  const [orders] = useState<DisplayOrder[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = JSON.parse(localStorage.getItem("hotel_kalya_user_orders") || "[]");
      if (stored.length > 0) return stored;
    } catch {
      // Ignore
    }
    return [
      {
        id: "ORD-938210",
        date: "Yesterday at 7:45 PM",
        type: "Hotel Room Delivery (Suite 204)",
        itemsCount: 3,
        total: 2850,
        status: "Delivered to Room",
      },
      {
        id: "ORD-519283",
        date: "24 Aug 2026",
        type: "Table Dine-In (Garden Terrace)",
        itemsCount: 4,
        total: 3950,
        status: "Completed",
      },
    ];
  });

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/account" },
          { label: "Food & Dining Orders" },
        ]}
      />

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link
                href="/account"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-maroon hover:underline mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Account Overview</span>
              </Link>
              <h1 className="font-serif font-black text-2xl sm:text-3xl text-brand-maroon">
                Dining &amp; Kitchen Orders
              </h1>
            </div>

            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-colors shadow self-start sm:self-center"
            >
              <Utensils className="w-3.5 h-3.5 text-brand-amber" />
              <span>Browse Digital Menu</span>
            </Link>
          </div>

          <div className="space-y-4">
            {orders.map((ord, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-brand-maroon/10 shadow-sm p-6 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-cream pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-brand-maroon">
                      Order Reference: #{ord.id}
                    </span>
                    <p className="text-xs text-brand-dark/60 mt-0.5">{ord.date}</p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold self-start sm:self-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{ord.status}</span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-brand-dark/80 pt-1">
                  <div>
                    <span className="font-semibold block">{ord.type}</span>
                    <span className="text-[11px] text-brand-dark/60">
                      Total Servings: {ord.itemsCount} dishes
                    </span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-brand-dark/50 block uppercase tracking-wider font-bold">
                      Order Total
                    </span>
                    <span className="font-serif font-black text-brand-maroon text-base">
                      KES {ord.total?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
