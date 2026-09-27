"use client";

export interface PdfExportOptions {
  filename?: string;
  title?: string;
  marginMm?: number;
  scale?: number;
  quality?: number;
  headerText?: string;
  footerText?: string;
}

/**
 * Exports any DOM element as a genuine, downloadable A4 PDF binary file.
 * Handles single-page and multi-page document pagination cleanly.
 */
export async function exportElementToRealPdf(
  elementOrId: HTMLElement | string,
  options: PdfExportOptions = {}
): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  const {
    filename = "Hotel-Kalya-Document.pdf",
    marginMm = 10,
    scale = 2,
    quality = 0.98,
    footerText = "Hotel Kalya Kapenguria • Official Record",
  } = options;

  const targetElement =
    typeof elementOrId === "string"
      ? document.getElementById(elementOrId)
      : elementOrId;

  if (!targetElement) {
    console.error("PDF Export: Target element not found", elementOrId);
    return false;
  }

  try {
    // Dynamic import to avoid SSR issues
    const [{ jsPDF }, html2canvasModule] = await Promise.all([
      import("jspdf"),
      import("html2canvas"),
    ]);
    const html2canvas = html2canvasModule.default || html2canvasModule;

    // Render DOM node to high-resolution canvas
    const canvas = await html2canvas(targetElement, {
      scale: scale,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: targetElement.scrollWidth,
    });

    const imgWidth = 210 - marginMm * 2; // A4 width: 210mm
    const pageHeightMm = 297; // A4 height: 297mm
    const printableHeightMm = pageHeightMm - marginMm * 2;

    // Canvas dimensions
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate how many mm high the entire canvas is at the scale of imgWidth
    const totalHeightMm = (canvasHeight * imgWidth) / canvasWidth;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    // If fits on one page
    if (totalHeightMm <= printableHeightMm) {
      const imgData = canvas.toDataURL("image/jpeg", quality);
      pdf.addImage(imgData, "JPEG", marginMm, marginMm, imgWidth, totalHeightMm, undefined, "FAST");

      // Running footer
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(footerText, marginMm, pageHeightMm - 5);
      pdf.text("Page 1 of 1", 210 - marginMm, pageHeightMm - 5, { align: "right" });
    } else {
      // Multi-page document: slice canvas vertically per A4 page
      const pageCanvasHeight = Math.floor((printableHeightMm / imgWidth) * canvasWidth);
      const totalPages = Math.ceil(canvasHeight / pageCanvasHeight);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage("a4", "portrait");
        }

        const sourceY = page * pageCanvasHeight;
        const sliceHeight = Math.min(pageCanvasHeight, canvasHeight - sourceY);

        // Create page slice canvas
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvasWidth;
        pageCanvas.height = sliceHeight;

        const ctx = pageCanvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvasWidth, sliceHeight);
          ctx.drawImage(
            canvas,
            0,
            sourceY,
            canvasWidth,
            sliceHeight,
            0,
            0,
            canvasWidth,
            sliceHeight
          );

          const sliceHeightMm = (sliceHeight * imgWidth) / canvasWidth;
          const pageImgData = pageCanvas.toDataURL("image/jpeg", quality);

          pdf.addImage(
            pageImgData,
            "JPEG",
            marginMm,
            marginMm,
            imgWidth,
            sliceHeightMm,
            undefined,
            "FAST"
          );

          // Running footer
          pdf.setFontSize(8);
          pdf.setTextColor(150, 150, 150);
          pdf.text(footerText, marginMm, pageHeightMm - 5);
          pdf.text(
            `Page ${page + 1} of ${totalPages}`,
            210 - marginMm,
            pageHeightMm - 5,
            { align: "right" }
          );
        }
      }
    }

    // Ensure filename ends in .pdf
    const safeFilename = filename.toLowerCase().endsWith(".pdf")
      ? filename
      : `${filename}.pdf`;

    pdf.save(safeFilename);
    return true;
  } catch (error) {
    console.error("PDF Generation error:", error);
    return false;
  }
}
