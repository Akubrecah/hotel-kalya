import { NextResponse } from "next/server";
import {
  getConferenceBookings,
  createConferenceBooking,
  updateConferenceBookingStatus,
  logAuditEvent,
} from "@/lib/db";
import { authorizeApiRequest } from "@/lib/rbac";

export async function GET(request: Request) {
  try {
    const auth = authorizeApiRequest(request, "view_conference", [
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
        action: "UNAUTHORIZED_CONFERENCE_ACCESS",
        target: "/api/conference",
        details: auth.error || "Blocked cross-department conference data query.",
        status: "DENIED",
      });
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

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
    const auth = authorizeApiRequest(req, "manage_conference", [
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
        action: "UNAUTHORIZED_CONFERENCE_UPDATE",
        target: "/api/conference",
        details: auth.error || "Blocked conference status update.",
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
