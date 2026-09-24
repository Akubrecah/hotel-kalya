"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Bed,
  Users,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Clock,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { Room } from "@/types/hospitality";
import { RoomCalendar } from "@/components/rooms/RoomCalendar";
import { WhatsAppConsultButton } from "@/components/rooms/WhatsAppConsultButton";
import { RoomBookingModal } from "@/components/rooms/RoomBookingModal";

export default function RoomDetailPage() {
  const params = useParams();
  const roomId = (params?.roomId as string) || "room-201";

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    fetch(`/api/rooms/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (data.success && data.room) {
          setRoom(data.room);
          setActiveImage(data.room.images[0] || "/placeholder.jpg");
        }
        setLoading(false);
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [roomId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream/40 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-brand-maroon animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-medium">Loading suite details and availability...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-brand-cream/40 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center max-w-md space-y-4 shadow-sm">
          <Bed className="w-12 h-12 text-gray-300 mx-auto" />
          <h2 className="font-serif font-bold text-xl text-brand-maroon">Room Not Found</h2>
          <p className="text-xs text-gray-500">
            The requested suite identifier could not be located in our room registry.
          </p>
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-maroon text-white text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Rooms</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E0B0F] pb-20">
      {/* Top Breadcrumb Header Strip */}
      <div className="bg-brand-cream border-b border-brand-amber-light/80 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 text-brand-maroon hover:text-brand-amber-dark font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Accommodation</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-gray-400">Kapenguria, West Pokot</span>
            <span className="text-gray-300">•</span>
            <span className="font-mono text-brand-maroon font-bold">Room {room.roomNumber}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Hero Section: Title & Booking Quick Action */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-amber text-brand-maroon font-black text-[10px] uppercase tracking-wider">
                {room.type}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                {room.reservationStatus}
              </span>
              <span className="text-xs text-gray-500 font-medium">Floor: {room.floor}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-black text-brand-maroon">
              {room.name}
            </h1>

            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed">
              {room.description}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-brand-amber/40 shadow-xl flex flex-col sm:flex-row lg:flex-col justify-between items-start sm:items-center lg:items-start gap-4 min-w-[280px]">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                Direct Rate
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-3xl font-black text-brand-maroon">
                  KES {room.basePrice.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">/ night</span>
              </div>
              <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                ✓ Includes Bed &amp; Farm Breakfast
              </p>
            </div>

            <div className="w-full flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => setBookingModalOpen(true)}
                className="w-full py-3 px-5 rounded-2xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-brand-amber" />
                <span>Book This Room</span>
              </button>

              <WhatsAppConsultButton
                context={{
                  serviceKey: "accommodation",
                  roomName: room.name,
                  roomNumber: room.roomNumber,
                  totalPrice: room.basePrice,
                }}
                variant="secondary"
                label="Consult on WhatsApp"
              />
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 relative h-80 sm:h-[480px] rounded-3xl overflow-hidden shadow-lg border border-brand-amber-light">
            <Image
              src={activeImage || room.images[0]}
              alt={room.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
            {room.images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`relative h-36 lg:h-36 rounded-2xl overflow-hidden border-2 transition-all ${
                  activeImage === img
                    ? "border-brand-amber ring-2 ring-brand-amber/50"
                    : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={`${room.name} ${i + 1}`} fill className="object-cover" sizes="200px" />
              </button>
            ))}
          </div>
        </div>

        {/* Main 2-Column Content: Amenities & Live Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Room Particulars & Policies (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Quick Specs Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-amber-light/80 text-brand-maroon flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Capacity</span>
                  <span className="font-bold text-xs text-gray-900">
                    {room.capacity.adults} Adults, {room.capacity.children} Child
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-amber-light/80 text-brand-maroon flex items-center justify-center">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Bed Layout</span>
                  <span className="font-bold text-xs text-gray-900">{room.bedConfiguration}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3 col-span-2 sm:col-span-1">
                <div className="w-10 h-10 rounded-xl bg-brand-amber-light/80 text-brand-maroon flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Hygiene</span>
                  <span className="font-bold text-xs text-emerald-800">100% Sanitized</span>
                </div>
              </div>
            </div>

            {/* Room Amenities Checklist */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-brand-maroon">
                Included Suite Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
                {room.amenities.map((a, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="font-medium">{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies & Stays Rules */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-brand-maroon">
                Hotel Kalya Guest Policies
              </h3>
              <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-brand-amber flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Check-In Time:</strong> From 2:00 PM. Early check-in subject to room availability upon request.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-brand-amber flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Check-Out Time:</strong> By 10:00 AM. Late check-out available upon desk coordination.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-brand-amber flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Payment &amp; Cancellation:</strong> M-Pesa STK Push, credit cards, or cash accepted. Cancellations up to 24 hours prior incur 0% cancellation penalty.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Room Calendar (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <RoomCalendar
              roomId={room.id}
              roomName={room.name}
              selectedCheckIn={selectedCalendarDate}
              onSelectDate={(date) => {
                setSelectedCalendarDate(date);
                setBookingModalOpen(true);
              }}
            />

            {/* Booking Assistance Card */}
            <div className="bg-brand-maroon text-white p-6 rounded-3xl border border-brand-amber/30 shadow-lg space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-amber block">
                Personalized Booking Assistance
              </span>
              <h4 className="font-serif font-bold text-base text-white">
                Have Special Requirements?
              </h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Contact our Front Desk directly on WhatsApp to coordinate multi-room bookings, county workshop delegations, or early arrivals.
              </p>
              <div className="pt-1">
                <WhatsAppConsultButton
                  context={{
                    serviceKey: "accommodation",
                    roomName: room.name,
                    roomNumber: room.roomNumber,
                    checkInDate: selectedCalendarDate,
                  }}
                  variant="primary"
                  label="Message Reservations Desk"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <RoomBookingModal
          room={room}
          initialCheckIn={selectedCalendarDate || "2026-09-25"}
          initialCheckOut="2026-09-28"
          onClose={() => setBookingModalOpen(false)}
        />
      )}
    </div>
  );
}
