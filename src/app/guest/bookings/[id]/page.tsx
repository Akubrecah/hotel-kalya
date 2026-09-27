"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  PhoneCall,
  Printer,
  ArrowLeft,
  XCircle,
  AlertTriangle,
  Download,
  RefreshCw,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { Booking } from "@/types/hospitality";
import { buildContextualWhatsAppUrl } from "@/lib/whatsapp";
import { exportElementToRealPdf } from "@/lib/pdf-generator";

export default function GuestBookingDetailPage() {
  const params = useParams();
  const bookingId = (params?.id as string) || "";

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await fetch("/api/bookings");
        const json = await res.json();
        if (json.success && Array.isArray(json.bookings)) {
          const found = json.bookings.find(
            (b: Booking) => b.id.toUpperCase() === bookingId.toUpperCase()
          );
          if (found) {
            setBooking(found);
          } else {
            setErrorMsg("Reservation not found.");
          }
        }
      } catch {
        setErrorMsg("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [bookingId]);

  const handleCancelBooking = async () => {
    if (!booking) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "CANCELLED",
          operatorName: `${booking.guestName} (Self-Service Cancel)`,
        }),
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setBooking(data.booking);
        setShowCancelModal(false);
      } else {
        alert(data.error || "Failed to cancel reservation.");
      }
    } catch {
      alert("Network error cancelling reservation.");
    } finally {
      setCancelling(false);
    }
  };

  const handleDownloadRealPdf = async () => {
    if (!booking) return;
    setGeneratingPdf(true);
    await exportElementToRealPdf("guest-booking-voucher-container", {
      filename: `Hotel-Kalya-Voucher-${booking.id}.pdf`,
      footerText: `Hotel Kalya Kapenguria • Official Voucher #${booking.id}`,
    });
    setGeneratingPdf(false);
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 max-w-4xl mx-auto">
        <p className="text-xs text-gray-400 animate-pulse">Loading reservation voucher...</p>
      </div>
    );
  }

  if (errorMsg || !booking) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 max-w-4xl mx-auto space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-gray-800">{errorMsg || "Reservation Not Found"}</h2>
        <p className="text-xs text-gray-500">
          We could not locate reference <strong className="font-mono">{bookingId}</strong>.
        </p>
        <Link
          href="/guest/bookings"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-maroon text-white font-bold text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Bookings</span>
        </Link>
      </div>
    );
  }

  const whatsappHref = buildContextualWhatsAppUrl({
    serviceKey: "accommodation",
    roomName: `Room ${booking.roomNumber} (${booking.roomType})`,
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate,
    guestsCount: booking.adults + booking.children,
    customMessage: `Inquiry regarding my reservation ${booking.id}`,
  });


  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Actions & Breadcrumb (Hidden during print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link
          href="/guest/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-brand-maroon transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Bookings</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            disabled={generatingPdf}
            onClick={handleDownloadRealPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-maroon text-white font-bold text-xs shadow-sm hover:bg-brand-maroon-dark transition-all disabled:opacity-50"
            title="Download Real PDF File"
          >
            {generatingPdf ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-amber" />
            ) : (
              <Download className="w-3.5 h-3.5 text-brand-amber" />
            )}
            <span>{generatingPdf ? "Generating..." : "Download Real PDF (.pdf)"}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs shadow-sm transition-all"
            title="Browser Print"
          >
            <Printer className="w-3.5 h-3.5 text-gray-500" />
            <span>Print Slip</span>
          </button>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>WhatsApp Desk</span>
          </a>

          {booking.status !== "CANCELLED" && booking.status !== "CHECKED_OUT" && (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-bold text-xs transition-all"
            >
              <XCircle className="w-3.5 h-3.5 text-red-500" />
              <span>Cancel Stay</span>
            </button>
          )}
        </div>
      </div>

      {/* Official Printable Voucher Document */}
      <div
        id="guest-booking-voucher-container"
        className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-md space-y-8 print:shadow-none print:border-none print:p-0"
      >
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-gray-200 pb-8">
          <div>
            <BrandLogo size="md" hideTagline />
            <p className="text-xs text-gray-500 mt-2">
              Kapenguria, West Pokot County, Kenya • Phone: +254 719 766649
            </p>
            <p className="text-[11px] text-gray-400">
              Email: reservations@hotelkalya.com • Web: www.hotelkalya.com
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-maroon/70">
              Official Booking Voucher
            </span>
            <p className="font-mono text-xl sm:text-2xl font-bold text-brand-maroon">
              {booking.id}
            </p>
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase ${
                  booking.status === "CONFIRMED"
                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                    : booking.status === "CHECKED_IN"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : booking.status === "CANCELLED"
                    ? "bg-red-100 text-red-800 border border-red-300"
                    : "bg-gray-100 text-gray-800 border border-gray-300"
                }`}
              >
                {booking.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-[10px] text-gray-400">
              Issued: {new Date(booking.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Guest & Reservation Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Guest Information */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
              Guest Particulars
            </h3>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5 text-xs">
              <p className="font-bold text-sm text-gray-900">{booking.guestName}</p>
              <p className="text-gray-600">Phone: {booking.guestPhone}</p>
              <p className="text-gray-600">Email: {booking.guestEmail}</p>
              <p className="text-gray-600">
                Party Size: {booking.adults} Adults {booking.children > 0 ? `, ${booking.children} Children` : ""}
              </p>
            </div>
          </div>

          {/* Accommodation Information */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
              Room Details
            </h3>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5 text-xs">
              <p className="font-bold text-sm text-brand-maroon">
                Room {booking.roomNumber} — {booking.roomType}
              </p>
              <p className="text-gray-600">Check-in: <strong>{booking.checkInDate}</strong> (2:00 PM)</p>
              <p className="text-gray-600">Check-out: <strong>{booking.checkOutDate}</strong> (10:00 AM)</p>
              <p className="text-gray-600">Duration: <strong>{booking.nights} Nights</strong></p>
            </div>
          </div>
        </div>

        {/* Financial Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
            Billing Summary
          </h3>
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Item &amp; Description</th>
                  <th className="py-3 px-4 text-center">Nights</th>
                  <th className="py-3 px-4 text-right">Rate / Night</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-gray-800">
                    Room {booking.roomNumber} ({booking.roomType})
                  </td>
                  <td className="py-3.5 px-4 text-center text-gray-600">{booking.nights}</td>
                  <td className="py-3.5 px-4 text-right text-gray-600">
                    KES {(booking.totalAmount / booking.nights).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-gray-900">
                    KES {booking.totalAmount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-brand-cream/60 border-t border-gray-200 font-bold">
                <tr>
                  <td colSpan={3} className="py-3.5 px-4 text-brand-maroon font-serif text-sm">
                    Total Payable Amount (Incl. VAT &amp; Tourism Fund):
                  </td>
                  <td className="py-3.5 px-4 text-right text-brand-maroon font-serif text-base font-extrabold">
                    KES {booking.totalAmount.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="py-2 px-4 text-[11px] text-gray-500 font-normal">
                    Payment Status: <strong className="text-emerald-700">{booking.paymentStatus}</strong> ({booking.paymentMethod || "M-Pesa STK / Cash on Arrival"})
                  </td>
                  <td className="py-2 px-4 text-right text-[11px] text-gray-500 font-normal">
                    Currency: KES
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Terms & Policies */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-1.5">
          <p className="font-bold text-gray-800">Stay &amp; Check-In Policies:</p>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-500">
            <li>Check-in is from 2:00 PM. Early check-in is subject to room availability upon arrival.</li>
            <li>Check-out is strictly by 10:00 AM to allow our housekeeping team to sanitize rooms for arriving guests.</li>
            <li>A valid national identification card or passport must be presented at the front desk upon check-in.</li>
            <li>Free cancellation is permitted up to 24 hours prior to arrival date.</li>
          </ul>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-4 border-t border-gray-100 text-[11px] text-gray-400">
          Thank you for choosing Hotel Kalya. We look forward to offering you hospitality redefined.
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-gray-900 font-serif">Cancel Reservation?</h3>
              <p className="text-xs text-gray-500">
                Are you sure you want to cancel booking <strong className="font-mono">{booking.id}</strong>? The room dates will immediately become available for other guests.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors"
              >
                Keep Stay
              </button>
              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
