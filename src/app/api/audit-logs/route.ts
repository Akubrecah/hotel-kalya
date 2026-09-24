import { NextRequest, NextResponse } from "next/server";
import { getAuditLogs, logAuditEvent } from "@/lib/db";
import { authorizeApiRequest } from "@/lib/rbac";

export async function GET(request: NextRequest) {
  try {
    const auth = authorizeApiRequest(request, "view_audit_logs", ["EXECUTIVE", "MANAGEMENT"]);
    if (!auth.authorized) {
      await logAuditEvent({
        userId: auth.user?.id || "unauthorized_caller",
        userName: auth.user?.name || "Unknown Caller",
        role: auth.user?.staffRole || "UNKNOWN",
        department: auth.user?.department || "UNKNOWN",
        action: "UNAUTHORIZED_AUDIT_LOGS_QUERY",
        target: "/api/audit-logs",
        details: auth.error || "Blocked audit trail query.",
        status: "DENIED",
      });
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, target, details, status, department, role, userName, userId } = body;

    if (!action || !target) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: action and target" },
        { status: 400 }
      );
    }

    await logAuditEvent({
      userId: userId || "staff",
      userName: userName || "Staff Operator",
      role: role || "STAFF",
      department: department || "Operations",
      action,
      target,
      details: details || "",
      status: status || "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      message: "Audit event recorded.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to record audit event: " + String(error) },
      { status: 500 }
    );
  }
}
