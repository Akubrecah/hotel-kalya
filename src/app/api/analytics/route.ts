import { NextRequest, NextResponse } from "next/server";
import { getOperationalAnalytics } from "@/lib/db";
import { authorizeApiRequest } from "@/lib/rbac";

export async function GET(request: NextRequest) {
  try {
    const auth = authorizeApiRequest(request, "reports:view", ["MANAGEMENT", "EXECUTIVE"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

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
