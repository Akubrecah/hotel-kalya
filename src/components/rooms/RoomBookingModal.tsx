"use client";

import React, { useState } from "react";
import { Room, Booking } from "@/types/hospitality";
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  X,
  Printer,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { WhatsAppConsultButton } from "./WhatsAppConsultButton";

interface RoomBookingModalProps {
  room: Room;
  initialCheckIn?: string;
  initialCheckOut?: string;
  onClose: () => void;
  onBookingSuccess?: (booking: Booking) => void;
}

export function RoomBookingModal({
  room,
  initialCheckIn = "2026-09-25",
  initialCheckOut = "2026-09-28",
  onClose,
  onBookingSuccess,
}: RoomBookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1 = Dates & Guests, 2 = Guest Info, 3 = Confirmation
  const [checkInDate, setCheckInDate] = useState(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("+254 7");
  const [guestEmail, setGuestEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"Paid" | "Deposit" | "Pay on Arrival">("Pay on Arrival");

  const [checkingAvail, setCheckingAvail] = useState(false);
  const [availError, setAvailError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Calculate nights & pricing
  const inTime = new Date(checkInDate).getTime();
  const outTime = new Date(checkOutDate).getTime();
  const nights = !isNaN(inTime) && !isNaN(outTime) && outTime > inTime
    ? Math.max(1, Math.round((outTime - inTime) / (1000 * 60 * 60 * 24)))
    : 1;
  const totalPrice = nights * room.basePrice;

  const handleVerifyAndProceed = async () => {
    setAvailError(null);
    setCheckingAvail(true);

    try {
      const res = await fetch(
        `/api/rooms?checkIn=${encodeURIComponent(checkInDate)}&checkOut=${encodeURIComponent(checkOutDate)}`
      );
      const data = await res.json();

      if (!data.success) {
        setAvailError(data.error || "Could not check room availability.");
        setCheckingAvail(false);
        return;
      }

      const isRoomAvailable = data.availableRooms.some(
        (r: Room) => r.id === room.id || r.roomNumber === room.roomNumber
      );

      if (!isRoomAvailable) {
        setAvailError(
          `Room ${room.roomNumber} is already reserved for the selected dates. Please choose different dates or explore another available suite.`
        );
        setCheckingAvail(false);
        return;
      }

      // Available! Move to guest details
      setCheckingAvail(false);
      setStep(2);
    } catch (err) {
      setAvailError("Network verification failed. Please try again: " + String(err));
      setCheckingAvail(false);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setAvailError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName,
          guestPhone,
          guestEmail,
          roomId: room.id,
          checkInDate,
          checkOutDate,
          adults,
          children,
          paymentStatus,
          paymentMethod: paymentStatus === "Pay on Arrival" ? "Pay at Front Desk" : "M-Pesa STK Push",
          specialRequests,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAvailError(data.error || "Reservation failed. Please check details.");
        setSubmitting(false);
        return;
      }

      setConfirmedBooking(data.reservation);
      setSubmitting(false);
      setStep(3);
      if (onBookingSuccess) {
        onBookingSuccess(data.reservation);
      }
    } catch (err) {
      setAvailError("Failed to submit booking: " + String(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden border border-brand-amber-light">
        {/* Modal Top Bar */}
        <div className="bg-brand-maroon-dark text-white p-5 px-6 flex items-center justify-between border-b border-brand-maroon">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-amber block">
              Step {step} of 3 • Direct Reservation
            </span>
            <h2 className="font-serif font-bold text-lg text-white truncate">
              {room.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Step 1: Dates & Guests */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="bg-brand-cream/60 p-4 rounded-2xl border border-brand-amber-light/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500 block">Nightly Rate</span>
                  <span className="font-serif font-black text-base text-brand-maroon">
                    KES {room.basePrice.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 block">Estimated Total ({nights} nights)</span>
                  <span className="font-serif font-black text-base text-emerald-800">
                    KES {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Check-In Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-brand-maroon"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Check-Out Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={checkOutDate}
                      min={checkInDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-brand-maroon"
                    />
                  </div>
                </div>
              </div>

              {/* Guests Selector */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Adults
                  </label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value, 10))}
                    className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-xs font-medium bg-white"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} Adult{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Children
                  </label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(parseInt(e.target.value, 10))}
                    className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-xs font-medium bg-white"
                  >
                    {[0, 1, 2, 3].map((n) => (
                      <option key={n} value={n}>
                        {n} Child{n !== 1 ? "ren" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Error Message */}
              {availError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <p>{availError}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleVerifyAndProceed}
                  disabled={checkingAvail}
                  className="flex-1 py-3 px-4 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  {checkingAvail ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-brand-amber" />
                      <span>Checking Availability...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify &amp; Continue</span>
                      <ArrowRight className="w-4 h-4 text-brand-amber" />
                    </>
                  )}
                </button>

                <WhatsAppConsultButton
                  context={{
                    serviceKey: "accommodation",
                    roomName: room.name,
                    roomNumber: room.roomNumber,
                    checkInDate,
                    checkOutDate,
                    guestsCount: `${adults} Adults${children ? `, ${children} Children` : ""}`,
                    totalPrice,
                  }}
                  variant="secondary"
                  label="Ask via WhatsApp"
                />
              </div>
            </div>
          )}

          {/* Step 2: Guest Details & Special Requests */}
          {step === 2 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
                <div>
                  <span className="font-bold text-brand-maroon">{room.name}</span>
                  <p className="text-[11px] text-gray-600">
                    {checkInDate} to {checkOutDate} ({nights} nights) • KES {totalPrice.toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-brand-maroon font-bold underline"
                >
                  Change Dates
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. James Chemosit"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-maroon"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Phone Number (M-Pesa) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 712 345678"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-maroon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="guest@gmail.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-maroon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Payment Preference
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentStatus("Pay on Arrival")}
                    className={`py-2 px-3 rounded-xl border font-bold text-left transition-all ${
                      paymentStatus === "Pay on Arrival"
                        ? "bg-brand-maroon text-white border-brand-maroon"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    Pay at Front Desk
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentStatus("Paid")}
                    className={`py-2 px-3 rounded-xl border font-bold text-left transition-all ${
                      paymentStatus === "Paid"
                        ? "bg-emerald-700 text-white border-emerald-700"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    M-Pesa STK Push
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Special Requests / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Late arrival at 7 PM, baby cot, quiet room..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-maroon"
                />
              </div>

              {availError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <p>{availError}</p>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-brand-amber" />
                      <span>Confirming Reservation...</span>
                    </>
                  ) : (
                    <span>Confirm Booking (KES {totalPrice.toLocaleString()})</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Booking Confirmed */}
          {step === 3 && confirmedBooking && (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 block">
                  Reservation Confirmed &amp; Room Blocked
                </span>
                <h3 className="font-serif font-black text-2xl text-brand-maroon mt-0.5">
                  Ref: {confirmedBooking.id}
                </h3>
                <p className="text-xs text-gray-600 mt-1 max-w-sm mx-auto">
                  Thank you, <strong>{confirmedBooking.guestName}</strong>! Your stay at Hotel Kalya has been registered.
                  Our front desk team has been notified.
                </p>
              </div>

              {/* Booking Summary Card */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs text-left space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Suite</span>
                  <span className="font-bold text-brand-maroon">{confirmedBooking.roomType} (Room {confirmedBooking.roomNumber})</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Stay Dates</span>
                  <span className="font-bold text-gray-900">{confirmedBooking.checkInDate} to {confirmedBooking.checkOutDate}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Guests</span>
                  <span className="font-bold text-gray-900">{confirmedBooking.adults} Adults</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-500">Total Billed</span>
                  <span className="font-black text-sm text-brand-maroon">KES {confirmedBooking.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-colors shadow"
                >
                  <Printer className="w-3.5 h-3.5 text-brand-amber" />
                  <span>Print Voucher / PDF</span>
                </button>

                <WhatsAppConsultButton
                  context={{
                    serviceKey: "accommodation",
                    roomName: confirmedBooking.roomType,
                    roomNumber: confirmedBooking.roomNumber,
                    checkInDate: confirmedBooking.checkInDate,
                    checkOutDate: confirmedBooking.checkOutDate,
                    totalPrice: confirmedBooking.totalAmount,
                    customMessage: `Hello Front Desk, I just confirmed reservation ${confirmedBooking.id} for Room ${confirmedBooking.roomNumber}. Looking forward to checking in!`,
                  }}
                  variant="secondary"
                  label="Notify Desk via WhatsApp"
                />
              </div>

              <div className="pt-2">
                <Link
                  href="/guest/dashboard"
                  onClick={onClose}
                  className="text-xs text-brand-maroon font-bold underline hover:text-brand-maroon-dark"
                >
                  Go to Guest Portal Dashboard →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
