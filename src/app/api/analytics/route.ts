import { NextResponse } from "next/server";
import { getOperationalAnalytics } from "@/lib/db";

export async function GET() {
  try {
    const analytics = await getOperationalAnalytics();
    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load operational analytics: " + String(error) },
      { status: 500 }
    );
  }
}
