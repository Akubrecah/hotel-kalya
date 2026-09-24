"use client";

import React, { useState, useEffect } from "react";
import {
  UserPlus,
  RefreshCw,
  Search,
} from "lucide-react";
import { StaffMember, StaffRole } from "@/types/hospitality";

export default function AdminStaffManagementPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New staff form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("Front Office");
  const [role, setRole] = useState<StaffRole>("RECEPTIONIST");
  const [whatsapp, setWhatsapp] = useState("254719766649");
  const [status, setStatus] = useState<"ACTIVE" | "ON_LEAVE" | "INACTIVE">("ACTIVE");

  const loadStaff = React.useCallback(async () => {
    try {
      const res = await fetch("/api/staff");
      const data = await res.json();
      if (data.success && Array.isArray(data.staff)) {
        setStaff(data.staff);
      }
    } catch (err) {
      console.error("Failed to load staff roster", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchStaff() {
      try {
        const res = await fetch("/api/staff");
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.staff)) {
          setStaff(data.staff);
        }
      } catch (err) {
        console.error("Failed to load staff roster", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    fetchStaff();
    return () => {
      ignore = true;
    };
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          department,
          role,
          whatsapp,
          status,
        }),
      });
      const data = await res.json();
      if (data.success && data.member) {
        setStaff((prev) => [...prev, data.member]);
        setShowAddModal(false);
        setName("");
        setEmail("");
        setPhone("");
      } else {
        alert(data.error || "Failed to add staff member.");
      }
    } catch {
      alert("Network error adding staff.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "ACTIVE" | "ON_LEAVE" | "INACTIVE") => {
    try {
      const res = await fetch("/api/staff", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.member) {
        setStaff((prev) =>
          prev.map((s) => (s.id === id ? data.member : s))
        );
      }
    } catch {
      alert("Error updating staff status.");
    }
  };

  const filteredStaff = staff.filter((s) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon">
            Staff &amp; Human Resource Management
          </h1>
          <p className="text-xs text-gray-500">
            Configure department roles, assign operational shifts, and manage WhatsApp consultation contacts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadStaff}
            disabled={loading}
            className="p-2 rounded-xl bg-white border border-gray-200 text-brand-maroon hover:bg-gray-50 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-all shadow-sm"
          >
            <UserPlus className="w-4 h-4 text-brand-amber" />
            <span>Add New Employee</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, department, role..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber text-xs"
          />
        </div>
        <span className="text-xs text-gray-500 font-medium hidden sm:inline">
          Total Employees: <strong>{staff.length}</strong>
        </span>
      </div>

      {/* Staff Roster Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400 animate-pulse">
            Loading employee directory...
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No employees found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Name &amp; Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">WhatsApp Contact</th>
                  <th className="py-3 px-4">Employment Status</th>
                  <th className="py-3 px-4 text-right">Quick Status Switch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStaff.map((s) => (
                  <tr key={s.id} className="hover:bg-brand-cream/30">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-maroon">{s.id}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900">{s.name}</p>
                      <span className="text-[10px] font-extrabold uppercase text-brand-amber-dark">
                        {s.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-700">{s.department}</td>
                    <td className="py-3.5 px-4 text-gray-600">{s.phone}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-600">
                      +{s.whatsapp}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          s.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : s.status === "ON_LEAVE"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {s.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      {s.status !== "ACTIVE" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(s.id, "ACTIVE")}
                          className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px]"
                        >
                          Activate
                        </button>
                      )}
                      {s.status !== "ON_LEAVE" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(s.id, "ON_LEAVE")}
                          className="px-2 py-1 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold text-[10px]"
                        >
                          On Leave
                        </button>
                      )}
                      {s.status !== "INACTIVE" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(s.id, "INACTIVE")}
                          className="px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold text-[10px]"
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-brand-maroon">
                Add New Staff Member
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dennis Kiplagat"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="dennis@hotelkalya.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 719 766649"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">WhatsApp Number (Clean)</label>
                  <input
                    type="text"
                    required
                    placeholder="254719766649"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs"
                  >
                    <option value="Front Office">Front Office &amp; Reception</option>
                    <option value="Housekeeping">Housekeeping &amp; Laundry</option>
                    <option value="Food & Beverage">Food &amp; Beverage</option>
                    <option value="Kitchen Operations">Kitchen Operations</option>
                    <option value="Events & Conferences">Events &amp; Conferences</option>
                    <option value="Outside Catering">Outside Catering</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Staff Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as StaffRole)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs"
                  >
                    <option value="RECEPTIONIST">RECEPTIONIST</option>
                    <option value="HOUSEKEEPING">HOUSEKEEPING</option>
                    <option value="WAITER">WAITER</option>
                    <option value="WAITRESS">WAITRESS</option>
                    <option value="CHEF">CHEF</option>
                    <option value="EVENT_COORDINATOR">EVENT_COORDINATOR</option>
                    <option value="CATERING_STAFF">CATERING_STAFF</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Employment Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "ACTIVE" | "ON_LEAVE" | "INACTIVE")}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-amber text-xs"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="ON_LEAVE">ON_LEAVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold text-xs shadow transition-colors disabled:opacity-50"
                >
                  {submitting ? "Adding..." : "Save Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
