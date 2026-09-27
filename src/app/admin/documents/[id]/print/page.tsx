"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { PROJECT_DOCUMENTS } from "@/lib/docs-manifest";
import { MarkdownViewer } from "@/components/admin/MarkdownViewer";
import { DocumentPrintHeader } from "@/components/admin/DocumentPrintHeader";
import {
  Printer,
  ArrowLeft,
  RefreshCw,
  Download,
  ExternalLink,
  FileText,
  Eye,
} from "lucide-react";
import Link from "next/link";

export default function DocumentPrintPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = (params?.id as string) || "DOC-001";
  const pack = searchParams.get("pack") === "template" ? "template" : "hotel-kalya";

  const [activeTab, setActiveTab] = useState<"pdf" | "markdown">("pdf");
  const [docContent, setDocContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const docMeta = useMemo(() => {
    return PROJECT_DOCUMENTS.find(
      (d) => d.id.toUpperCase() === id.toUpperCase()
    ) || null;
  }, [id]);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/documents/${id}?pack=${pack}`)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (data.success && data.content) {
          setDocContent(data.content);
        } else {
          setDocContent(`# Document Not Found\n\nCould not retrieve content for ${id}.`);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setDocContent(`# Error\n\nFailed to load: ${String(err)}`);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id, pack]);

  const safeTitle = (docMeta?.title || id)
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .slice(0, 40);
  const pdfDownloadUrl = `/api/documents/${id}/pdf?pack=${pack}&download=true`;
  const pdfViewUrl = `/api/documents/${id}/pdf?pack=${pack}`;
  const filename = `${id.toUpperCase()}-${safeTitle}.pdf`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Floating Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:px-6 shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/documents"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-brand-maroon transition-colors bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Documents</span>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-maroon text-white">
                  {id.toUpperCase()}
                </span>
                <h1 className="font-serif font-bold text-sm text-gray-900 truncate max-w-sm sm:max-w-md">
                  {docMeta?.title || id}
                </h1>
              </div>
              <p className="text-[11px] text-gray-500">
                {docMeta?.phaseName} • {pack === "hotel-kalya" ? "Hotel Kalya Official Record" : "Generic Template"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("pdf")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === "pdf"
                    ? "bg-white text-brand-maroon shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-brand-amber" />
                <span>PDF Document</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("markdown")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === "markdown"
                    ? "bg-white text-brand-maroon shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Web Reader</span>
              </button>
            </div>

            {/* Direct PDF Download Anchor */}
            <a
              href={pdfDownloadUrl}
              download={filename}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-maroon text-white text-xs font-bold hover:bg-brand-maroon-dark transition-all shadow-sm active:scale-95"
              title="Download Genuine PDF File Directly"
            >
              <Download className="w-4 h-4 text-brand-amber" />
              <span>Download Real PDF (.pdf)</span>
            </a>

            {/* Open Fullscreen PDF Viewer */}
            <a
              href={pdfViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-amber text-brand-maroon text-xs font-bold hover:bg-brand-amber-dark transition-colors shadow-sm"
              title="Open native browser PDF viewer in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fullscreen PDF</span>
            </a>

            {/* Browser Print / Receipt */}
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-colors"
              title="Browser Print Slip"
            >
              <Printer className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden sm:inline">Print Slip</span>
            </button>
          </div>
        </div>

        {/* Main Document Body */}
        {loading ? (
          <div className="bg-white rounded-3xl p-20 text-center space-y-3 border border-gray-200 shadow-sm">
            <RefreshCw className="w-8 h-8 text-brand-maroon animate-spin mx-auto" />
            <p className="text-xs text-gray-500">Preparing official PDF deliverable...</p>
          </div>
        ) : activeTab === "pdf" ? (
          /* Real Embedded PDF Document Viewer */
          <div className="bg-[#525659] rounded-3xl p-2 sm:p-4 shadow-xl border border-gray-300 overflow-hidden">
            <div className="w-full h-[82vh] rounded-2xl overflow-hidden bg-white shadow-inner">
              <iframe
                src={`${pdfViewUrl}#toolbar=1&navpanes=1`}
                className="w-full h-full border-none"
                title={`Official PDF - ${id}`}
              />
            </div>
          </div>
        ) : (
          /* HTML / Markdown Printable Studio */
          <div
            id="official-pdf-document"
            className="bg-white rounded-3xl p-6 sm:p-12 shadow-md border border-gray-200 space-y-6"
          >
            <DocumentPrintHeader
              docId={id.toUpperCase()}
              title={docMeta?.title || id}
              phase={docMeta?.phaseName}
              category={docMeta?.category}
              author={docMeta?.owner}
              status={pack === "hotel-kalya" ? "Approved & Executed" : "Template Specification"}
            />

            <MarkdownViewer content={docContent} />

            {/* Official Sign-Off Section */}
            <div className="border-t-2 border-gray-300 pt-8 mt-12 print-break-inside-avoid">
              <div className="text-center mb-6">
                <h4 className="font-serif font-bold text-xs uppercase tracking-widest text-brand-maroon">
                  Document Execution &amp; Acceptance Seal
                </h4>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Standard Website Project Documentation Framework • Hotel Kalya Kapenguria
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 text-xs">
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Client Approver (Hotel Kalya Directorate)
                  </span>
                  <div className="h-12 border-b border-dashed border-gray-400 flex items-end pb-1 text-xs text-gray-400">
                    Signature / Stamp
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>Name: Haron Pkopus</span>
                    <span>Date: ________________</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Lead Systems Architect / Delivery Lead
                  </span>
                  <div className="h-12 border-b border-dashed border-gray-400 flex items-end pb-1 text-xs text-gray-400">
                    Signature / Stamp
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>Name: Technical Delivery Lead</span>
                    <span>Date: ________________</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-[9px] text-gray-400">
                <span>Standard Website Project Documentation Pack • Version 1.0</span>
                <span>CONFIDENTIAL • HOTEL KALYA KAPENGURIA, WEST POKOT</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
