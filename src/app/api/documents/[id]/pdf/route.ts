import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { PROJECT_DOCUMENTS } from "@/lib/docs-manifest";
import { generateExecutivePdf } from "@/lib/server-pdf";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const pack = searchParams.get("pack") === "template" ? "_TEMPLATE-PACK" : "HOTEL-KALYA-PACK";
    const isDownload = searchParams.get("download") === "true";

    const docMeta = PROJECT_DOCUMENTS.find(
      (d) => d.id.toUpperCase() === id.toUpperCase()
    );

    if (!docMeta) {
      return NextResponse.json(
        { success: false, error: `Document ID '${id}' not found in project manifest` },
        { status: 404 }
      );
    }

    // Resolve file path in WEBSITE-PROJECT-DOCUMENTATION-PACK
    let content: string | null = null;
    const pathsToTry = [
      path.resolve(process.cwd(), "../WEBSITE-PROJECT-DOCUMENTATION-PACK", pack, docMeta.folder, docMeta.filename),
      path.resolve(process.cwd(), "WEBSITE-PROJECT-DOCUMENTATION-PACK", pack, docMeta.folder, docMeta.filename),
      path.resolve("/Users/Akubrecah/Desktop/HOTEL KALYA/WEBSITE-PROJECT-DOCUMENTATION-PACK", pack, docMeta.folder, docMeta.filename),
    ];

    for (const p of pathsToTry) {
      try {
        content = await fs.readFile(/*turbopackIgnore: true*/ p, "utf-8");
        if (content) break;
      } catch {
        // continue
      }
    }

    if (!content) {
      content = `# ${docMeta.id}: ${docMeta.title}\n\n**Category:** ${docMeta.category}\n**Lifecycle Phase:** ${docMeta.lifecyclePhase}\n**Owner:** ${docMeta.owner}\n\n## Overview\n${docMeta.description}\n\n---\n\n## Content Status\nOfficial specification instantiated for Hotel Kalya Digital Platform.`;
    }

    const pdfBuffer = generateExecutivePdf(
      {
        id: docMeta.id,
        title: docMeta.title,
        category: docMeta.category,
        phaseName: docMeta.phaseName,
        owner: docMeta.owner,
        status: pack === "HOTEL-KALYA-PACK" ? "APPROVED & EXECUTED" : "TEMPLATE BASELINE",
        version: "1.0",
      },
      content
    );

    const safeTitle = docMeta.title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
    const filename = `${docMeta.id}-${safeTitle}.pdf`;

    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Length", pdfBuffer.length.toString());
    headers.set(
      "Content-Disposition",
      `${isDownload ? "attachment" : "inline"}; filename="${filename}"`
    );
    headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600");

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Server PDF generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate PDF document" },
      { status: 500 }
    );
  }
}
