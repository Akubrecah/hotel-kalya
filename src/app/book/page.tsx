"use client";

import { useState } from "react";
import { Send, CheckCircle2, Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { BRAND, SERVICE_CATEGORIES } from "@/lib/constants";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GoogleMap } from "@/components/maps/GoogleMap";
import { DirectionsButton } from "@/components/maps/DirectionsButton";

export default function BookPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "Accommodation (Rooms & Suites)",
    date: "",
    guests: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const textMsg = encodeURIComponent(
      `*New Website Booking Enquiry - Hotel Kalya Kapenguria*\n\n` +
        `👤 *Name:* ${form.name || "Guest"}\n` +
        `📞 *Phone:* ${form.phone}\n` +
        `✉️ *Email:* ${form.email || "Not specified"}\n` +
        `🏨 *Service Required:* ${form.service}\n` +
        `📅 *Date / Check-In:* ${form.date || "Not specified"}\n` +
        `👥 *Number of Guests / Delegates:* ${form.guests || "Not specified"}\n` +
        `📝 *Notes/Message:* ${form.message || "Please provide rates and availability."}`
    );

    const waUrl = `https://wa.me/${BRAND.phoneClean}?text=${textMsg}`;

    setTimeout(() => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }, 600);
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <>
      {/* Breadcrumbs Strip */}
      <section className="bg-brand-cream border-b border-brand-amber-light/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Direct Reservations & Bookings" }]} />
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-brand-cream rounded-3xl p-6 sm:p-10 border border-brand-amber-light/90 shadow-lg">
              <div className="mb-8">
                <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
                  Direct Reservations & Enquiries
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-brand-maroon-dark mt-1">
                  Connect Directly With Our Desk
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Fill in your details below. Your submission directly formats
                  an official WhatsApp enquiry and registers your booking request
                  with Hotel Kalya staff.
                </p>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-emerald-900">
                    Enquiry Initiated!
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                    Thank you, <strong>{form.name || "Guest"}</strong>. We are
                    transferring your enquiry details directly to our
                    reservations desk on WhatsApp (
                    <strong>{BRAND.phone}</strong>).
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-brand-maroon underline font-bold"
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Chebet"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className="w-full bg-white border border-brand-amber-light rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-brand-amber focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+254 7XX XXX XXX"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className="w-full bg-white border border-brand-amber-light rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-brand-amber focus:outline-none"
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
                        placeholder="name@organization.com"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className="w-full bg-white border border-brand-amber-light rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-brand-amber focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Service Category *
                      </label>
                      <select
                        value={form.service}
                        onChange={(e) => update("service", e.target.value)}
                        className="w-full bg-white border border-brand-amber-light rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-brand-amber focus:outline-none"
                      >
                        {SERVICE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => update("date", e.target.value)}
                        className="w-full bg-white border border-brand-amber-light rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-brand-amber focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Number of Guests / Delegates
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2 adults, or 35 delegates"
                        value={form.guests}
                        onChange={(e) => update("guests", e.target.value)}
                        className="w-full bg-white border border-brand-amber-light rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-brand-amber focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Additional Notes or Special Requests
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify room preferences, dietary requirements, conference AV needs, or event timing..."
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      className="w-full bg-white border border-brand-amber-light rounded-xl p-3 text-sm text-gray-800 focus:ring-2 focus:ring-brand-amber focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Send Booking Enquiry (Instant WhatsApp & Desk)</span>
                    <Send className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-gray-500 text-center">
                    Instant response guaranteed during normal hotel service hours.
                    No booking charges applied online.
                  </p>
                </form>
              )}
            </div>

            {/* Contact Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              {/* Contact Card */}
              <div className="bg-brand-maroon-dark text-white rounded-3xl p-8 border-2 border-brand-amber shadow-xl">
                <div className="space-y-5">
                  <BrandLogo light />
                  <h3 className="font-serif text-xl font-bold text-white">
                    Official Contact Information
                  </h3>

                  <div className="space-y-4 pt-2">
                    <a
                      href={`tel:${BRAND.phone}`}
                      className="flex items-start gap-3.5 text-white/90 hover:text-brand-amber transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-brand-amber">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-brand-amber-light font-semibold block">
                          Official Cell
                        </span>
                        <span className="font-bold text-base">
                          {BRAND.phone}
                        </span>
                      </div>
                    </a>

                    <a
                      href={`mailto:${BRAND.email}`}
                      className="flex items-start gap-3.5 text-white/90 hover:text-brand-amber transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-brand-amber">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-brand-amber-light font-semibold block">
                          Official Email
                        </span>
                        <span className="font-semibold text-sm break-all">
                          {BRAND.email}
                        </span>
                      </div>
                    </a>

                    <div className="flex items-start gap-3.5 text-white/90">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-brand-amber">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-brand-amber-light font-semibold block">
                          Physical Location
                        </span>
                        <span className="font-medium text-sm">
                          {BRAND.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 text-white/90">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-brand-amber">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-brand-amber-light font-semibold block">
                          Service Hours
                        </span>
                        <span className="font-medium text-sm">
                          Reception: {BRAND.operatingHours.reception} •
                          Restaurant: {BRAND.operatingHours.restaurant}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/15">
                    <a
                      href={`https://wa.me/${BRAND.phoneClean}?text=Hello%20Hotel%20Kalya%20Kapenguria`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp Directly</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Map Card */}
              <div className="bg-white rounded-2xl p-6 border border-brand-amber-light shadow-md">
                <h4 className="font-serif font-bold text-base text-brand-maroon-dark mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-amber" />
                  Locate Hotel Kalya in Kapenguria
                </h4>
                <p className="text-xs text-gray-600 mb-4">
                  Easily accessible along the main tarmac route connecting Kitale
                  to Kapenguria and Lodwar. Secure, gated complex with ample
                  parking.
                </p>

                <div className="space-y-3">
                  <GoogleMap height="200px" zoom={14} showCard={false} />
                  <DirectionsButton size="sm" className="w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
