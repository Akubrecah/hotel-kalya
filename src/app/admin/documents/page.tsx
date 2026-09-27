"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Printer,
  CheckCircle2,
  Filter,
  Download,
  Eye,
  X,
  Layers,
  Building,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { PROJECT_DOCUMENTS, ProjectDocMetadata } from "@/lib/docs-manifest";
import { MarkdownViewer } from "@/components/admin/MarkdownViewer";
import { DocumentPrintHeader } from "@/components/admin/DocumentPrintHeader";
import { exportElementToRealPdf } from "@/lib/pdf-generator";

export default function AdminDocumentsPage() {
  const [selectedPack, setSelectedPack] = useState<"hotel-kalya" | "template">("hotel-kalya");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPhase, setSelectedPhase] = useState<string>("All");

  // Document modal viewer state
  const [activeDoc, setActiveDoc] = useState<ProjectDocMetadata | null>(null);
  const [docContent, setDocContent] = useState<string>("");
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [generatingModalPdf, setGeneratingModalPdf] = useState(false);

  // Filtered documents list
  const filteredDocs = useMemo(() => {
    return PROJECT_DOCUMENTS.filter((doc) => {
      const matchesSearch =
        doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.phaseName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || doc.category === selectedCategory;

      const matchesPhase =
        selectedPhase === "All" || doc.phaseName === selectedPhase;

      return matchesSearch && matchesCategory && matchesPhase;
    });
  }, [searchQuery, selectedCategory, selectedPhase]);

  // Load document content when activeDoc changes
  useEffect(() => {
    if (!activeDoc) return;

    let mounted = true;
    fetch(`/api/documents/${activeDoc.id}?pack=${selectedPack}`)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (data.success && data.content) {
          setDocContent(data.content);
        } else {
          setDocContent(`# Error Loading Document\n\nCould not fetch content for ${activeDoc.id}: ${data.error || "Unknown error"}`);
        }
        setLoadingDoc(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setDocContent(`# Error\n\nFailed to fetch document: ${String(err)}`);
        setLoadingDoc(false);
      });

    return () => {
      mounted = false;
    };
  }, [activeDoc, selectedPack]);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(PROJECT_DOCUMENTS.map((d) => d.category)))];
  }, []);

  const phases = useMemo(() => {
    return ["All", ...Array.from(new Set(PROJECT_DOCUMENTS.map((d) => d.phaseName)))];
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadModalPdf = async () => {
    if (!activeDoc) return;
    setGeneratingModalPdf(true);
    const safeTitle = activeDoc.title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
    const filename = `${activeDoc.id.toUpperCase()}-${safeTitle}.pdf`;
    await exportElementToRealPdf("modal-printable-document-body", {
      filename,
      footerText: `Hotel Kalya Kapenguria • ${activeDoc.id.toUpperCase()} • Official Deliverable`,
    });
    setGeneratingModalPdf(false);
  };

  const handleDownloadMarkdown = (doc: ProjectDocMetadata) => {
    fetch(`/api/documents/${doc.id}?pack=${selectedPack}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.content) {
          const blob = new Blob([data.content], { type: "text/markdown" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${doc.id}-${selectedPack}.md`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-amber/20 text-brand-maroon-dark text-[10px] font-bold uppercase tracking-wider">
              Governance &amp; Delivery SOP
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 font-medium">32 Phases • 45 Deliverables</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon">
            Project Documentation &amp; PDF Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Audit, inspect, and export all client onboarding, commercial, technical, and handover documents.
            Generates pixel-perfect A4 PDFs with official Hotel Kalya letterhead and signatures.
          </p>
        </div>

        {/* Pack Selector Toggle */}
        <div className="bg-gray-100 p-1 rounded-2xl flex items-center shadow-inner border border-gray-200 self-start md:self-center">
          <button
            type="button"
            onClick={() => setSelectedPack("hotel-kalya")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedPack === "hotel-kalya"
                ? "bg-brand-maroon text-white shadow-md"
                : "text-gray-600 hover:text-brand-maroon"
            }`}
          >
            <Building className="w-3.5 h-3.5 text-brand-amber" />
            <span>Hotel Kalya Pack</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedPack("template")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedPack === "template"
                ? "bg-brand-maroon text-white shadow-md"
                : "text-gray-600 hover:text-brand-maroon"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-brand-amber" />
            <span>Blank Template Pack</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Deliverables</span>
          <div className="font-serif font-black text-2xl text-brand-maroon mt-1">45 Documents</div>
          <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 100% Phase Coverage
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Mandatory Pre-Gates</span>
          <div className="font-serif font-black text-2xl text-brand-amber-dark mt-1">10 / 10 Gates</div>
          <span className="text-[10px] text-gray-500 font-medium mt-0.5">Strict Zero-Code Policy</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Active Edition</span>
          <div className="font-bold text-sm text-gray-900 mt-1 truncate">
            {selectedPack === "hotel-kalya" ? "Hotel Kalya Official" : "Reusable Template"}
          </div>
          <span className="text-[10px] text-brand-maroon font-semibold mt-0.5">
            {selectedPack === "hotel-kalya" ? "KES 650k • 49 Routes • Signed" : "Generic Agency Blueprint"}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">PDF Export Engine</span>
          <div className="font-bold text-sm text-emerald-800 mt-1 flex items-center gap-1.5">
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>Browser A4 Vector</span>
          </div>
          <span className="text-[10px] text-gray-500 font-medium mt-0.5">Zero Puppeteer Latency</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Document ID (DOC-001), Title, Keyword, or Phase..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-maroon focus:border-brand-maroon transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              aria-label="Filter by lifecycle phase"
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 bg-white"
            >
              {phases.map((p) => (
                <option key={p} value={p}>
                  {p === "All" ? "All Lifecycle Phases (1-14)" : p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-gray-400 mr-1 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-brand-amber text-brand-maroon shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => {
          return (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-gray-200 hover:border-brand-amber hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-brand-maroon/10 text-brand-maroon">
                    {doc.id}
                  </span>
                  {doc.gate && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {doc.gate}
                    </span>
                  )}
                  <span className="text-[11px] text-gray-400 font-medium">
                    Phase {String(doc.phaseNum).padStart(2, "0")}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-gray-900 group-hover:text-brand-maroon transition-colors line-clamp-1">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>
                </div>

                <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1 border-t border-gray-100">
                  <span className="truncate max-w-[170px]">Owner: {doc.owner}</span>
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium text-[10px]">
                    {doc.category}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveDoc(doc)}
                  className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-brand-cream border border-brand-maroon/20 text-brand-maroon hover:bg-brand-cream/80 text-xs font-bold transition-colors"
                  title="Preview & Read Document"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Read</span>
                </button>

                <a
                  href={`/api/documents/${doc.id}/pdf?pack=${selectedPack}&download=true`}
                  download={`${doc.id}-${doc.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`}
                  className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-brand-maroon text-white hover:bg-brand-maroon-dark text-xs font-bold transition-colors shadow-sm"
                  title="Download Real PDF Document"
                >
                  <Download className="w-3.5 h-3.5 text-brand-amber" />
                  <span>PDF</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleDownloadMarkdown(doc)}
                  className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors"
                  title="Download Raw Markdown"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>.md</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDocs.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border text-center space-y-3">
          <FileText className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-serif font-bold text-gray-700">No documents matched your filter</h3>
          <p className="text-xs text-gray-500">
            Try adjusting your search query or reset category filter to &quot;All&quot;.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSelectedPhase("All");
            }}
            className="px-4 py-2 rounded-xl bg-brand-maroon text-white text-xs font-bold mt-2"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Modal Document Viewer & Print Drawer */}
      {activeDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:max-h-none print:shadow-none print:rounded-none print:w-full print:p-0">
            {/* Modal Header Bar (hidden in print) */}
            <div className="p-4 sm:px-6 bg-brand-maroon-dark text-white flex items-center justify-between border-b border-brand-maroon no-print">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-brand-amber text-brand-maroon font-mono text-xs font-black">
                  {activeDoc.id}
                </span>
                <div>
                  <h3 className="font-serif font-bold text-sm text-white truncate max-w-md">
                    {activeDoc.title}
                  </h3>
                  <p className="text-[10px] text-white/70">
                    {activeDoc.phaseName} • {selectedPack === "hotel-kalya" ? "Hotel Kalya Instantiated" : "Generic Template"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`/api/documents/${activeDoc.id}/pdf?pack=${selectedPack}&download=true`}
                  download={`${activeDoc.id}-${activeDoc.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-amber text-brand-maroon hover:bg-brand-amber-dark text-xs font-bold transition-all shadow"
                  title="Download Real PDF File Directly"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF (.pdf)</span>
                </a>

                <Link
                  href={`/admin/documents/${activeDoc.id}/print?pack=${selectedPack}`}
                  target="_blank"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors border border-white/20"
                  title="Open Dedicated PDF Document Studio"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">PDF Studio</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setActiveDoc(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div
              id="modal-printable-document-body"
              className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 print:overflow-visible print:p-0 bg-white"
            >
              {/* Official Letterhead */}
              <DocumentPrintHeader
                docId={activeDoc.id}
                title={activeDoc.title}
                phase={activeDoc.phaseName}
                category={activeDoc.category}
                author={activeDoc.owner}
                status={selectedPack === "hotel-kalya" ? "Signed & Active" : "Template / Fillable"}
              />

              {/* Rendered Document Content */}
              {loadingDoc ? (
                <div className="p-12 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-brand-maroon animate-spin mx-auto" />
                  <p className="text-xs text-gray-500">Loading document specification...</p>
                </div>
              ) : (
                <MarkdownViewer content={docContent} />
              )}

              {/* Printable Official Sign-Off Footer */}
              <div className="border-t-2 border-gray-200 pt-8 mt-12 print-break-inside-avoid">
                <div className="text-center mb-6">
                  <h4 className="font-serif font-bold text-xs uppercase tracking-widest text-brand-maroon">
                    Document Execution &amp; Acceptance Seal
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    This document is an integral component of the Hotel Kalya Digital Project Lifecycle.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 text-xs">
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Client Approver (Hotel Kalya Directorate)
                    </span>
                    <div className="h-12 border-b border-dashed border-gray-400 flex items-end pb-1 text-xs text-gray-400">
                      Signature / Official Stamp
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>Name: Haron Pkopus</span>
                      <span>Date: ________________</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Lead Systems Architect / Agency Lead
                    </span>
                    <div className="h-12 border-b border-dashed border-gray-400 flex items-end pb-1 text-xs text-gray-400">
                      Signature / Digital Seal
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>Name: Technical Delivery Lead</span>
                      <span>Date: ________________</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-[9px] text-gray-400">
                  <span>Standard Website Project Documentation Pack • Revision 1.0</span>
                  <span>CONFIDENTIAL &amp; PROPRIETARY • HOTEL KALYA KAPENGURIA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
