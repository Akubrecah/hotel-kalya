"use client";

import { MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/constants";

export function WhatsAppFAB() {
  return (
    <a
      href={`https://wa.me/${BRAND.phoneClean}?text=Hello%20Hotel%20Kalya,%20I%20am%20reaching%20out%20via%20your%20website%20to%20enquire%20about%20booking.`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Direct WhatsApp Booking"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition-transform hover:scale-105"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold uppercase tracking-wider pr-1">
        WhatsApp Desk
      </span>
    </a>
  );
}
