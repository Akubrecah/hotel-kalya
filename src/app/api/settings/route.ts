import { NextRequest, NextResponse } from "next/server";
import { getHotelSettings, updateHotelSettings } from "@/lib/db";

export async function GET() {
  try {
    const settings = await getHotelSettings();
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch hotel settings: " + String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await updateHotelSettings(body);
    return NextResponse.json({
      success: true,
      settings: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update hotel settings: " + String(error) },
      { status: 500 }
    );
  }
}
