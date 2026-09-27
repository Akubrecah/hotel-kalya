import { jsPDF } from "jspdf";

export interface ServerPdfMetadata {
  id: string;
  title: string;
  category: string;
  phaseName: string;
  owner: string;
  status?: string;
  version?: string;
}

/**
 * Generates an executive, publication-grade ISO A4 PDF buffer from markdown text.
 * Runs in Node.js server environments without DOM dependencies.
 */
export function generateExecutivePdf(
  meta: ServerPdfMetadata,
  markdownContent: string
): Buffer {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  const bottomMargin = 20;
  let y = margin;

  function checkPageBreak(requiredHeight: number) {
    if (y + requiredHeight > pageHeight - bottomMargin) {
      doc.addPage("a4", "portrait");
      y = margin + 8; // leave room for running header
      drawRunningHeader();
    }
  }

  function drawRunningHeader() {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `HOTEL KALYA KAPENGURIA  |  ${meta.id} - ${meta.title.slice(0, 45)}`,
      margin,
      margin
    );
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, margin + 2, pageWidth - margin, margin + 2);
  }

  // --- PAGE 1 OFFICIAL LETTERHEAD BANNER ---
  // Top Maroon Banner Bar
  doc.setFillColor(124, 19, 34); // Brand Maroon #7C1322
  doc.rect(margin, y, contentWidth, 24, "F");

  // Gold accent line
  doc.setFillColor(242, 174, 28); // Brand Amber #F2AE1C
  doc.rect(margin, y + 23, contentWidth, 1.2, "F");

  // Brand text inside banner
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("HOTEL KALYA KAPENGURIA", margin + 5, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(242, 174, 28);
  doc.text("HOSPITALITY REDEFINED  *  EXECUTIVE DELIVERABLE", margin + 5, y + 14);

  doc.setFontSize(7.5);
  doc.setTextColor(230, 230, 230);
  doc.text(
    "Kapenguria, West Pokot County, Kenya  |  Tel: +254 719 766649  |  Email: info@hotelkalya.com",
    margin + 5,
    y + 19
  );

  // Document Badge on right
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(pageWidth - margin - 38, y + 3, 34, 17, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(124, 19, 34);
  doc.text("OFFICIAL RECORD", pageWidth - margin - 21, y + 7.5, { align: "center" });
  doc.setFontSize(11);
  doc.text(meta.id, pageWidth - margin - 21, y + 12.5, { align: "center" });
  doc.setFontSize(6.5);
  doc.setTextColor(100, 100, 100);
  doc.text(meta.status || "CONFIDENTIAL", pageWidth - margin - 21, y + 17, { align: "center" });

  y += 30;

  // Metadata Grid Box
  doc.setFillColor(250, 249, 245); // Warm cream
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, "FD");
  doc.setDrawColor(230, 225, 215);

  const colW = contentWidth / 4;
  const metaItems = [
    { label: "DOCUMENT TITLE", value: meta.title },
    { label: "GOVERNANCE CLASS", value: meta.category },
    { label: "LIFECYCLE STAGE", value: meta.phaseName },
    { label: "LEAD AUTHORITY", value: meta.owner },
  ];

  metaItems.forEach((item, idx) => {
    const colX = margin + idx * colW + 3;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(150, 150, 150);
    doc.text(item.label, colX, y + 5);

    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);
    const splitVal = doc.splitTextToSize(item.value, colW - 6);
    doc.text(splitVal.slice(0, 2), colX, y + 10);
  });

  y += 24;

  // --- PARSE MARKDOWN LINES ---
  const lines = markdownContent.split("\n");
  let inTable = false;
  let tableRows: string[][] = [];

  function flushTable() {
    if (tableRows.length === 0) return;
    checkPageBreak(tableRows.length * 7 + 10);

    const numCols = Math.max(...tableRows.map((r) => r.length));
    const cellW = contentWidth / numCols;

    tableRows.forEach((row, rIdx) => {
      checkPageBreak(7);
      const isHeader = rIdx === 0;

      if (isHeader) {
        doc.setFillColor(124, 19, 34);
        doc.rect(margin, y, contentWidth, 6.5, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
      } else {
        const bg = rIdx % 2 === 0 ? 250 : 255;
        doc.setFillColor(bg, bg, bg);
        doc.rect(margin, y, contentWidth, 6.5, "F");
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.2);
        doc.line(margin, y + 6.5, margin + contentWidth, y + 6.5);
        doc.setTextColor(50, 50, 50);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
      }

      row.forEach((cell, cIdx) => {
        const text = cell.replace(/\*\*/g, "").trim();
        const split = doc.splitTextToSize(text, cellW - 4);
        doc.text(split[0] || "", margin + cIdx * cellW + 2, y + 4.5);
      });

      y += 6.5;
    });

    y += 4;
    tableRows = [];
    inTable = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();

    // Table line
    if (rawLine.startsWith("|") && rawLine.endsWith("|")) {
      // Skip separator line like | :--- | :--- |
      if (/^\|[\s\-:]+\|/.test(rawLine)) {
        continue;
      }
      const cols = rawLine
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());
      tableRows.push(cols);
      inTable = true;
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Skip empty lines
    if (!rawLine) {
      y += 2.5;
      continue;
    }

    // Horizontal Rule
    if (rawLine === "---" || rawLine === "***" || rawLine === "___") {
      checkPageBreak(5);
      doc.setDrawColor(210, 210, 210);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;
      continue;
    }

    // H1 Heading
    if (rawLine.startsWith("# ")) {
      checkPageBreak(14);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.setTextColor(124, 19, 34); // Maroon
      const heading = rawLine.replace(/^#\s+/, "");
      const split = doc.splitTextToSize(heading, contentWidth);
      doc.text(split, margin, y + 4);
      y += split.length * 6 + 4;
      continue;
    }

    // H2 Heading
    if (rawLine.startsWith("## ")) {
      checkPageBreak(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(124, 19, 34);
      const heading = rawLine.replace(/^##\s+/, "");
      const split = doc.splitTextToSize(heading, contentWidth);
      doc.text(split, margin, y + 3);
      y += split.length * 5 + 2;

      // Small underline for H2
      doc.setDrawColor(242, 174, 28);
      doc.setLineWidth(0.6);
      doc.line(margin, y, margin + 40, y);
      y += 4;
      continue;
    }

    // H3 Heading
    if (rawLine.startsWith("### ")) {
      checkPageBreak(9);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      const heading = rawLine.replace(/^###\s+/, "");
      const split = doc.splitTextToSize(heading, contentWidth);
      doc.text(split, margin, y + 2);
      y += split.length * 4.5 + 2;
      continue;
    }

    // Blockquote
    if (rawLine.startsWith(">")) {
      const quoteText = rawLine.replace(/^>\s*/, "").replace(/\*\*/g, "");
      const split = doc.splitTextToSize(quoteText, contentWidth - 10);
      const boxHeight = split.length * 4.5 + 5;
      checkPageBreak(boxHeight + 2);

      doc.setFillColor(253, 251, 247);
      doc.rect(margin, y, contentWidth, boxHeight, "F");

      // Left amber accent bar
      doc.setFillColor(242, 174, 28);
      doc.rect(margin, y, 2.5, boxHeight, "F");

      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text(split, margin + 6, y + 4.5);
      y += boxHeight + 3;
      continue;
    }

    // Bullet List Item
    if (/^[-*]\s+/.test(rawLine) || /^\d+\.\s+/.test(rawLine)) {
      const cleanItem = rawLine
        .replace(/^[-*]\s+/, "")
        .replace(/^\d+\.\s+/, "")
        .replace(/\*\*/g, "");
      const split = doc.splitTextToSize(cleanItem, contentWidth - 8);
      checkPageBreak(split.length * 4 + 2);

      // Bullet dot
      doc.setFillColor(124, 19, 34);
      doc.circle(margin + 2.5, y + 1.5, 0.8, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(50, 50, 50);
      doc.text(split, margin + 6, y + 2.5);
      y += split.length * 4.2 + 1.5;
      continue;
    }

    // Normal Paragraph Text
    const cleanText = rawLine
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1");
    const split = doc.splitTextToSize(cleanText, contentWidth);
    checkPageBreak(split.length * 4.2 + 2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    doc.text(split, margin, y + 2);
    y += split.length * 4.2 + 2;
  }

  if (inTable) {
    flushTable();
  }

  // --- SIGN-OFF SEAL BOX ON LAST PAGE ---
  checkPageBreak(40);
  y += 6;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(124, 19, 34);
  doc.text("DOCUMENT EXECUTION & FORMAL ACCEPTANCE SEAL", margin, y + 2);
  y += 6;

  const signColW = contentWidth / 2 - 4;

  // Box 1: Client Directorate
  doc.setFillColor(252, 252, 252);
  doc.roundedRect(margin, y, signColW, 26, 1.5, 1.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text("HOTEL KALYA DIRECTORATE / APPROVER", margin + 3, y + 4.5);
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.2);
  doc.line(margin + 3, y + 17, margin + signColW - 3, y + 17);
  doc.setFontSize(6.5);
  doc.setTextColor(140, 140, 140);
  doc.text("Signature / Official Stamp", margin + 3, y + 16);
  doc.setTextColor(50, 50, 50);
  doc.text("Name: Haron Pkopus  |  Date: ______________", margin + 3, y + 22);

  // Box 2: Engineering Lead
  const box2X = margin + signColW + 8;
  doc.setFillColor(252, 252, 252);
  doc.roundedRect(box2X, y, signColW, 26, 1.5, 1.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text("LEAD SYSTEMS ARCHITECT / AGENCY LEAD", box2X + 3, y + 4.5);
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.2);
  doc.line(box2X + 3, y + 17, box2X + signColW - 3, y + 17);
  doc.setFontSize(6.5);
  doc.setTextColor(140, 140, 140);
  doc.text("Signature / Engineering Seal", box2X + 3, y + 16);
  doc.setTextColor(50, 50, 50);
  doc.text(
    "Role: Lead Full-Stack Architect  |  Date: ______________",
    box2X + 3,
    y + 22
  );

  // --- ADD RUNNING FOOTERS TO ALL PAGES ---
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    doc.text(
      "Hotel Kalya Kapenguria  *  Confidential Official Project Record",
      margin,
      pageHeight - 7.5
    );
    doc.text(
      `Page ${p} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 7.5,
      { align: "right" }
    );
  }

  return Buffer.from(doc.output("arraybuffer"));
}
