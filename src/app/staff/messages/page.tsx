"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  RefreshCw,
  PhoneCall,
} from "lucide-react";
import { staffFetch } from "@/lib/api-client";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  department?: string;
  status: "new" | "in_progress" | "resolved";
  createdAt: string;
}

export default function StaffMessagesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const loadInquiries = React.useCallback(async () => {
    try {
      const res = await staffFetch("/api/inquiries");
      const data = await res.json();
      if (data.success && Array.isArray(data.inquiries)) {
        setInquiries(data.inquiries);
      }
    } catch (err) {
      console.error("Failed to load inquiries", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchInquiries() {
      try {
        const res = await staffFetch("/api/inquiries");
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.inquiries)) {
          setInquiries(data.inquiries);
        }
      } catch (err) {
        console.error("Failed to load inquiries", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    fetchInquiries();
    return () => {
      ignore = true;
    };
  }, []);

  const handleResolve = (id: string) => {
    setResolvingId(id);
    setTimeout(() => {
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: "resolved" } : i))
      );
      setResolvingId(null);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon">
            Guest Communication &amp; Desk Inquiries
          </h1>
          <p className="text-xs text-gray-500">
            Incoming guest inquiries, special stay notes, and concierge triage requests
          </p>
        </div>

        <button
          type="button"
          onClick={loadInquiries}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brand-maroon ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Messages</span>
        </button>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400 animate-pulse bg-white rounded-3xl border">
            Checking guest communications inbox...
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-gray-800 text-base">Inbox Clean!</h3>
            <p className="text-xs text-gray-500">No active unresolved guest messages.</p>
          </div>
        ) : (
          inquiries.map((inq) => {
            const isResolved = inq.status === "resolved";
            const waUrl = `https://wa.me/${inq.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
              `Hello ${inq.name}, this is Hotel Kalya team responding to your request: "${inq.subject || inq.message}".`
            )}`;

            return (
              <div
                key={inq.id}
                className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all ${
                  isResolved
                    ? "opacity-60 border-gray-200"
                    : "border-brand-maroon/20 hover:border-brand-amber"
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-brand-maroon bg-brand-cream px-2 py-0.5 rounded">
                      {inq.id}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isResolved
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {inq.status}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(inq.createdAt).toLocaleDateString()} at{" "}
                      {new Date(inq.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-gray-900">
                    {inq.subject || "General Guest Assistance Request"}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    {inq.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 pt-1">
                    <span>Guest: <strong className="text-gray-800">{inq.name}</strong></span>
                    <span>Tel: <strong>{inq.phone}</strong></span>
                    <span>Email: <strong>{inq.email}</strong></span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Reply on WhatsApp</span>
                  </a>

                  {!isResolved && (
                    <button
                      type="button"
                      disabled={resolvingId === inq.id}
                      onClick={() => handleResolve(inq.id)}
                      className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 font-bold text-xs transition-colors"
                    >
                      {resolvingId === inq.id ? "Resolving..." : "Mark Handled"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
