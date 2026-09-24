import { NextResponse } from "next/server";
import {
  getConferenceBookings,
  createConferenceBooking,
  updateConferenceBookingStatus,
} from "@/lib/db";

export async function GET() {
  try {
    const conferences = await getConferenceBookings();
    return NextResponse.json({ success: true, count: conferences.length, conferences });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load conference bookings", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.clientName || !body.hallName || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { success: false, error: "clientName, hallName, startDate, and endDate are required" },
        { status: 400 }
      );
    }

    const booking = await createConferenceBooking(body);
    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create conference booking", details: String(error) },
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

    const updated = await updateConferenceBookingStatus(body.id, body.status, body.operatorName);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update conference status", details: String(error) },
      { status: 500 }
    );
  }
}
