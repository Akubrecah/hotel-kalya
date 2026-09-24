"use client";

import React from "react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { BRAND } from "@/lib/constants";

interface DocumentPrintHeaderProps {
  docId: string;
  title: string;
  phase?: string;
  version?: string;
  status?: string;
  category?: string;
  author?: string;
  date?: string;
}

export function DocumentPrintHeader({
  docId,
  title,
  phase = "Executive Delivery Framework",
  version = "v1.0 (Production)",
  status = "Approved & Baseline Frozen",
  category = "Project Governance",
  author = "Hotel Kalya Digital Engineering & Client Directorate",
  date,
}: DocumentPrintHeaderProps) {
  const currentDate = date || new Date().toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="border-b-2 border-brand-maroon pb-6 mb-6">
      {/* Top Organization Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <BrandLogo size="md" />
          <div>
            <h1 className="font-serif text-2xl font-black text-brand-maroon tracking-wider">
              HOTEL KALYA
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-amber-dark">
              Hospitality Redefined • Kapenguria, West Pokot County
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Tel: {BRAND.phone} • Email: {BRAND.email} • Web: hotelkalya.com
            </p>
          </div>
        </div>

        {/* Document Classification Box */}
        <div className="text-right border border-brand-amber/40 bg-brand-cream/60 rounded-xl p-3 min-w-[200px]">
          <div className="text-[10px] uppercase font-bold tracking-widest text-brand-maroon">
            Official Project Document
          </div>
          <div className="font-mono text-base font-black text-brand-maroon-dark">
            {docId}
          </div>
          <div className="inline-block px-2 py-0.5 mt-1 rounded bg-brand-amber/20 text-brand-maroon-dark text-[10px] font-bold uppercase">
            {status}
          </div>
        </div>
      </div>

      {/* Gold Divider */}
      <div className="w-full h-1 bg-gradient-to-r from-brand-maroon via-brand-amber to-brand-maroon my-4 rounded-full" />

      {/* Document Control Summary Table */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs bg-gray-50 p-3 rounded-xl border border-gray-200">
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Deliverable</span>
          <span className="font-bold text-gray-900 truncate block">{title}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Lifecycle Stage</span>
          <span className="font-medium text-gray-800 truncate block">{phase}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Version &amp; Date</span>
          <span className="font-medium text-gray-800 block truncate">{version} • {currentDate}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Governance Class</span>
          <span className="font-medium text-gray-800 truncate block">{category}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Lead Authority</span>
          <span className="font-medium text-gray-800 truncate block">{author}</span>
        </div>
      </div>
    </div>
  );
}
