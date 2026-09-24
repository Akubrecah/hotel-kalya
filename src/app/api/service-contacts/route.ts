import { NextRequest, NextResponse } from "next/server";
import { getServiceContacts, updateServiceContact } from "@/lib/db";

export async function GET() {
  try {
    const contacts = await getServiceContacts();
    return NextResponse.json({
      success: true,
      contacts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch service contacts: " + String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceKey, ...updates } = body;

    if (!serviceKey) {
      return NextResponse.json(
        { success: false, error: "serviceKey is required." },
        { status: 400 }
      );
    }

    const updated = await updateServiceContact(serviceKey, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Service contact for '${serviceKey}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      contact: updated,
      message: "Service contact details updated.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update service contact: " + String(error) },
      { status: 500 }
    );
  }
}
