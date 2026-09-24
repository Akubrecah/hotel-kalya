import { NextRequest, NextResponse } from "next/server";
import { getBookingById, updateBookingStatus } from "@/lib/db";
import { ReservationLifecycleStatus } from "@/types/hospitality";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const booking = await getBookingById(id);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: `Reservation '${id}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      reservation: booking,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error: " + String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status, operatorName } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Missing status in request body." },
        { status: 400 }
      );
    }

    const result = await updateBookingStatus(
      id,
      status as ReservationLifecycleStatus,
      operatorName || "Front Desk Operator"
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      reservation: result.booking,
      message: `Reservation status updated to ${status}.`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update reservation: " + String(error) },
      { status: 500 }
    );
  }
}
