import { NextRequest, NextResponse } from "next/server";
import { getStaffMembers, createStaffMember, updateStaffMember } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const role = searchParams.get("role");

    let staff = await getStaffMembers();

    if (department && department !== "all") {
      staff = staff.filter((s) => s.department.toLowerCase() === department.toLowerCase());
    }
    if (role && role !== "all") {
      staff = staff.filter((s) => s.role.toUpperCase() === role.toUpperCase());
    }

    return NextResponse.json({
      success: true,
      total: staff.length,
      staff,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch staff roster: " + String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.role || !body.department) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (name, email, role, department)." },
        { status: 400 }
      );
    }

    const newStaff = await createStaffMember({
      name: body.name,
      email: body.email,
      phone: body.phone || "+254 700 000000",
      department: body.department,
      role: body.role,
      whatsapp: body.whatsapp || "254719766649",
      status: body.status || "ACTIVE",
      shift: body.shift || "Morning (6AM - 2PM)",
      assignedRooms: body.assignedRooms || [],
      assignedTables: body.assignedTables || [],
    });

    return NextResponse.json({
      success: true,
      staff: newStaff,
      message: "Staff member added successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create staff member: " + String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Staff ID is required." },
        { status: 400 }
      );
    }

    const updated = await updateStaffMember(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Staff member '${id}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      staff: updated,
      message: "Staff profile updated.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update staff member: " + String(error) },
      { status: 500 }
    );
  }
}
