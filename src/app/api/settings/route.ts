import { NextRequest, NextResponse } from "next/server";
import { getHotelSettings, updateHotelSettings } from "@/lib/db";
import { authorizeApiRequest } from "@/lib/rbac";

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
    const auth = authorizeApiRequest(request, "settings:manage", ["EXECUTIVE"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const updated = await updateHotelSettings(body, auth.user);
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
