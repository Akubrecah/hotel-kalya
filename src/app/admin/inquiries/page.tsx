"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ClipboardList,
  Search,
  Printer,
  Calendar,
  UtensilsCrossed,
  Mail,
  FileText,
  Clock,
  Filter,
  RefreshCw,
  X,
  Eye,
  Phone,
  Building,
} from "lucide-react";
import { InquiryRecord } from "@/app/api/inquiries/route";
import { FormFillPrintSlip } from "@/components/admin/FormFillPrintSlip";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Selected item for print preview modal
  const [activeInquiry, setActiveInquiry] = useState<InquiryRecord | null>(null);

  const fetchInquiries = () => {
    setLoading(true);
    fetch("/api/inquiries")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.inquiries) {
          setInquiries(data.inquiries);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let mounted = true;
    fetch("/api/inquiries")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (data.success && data.inquiries) {
          setInquiries(data.inquiries);
        }
        setLoading(false);
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleStatusChange = async (id: string, newStatus: InquiryRecord["status"]) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        if (activeInquiry && activeInquiry.id === id) {
          setActiveInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch {
      // fallback
    }
  };

  const filtered = useMemo(() => {
    return inquiries.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.organization && item.organization.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === "all" || item.type === selectedType;
      const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [inquiries, searchQuery, selectedType, selectedStatus]);

  const counts = useMemo(() => {
    return {
      total: inquiries.length,
      reservations: inquiries.filter((i) => i.type === "reservation").length,
      dining: inquiries.filter((i) => i.type === "dining").length,
      contact: inquiries.filter((i) => i.type === "contact").length,
      intake: inquiries.filter((i) => i.type === "intake").length,
      pending: inquiries.filter((i) => i.status === "New" || i.status === "In Review").length,
    };
  }, [inquiries]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-amber/20 text-brand-maroon-dark text-[10px] font-bold uppercase tracking-wider">
              Front Desk Operations
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 font-medium">Customer Submissions &amp; Folios</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon">
            Guest Inquiries &amp; Form Fills
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Real-time feed of online reservations, table orders, website contact inquiries, and client project intake forms.
            Generate branded, printable PDF receipts, kitchen dispatch slips, and booking vouchers.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <button
            type="button"
            onClick={fetchInquiries}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-brand-maroon ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-maroon text-white text-xs font-bold hover:bg-brand-maroon-dark transition-colors shadow-md"
          >
            <Printer className="w-3.5 h-3.5 text-brand-amber" />
            <span>Print Master Log</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Form Fills</span>
          <div className="font-serif font-black text-2xl text-brand-maroon mt-1">
            {counts.total} Submissions
          </div>
          <span className="text-[10px] text-gray-500 font-medium mt-0.5">Across All Portals</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Pending Desk Action</span>
          <div className="font-serif font-black text-2xl text-amber-600 mt-1">
            {counts.pending} Inquiries
          </div>
          <span className="text-[10px] text-amber-800 font-medium mt-0.5">Requires Staff Follow-up</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Room Bookings</span>
          <div className="font-serif font-black text-2xl text-emerald-700 mt-1">
            {counts.reservations} Vouchers
          </div>
          <span className="text-[10px] text-emerald-800 font-medium mt-0.5">PDF Ready</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Dining &amp; Kitchen</span>
          <div className="font-serif font-black text-2xl text-blue-700 mt-1">
            {counts.dining} Orders
          </div>
          <span className="text-[10px] text-blue-800 font-medium mt-0.5">Kitchen Dispatch Slips</span>
        </div>
      </div>

      {/* Type Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setSelectedType("all")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedType === "all"
              ? "bg-brand-maroon text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ClipboardList className="w-4 h-4 text-brand-amber" />
          <span>All Submissions ({counts.total})</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedType("reservation")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedType === "reservation"
              ? "bg-brand-maroon text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-500" />
          <span>Room Reservations ({counts.reservations})</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedType("dining")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedType === "dining"
              ? "bg-brand-maroon text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <UtensilsCrossed className="w-4 h-4 text-blue-500" />
          <span>Kitchen Orders ({counts.dining})</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedType("contact")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedType === "contact"
              ? "bg-brand-maroon text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Mail className="w-4 h-4 text-amber-500" />
          <span>Contact Inquiries ({counts.contact})</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedType("intake")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedType === "intake"
              ? "bg-brand-maroon text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FileText className="w-4 h-4 text-purple-500" />
          <span>Project Intake Forms ({counts.intake})</span>
        </button>
      </div>

      {/* Search and Secondary Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Guest Name, Phone, Email, Reference ID, or Subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-maroon focus:border-brand-maroon transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label="Filter by submission status"
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="In Review">In Review</option>
            <option value="Approved">Approved / Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Ref ID &amp; Type</th>
                <th className="py-3.5 px-4">Customer / Guest</th>
                <th className="py-3.5 px-4">Subject &amp; Details</th>
                <th className="py-3.5 px-4">Date &amp; Time</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">PDF Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => {
                const dateStr = new Date(item.createdAt).toLocaleDateString("en-KE", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr key={item.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="py-3.5 px-4 align-top">
                      <span className="font-mono text-xs font-black text-brand-maroon block">
                        {item.id}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mt-1 ${
                          item.type === "reservation"
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                            : item.type === "dining"
                            ? "bg-blue-100 text-blue-900 border border-blue-300"
                            : item.type === "intake"
                            ? "bg-purple-100 text-purple-900 border border-purple-300"
                            : "bg-amber-100 text-amber-900 border border-amber-300"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <div className="font-bold text-gray-900">{item.name}</div>
                      <div className="text-[11px] text-gray-600 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-brand-amber-dark" />
                        <span>{item.phone}</span>
                      </div>
                      {item.organization && (
                        <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-[150px]">{item.organization}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 align-top max-w-xs">
                      <div className="font-bold text-gray-800 line-clamp-1">{item.subject}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                        {item.type === "reservation" && (
                          <span>
                            {String(item.details.room || "")} • {String(item.details.checkIn || "")} ({String(item.details.nights || 1)} nights)
                          </span>
                        )}
                        {item.type === "dining" && (
                          <span>
                            {String(item.details.tableNumber || "")} • Total: KES {Number(item.details.totalAmount || 0).toLocaleString()}
                          </span>
                        )}
                        {item.type === "intake" && (
                          <span>
                            Budget: {String(item.details.budget || "")} • Target: {String(item.details.targetGoLive || "")}
                          </span>
                        )}
                        {item.type === "contact" && (
                          <span>{String(item.details.message || item.subject)}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{dateStr}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">{item.source}</span>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value as InquiryRecord["status"])}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border ${
                          item.status === "Approved" || item.status === "Completed"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : item.status === "In Review"
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : item.status === "New"
                            ? "bg-rose-50 text-rose-800 border-rose-300"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="In Review">In Review</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Approved">Approved</option>
                        <option value="Completed">Completed</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveInquiry(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-cream border border-brand-maroon/20 text-brand-maroon hover:bg-brand-cream/80 text-xs font-bold transition-colors shadow-sm"
                          title="View and Print Slip"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveInquiry(item);
                            setTimeout(() => window.print(), 400);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-maroon text-white hover:bg-brand-maroon-dark text-xs font-bold transition-colors shadow-sm"
                          title="Instant Print / PDF Export"
                        >
                          <Printer className="w-3.5 h-3.5 text-brand-amber" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <ClipboardList className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="font-serif font-bold text-gray-700">No matching submissions found</h3>
            <p className="text-xs text-gray-500">
              Clear your search term or select &quot;All Submissions&quot;.
            </p>
          </div>
        )}
      </div>

      {/* Modal for Slip Preview & Print */}
      {activeInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:max-h-none print:shadow-none print:rounded-none print:w-full print:p-0">
            {/* Header bar */}
            <div className="p-4 sm:px-6 bg-brand-maroon-dark text-white flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-amber text-brand-maroon">
                  {activeInquiry.id}
                </span>
                <span className="font-serif font-bold text-sm">
                  {activeInquiry.name} — Folio Slip
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-amber text-brand-maroon text-xs font-bold hover:bg-brand-amber-dark transition-colors shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInquiry(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Slip content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 print:p-0 print:overflow-visible">
              <FormFillPrintSlip inquiry={activeInquiry} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
