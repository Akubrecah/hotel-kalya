import { NextRequest, NextResponse } from "next/server";
import { getRooms, updateHousekeepingStatus, getHousekeepingLogs } from "@/lib/db";
import { HousekeepingStatus } from "@/types/hospitality";

export async function GET() {
  try {
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
    const body = await request.json();
    const { roomId, status, staffName, notes } = body;

    if (!roomId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: roomId and status." },
        { status: 400 }
      );
    }

    const result = await updateHousekeepingStatus(
      roomId,
      status as HousekeepingStatus,
      staffName || "Housekeeping Staff",
      notes
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

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
