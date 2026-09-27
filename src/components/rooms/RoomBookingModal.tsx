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
  Percent,
  ShieldCheck,
  Check,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { WhatsAppConsultButton } from "./WhatsAppConsultButton";
import { MpesaModal } from "@/components/payments/MpesaModal";

interface RoomBookingModalProps {
  room: Room;
  initialCheckIn?: string;
  initialCheckOut?: string;
  onClose: () => void;
  onBookingSuccess?: (booking: Booking) => void;
}

type PaymentMode = "full" | "deposit_50" | "deposit_25" | "arrival";

export function RoomBookingModal({
  room,
  initialCheckIn = "2026-09-25",
  initialCheckOut = "2026-09-28",
  onClose,
  onBookingSuccess,
}: RoomBookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1 = Dates & Guests, 2 = Guest Info & Payment, 3 = Confirmation
  const [checkInDate, setCheckInDate] = useState(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("+254 7");
  const [guestEmail, setGuestEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Payment Options
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("deposit_50");
  const [isMpesaOpen, setIsMpesaOpen] = useState(false);
  const [pendingRef, setPendingRef] = useState("");

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

  // Percentage calculations
  const deposit50 = Math.round(totalPrice * 0.5);
  const deposit25 = Math.round(totalPrice * 0.25);

  const amountDueNow =
    paymentMode === "full"
      ? totalPrice
      : paymentMode === "deposit_50"
      ? deposit50
      : paymentMode === "deposit_25"
      ? deposit25
      : 0;

  const balanceDue = Math.max(0, totalPrice - amountDueNow);
  const paymentPercentage = totalPrice > 0 ? Math.round((amountDueNow / totalPrice) * 100) : 0;

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

  const executeCreateBooking = async (mpesaReceipt?: string) => {
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
          roomNumber: room.roomNumber,
          serviceName: room.name,
          checkInDate,
          checkOutDate,
          adults,
          children,
          totalAmount: totalPrice,
          amountPaid: amountDueNow,
          balanceDue,
          paymentPercentage,
          paymentStatus: amountDueNow >= totalPrice ? "Paid" : amountDueNow > 0 ? "Deposit" : "Pay on Arrival",
          paymentMethod: amountDueNow > 0 ? "M-Pesa STK Push" : "Pay at Front Desk",
          mpesaReceiptNumber: mpesaReceipt,
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

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setAvailError("Please enter your full name.");
      return;
    }
    if (!guestPhone.trim() || guestPhone.trim().length < 9) {
      setAvailError("Please enter a valid phone number.");
      return;
    }

    if (amountDueNow > 0) {
      const ref = "RES-" + new Date().getFullYear() + "-" + Math.floor(100000 + Math.random() * 900000);
      setPendingRef(ref);
      setIsMpesaOpen(true);
    } else {
      executeCreateBooking();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden border border-brand-amber-light max-h-[92vh]">
          {/* Modal Top Bar */}
          <div className="bg-brand-maroon-dark text-white p-5 px-6 flex items-center justify-between border-b border-brand-maroon shrink-0">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-amber block">
                Step {step} of 3 • Direct Reservation
              </span>
              <h2 className="font-serif font-bold text-lg text-white truncate">
                {room.name} (#{room.roomNumber})
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
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
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

            {/* Step 2: Guest Details & Percentage Payment */}
            {step === 2 && (
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-brand-maroon">{room.name}</span>
                    <p className="text-[11px] text-gray-600">
                      {checkInDate} to {checkOutDate} ({nights} nights) • Total KES {totalPrice.toLocaleString()}
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

                {/* Percentage Payment Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Payment Plan
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* 100% Full */}
                    <button
                      type="button"
                      onClick={() => setPaymentMode("full")}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        paymentMode === "full"
                          ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500 font-bold text-emerald-950"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-[11px]">100% Full</span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded">Complete</span>
                      </div>
                      <span className="font-bold text-xs block mt-0.5">KES {totalPrice.toLocaleString()}</span>
                    </button>

                    {/* 50% Deposit */}
                    <button
                      type="button"
                      onClick={() => setPaymentMode("deposit_50")}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        paymentMode === "deposit_50"
                          ? "bg-brand-cream border-brand-maroon ring-2 ring-brand-maroon font-bold text-brand-maroon-dark"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-[11px]">50% Deposit</span>
                        <span className="text-[10px] bg-brand-amber text-brand-maroon px-1.5 py-0.2 rounded font-black">Popular</span>
                      </div>
                      <span className="font-bold text-xs block mt-0.5">KES {deposit50.toLocaleString()}</span>
                    </button>

                    {/* 25% Deposit */}
                    <button
                      type="button"
                      onClick={() => setPaymentMode("deposit_25")}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        paymentMode === "deposit_25"
                          ? "bg-amber-50 border-amber-600 ring-2 ring-amber-500 font-bold text-amber-950"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-[11px]">25% Deposit</span>
                        <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">Minimum</span>
                      </div>
                      <span className="font-bold text-xs block mt-0.5">KES {deposit25.toLocaleString()}</span>
                    </button>

                    {/* Pay on Arrival */}
                    <button
                      type="button"
                      onClick={() => setPaymentMode("arrival")}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        paymentMode === "arrival"
                          ? "bg-gray-200 border-gray-500 ring-2 ring-gray-400 font-bold text-gray-900"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      <span className="font-extrabold text-[11px] block">Pay on Arrival</span>
                      <span className="text-gray-500 text-[10px]">KES 0 Due Now</span>
                    </button>
                  </div>

                  {/* Summary pill */}
                  <div className="mt-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs flex justify-between items-center">
                    <span className="text-gray-600">
                      Amount Due Now: <strong className="text-emerald-700">KES {amountDueNow.toLocaleString()}</strong>
                    </span>
                    <span className="text-gray-600">
                      Balance at Check-in: <strong className="text-brand-maroon">KES {balanceDue.toLocaleString()}</strong>
                    </span>
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
                  {amountDueNow > 0 ? (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#00A859] text-white font-bold text-xs hover:bg-[#008f4c] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                    >
                      <div className="w-5 h-5 rounded bg-white text-[#00A859] flex items-center justify-center font-bold text-xs">
                        M
                      </div>
                      <span>Pay KES {amountDueNow.toLocaleString()} via M-Pesa STK</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-3 px-4 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-brand-amber" />
                          <span>Confirming Reservation...</span>
                        </>
                      ) : (
                        <span>Confirm Booking (Pay at Desk)</span>
                      )}
                    </button>
                  )}
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
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Total Billed</span>
                    <span className="font-black text-sm text-brand-maroon">KES {confirmedBooking.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Amount Paid</span>
                    <span className="font-bold text-emerald-700">
                      KES {(confirmedBooking.amountPaid || 0).toLocaleString()} ({confirmedBooking.paymentPercentage || 0}%)
                    </span>
                  </div>
                  {confirmedBooking.mpesaReceiptNumber && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">M-Pesa Receipt</span>
                      <span className="font-mono font-bold text-emerald-800">{confirmedBooking.mpesaReceiptNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1">
                    <span className="text-gray-500">Balance Due at Check-In</span>
                    <span className="font-extrabold text-sm text-brand-maroon">
                      KES {(confirmedBooking.balanceDue || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/book/confirmation/${confirmedBooking.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-colors shadow"
                  >
                    <FileText className="w-3.5 h-3.5 text-brand-amber" />
                    <span>View &amp; Print Voucher</span>
                  </Link>

                  <WhatsAppConsultButton
                    context={{
                      serviceKey: "accommodation",
                      roomName: confirmedBooking.roomType,
                      roomNumber: confirmedBooking.roomNumber,
                      checkInDate: confirmedBooking.checkInDate,
                      checkOutDate: confirmedBooking.checkOutDate,
                      totalPrice: confirmedBooking.totalAmount,
                      customMessage: `Hello Front Desk, I just confirmed reservation ${confirmedBooking.id} for Room ${confirmedBooking.roomNumber} with KES ${(confirmedBooking.amountPaid || 0).toLocaleString()} paid online. Looking forward to checking in!`,
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

      {/* M-Pesa Modal with live STK Push */}
      <MpesaModal
        isOpen={isMpesaOpen}
        onClose={() => setIsMpesaOpen(false)}
        amount={amountDueNow}
        reference={pendingRef || "HOTEL-KALYA"}
        defaultPhone={guestPhone}
        onSuccess={(receipt) => {
          setIsMpesaOpen(false);
          executeCreateBooking(receipt);
        }}
      />
    </>
  );
}
