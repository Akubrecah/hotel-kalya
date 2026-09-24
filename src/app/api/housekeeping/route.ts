import { NextRequest, NextResponse } from "next/server";
import { getRooms, updateHousekeepingStatus, getHousekeepingLogs, logAuditEvent } from "@/lib/db";
import { HousekeepingStatus } from "@/types/hospitality";
import { authorizeApiRequest } from "@/lib/rbac";

export async function GET(request: NextRequest) {
  try {
    const auth = authorizeApiRequest(request, "view_housekeeping", [
      "HOUSEKEEPING",
      "FRONT_OFFICE",
      "MANAGEMENT",
      "EXECUTIVE",
    ]);

    if (!auth.authorized) {
      await logAuditEvent({
        userId: auth.user?.id || "unauthorized_caller",
        userName: auth.user?.name || "Unknown Caller",
        role: auth.user?.staffRole || "UNKNOWN",
        department: auth.user?.department || "UNKNOWN",
        action: "UNAUTHORIZED_HOUSEKEEPING_ACCESS",
        target: "/api/housekeeping",
        details: auth.error || "Blocked unauthorized cross-department data request.",
        status: "DENIED",
      });
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const rooms = await getRooms();
    const logs = await getHousekeepingLogs();

    const categorized = {
      ready: rooms.filter((r) => r.housekeepingStatus === "READY"),
      dirty: rooms.filter((r) => r.housekeepingStatus === "DIRTY"),
      cleaning: rooms.filter((r) => r.housekeepingStatus === "CLEANING"),
      inspected: rooms.filter((r) => r.housekeepingStatus === "INSPECTED"),
      clean: rooms.filter((r) => r.housekeepingStatus === "CLEAN"),
      outOfOrder: rooms.filter((r) => r.housekeepingStatus === "OUT_OF_ORDER"),
    };

    return NextResponse.json({
      success: true,
      totalRooms: rooms.length,
      categorized,
      recentLogs: logs.slice(0, 50),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load housekeeping board: " + String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = authorizeApiRequest(request, "update_room_status", [
      "HOUSEKEEPING",
      "FRONT_OFFICE",
      "MANAGEMENT",
      "EXECUTIVE",
    ]);

    if (!auth.authorized) {
      await logAuditEvent({
        userId: auth.user?.id || "unauthorized_caller",
        userName: auth.user?.name || "Unknown Caller",
        role: auth.user?.staffRole || "UNKNOWN",
        department: auth.user?.department || "UNKNOWN",
        action: "UNAUTHORIZED_HOUSEKEEPING_MUTATION",
        target: "/api/housekeeping",
        details: auth.error || "Blocked cross-department status update.",
        status: "DENIED",
      });
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const { roomId, status, staffName, notes } = body;

    if (!roomId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: roomId and status." },
        { status: 400 }
      );
    }

    const effectiveStaffName = auth.user?.name || staffName || "Housekeeping Staff";
    const result = await updateHousekeepingStatus(
      roomId,
      status as HousekeepingStatus,
      effectiveStaffName,
      notes
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    await logAuditEvent({
      userId: auth.user?.id || "staff",
      userName: effectiveStaffName,
      role: auth.user?.staffRole || "HOUSEKEEPING",
      department: auth.user?.department || "Housekeeping",
      action: "UPDATE_ROOM_CLEANLINESS",
      target: `Room ${roomId}`,
      details: `Status set to ${status}${notes ? ` - ${notes}` : ""}`,
      status: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      room: result.room,
      message: `Room housekeeping status updated to ${status}.`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update housekeeping status: " + String(error) },
      { status: 500 }
    );
  }
}

export const PATCH = POST;
