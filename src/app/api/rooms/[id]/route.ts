import { NextRequest, NextResponse } from "next/server";
import { getRoomById, updateRoom, getRoomMonthCalendar } from "@/lib/db";
import { authorizeApiRequest } from "@/lib/rbac";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const includeCalendar = searchParams.get("calendar") === "true";
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")!, 10) : new Date().getFullYear();
    const month = searchParams.get("month") ? parseInt(searchParams.get("month")!, 10) : new Date().getMonth() + 1;

    const room = await getRoomById(id);
    if (!room) {
      return NextResponse.json(
        { success: false, error: `Room '${id}' not found.` },
        { status: 404 }
      );
    }

    let calendar = null;
    if (includeCalendar) {
      calendar = await getRoomMonthCalendar(room.id, year, month);
    }

    return NextResponse.json({
      success: true,
      room,
      year,
      month,
      calendar,
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
    const auth = authorizeApiRequest(request, "rooms:write", ["MANAGEMENT", "EXECUTIVE", "HOUSEKEEPING"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = await context.params;
    const body = await request.json();

    const updated = await updateRoom(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Room '${id}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      room: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update room: " + String(error) },
      { status: 500 }
    );
  }
}
