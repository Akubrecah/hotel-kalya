import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { PROJECT_DOCUMENTS } from "@/lib/docs-manifest";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const pack = searchParams.get("pack") === "template" ? "_TEMPLATE-PACK" : "HOTEL-KALYA-PACK";

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
    const filePath = path.resolve(
      process.cwd(),
      "../WEBSITE-PROJECT-DOCUMENTATION-PACK",
      pack,
      docMeta.folder,
      docMeta.filename
    );

    try {
      const content = await fs.readFile(filePath, "utf-8");
      return NextResponse.json({
        success: true,
        document: docMeta,
        pack,
        content,
      });
    } catch (fileErr) {
      // Fallback: If not found at relative path, try alternative root
      const altPath = path.resolve(
        process.cwd(),
        "WEBSITE-PROJECT-DOCUMENTATION-PACK",
        pack,
        docMeta.folder,
        docMeta.filename
      );
      try {
        const content = await fs.readFile(altPath, "utf-8");
        return NextResponse.json({
          success: true,
          document: docMeta,
          pack,
          content,
        });
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: `File not found on disk at: ${filePath} (${String(fileErr)})`,
          },
          { status: 404 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error: " + String(error) },
      { status: 500 }
    );
  }
}
