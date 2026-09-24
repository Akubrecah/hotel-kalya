"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { PROJECT_DOCUMENTS } from "@/lib/docs-manifest";
import { MarkdownViewer } from "@/components/admin/MarkdownViewer";
import { DocumentPrintHeader } from "@/components/admin/DocumentPrintHeader";
import { Printer, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function DocumentPrintPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = (params?.id as string) || "DOC-001";
  const pack = searchParams.get("pack") === "template" ? "template" : "hotel-kalya";
  const autoPrint = searchParams.get("autoPrint") === "true";

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

  useEffect(() => {
    if (!loading && autoPrint && docContent) {
      const timer = setTimeout(() => {
        window.print();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [loading, autoPrint, docContent]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-6 sm:p-12 print:p-0 max-w-4xl mx-auto">
      {/* Floating Toolbar (hidden in print) */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-200 no-print">
        <Link
          href="/admin/documents"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-brand-maroon transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Document Center</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            Pack: <strong>{pack === "hotel-kalya" ? "Hotel Kalya Official" : "Template"}</strong>
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-maroon text-white text-xs font-bold hover:bg-brand-maroon-dark transition-all shadow-md"
          >
            <Printer className="w-4 h-4 text-brand-amber" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-brand-maroon animate-spin mx-auto" />
          <p className="text-xs text-gray-500">Preparing high-resolution PDF document...</p>
        </div>
      ) : (
        <div className="space-y-6">
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
  );
}
