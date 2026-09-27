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
    const auth = authorizeApiRequest(request, "audit:view", ["EXECUTIVE", "MANAGEMENT", "FRONT_OFFICE"]);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, error: auth.error || "Authentication required" }, { status: auth.status || 401 });
    }

    const body = await request.json();
    const { action, target, details, status } = body;

    if (!action || !target) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: action and target" },
        { status: 400 }
      );
    }

    // Bind identity strictly to authenticated user session to preserve audit trail integrity
    await logAuditEvent({
      userId: auth.user.id,
      userName: auth.user.name,
      role: (auth.user.staffRole as any) || (auth.user.role?.toUpperCase() as any) || "STAFF",
      department: auth.user.department || "Operations",
      action: String(action).slice(0, 100),
      target: String(target).slice(0, 150),
      details: details ? String(details).slice(0, 500) : "",
      status: status === "DENIED" ? "DENIED" : "SUCCESS",
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
