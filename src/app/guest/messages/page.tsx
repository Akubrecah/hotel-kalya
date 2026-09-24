"use client";

import React, { useState, useEffect } from "react";
import {
  PhoneCall,
  Clock,
  Send,
  CheckCircle2,
} from "lucide-react";
import { ServiceContact } from "@/types/hospitality";
import { useAuth } from "@/context/AuthContext";

export default function GuestMessagesPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<ServiceContact[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [department, setDepartment] = useState("accommodation");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadContacts() {
      try {
        const res = await fetch("/api/service-contacts");
        const json = await res.json();
        if (json.success && Array.isArray(json.contacts)) {
          setContacts(json.contacts);
        }
      } catch (err) {
        console.error("Failed to load contacts", err);
      } finally {
        setLoading(false);
      }
    }
    loadContacts();
  }, []);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !subject.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.name || "Guest",
          email: user?.email || "guest@hotelkalya.com",
          phone: user?.phone || "+254 712 345678",
          department,
          subject,
          message,
          type: "guest_message",
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setMessage("");
        setSubject("");
      }
    } catch (err) {
      console.error("Inquiry submission error", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon">
          Front Desk &amp; Concierge Messaging Hub
        </h1>
        <p className="text-xs text-gray-500">
          Connect directly with Hotel Kalya department heads on WhatsApp or send an internal message
        </p>
      </div>

      {/* Department Contacts Cards */}
      <div className="space-y-4">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
          Department Duty Personnel (Instant WhatsApp)
        </h2>

        {loading ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-gray-100 animate-pulse text-xs text-gray-400">
            Loading departmental contacts...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((c) => {
              const waUrl = `https://wa.me/${c.whatsappNumber}?text=${encodeURIComponent(
                `Hello ${c.responsibleStaff} (${c.roleTitle}), I am inquiring about ${c.serviceTitle} at Hotel Kalya.`
              )}`;

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-sm flex flex-col justify-between hover:border-brand-amber/50 hover:shadow-md transition-all space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-maroon bg-brand-cream px-2 py-0.5 rounded-lg border border-brand-maroon/10">
                        {c.department}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-brand-amber" />
                        {c.availabilityHours}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-gray-900">{c.responsibleStaff}</h3>
                    <p className="text-xs text-brand-amber-dark font-medium">{c.roleTitle}</p>

                    <p className="text-[11px] text-gray-500 italic">
                      &quot;{c.quickGreeting}&quot;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-gray-500">
                      <p>Tel: {c.phone}</p>
                    </div>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Direct In-App Message Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-5">
        <div>
          <h2 className="text-lg font-serif font-bold text-brand-maroon">
            Send an Internal Front Desk Note
          </h2>
          <p className="text-xs text-gray-500">
            Have special requirements, requests for extra towels, wakeup calls, or dietary specifications? Send a note to our staff.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-emerald-900">Message Delivered to Front Desk</h3>
            <p className="text-xs text-emerald-700">
              Our front desk supervisor will review your request and take action immediately.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-2 px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
            >
              Send Another Note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitInquiry} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Target Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber text-xs"
                >
                  <option value="accommodation">Accommodation &amp; Front Desk</option>
                  <option value="restaurant">Restaurant &amp; Room Dining</option>
                  <option value="conference">Conference &amp; Meeting Hall</option>
                  <option value="catering">Outside Catering</option>
                  <option value="garden">Garden Weddings &amp; Events</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wake-up call at 6:30 AM / Extra Pillows"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Detailed Message</label>
              <textarea
                required
                rows={4}
                placeholder="Write your request or inquiry in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber text-xs resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-all shadow disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-brand-amber" />
                <span>{submitting ? "Sending..." : "Submit to Desk"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
