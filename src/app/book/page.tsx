"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Send,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  FileText,
  Calendar,
  Bed,
  Users,
  CreditCard,
  Percent,
  Sparkles,
  ChevronDown,
  Info,
  ShieldCheck,
  Check,
  AlertCircle,
  Building,
  Flower2,
  UtensilsCrossed,
  Layers,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { BRAND, SERVICE_CATEGORIES, IMAGES } from "@/lib/constants";
import { getStandardWhatsAppUrl } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GoogleMap } from "@/components/maps/GoogleMap";
import { DirectionsButton } from "@/components/maps/DirectionsButton";
import { MpesaModal } from "@/components/payments/MpesaModal";
import { Room, Booking } from "@/types/hospitality";

// Payment modes
type PaymentMode = "full" | "deposit_50" | "deposit_25" | "custom" | "arrival";

function BookingEngineContent() {
  const searchParams = useSearchParams();

  // Query parameters
  const initialRoomId = searchParams.get("roomId") || "";
  const initialService = searchParams.get("service") || "";
  const initialHall = searchParams.get("hall") || "";
  const initialPackage = searchParams.get("package") || "";
  const initialCheckIn = searchParams.get("checkIn") || searchParams.get("date") || "";
  const initialCheckOut = searchParams.get("checkOut") || "";
  const initialGuests = searchParams.get("guests") || "";

  // Available Rooms from DB
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  // Selected Service and Room State
  const [selectedService, setSelectedService] = useState<string>(
    initialRoomId
      ? "Accommodation (Rooms & Suites)"
      : initialService.toLowerCase().includes("conference") || initialHall || initialPackage
      ? "Conference / Seminar Space"
      : initialService.toLowerCase().includes("garden")
      ? "Garden Experience / Photoshoot"
      : initialService.toLowerCase().includes("airbnb")
      ? "AirBnB / Short-Stay Apartment"
      : initialService.toLowerCase().includes("catering")
      ? "Outside Catering"
      : initialService || "Accommodation (Rooms & Suites)"
  );

  const [selectedRoomId, setSelectedRoomId] = useState<string>(initialRoomId);
  const [customVenueTitle, setCustomVenueTitle] = useState<string>(
    initialHall || initialPackage || (initialService && !initialRoomId ? initialService : "")
  );

  // Form State
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    checkIn: initialCheckIn || todayStr,
    checkOut: initialCheckOut || tomorrowStr,
    adults: initialGuests ? parseInt(initialGuests, 10) || 1 : 1,
    children: 0,
    specialRequests: "",
  });

  // Payment Options State
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("deposit_50");
  const [customAmount, setCustomAmount] = useState<number>(0);

  // Modals & Flow States
  const [isMpesaOpen, setIsMpesaOpen] = useState(false);
  const [pendingReference, setPendingReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Official contact info loaded from settings
  const [officialWhatsApp, setOfficialWhatsApp] = useState(BRAND.phoneClean);
  const [officialPhone, setOfficialPhone] = useState(BRAND.phone);
  const [officialEmail, setOfficialEmail] = useState(BRAND.email);
  const [officialAddress, setOfficialAddress] = useState(BRAND.location);

  // Fetch rooms on mount
  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.rooms)) {
          setRooms(data.rooms);
          if (initialRoomId) {
            const match = data.rooms.find(
              (r: Room) => r.id === initialRoomId || r.roomNumber === initialRoomId
            );
            if (match) {
              setSelectedRoomId(match.id);
            }
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingRooms(false));
  }, [initialRoomId]);

  // Fetch official settings
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings?.officialWhatsApp) {
          setOfficialWhatsApp(data.settings.officialWhatsApp.replace(/\D/g, ""));
        } else if (data.settings?.phone) {
          setOfficialWhatsApp(data.settings.phone.replace(/\D/g, ""));
        }
        if (data.settings?.phone) setOfficialPhone(data.settings.phone);
        if (data.settings?.email) setOfficialEmail(data.settings.email);
        if (data.settings?.address) setOfficialAddress(data.settings.address);
      })
      .catch(() => {});
  }, []);

  // Selected room object
  const currentRoom = useMemo(() => {
    if (!selectedRoomId) return null;
    return rooms.find((r) => r.id === selectedRoomId || r.roomNumber === selectedRoomId) || null;
  }, [selectedRoomId, rooms]);

  // Calculate nights
  const nights = useMemo(() => {
    const inTime = new Date(form.checkIn).getTime();
    const outTime = new Date(form.checkOut).getTime();
    if (!isNaN(inTime) && !isNaN(outTime) && outTime > inTime) {
      return Math.max(1, Math.round((outTime - inTime) / (1000 * 60 * 60 * 24)));
    }
    return 1;
  }, [form.checkIn, form.checkOut]);

  // Calculate Base and Total Price
  const { unitPrice, totalAmount, pricingLabel } = useMemo(() => {
    if (selectedService.includes("Accommodation") && currentRoom) {
      const unit = currentRoom.basePrice;
      const total = nights * unit;
      return { unitPrice: unit, totalAmount: total, pricingLabel: `KES ${unit.toLocaleString()} / night` };
    }

    if (selectedService.includes("Conference")) {
      const isPerDelegate = customVenueTitle.toLowerCase().includes("delegate") || customVenueTitle.toLowerCase().includes("package");
      const unit = isPerDelegate ? 2500 : 15000;
      const total = isPerDelegate ? unit * Math.max(1, form.adults) * nights : unit * nights;
      return {
        unitPrice: unit,
        totalAmount: total,
        pricingLabel: isPerDelegate ? `KES ${unit.toLocaleString()} / delegate / day` : `KES ${unit.toLocaleString()} / day`,
      };
    }

    if (selectedService.includes("Garden")) {
      const isPhotoshoot = customVenueTitle.toLowerCase().includes("photo");
      const unit = isPhotoshoot ? 5000 : 10000;
      const total = unit * nights;
      return { unitPrice: unit, totalAmount: total, pricingLabel: `KES ${unit.toLocaleString()} / day` };
    }

    if (selectedService.includes("AirBnB")) {
      const unit = 6500;
      const total = unit * nights;
      return { unitPrice: unit, totalAmount: total, pricingLabel: `KES ${unit.toLocaleString()} / night` };
    }

    if (selectedService.includes("Catering")) {
      const unit = 1800;
      const total = unit * Math.max(1, form.adults);
      return { unitPrice: unit, totalAmount: total, pricingLabel: `KES ${unit.toLocaleString()} / person` };
    }

    // Default room or generic estimate
    const unit = 5000;
    const total = unit * nights;
    return { unitPrice: unit, totalAmount: total, pricingLabel: `KES ${unit.toLocaleString()} / night` };
  }, [selectedService, currentRoom, nights, customVenueTitle, form.adults]);

  // Initialize or adjust custom amount default
  useEffect(() => {
    if (customAmount === 0 && totalAmount > 0) {
      setCustomAmount(Math.round(totalAmount * 0.5));
    }
  }, [totalAmount, customAmount]);

  // Payment Calculation: Percentage options
  const deposit50 = Math.round(totalAmount * 0.5);
  const deposit25 = Math.round(totalAmount * 0.25);

  const amountDueNow = useMemo(() => {
    switch (paymentMode) {
      case "full":
        return totalAmount;
      case "deposit_50":
        return deposit50;
      case "deposit_25":
        return deposit25;
      case "custom":
        return Math.min(totalAmount, Math.max(1, customAmount || deposit50));
      case "arrival":
        return 0;
      default:
        return deposit50;
    }
  }, [paymentMode, totalAmount, deposit50, deposit25, customAmount]);

  const balanceDue = Math.max(0, totalAmount - amountDueNow);
  const paymentPercentage = totalAmount > 0 ? Math.round((amountDueNow / totalAmount) * 100) : 0;

  // Handle Form Change
  const updateForm = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Pre-validate before booking
  const validateForm = () => {
    if (!form.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return false;
    }
    if (!form.phone.trim() || form.phone.trim().length < 9) {
      setErrorMessage("Please enter a valid phone number (e.g. 0712345678 or +254712345678).");
      return false;
    }
    if (!form.checkIn) {
      setErrorMessage("Please select a check-in / start date.");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  // Finalize booking persistence to database
  const executeBookingCreation = async (mpesaReceipt?: string) => {
    setSubmitting(true);
    setErrorMessage(null);

    const isRoomSelected = selectedService.includes("Accommodation") && currentRoom;
    const resolvedRoomId = isRoomSelected ? currentRoom.id : "venue-booking";
    const resolvedRoomNumber = isRoomSelected
      ? currentRoom.roomNumber
      : customVenueTitle || selectedService;
    const resolvedServiceName = isRoomSelected
      ? currentRoom.type
      : customVenueTitle
      ? `${selectedService} - ${customVenueTitle}`
      : selectedService;

    const payload = {
      guestName: form.name.trim(),
      guestPhone: form.phone.trim(),
      guestEmail: form.email.trim() || "guest@hotelkalya.com",
      roomId: resolvedRoomId,
      roomNumber: resolvedRoomNumber,
      serviceName: resolvedServiceName,
      checkInDate: form.checkIn,
      checkOutDate: form.checkOut,
      adults: Number(form.adults) || 1,
      children: Number(form.children) || 0,
      totalAmount,
      amountPaid: amountDueNow,
      balanceDue,
      paymentPercentage,
      paymentStatus: amountDueNow >= totalAmount ? "Paid" : amountDueNow > 0 ? "Deposit" : "Pay on Arrival",
      paymentMethod: amountDueNow > 0 ? "M-Pesa STK Push" : "Pay at Front Desk",
      mpesaReceiptNumber: mpesaReceipt || undefined,
      specialRequests: form.specialRequests,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to confirm reservation.");
      }

      setConfirmedBooking(data.reservation);
      setSubmitting(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Reservation failed.";
      setErrorMessage(msg);
      setSubmitting(false);
    }
  };

  // Initiation flow
  const handleInitiateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const ref = "RES-" + new Date().getFullYear() + "-" + Math.floor(100000 + Math.random() * 900000);
    setPendingReference(ref);

    // If online payment is requested, open M-Pesa modal
    if (amountDueNow > 0) {
      setIsMpesaOpen(true);
    } else {
      // Pay on arrival
      executeBookingCreation();
    }
  };

  // WhatsApp formatted enquiry message
  const generateWhatsAppMessage = (refId?: string) => {
    const isRoomSelected = selectedService.includes("Accommodation") && currentRoom;
    const ref = refId || pendingReference || "NEW-INQUIRY";
    return (
      `*Hotel Kalya Kapenguria - Reservation Confirmation*\n\n` +
      `🔖 *Reference:* #${ref}\n` +
      `👤 *Guest Name:* ${form.name || "Guest"}\n` +
      `📞 *Phone:* ${form.phone}\n` +
      `✉️ *Email:* ${form.email || "Not specified"}\n` +
      `🏨 *Service / Suite:* ${isRoomSelected ? `${currentRoom.name} (#${currentRoom.roomNumber})` : customVenueTitle || selectedService}\n` +
      `📅 *Stay Dates:* ${form.checkIn} to ${form.checkOut} (${nights} night${nights > 1 ? "s" : ""})\n` +
      `👥 *Guests:* ${form.adults} Adults${form.children ? `, ${form.children} Children` : ""}\n` +
      `💰 *Total Billed:* KES ${totalAmount.toLocaleString()}\n` +
      `💳 *Amount Paid:* KES ${amountDueNow.toLocaleString()} (${paymentPercentage}%)\n` +
      `⏳ *Balance Due at Check-in:* KES ${balanceDue.toLocaleString()}\n` +
      (form.specialRequests ? `📝 *Special Requests:* ${form.specialRequests}\n` : "") +
      `\nPlease verify reservation at the front office desk.`
    );
  };

  return (
    <>
      {/* Breadcrumbs Strip */}
      <section className="bg-brand-cream border-b border-brand-amber-light/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Accommodations & Suites", href: "/rooms" },
              { label: "Direct Reservations & Payments" },
            ]}
          />
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white min-h-[85vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-10 text-center sm:text-left max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cream border border-brand-amber/30 text-brand-maroon text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
              <span>Direct Reservations &amp; Flexible Payments</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-maroon-dark">
              Reserve Your Stay or Event Space
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Confirm your room, conference hall, or event garden in seconds. Pay in full, make a 50% or 25% commitment deposit via M-Pesa STK Push, or opt to pay at check-in.
            </p>
          </div>

          {/* SUCCESS SCREEN: Confirmed Booking */}
          {confirmedBooking ? (
            <div className="bg-gradient-to-b from-emerald-50 to-white border-2 border-emerald-300 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-2xl space-y-6 animate-in fade-in duration-300">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Reservation Confirmed • Reference #{confirmedBooking.id}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-black text-brand-maroon mt-3">
                  Thank You, {confirmedBooking.guestName}!
                </h2>
                <p className="text-sm text-gray-700 mt-2 max-w-lg mx-auto">
                  Your reservation for <strong>{confirmedBooking.serviceName || confirmedBooking.roomType}</strong> has been logged in our front desk system.
                </p>
              </div>

              {/* Receipt & Payment Summary Box */}
              <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm max-w-lg mx-auto text-left space-y-3 text-xs">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500 font-medium">Reserved Item</span>
                  <span className="font-bold text-brand-maroon">
                    {confirmedBooking.roomType} {confirmedBooking.roomNumber ? `(#${confirmedBooking.roomNumber})` : ""}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500 font-medium">Dates &amp; Nights</span>
                  <span className="font-bold text-gray-800">
                    {confirmedBooking.checkInDate} to {confirmedBooking.checkOutDate} ({confirmedBooking.nights} night{confirmedBooking.nights > 1 ? "s" : ""})
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500 font-medium">Total Cost</span>
                  <span className="font-bold text-gray-800">KES {confirmedBooking.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500 font-medium">Amount Paid Online</span>
                  <span className="font-bold text-emerald-700">
                    KES {(confirmedBooking.amountPaid || 0).toLocaleString()} ({confirmedBooking.paymentPercentage || 0}%)
                  </span>
                </div>
                {confirmedBooking.mpesaReceiptNumber && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500 font-medium">M-Pesa Receipt</span>
                    <span className="font-mono font-bold text-emerald-800">{confirmedBooking.mpesaReceiptNumber}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1">
                  <span className="text-gray-500 font-medium">Balance Due at Check-in</span>
                  <span className="font-extrabold text-sm text-brand-maroon">
                    KES {(confirmedBooking.balanceDue || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href={`/book/confirmation/${confirmedBooking.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-maroon text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-maroon-dark transition-all shadow-md"
                >
                  <FileText className="w-4 h-4 text-brand-amber" />
                  <span>View &amp; Print Official Voucher</span>
                </Link>

                <a
                  href={getStandardWhatsAppUrl(generateWhatsAppMessage(confirmedBooking.id), officialWhatsApp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Notify Front Desk (WhatsApp)</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmedBooking(null);
                    setSelectedRoomId("");
                  }}
                  className="text-xs text-brand-maroon font-bold underline hover:text-brand-maroon-dark"
                >
                  ← Book Another Suite or Service
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form & Payment Selector (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-brand-amber-light shadow-xl space-y-8">
                {/* 1. SELECTION & PREFILL CARD */}
                <div className="bg-brand-cream/60 rounded-2xl p-5 border border-brand-amber/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold tracking-widest text-brand-maroon flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-brand-amber" />
                      1. Selected Item / Space
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      Prefilled &amp; Verified
                    </span>
                  </div>

                  {/* Room / Venue Preview Box */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-brand-amber-light">
                    <div className="w-full sm:w-28 h-24 rounded-lg overflow-hidden relative shrink-0">
                      <Image
                        src={
                          currentRoom?.images?.[0] ||
                          (selectedService.includes("Conference")
                            ? IMAGES.conferenceRoom
                            : selectedService.includes("Garden")
                            ? IMAGES.gardenLandscape
                            : selectedService.includes("AirBnB")
                            ? IMAGES.airbnbStay
                            : IMAGES.deluxeSuite)
                        }
                        alt="Selected Space"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1 text-center sm:text-left">
                      <h3 className="font-serif font-bold text-base text-brand-maroon-dark">
                        {currentRoom
                          ? `${currentRoom.name} (#${currentRoom.roomNumber})`
                          : customVenueTitle || selectedService}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {currentRoom
                          ? `${currentRoom.type} • ${currentRoom.floor} • ${currentRoom.bedConfiguration}`
                          : selectedService}
                      </p>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                        <span className="text-xs font-bold text-brand-maroon bg-brand-cream px-2 py-0.5 rounded">
                          {pricingLabel}
                        </span>
                        {nights > 1 && (
                          <span className="text-xs text-gray-500">
                            • {nights} nights = KES {totalAmount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Change Service / Room dropdowns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Service Category
                      </label>
                      <div className="relative">
                        <select
                          value={selectedService}
                          onChange={(e) => {
                            setSelectedService(e.target.value);
                            if (!e.target.value.includes("Accommodation")) {
                              setSelectedRoomId("");
                            }
                          }}
                          className="w-full bg-white border border-brand-amber-light rounded-xl px-3 py-2 text-xs font-medium text-gray-800 focus:ring-2 focus:ring-brand-maroon appearance-none"
                        >
                          {SERVICE_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {selectedService.includes("Accommodation") ? (
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Select Specific Room
                        </label>
                        <div className="relative">
                          <select
                            value={selectedRoomId}
                            onChange={(e) => setSelectedRoomId(e.target.value)}
                            disabled={loadingRooms}
                            className="w-full bg-white border border-brand-amber-light rounded-xl px-3 py-2 text-xs font-medium text-gray-800 focus:ring-2 focus:ring-brand-maroon appearance-none"
                          >
                            <option value="">-- Choose Room / Suite --</option>
                            {rooms.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name} (#{r.roomNumber}) - KES {r.basePrice.toLocaleString()}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Venue / Hall / Package Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Mt. Elgon Hall, Sunset Lawn, Wedding Buffet"
                          value={customVenueTitle}
                          onChange={(e) => setCustomVenueTitle(e.target.value)}
                          className="w-full bg-white border border-brand-amber-light rounded-xl px-3 py-2 text-xs font-medium text-gray-800 focus:ring-2 focus:ring-brand-maroon"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. DATES & GUEST SPECIFICATIONS */}
                <form onSubmit={handleInitiateBooking} className="space-y-6">
                  <div>
                    <span className="text-[11px] uppercase font-bold tracking-widest text-brand-maroon flex items-center gap-1.5 mb-3">
                      <Calendar className="w-4 h-4 text-brand-amber" />
                      2. Stay Dates &amp; Guest Details
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Check-In / Event Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={form.checkIn}
                          min={todayStr}
                          onChange={(e) => updateForm("checkIn", e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:ring-2 focus:ring-brand-maroon"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Check-Out Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={form.checkOut}
                          min={form.checkIn || todayStr}
                          onChange={(e) => updateForm("checkOut", e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:ring-2 focus:ring-brand-maroon"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Kennedy Chesire"
                          value={form.name}
                          onChange={(e) => updateForm("name", e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:ring-2 focus:ring-brand-maroon"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Phone / M-Pesa Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="0712 345 678 or +254 7..."
                          value={form.phone}
                          onChange={(e) => updateForm("phone", e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:ring-2 focus:ring-brand-maroon"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          placeholder="guest@example.com"
                          value={form.email}
                          onChange={(e) => updateForm("email", e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:ring-2 focus:ring-brand-maroon"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Adults / Delegates
                        </label>
                        <select
                          value={form.adults}
                          onChange={(e) => updateForm("adults", parseInt(e.target.value, 10))}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:ring-2 focus:ring-brand-maroon"
                        >
                          {[1, 2, 3, 4, 5, 10, 20, 30, 50, 100].map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? "Person" : "People"}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Children
                        </label>
                        <select
                          value={form.children}
                          onChange={(e) => updateForm("children", parseInt(e.target.value, 10))}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:ring-2 focus:ring-brand-maroon"
                        >
                          {[0, 1, 2, 3, 4].map((n) => (
                            <option key={n} value={n}>
                              {n} Child{n !== 1 ? "ren" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Special Requests / Notes
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Late arrival, quiet room, baby cot, projector AV setup..."
                        value={form.specialRequests}
                        onChange={(e) => updateForm("specialRequests", e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 focus:ring-2 focus:ring-brand-maroon"
                      />
                    </div>
                  </div>

                  {/* 3. PERCENTAGE PAYMENT OPTIONS */}
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-[11px] uppercase font-bold tracking-widest text-brand-maroon flex items-center gap-1.5 mb-2">
                      <Percent className="w-4 h-4 text-brand-amber" />
                      3. Choose Payment Amount (Full or Percentage Deposit)
                    </span>
                    <p className="text-xs text-gray-500 mb-4">
                      You can pay 100% in full, a 50% or 25% commitment deposit, enter a custom amount, or pay on arrival.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Option 1: 100% Full Payment */}
                      <button
                        type="button"
                        onClick={() => setPaymentMode("full")}
                        className={`p-4 rounded-2xl border text-left transition-all relative ${
                          paymentMode === "full"
                            ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500 shadow-sm"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-extrabold text-emerald-900 uppercase">
                            100% Full Payment
                          </span>
                          <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                            Complete
                          </span>
                        </div>
                        <p className="font-serif text-lg font-bold text-gray-900">
                          KES {totalAmount.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Zero balance at check-in • Instant official voucher
                        </p>
                        {paymentMode === "full" && (
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center absolute top-3 right-3 shadow">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>

                      {/* Option 2: 50% Deposit (Recommended) */}
                      <button
                        type="button"
                        onClick={() => setPaymentMode("deposit_50")}
                        className={`p-4 rounded-2xl border text-left transition-all relative ${
                          paymentMode === "deposit_50"
                            ? "border-brand-maroon bg-brand-cream/60 ring-2 ring-brand-maroon shadow-sm"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-extrabold text-brand-maroon uppercase">
                            50% Deposit
                          </span>
                          <span className="text-[10px] font-black bg-brand-amber text-brand-maroon px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        </div>
                        <p className="font-serif text-lg font-bold text-gray-900">
                          KES {deposit50.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Guarantees booking • Balance KES {(totalAmount - deposit50).toLocaleString()} on arrival
                        </p>
                        {paymentMode === "deposit_50" && (
                          <div className="w-5 h-5 rounded-full bg-brand-maroon text-white flex items-center justify-center absolute top-3 right-3 shadow">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>

                      {/* Option 3: 25% Deposit */}
                      <button
                        type="button"
                        onClick={() => setPaymentMode("deposit_25")}
                        className={`p-4 rounded-2xl border text-left transition-all relative ${
                          paymentMode === "deposit_25"
                            ? "border-amber-600 bg-amber-50/60 ring-2 ring-amber-500 shadow-sm"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-extrabold text-amber-900 uppercase">
                            25% Deposit
                          </span>
                          <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                            Minimum Hold
                          </span>
                        </div>
                        <p className="font-serif text-lg font-bold text-gray-900">
                          KES {deposit25.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Holds reservation • Balance KES {(totalAmount - deposit25).toLocaleString()} on arrival
                        </p>
                        {paymentMode === "deposit_25" && (
                          <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center absolute top-3 right-3 shadow">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>

                      {/* Option 4: Custom Amount */}
                      <button
                        type="button"
                        onClick={() => setPaymentMode("custom")}
                        className={`p-4 rounded-2xl border text-left transition-all relative ${
                          paymentMode === "custom"
                            ? "border-purple-600 bg-purple-50/60 ring-2 ring-purple-500 shadow-sm"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-extrabold text-purple-900 uppercase">
                            Custom Amount
                          </span>
                          <span className="text-[10px] font-black bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full">
                            Flexible
                          </span>
                        </div>
                        <p className="font-serif text-lg font-bold text-gray-900">
                          KES {customAmount.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Choose your own partial deposit amount
                        </p>
                        {paymentMode === "custom" && (
                          <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center absolute top-3 right-3 shadow">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Custom Amount Range Input */}
                    {paymentMode === "custom" && (
                      <div className="mt-3 p-4 bg-purple-50/80 rounded-2xl border border-purple-200 space-y-2 animate-in fade-in">
                        <div className="flex justify-between text-xs">
                          <label className="font-bold text-purple-950">
                            Enter Amount to Pay Now (KES)
                          </label>
                          <span className="font-bold text-purple-700">
                            {paymentPercentage}% of Total
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            min={500}
                            max={totalAmount}
                            step={100}
                            value={customAmount}
                            onChange={(e) => setCustomAmount(Number(e.target.value))}
                            className="w-full bg-white border border-purple-300 rounded-xl px-3 py-2 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-purple-600"
                          />
                        </div>
                        <p className="text-[11px] text-purple-800">
                          Minimum payment is KES 500 up to full total of KES {totalAmount.toLocaleString()}.
                        </p>
                      </div>
                    )}

                    {/* Pay on Arrival Option Pill */}
                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMode("arrival")}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs transition-all ${
                          paymentMode === "arrival"
                            ? "border-gray-400 bg-gray-100 ring-2 ring-gray-400 text-gray-900 font-bold"
                            : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-500" />
                          <span>Pay 100% on Arrival at Hotel Front Desk (KES 0 Due Now)</span>
                        </div>
                        {paymentMode === "arrival" && (
                          <span className="text-[10px] bg-gray-300 text-gray-800 px-2 py-0.5 rounded-full font-bold">
                            Selected
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error Alert */}
                  {errorMessage && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submission Action Button */}
                  <div className="pt-2">
                    {amountDueNow > 0 ? (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 px-6 rounded-2xl bg-[#00A859] hover:bg-[#008f4c] text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-[0.99] disabled:opacity-50"
                      >
                        <div className="w-7 h-7 rounded-lg bg-white text-[#00A859] flex items-center justify-center font-black text-sm">
                          M
                        </div>
                        <span>
                          Pay KES {amountDueNow.toLocaleString()} via M-Pesa STK Push
                        </span>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 px-6 rounded-2xl bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-[0.99] disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-5 h-5 text-brand-amber" />
                        <span>Confirm Reservation (Pay on Arrival)</span>
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Right Column: Dynamic Price Summary Card & Desk Contact (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* 1. Live Payment Breakdown Summary */}
                <div className="bg-brand-maroon-dark text-white rounded-3xl p-6 sm:p-8 border-2 border-brand-amber shadow-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-white/15 pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-brand-amber block">
                        Reservation Summary
                      </span>
                      <h3 className="font-serif text-xl font-bold text-white">
                        Financial Breakdown
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-brand-amber bg-white/10 px-2.5 py-1 rounded-lg">
                      {nights} Night{nights > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-white/80">
                      <span>Rate</span>
                      <span className="font-medium text-white">{pricingLabel}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Total Reservation Cost</span>
                      <span className="font-bold text-white">KES {totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Payment Plan</span>
                      <span className="font-bold text-brand-amber">
                        {paymentMode === "full"
                          ? "100% Full Payment"
                          : paymentMode === "deposit_50"
                          ? "50% Deposit"
                          : paymentMode === "deposit_25"
                          ? "25% Deposit"
                          : paymentMode === "custom"
                          ? `Custom (${paymentPercentage}%)`
                          : "Pay at Front Desk"}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-white/15 space-y-2">
                      <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-white/10">
                        <span className="font-bold text-brand-amber">Amount Due Now</span>
                        <span className="font-serif font-black text-xl text-emerald-400">
                          KES {amountDueNow.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between text-white/70 text-xs px-1">
                        <span>Balance Due at Check-In:</span>
                        <span className="font-bold text-white">KES {balanceDue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-white/60 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-amber" />
                      <span>Instant STK Push to your Safaricom M-Pesa line.</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-amber" />
                      <span>Free cancellation up to 24 hours before check-in.</span>
                    </p>
                  </div>
                </div>

                {/* 2. Direct Front Desk WhatsApp & Call Card */}
                <div className="bg-brand-cream rounded-3xl p-6 border border-brand-amber-light shadow-md space-y-4">
                  <h4 className="font-serif font-bold text-base text-brand-maroon-dark flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-maroon" />
                    Prefer to Book via Desk?
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Our 24/7 reception desk in Kapenguria is always on standby to assist with custom corporate invoicing, special banquets, or group bookings.
                  </p>

                  <div className="space-y-2 pt-1">
                    <a
                      href={getStandardWhatsAppUrl(generateWhatsAppMessage(), officialWhatsApp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp Directly</span>
                    </a>

                    <a
                      href={`tel:${officialPhone}`}
                      className="w-full bg-white hover:bg-gray-50 text-brand-maroon border border-brand-maroon/20 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-brand-maroon" />
                      <span>Call Front Desk: {officialPhone}</span>
                    </a>
                  </div>
                </div>

                {/* 3. Location & Directions */}
                <div className="bg-white rounded-3xl p-6 border border-brand-amber-light shadow-md space-y-3">
                  <h4 className="font-serif font-bold text-sm text-brand-maroon-dark flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-amber" />
                    Hotel Kalya Kapenguria
                  </h4>
                  <p className="text-xs text-gray-600">
                    Located along the main tarmac route connecting Kitale to Kapenguria and Lodwar. Secure parking available.
                  </p>
                  <div className="space-y-2">
                    <GoogleMap height="160px" zoom={14} showCard={false} />
                    <DirectionsButton size="sm" className="w-full" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* M-Pesa Modal with live STK Push */}
      <MpesaModal
        isOpen={isMpesaOpen}
        onClose={() => setIsMpesaOpen(false)}
        amount={amountDueNow}
        reference={pendingReference || "HOTEL-KALYA"}
        defaultPhone={form.phone}
        onSuccess={(receiptNumber) => {
          setIsMpesaOpen(false);
          executeBookingCreation(receiptNumber);
        }}
      />
    </>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-brand-cream/40">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-brand-maroon border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold uppercase tracking-wider text-brand-maroon">
              Loading Hotel Kalya Reservations...
            </p>
          </div>
        </div>
      }
    >
      <BookingEngineContent />
    </Suspense>
  );
}
