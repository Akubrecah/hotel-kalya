import { NextResponse } from "next/server";
import { getAuditLogs } from "@/lib/db";

export async function GET() {
  try {
    const logs = await getAuditLogs();
    return NextResponse.json({
      success: true,
      total: logs.length,
      logs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load audit logs: " + String(error) },
      { status: 500 }
    );
  }
}
