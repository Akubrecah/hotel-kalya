import { NextResponse } from "next/server";
import {
  getEventBookings,
  createEventBooking,
  updateEventBookingStatus,
  logAuditEvent,
} from "@/lib/db";
import { authorizeApiRequest } from "@/lib/rbac";

export async function GET(request: Request) {
  try {
    const auth = authorizeApiRequest(request, "view_events", [
      "EVENTS",
      "CONFERENCES",
      "MANAGEMENT",
      "EXECUTIVE",
    ]);

    if (!auth.authorized) {
      await logAuditEvent({
        userId: auth.user?.id || "unauthorized_caller",
        userName: auth.user?.name || "Unknown Caller",
        role: auth.user?.staffRole || "UNKNOWN",
        department: auth.user?.department || "UNKNOWN",
        action: "UNAUTHORIZED_EVENTS_ACCESS",
        target: "/api/events",
        details: auth.error || "Blocked cross-department event data query.",
        status: "DENIED",
      });
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

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
    const auth = authorizeApiRequest(req, "manage_events", [
      "EVENTS",
      "CONFERENCES",
      "MANAGEMENT",
      "EXECUTIVE",
    ]);

    if (!auth.authorized) {
      await logAuditEvent({
        userId: auth.user?.id || "unauthorized_caller",
        userName: auth.user?.name || "Unknown Caller",
        role: auth.user?.staffRole || "UNKNOWN",
        department: auth.user?.department || "UNKNOWN",
        action: "UNAUTHORIZED_EVENTS_UPDATE",
        target: "/api/events",
        details: auth.error || "Blocked events status update.",
        status: "DENIED",
      });
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

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
