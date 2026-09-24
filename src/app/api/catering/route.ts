import { NextResponse } from "next/server";
import {
  getCateringBookings,
  createCateringBooking,
  updateCateringBookingStatus,
} from "@/lib/db";

export async function GET() {
  try {
    const caterings = await getCateringBookings();
    return NextResponse.json({ success: true, count: caterings.length, caterings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load catering bookings", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.clientName || !body.location || !body.eventDate || !body.guestCount) {
      return NextResponse.json(
        { success: false, error: "clientName, location, eventDate, and guestCount are required" },
        { status: 400 }
      );
    }

    const booking = await createCateringBooking(body);
    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create catering booking", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json(
        { success: false, error: "id and status are required" },
        { status: 400 }
      );
    }

    const updated = await updateCateringBookingStatus(body.id, body.status, body.operatorName);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Catering booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update catering status", details: String(error) },
      { status: 500 }
    );
  }
}
