"use client";

import React, { useMemo } from "react";
import { CheckSquare, Square, AlertCircle, Info, AlertTriangle, CheckCircle2 } from "lucide-react";

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export function MarkdownViewer({ content, className = "" }: MarkdownViewerProps) {
  const renderedElements = useMemo(() => {
    return parseMarkdown(content);
  }, [content]);

  return (
    <div className={`prose-sm max-w-none text-gray-800 leading-relaxed font-sans space-y-4 ${className}`}>
      {renderedElements}
    </div>
  );
}

function parseMarkdown(md: string): React.ReactNode[] {
  if (!md) return [];

  const lines = md.split("\n");
  const nodes: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "";

  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  const flushTable = (key: number) => {
    if (!inTable) return null;
    const element = (
      <div key={`table-wrapper-${key}`} className="my-6 overflow-x-auto rounded-xl border border-gray-200 shadow-sm print:shadow-none">
        <table className="w-full text-left text-xs border-collapse">
          {tableHeader.length > 0 && (
            <thead className="bg-brand-maroon/5 border-b border-gray-200 text-brand-maroon font-bold">
              <tr>
                {tableHeader.map((h, i) => (
                  <th key={i} className="px-4 py-3 font-bold border-r last:border-r-0 border-gray-200">
                    {parseInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-gray-100 bg-white">
            {tableRows.map((row, rIdx) => (
              <tr key={rIdx} className={rIdx % 2 === 1 ? "bg-gray-50/60" : "bg-white"}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-2.5 border-r last:border-r-0 border-gray-200 align-top text-gray-700">
                    {parseInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    inTable = false;
    tableHeader = [];
    tableRows = [];
    return element;
  };

  const flushCodeBlock = (key: number) => {
    if (!inCodeBlock) return null;
    const element = (
      <div key={`code-${key}`} className="my-4 rounded-xl bg-gray-900 text-gray-100 p-4 font-mono text-xs overflow-x-auto border border-gray-800 shadow-inner">
        {codeLang && <div className="text-[10px] text-brand-amber font-bold uppercase mb-2 tracking-wider">{codeLang}</div>}
        <pre className="whitespace-pre">{codeBuffer.join("\n")}</pre>
      </div>
    );
    inCodeBlock = false;
    codeBuffer = [];
    codeLang = "";
    return element;
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx];
    const line = rawLine.trim();

    // Code block toggle
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        nodes.push(flushCodeBlock(idx));
      } else {
        if (inTable) nodes.push(flushTable(idx));
        inCodeBlock = true;
        codeLang = line.replace("```", "").trim();
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    // Markdown Table row
    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());

      // Check if it's separator row like | :--- | :--- |
      const isSeparator = cells.every((c) => /^:?-+:?$/.test(c));
      if (isSeparator) {
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      nodes.push(flushTable(idx));
    }

    // Empty lines
    if (!line) {
      continue;
    }

    // Headings
    if (line.startsWith("# ")) {
      nodes.push(
        <h1 key={idx} className="font-serif text-2xl sm:text-3xl font-extrabold text-brand-maroon pt-4 pb-2 border-b-2 border-brand-amber/40">
          {parseInline(line.replace("# ", ""))}
        </h1>
      );
      continue;
    }
    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={idx} className="font-serif text-xl sm:text-2xl font-bold text-brand-maroon-dark pt-5 pb-1 flex items-center gap-2 border-b border-gray-200">
          <span className="w-2 h-2 rounded-full bg-brand-amber inline-block" />
          {parseInline(line.replace("## ", ""))}
        </h2>
      );
      continue;
    }
    if (line.startsWith("### ")) {
      nodes.push(
        <h3 key={idx} className="font-serif text-base sm:text-lg font-bold text-gray-900 pt-3">
          {parseInline(line.replace("### ", ""))}
        </h3>
      );
      continue;
    }
    if (line.startsWith("#### ")) {
      nodes.push(
        <h4 key={idx} className="text-sm font-bold text-gray-800 uppercase tracking-wider pt-2 text-brand-maroon">
          {parseInline(line.replace("#### ", ""))}
        </h4>
      );
      continue;
    }

    // Horizontal Rule
    if (line === "---" || line === "***" || line === "___") {
      nodes.push(<hr key={idx} className="my-6 border-t border-gray-200/80" />);
      continue;
    }

    // Blockquotes & Alerts
    if (line.startsWith("> ")) {
      const bqText = line.replace(/^>\s*/, "");
      let alertType = "info";
      let cleanText = bqText;

      if (bqText.includes("[!NOTE]")) {
        alertType = "note";
        cleanText = bqText.replace(/\[!NOTE\]/i, "").trim();
      } else if (bqText.includes("[!IMPORTANT]")) {
        alertType = "important";
        cleanText = bqText.replace(/\[!IMPORTANT\]/i, "").trim();
      } else if (bqText.includes("[!WARNING]") || bqText.includes("[!CAUTION]")) {
        alertType = "warning";
        cleanText = bqText.replace(/\[!(WARNING|CAUTION)\]/i, "").trim();
      } else if (bqText.includes("[!TIP]")) {
        alertType = "tip";
        cleanText = bqText.replace(/\[!TIP\]/i, "").trim();
      }

      nodes.push(
        <div
          key={idx}
          className={`p-4 rounded-xl border my-3 text-xs leading-relaxed flex items-start gap-3 ${
            alertType === "important"
              ? "bg-amber-50/80 border-amber-300 text-amber-950"
              : alertType === "warning"
              ? "bg-rose-50/80 border-rose-300 text-rose-950"
              : alertType === "tip"
              ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
              : "bg-blue-50/80 border-blue-200 text-blue-950"
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {alertType === "important" ? (
              <AlertCircle className="w-4 h-4 text-brand-amber-dark" />
            ) : alertType === "warning" ? (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            ) : alertType === "tip" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <Info className="w-4 h-4 text-blue-600" />
            )}
          </div>
          <div>{parseInline(cleanText)}</div>
        </div>
      );
      continue;
    }

    // Checkboxes / Task lists
    if (line.startsWith("- [ ] ") || line.startsWith("* [ ] ")) {
      nodes.push(
        <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 py-1 pl-2">
          <Square className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
          <span>{parseInline(line.replace(/^[-*]\s*\[\s*\]\s*/, ""))}</span>
        </div>
      );
      continue;
    }
    if (line.startsWith("- [x] ") || line.startsWith("- [X] ") || line.startsWith("* [x] ")) {
      nodes.push(
        <div key={idx} className="flex items-start gap-2.5 text-xs text-emerald-800 font-medium py-1 pl-2">
          <CheckSquare className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <span>{parseInline(line.replace(/^[-*]\s*\[[xX]\]\s*/, ""))}</span>
        </div>
      );
      continue;
    }

    // Unordered List
    if (line.startsWith("- ") || line.startsWith("* ")) {
      nodes.push(
        <li key={idx} className="list-disc ml-6 text-xs text-gray-700 py-0.5">
          {parseInline(line.replace(/^[-*]\s+/, ""))}
        </li>
      );
      continue;
    }

    // Ordered List
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      nodes.push(
        <li key={idx} value={parseInt(numMatch[1], 10)} className="list-decimal ml-6 text-xs text-gray-700 py-0.5">
          {parseInline(numMatch[2])}
        </li>
      );
      continue;
    }

    // Standard Paragraph
    nodes.push(
      <p key={idx} className="text-xs text-gray-700 leading-relaxed">
        {parseInline(line)}
      </p>
    );
  }

  if (inTable) nodes.push(flushTable(lines.length));
  if (inCodeBlock) nodes.push(flushCodeBlock(lines.length));

  return nodes;
}

function parseInline(text: string): React.ReactNode {
  if (!text) return "";

  // Split by inline codes: `code`
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="px-1.5 py-0.5 mx-0.5 rounded bg-amber-50 text-brand-maroon-dark font-mono text-[11px] border border-amber-200/80">
          {part.slice(1, -1)}
        </code>
      );
    }

    // Process bold **bold**
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return (
      <React.Fragment key={i}>
        {boldParts.map((bPart, bIdx) => {
          if (bPart.startsWith("**") && bPart.endsWith("**")) {
            return (
              <strong key={bIdx} className="font-bold text-gray-900">
                {bPart.slice(2, -2)}
              </strong>
            );
          }

          // Process italic *italic*
          const italicParts = bPart.split(/(\*[^*]+\*)/g);
          return (
            <React.Fragment key={bIdx}>
              {italicParts.map((iPart, iIdx) => {
                if (iPart.startsWith("*") && iPart.endsWith("*") && iPart.length > 2) {
                  return (
                    <em key={iIdx} className="italic text-gray-800">
                      {iPart.slice(1, -1)}
                    </em>
                  );
                }

                // Process markdown links [text](url)
                const linkMatch = iPart.match(/\[([^\]]+)\]\(([^)]+)\)/);
                if (linkMatch) {
                  const segments = iPart.split(/(\[[^\]]+\]\([^)]+\))/g);
                  return segments.map((seg, sIdx) => {
                    const m = seg.match(/\[([^\]]+)\]\(([^)]+)\)/);
                    if (m) {
                      return (
                        <a key={sIdx} href={m[2]} target="_blank" rel="noopener noreferrer" className="text-brand-maroon underline font-semibold hover:text-brand-amber-dark">
                          {m[1]}
                        </a>
                      );
                    }
                    return seg;
                  });
                }

                return iPart;
              })}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  });
}
