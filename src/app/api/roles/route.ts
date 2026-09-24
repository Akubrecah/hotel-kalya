import { NextRequest, NextResponse } from "next/server";
import { getRoles, createRole, updateRole, deleteRole, logAuditEvent } from "@/lib/db";
import { authorizeApiRequest } from "@/lib/rbac";

export async function GET(request: NextRequest) {
  try {
    const auth = authorizeApiRequest(request, "manage_roles", ["EXECUTIVE", "MANAGEMENT"]);
    if (!auth.authorized) {
      await logAuditEvent({
        userId: auth.user?.id || "unauthorized_caller",
        userName: auth.user?.name || "Unknown Caller",
        role: auth.user?.staffRole || "UNKNOWN",
        department: auth.user?.department || "UNKNOWN",
        action: "UNAUTHORIZED_ROLES_ACCESS",
        target: "/api/roles",
        details: auth.error || "Blocked RBAC role configuration query.",
        status: "DENIED",
      });
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const roles = await getRoles();
    return NextResponse.json({
      success: true,
      roles,
      count: roles.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch roles: " + String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = authorizeApiRequest(request, "manage_roles", ["EXECUTIVE"]);
    if (!auth.authorized) {
      await logAuditEvent({
        userId: auth.user?.id || "unauthorized_caller",
        userName: auth.user?.name || "Unknown Caller",
        role: auth.user?.staffRole || "UNKNOWN",
        department: auth.user?.department || "UNKNOWN",
        action: "UNAUTHORIZED_ROLE_CREATION",
        target: "/api/roles",
        details: auth.error || "Blocked role creation attempt.",
        status: "DENIED",
      });
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const { roleCode, title, department, description, permissions } = body;

    if (!roleCode || !title || !department) {
      return NextResponse.json(
        { success: false, error: "Role code, title, and department are required." },
        { status: 400 }
      );
    }

    const newRole = await createRole({
      roleCode,
      title,
      department,
      description: description || "",
      permissions: Array.isArray(permissions) ? permissions : [],
    });

    await logAuditEvent({
      userId: auth.user?.id || "admin",
      userName: auth.user?.name || "Administrator",
      role: "ADMIN",
      department: "Management",
      action: "CREATE_ROLE_POLICY",
      target: newRole.title,
      details: `Created custom role ${newRole.roleCode} with ${newRole.permissions.length} permissions`,
      status: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      role: newRole,
      message: `Role '${newRole.title}' created successfully.`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = authorizeApiRequest(request, "manage_roles", ["EXECUTIVE"]);
    if (!auth.authorized) {
      await logAuditEvent({
        userId: auth.user?.id || "unauthorized_caller",
        userName: auth.user?.name || "Unknown Caller",
        role: auth.user?.staffRole || "UNKNOWN",
        department: auth.user?.department || "UNKNOWN",
        action: "UNAUTHORIZED_ROLE_UPDATE",
        target: "/api/roles",
        details: auth.error || "Blocked role policy modification.",
        status: "DENIED",
      });
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const { id, title, department, description, permissions } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Role ID is required for update." },
        { status: 400 }
      );
    }

    const updated = await updateRole(id, {
      title,
      department,
      description,
      permissions,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Role not found." },
        { status: 404 }
      );
    }

    await logAuditEvent({
      userId: auth.user?.id || "admin",
      userName: auth.user?.name || "Administrator",
      role: "ADMIN",
      department: "Management",
      action: "UPDATE_ROLE_POLICY",
      target: updated.title,
      details: `Updated role permissions for ${updated.roleCode}`,
      status: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      role: updated,
      message: `Role '${updated.title}' updated successfully.`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update role: " + String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = authorizeApiRequest(request, "manage_roles", ["EXECUTIVE"]);
    if (!auth.authorized) {
      await logAuditEvent({
        userId: auth.user?.id || "unauthorized_caller",
        userName: auth.user?.name || "Unknown Caller",
        role: auth.user?.staffRole || "UNKNOWN",
        department: auth.user?.department || "UNKNOWN",
        action: "UNAUTHORIZED_ROLE_DELETION",
        target: "/api/roles",
        details: auth.error || "Blocked role deletion attempt.",
        status: "DENIED",
      });
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Role ID is required for deletion." },
        { status: 400 }
      );
    }

    const result = await deleteRole(id);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    await logAuditEvent({
      userId: auth.user?.id || "admin",
      userName: auth.user?.name || "Administrator",
      role: "ADMIN",
      department: "Management",
      action: "DELETE_ROLE_POLICY",
      target: id,
      details: `Deleted role definition ${id}`,
      status: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      message: "Role deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete role: " + String(error) },
      { status: 500 }
    );
  }
}
