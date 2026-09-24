import { NextResponse } from "next/server";
import { PROJECT_DOCUMENTS } from "@/lib/docs-manifest";

export async function GET() {
  try {
    const phases = Array.from(new Set(PROJECT_DOCUMENTS.map((d) => d.phaseName)));
    const categories = Array.from(new Set(PROJECT_DOCUMENTS.map((d) => d.category)));

    return NextResponse.json({
      success: true,
      total: PROJECT_DOCUMENTS.length,
      documents: PROJECT_DOCUMENTS,
      phases,
      categories,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load document manifest: " + String(error) },
      { status: 500 }
    );
  }
}
