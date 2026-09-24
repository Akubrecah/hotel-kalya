import { NextRequest, NextResponse } from "next/server";
import { getBookings, createBooking } from "@/lib/db";
import { Booking } from "@/types/hospitality";

// Retain compatibility interface for any components referencing ReservationRecord
export type ReservationRecord = Booking & {
  service: string;
  guestsCount: string;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const roomId = searchParams.get("roomId");
    const guestPhone = searchParams.get("phone");

    let bookings = await getBookings();

    if (statusFilter && statusFilter !== "all") {
      bookings = bookings.filter(
        (b) => b.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (roomId) {
      bookings = bookings.filter((b) => b.roomId === roomId || b.roomNumber === roomId);
    }

    if (guestPhone) {
      bookings = bookings.filter((b) => b.guestPhone.includes(guestPhone));
    }

    // Map to compatible structure for existing table views
    const formatted = bookings.map((b) => ({
      ...b,
      service: b.roomType || "Accommodation",
      guestsCount: `${b.adults} Adults${b.children ? `, ${b.children} Children` : ""}`,
    }));

    return NextResponse.json({
      success: true,
      total: formatted.length,
      reservations: formatted,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch reservations: " + String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Required fields validation
    if (!body.guestName || !body.guestPhone || !body.roomId || !body.checkInDate || !body.checkOutDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required booking details (guestName, guestPhone, roomId, checkInDate, checkOutDate).",
        },
        { status: 400 }
      );
    }

    // Call database createBooking which executes strict server-side double-booking check
    const result = await createBooking({
      guestName: body.guestName,
      guestPhone: body.guestPhone,
      guestEmail: body.guestEmail || "guest@hotelkalya.com",
      roomId: body.roomId,
      checkInDate: body.checkInDate,
      checkOutDate: body.checkOutDate,
      adults: body.adults || (body.guestsCount ? parseInt(body.guestsCount, 10) : 1),
      children: body.children || 0,
      paymentStatus: body.paymentStatus || "Pay on Arrival",
      paymentMethod: body.paymentMethod || "M-Pesa STK Push",
      specialRequests: body.specialRequests,
    });

    if (!result.success) {
      // If double booking conflict
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 409 } // 409 Conflict
      );
    }

    return NextResponse.json({
      success: true,
      reservation: {
        ...result.booking,
        service: result.booking?.roomType,
        guestsCount: `${result.booking?.adults} Adults`,
      },
      message: "Reservation confirmed successfully. Confirmation reference generated.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error: " + String(error) },
      { status: 500 }
    );
  }
}
