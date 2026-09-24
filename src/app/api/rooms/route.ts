import { NextRequest, NextResponse } from "next/server";
import { getRooms, searchAvailableRooms, updateRoom } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const guests = searchParams.get("guests") ? parseInt(searchParams.get("guests")!, 10) : undefined;
    const typeSlug = searchParams.get("typeSlug") || undefined;
    const status = searchParams.get("status") || undefined;

    // If date range is specified, run availability search
    if (checkIn && checkOut) {
      const { availableRooms, unavailableRooms } = await searchAvailableRooms({
        checkIn,
        checkOut,
        guests,
        typeSlug,
      });

      return NextResponse.json({
        success: true,
        checkIn,
        checkOut,
        totalAvailable: availableRooms.length,
        totalUnavailable: unavailableRooms.length,
        availableRooms,
        unavailableRooms,
      });
    }

    let rooms = await getRooms();

    if (typeSlug && typeSlug !== "all") {
      rooms = rooms.filter((r) => r.typeSlug === typeSlug);
    }
    if (status && status !== "all") {
      rooms = rooms.filter((r) => r.reservationStatus.toLowerCase() === status.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      total: rooms.length,
      rooms,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch rooms: " + String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.roomNumber || !body.name || !body.type || !body.basePrice) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (roomNumber, name, type, basePrice)." },
        { status: 400 }
      );
    }

    const roomId = `room-${body.roomNumber.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    const newRoom = await updateRoom(roomId, {
      id: roomId,
      ...body,
      reservationStatus: body.reservationStatus || "AVAILABLE",
      housekeepingStatus: body.housekeepingStatus || "READY",
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      room: newRoom,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create room: " + String(error) },
      { status: 500 }
    );
  }
}
