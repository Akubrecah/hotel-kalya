"use client";

import React, { useState } from "react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { BRAND } from "@/lib/constants";
import { InquiryRecord } from "@/app/api/inquiries/route";
import { Printer, CheckCircle2, Download, RefreshCw, Check } from "lucide-react";
import { exportElementToRealPdf } from "@/lib/pdf-generator";

interface FormFillPrintSlipProps {
  inquiry: InquiryRecord;
  onPrint?: () => void;
}

export function FormFillPrintSlip({ inquiry, onPrint }: FormFillPrintSlipProps) {
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleDownloadRealPdf = async () => {
    setGeneratingPdf(true);
    setDownloadSuccess(false);

    const safeTitle = (inquiry.type || "Document").toUpperCase();
    const filename = `Folio-${inquiry.id}-${safeTitle}.pdf`;

    const success = await exportElementToRealPdf("form-print-slip-container", {
      filename,
      footerText: `Hotel Kalya Kapenguria • Folio ${inquiry.id} • Official Record`,
    });

    setGeneratingPdf(false);
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }
  };

  const formattedDate = new Date(inquiry.createdAt).toLocaleDateString("en-KE", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white text-gray-900 font-sans p-6 sm:p-8 rounded-2xl max-w-3xl mx-auto border border-gray-200 shadow-lg print:shadow-none print:border-none print:p-0">
      {/* Action Toolbar (hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200 no-print">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            Official Document &amp; PDF Export
          </span>
          <h2 className="text-base font-bold text-brand-maroon">
            {inquiry.type === "reservation"
              ? "Guest Reservation Voucher & Tax Invoice"
              : inquiry.type === "dining"
              ? "Kitchen Dispatch Slip & Dining Folio"
              : inquiry.type === "intake"
              ? "Client Project Master Intake Document"
              : "Guest Inquiry & Front-Desk Dispatch Record"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* REAL PDF DOWNLOAD BUTTON */}
          <button
            type="button"
            disabled={generatingPdf}
            onClick={handleDownloadRealPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-all shadow-md active:scale-95 disabled:opacity-50"
            title="Download actual .pdf binary file"
          >
            {generatingPdf ? (
              <>
                <RefreshCw className="w-4 h-4 text-brand-amber animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>PDF Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-brand-amber" />
                <span>Download Real PDF (.pdf)</span>
              </>
            )}
          </button>

          {/* Browser Print / Receipt */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-colors"
            title="Browser printer dialog"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            <span>Print Slip</span>
          </button>
        </div>
      </div>

      {/* Printable Body */}
      <div id="form-print-slip-container" className="space-y-6 bg-white p-2">
        {/* Header with Monogram — No repeated logo and name */}
        <div className="flex items-start justify-between border-b-2 border-brand-maroon pb-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" hideTagline />
            <div className="border-l-2 border-brand-amber/50 pl-3 py-0.5 text-xs text-gray-600 space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-maroon block">
                Official Operations Folio
              </span>
              <p className="text-[11px] text-gray-700">
                P.O. Box Kapenguria, Kenya • Tel: {BRAND.phone}
              </p>
              <p className="text-[10px] text-gray-500">
                Email: {BRAND.email} • Web: www.hotelkalya.com
              </p>
            </div>
          </div>

          <div className="text-right border border-gray-200 bg-gray-50 p-2.5 rounded-xl min-w-[170px]">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              Reference Folio
            </span>
            <span className="font-mono text-base font-black text-brand-maroon">
              {inquiry.id}
            </span>
            <div className="text-[10px] text-gray-500 mt-0.5">{formattedDate}</div>
          </div>
        </div>

        {/* Document Title Banner */}
        <div className="bg-brand-maroon text-white p-3 rounded-xl flex items-center justify-between">
          <div className="font-serif font-bold text-sm tracking-wide">
            {inquiry.type === "reservation" && "OFFICIAL GUEST RESERVATION VOUCHER"}
            {inquiry.type === "dining" && "KITCHEN ORDER DISPATCH & DINING SLIP"}
            {inquiry.type === "intake" && "WEBSITE PROJECT INTAKE FORM (DOC-001)"}
            {inquiry.type === "contact" && "GUEST INQUIRY & COMMUNICATIONS DISPATCH"}
          </div>
          <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-brand-amber text-brand-maroon">
            Status: {inquiry.status}
          </span>
        </div>

        {/* Customer / Client Profile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Name / Contact</span>
            <span className="font-bold text-gray-900 block">{inquiry.name}</span>
            {inquiry.organization && (
              <span className="text-[11px] text-brand-maroon font-medium block">{inquiry.organization}</span>
            )}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Phone &amp; Email</span>
            <span className="font-medium text-gray-800 block">{inquiry.phone}</span>
            <span className="text-[11px] text-gray-500 block truncate">{inquiry.email || "N/A"}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Origin Source</span>
            <span className="font-medium text-gray-800 block">{inquiry.source}</span>
            <span className="text-[10px] text-gray-500 block">Priority: {inquiry.priority}</span>
          </div>
        </div>

        {/* Dynamic Type Specific Content */}
        {inquiry.type === "reservation" && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-sm text-brand-maroon border-b border-gray-200 pb-1">
              Reservation Particulars &amp; Accommodation Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-amber-50/50 p-4 rounded-xl border border-amber-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Room / Suite</span>
                <span className="font-bold text-brand-maroon block">
                  {String(inquiry.details.room || "Executive Deluxe")}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Check-In Date</span>
                <span className="font-bold text-gray-900 block">
                  {String(inquiry.details.checkIn || "Pending")} (2:00 PM)
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Check-Out Date</span>
                <span className="font-bold text-gray-900 block">
                  {String(inquiry.details.checkOut || "Pending")} (10:00 AM)
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Occupancy</span>
                <span className="font-medium text-gray-900 block">
                  {String(inquiry.details.guests || "1 Guest")}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Payment Method</span>
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {String(inquiry.details.paymentMethod || "M-Pesa STK Push (Paid)")}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Rate</span>
                <span className="font-serif font-black text-lg text-brand-maroon">
                  KES {Number(inquiry.details.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {Boolean(inquiry.details.specialRequests) && (
              <div className="p-3 bg-gray-50 rounded-xl text-xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Guest Notes &amp; Special Requests:</span>
                <p className="text-gray-700 italic mt-0.5">{String(inquiry.details.specialRequests)}</p>
              </div>
            )}
          </div>
        )}

        {inquiry.type === "dining" && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-sm text-brand-maroon border-b border-gray-200 pb-1">
              Kitchen Preparation &amp; Dining Items
            </h3>
            <div className="flex items-center justify-between text-xs bg-amber-50/60 p-3 rounded-xl border border-amber-200">
              <span className="font-bold text-brand-maroon">
                Table / Location: {String(inquiry.details.tableNumber || "Main Dining Area")}
              </span>
              <span className="font-bold text-gray-700">
                Spice Preference: {String(inquiry.details.spiceLevel || "Standard")}
              </span>
            </div>

            {Array.isArray(inquiry.details.items) && (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                    <tr>
                      <th className="p-2.5">Item Description</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Price</th>
                      <th className="p-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(inquiry.details.items as Array<{ name: string; qty: number; price: number }>).map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-bold text-gray-800">{it.name}</td>
                        <td className="p-2.5 text-center font-bold text-brand-maroon">{it.qty}</td>
                        <td className="p-2.5 text-right text-gray-600">KES {it.price.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-bold text-gray-900">KES {(it.qty * it.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t border-gray-200">
                    <tr>
                      <td colSpan={3} className="p-2.5 font-bold text-right text-gray-700">Total Billed:</td>
                      <td className="p-2.5 font-black text-right text-brand-maroon text-sm">
                        KES {Number(inquiry.details.totalAmount || 0).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {Boolean(inquiry.details.notes) && (
              <div className="p-3 bg-amber-50 rounded-xl text-xs border border-amber-200 text-amber-950">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">Chef Instructions:</span>
                <p className="font-medium mt-0.5">{String(inquiry.details.notes)}</p>
              </div>
            )}
          </div>
        )}

        {(inquiry.type === "contact" || inquiry.type === "intake") && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-sm text-brand-maroon border-b border-gray-200 pb-1">
              Inquiry / Project Scope Specification
            </h3>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Subject / Objective</span>
              <p className="font-bold text-gray-900 text-sm">{inquiry.subject}</p>

              {Object.entries(inquiry.details).map(([key, value]) => {
                if (key === "message") {
                  return (
                    <div key={key} className="pt-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Message Body:</span>
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-lg border mt-1">
                        {String(value)}
                      </p>
                    </div>
                  );
                }
                return (
                  <div key={key} className="grid grid-cols-3 gap-2 border-t border-gray-200/60 pt-1.5">
                    <span className="text-[10px] uppercase font-bold text-gray-500 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}:
                    </span>
                    <span className="col-span-2 text-gray-800 font-medium">
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Verification & Signature Section */}
        <div className="border-t border-gray-200 pt-6 mt-6 print-break-inside-avoid">
          <div className="grid grid-cols-2 gap-8 text-xs">
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Front Desk / Service Agent</span>
              <div className="h-10 border-b border-dashed border-gray-400" />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>Authorized Staff Signature</span>
                <span>Date: _________________</span>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Guest / Client Acknowledgement</span>
              <div className="h-10 border-b border-dashed border-gray-400" />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>Guest Signature / Stamp</span>
                <span>Date: _________________</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[9px] text-gray-400">
            <span>Hotel Kalya Management System • Kapenguria, West Pokot County</span>
            <span>Document Generated: {new Date().toISOString()} • Confidential</span>
          </div>
        </div>
      </div>
    </div>
  );
}
