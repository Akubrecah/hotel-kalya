import { NextResponse } from "next/server";
import {
  getEventBookings,
  createEventBooking,
  updateEventBookingStatus,
} from "@/lib/db";

export async function GET() {
  try {
    const events = await getEventBookings();
    return NextResponse.json({ success: true, count: events.length, events });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load events", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.clientName || !body.eventType || !body.venueArea || !body.eventDate) {
      return NextResponse.json(
        { success: false, error: "clientName, eventType, venueArea, and eventDate are required" },
        { status: 400 }
      );
    }

    const event = await createEventBooking(body);
    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create event", details: String(error) },
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

    const updated = await updateEventBookingStatus(body.id, body.status, body.operatorName);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, event: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update event status", details: String(error) },
      { status: 500 }
    );
  }
}
