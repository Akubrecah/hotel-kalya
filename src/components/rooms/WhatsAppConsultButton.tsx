"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { buildContextualWhatsAppUrl, WhatsAppInquiryContext } from "@/lib/whatsapp";
import { ServiceContact } from "@/types/hospitality";

interface WhatsAppConsultButtonProps {
  context: WhatsAppInquiryContext;
  className?: string;
  variant?: "primary" | "secondary" | "subtle";
  label?: string;
}

export function WhatsAppConsultButton({
  context,
  className = "",
  variant = "primary",
  label = "Consult on WhatsApp",
}: WhatsAppConsultButtonProps) {
  const [contact, setContact] = useState<ServiceContact | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    fetch("/api/service-contacts")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (data.success && data.contacts) {
          const matched = data.contacts.find(
            (c: ServiceContact) => c.serviceKey === context.serviceKey
          );
          if (matched) setContact(matched);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [context.serviceKey]);

  const targetUrl = buildContextualWhatsAppUrl(context, contact);

  let styleClasses =
    "bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md hover:shadow-lg";
  if (variant === "secondary") {
    styleClasses =
      "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold";
  } else if (variant === "subtle") {
    styleClasses = "text-emerald-700 hover:text-emerald-900 underline font-semibold";
  }

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs transition-all ${styleClasses} ${className}`}
      title={
        contact
          ? `Chat with ${contact.responsibleStaff} (${contact.roleTitle}) on WhatsApp`
          : "Chat with Hotel Kalya Front Desk"
      }
    >
      <MessageCircle className="w-4 h-4 text-emerald-100 fill-emerald-100" />
      <span>{label}</span>
    </a>
  );
}
