"use client";

import React, { useState, useEffect } from "react";
import {
  History,
  Search,
  RefreshCw,
} from "lucide-react";
import { AuditLog } from "@/types/hospitality";

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const loadLogs = React.useCallback(async () => {
    try {
      const res = await fetch("/api/audit-logs");
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error("Failed to load audit logs", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchLogs() {
      try {
        const res = await fetch("/api/audit-logs");
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.logs)) {
          setLogs(data.logs);
        }
      } catch (err) {
        console.error("Failed to load audit logs", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    fetchLogs();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (roleFilter !== "ALL" && log.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        log.userName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.target.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon flex items-center gap-2">
            <History className="w-7 h-7 text-brand-amber-dark" />
            <span>Operational Audit Trail &amp; System Logs</span>
          </h1>
          <p className="text-xs text-gray-500">
            Immutable log of room status updates, check-ins, cancellations, order dispatches, and staff actions
          </p>
        </div>

        <button
          type="button"
          onClick={loadLogs}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brand-maroon ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Trail</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {["ALL", "HOUSEKEEPING", "RECEPTION", "GUEST", "EVENT_COORDINATOR", "CATERING_STAFF", "ADMIN"].map(
            (role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  roleFilter === role
                    ? "bg-brand-maroon text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {role === "ALL" ? "All Roles" : role}
              </button>
            )
          )}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, user, or target..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber focus:bg-white"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400 animate-pulse">
            Loading audit records from database repository...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No audit logs found matching current criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-brand-cream/30">
                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })} •{" "}
                      {new Date(log.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{log.userName}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-brand-maroon">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">{log.target}</td>
                    <td className="py-3.5 px-4 text-gray-600 leading-snug">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
