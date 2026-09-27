"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { getStandardWhatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppFAB() {
  const [waNumber, setWaNumber] = useState(BRAND.phoneClean);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings?.officialWhatsApp) {
            setWaNumber(data.settings.officialWhatsApp.replace(/\D/g, ""));
          } else if (data.settings?.phone) {
            setWaNumber(data.settings.phone.replace(/\D/g, ""));
          }
        }
      } catch {
        // Fallback to default
      }
    }
    loadSettings();
  }, []);

  const whatsappUrl = getStandardWhatsAppUrl(
    "Hello Hotel Kalya Front Desk, I am reaching out via your website to enquire about booking & hospitality services.",
    waNumber
  );

  return (
    <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-[calc(1.25rem+env(safe-area-inset-right,0px))] z-50 group flex flex-col items-end">
      {/* Desktop Tooltip */}
      <div
        role="tooltip"
        className="pointer-events-none mb-2 hidden md:block opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0"
      >
        <div className="bg-brand-dark/95 backdrop-blur-md text-white border border-brand-amber/30 text-[11px] font-semibold py-1.5 px-3 rounded-xl shadow-xl flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Front Desk Live on WhatsApp</span>
        </div>
      </div>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Hotel Kalya Front Desk on WhatsApp"
        className="bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white p-3.5 sm:p-4 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:shadow-[0_10px_25px_rgba(37,211,102,0.4)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      >
        <MessageCircle className="w-6 h-6 flex-shrink-0 animate-subtle-pulse" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold uppercase tracking-wider pr-1">
          WhatsApp Desk
        </span>
      </a>
    </div>
  );
}
