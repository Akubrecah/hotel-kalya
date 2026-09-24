import { NextResponse } from "next/server";
import {
  getCateringBookings,
  createCateringBooking,
  updateCateringBookingStatus,
  logAuditEvent,
} from "@/lib/db";
import { authorizeApiRequest } from "@/lib/rbac";

export async function GET(request: Request) {
  try {
    const auth = authorizeApiRequest(request, "view_catering", [
      "CATERING",
      "MANAGEMENT",
      "EXECUTIVE",
    ]);

    if (!auth.authorized) {
      await logAuditEvent({
        userId: auth.user?.id || "unauthorized_caller",
        userName: auth.user?.name || "Unknown Caller",
        role: auth.user?.staffRole || "UNKNOWN",
        department: auth.user?.department || "UNKNOWN",
        action: "UNAUTHORIZED_CATERING_ACCESS",
        target: "/api/catering",
        details: auth.error || "Blocked cross-department catering data query.",
        status: "DENIED",
      });
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

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
    const auth = authorizeApiRequest(req, "manage_catering", [
      "CATERING",
      "MANAGEMENT",
      "EXECUTIVE",
    ]);

    if (!auth.authorized) {
      await logAuditEvent({
        userId: auth.user?.id || "unauthorized_caller",
        userName: auth.user?.name || "Unknown Caller",
        role: auth.user?.staffRole || "UNKNOWN",
        department: auth.user?.department || "UNKNOWN",
        action: "UNAUTHORIZED_CATERING_UPDATE",
        target: "/api/catering",
        details: auth.error || "Blocked catering status update.",
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
