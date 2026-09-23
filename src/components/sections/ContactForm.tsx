"use client";

import { useState } from "react";
import { Send, CheckCircle2, MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/constants";

const INQUIRY_TYPES = [
  "Room & Suite Reservations",
  "Food Service / Restaurant Table",
  "Conference & Seminar Hall",
  "Outside Catering Services",
  "Kalya Gardens / Photoshoot Access",
  "Private Events & Celebrations",
  "Corporate Billing / Procurement",
  "General Inquiries & Feedback",
];

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: INQUIRY_TYPES[0],
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const text = encodeURIComponent(
      `*New Contact Message — Hotel Kalya Website*\n\n` +
        `👤 *Name:* ${formData.name}\n` +
        `📞 *Phone:* ${formData.phone}\n` +
        `✉️ *Email:* ${formData.email || "Not provided"}\n` +
        `🏷️ *Inquiry Regarding:* ${formData.subject}\n` +
        `💬 *Message:* ${formData.message}`
    );

    const waUrl = `https://wa.me/${BRAND.phoneClean}?text=${text}`;

    setTimeout(() => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }, 600);
  };

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-amber-light shadow-lg">
      <div className="mb-8">
        <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
          Send a Message
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-brand-maroon-dark mt-1">
          How Can We Help You?
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Have questions about room rates, conference packages, outside catering,
          or garden bookings? Send us your message and our desk will respond promptly.
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-emerald-900">
            Thank You, {formData.name || "Guest"}!
          </h3>
          <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
            Your message has been initiated. We are connecting you directly to our front desk team via WhatsApp (
            <strong>{BRAND.phone}</strong>).
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "",
                  phone: "",
                  email: "",
                  subject: INQUIRY_TYPES[0],
                  message: "",
                });
              }}
              className="text-xs text-brand-maroon underline font-bold hover:text-brand-maroon-dark"
            >
              Send another message
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mary Jepkemoi"
                value={formData.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full bg-brand-cream/40 border border-brand-amber-light rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-brand-amber focus:outline-none transition-shadow"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+254 7XX XXX XXX"
                value={formData.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full bg-brand-cream/40 border border-brand-amber-light rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-brand-amber focus:outline-none transition-shadow"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full bg-brand-cream/40 border border-brand-amber-light rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-brand-amber focus:outline-none transition-shadow"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Inquiry Topic *
              </label>
              <select
                value={formData.subject}
                onChange={(e) => update("subject", e.target.value)}
                className="w-full bg-brand-cream/40 border border-brand-amber-light rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-brand-amber focus:outline-none transition-shadow"
              >
                {INQUIRY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Your Message or Questions *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Tell us what you are planning, preferred dates, number of people, or specific requirements..."
              value={formData.message}
              onChange={(e) => update("message", e.target.value)}
              className="w-full bg-brand-cream/40 border border-brand-amber-light rounded-xl p-3.5 text-sm text-gray-800 focus:ring-2 focus:ring-brand-amber focus:outline-none transition-shadow"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Send Direct Message (Instant Response)</span>
            <Send className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-center text-[11px] text-gray-500 pt-1">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Connects directly with Hotel Kalya Front Desk WhatsApp ({BRAND.phone})</span>
          </div>
        </form>
      )}
    </div>
  );
}
