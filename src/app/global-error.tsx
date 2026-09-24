"use client";

import React from "react";
import Link from "next/link";
import { BRAND } from "@/lib/constants";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center p-6 bg-[#FDFBF7] font-sans antialiased text-[#1E0B0F]">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl border border-[#F2AE1C]/40 shadow-xl">
          <div className="inline-block px-3 py-1 rounded-full bg-[#F2AE1C]/20 text-[#7C1322] text-xs font-bold uppercase tracking-widest">
            System Notice
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#7C1322]">
            Hotel Kalya Kapenguria
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            A critical system exception was encountered. Our technical team has been alerted. Please reload or contact the front desk.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              type="button"
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#7C1322] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#580B16] transition-colors shadow-sm"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-[#7C1322] text-[#7C1322] text-xs font-bold uppercase tracking-wider hover:bg-[#FDFBF7] transition-colors"
            >
              Return Home
            </Link>
          </div>
          <p className="text-xs text-gray-500 pt-2 border-t border-gray-100">
            Front Desk Hotline: <a href={`tel:${BRAND.phone}`} className="font-bold text-[#7C1322] underline">{BRAND.phone}</a>
          </p>
        </div>
      </body>
    </html>
  );
}
