import { NextRequest, NextResponse } from "next/server";
import { getRoles, createRole, updateRole, deleteRole } from "@/lib/db";

export async function GET() {
  try {
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
