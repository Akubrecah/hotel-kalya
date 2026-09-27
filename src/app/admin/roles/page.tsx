"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  Plus,
  Search,
  RefreshCw,
  Trash2,
  Edit,
  Check,
  Lock,
  Layers,
  Sparkles,
} from "lucide-react";
import { RoleDefinition, PermissionKey } from "@/types/hospitality";
import { staffFetch } from "@/lib/api-client";

const PERMISSION_GROUPS: {
  category: string;
  description: string;
  permissions: { key: PermissionKey; label: string; desc: string }[];
}[] = [
  {
    category: "Front Desk & Guest Operations",
    description: "Access to guest reservations, room folios, and guest inquiries",
    permissions: [
      { key: "reservations:read", label: "View Reservations", desc: "Read guest bookings & folios" },
      { key: "reservations:write", label: "Manage Reservations", desc: "Create, check-in, check-out & cancel bookings" },
      { key: "rooms:read", label: "View Rooms", desc: "Inspect room inventory and calendar" },
      { key: "rooms:write", label: "Manage Rooms", desc: "Edit room rates, descriptions, and availability" },
      { key: "inquiries:manage", label: "Manage Guest Inquiries", desc: "Reply to customer quote requests and inquiries" },
    ],
  },
  {
    category: "Housekeeping & Facilities",
    description: "Room cleanliness, turnover cycles, and inspection sign-offs",
    permissions: [
      { key: "housekeeping:read", label: "View Cleanliness Board", desc: "Inspect dirty/clean room status" },
      { key: "housekeeping:write", label: "Update Room Status", desc: "Mark rooms dirty, cleaning, clean, ready, or out-of-order" },
    ],
  },
  {
    category: "Food, Beverage & Dining",
    description: "Restaurant tables, guest orders, menu catalogs, and kitchen display (KDS)",
    permissions: [
      { key: "restaurant:orders", label: "Waitstaff Ordering", desc: "Manage dining tables and order creation" },
      { key: "kitchen:kds", label: "Kitchen Display (KDS)", desc: "Cook progression, ticket status, and 86 items" },
      { key: "menu:manage", label: "Manage Menu Catalog", desc: "Add, edit dishes, prices, and food categories" },
    ],
  },
  {
    category: "Conferences, Banquets & Events",
    description: "Hall bookings, outside catering logistics, and garden events",
    permissions: [
      { key: "conference:manage", label: "Manage Conferences", desc: "Hall bookings and delegate seating setups" },
      { key: "catering:manage", label: "Manage Outside Catering", desc: "Banquet orders and transport checklists" },
      { key: "events:manage", label: "Manage Garden Events", desc: "Kalya Gardens weddings and sundowners" },
    ],
  },
  {
    category: "Hospitality CMS & Marketing",
    description: "Serviced apartments, promotional campaigns, media assets, and verified reviews",
    permissions: [
      { key: "airbnb:manage", label: "Manage Airbnb Apartments", desc: "Cottages, long-stay bookings & rates" },
      { key: "offers:manage", label: "Manage Special Offers", desc: "Promotional packages and seasonal discounts" },
      { key: "gallery:manage", label: "Manage Media Library", desc: "Upload and organize hotel photographs" },
      { key: "announcements:manage", label: "Manage Announcements", desc: "Website notice banners and alerts" },
      { key: "reviews:manage", label: "Manage Guest Reviews", desc: "Moderate customer testimonials and feedback" },
      { key: "documents:manage", label: "Project & PDF Slips", desc: "Manage project documentation and contracts" },
    ],
  },
  {
    category: "Executive Governance & Administration",
    description: "System administration, financial reports, and RBAC control",
    permissions: [
      { key: "reports:view", label: "View Financial Reports", desc: "ADR, occupancy %, and revenue breakdowns" },
      { key: "staff:manage", label: "Staff Roster Management", desc: "Add, edit, and deactivate employees" },
      { key: "roles:manage", label: "Role & RBAC Management", desc: "Create, configure, and delete roles" },
      { key: "settings:manage", label: "Hotel Settings", desc: "Policies, Wi-Fi credentials, and operating hours" },
      { key: "audit:view", label: "View Audit Trail", desc: "Inspect system security and action logs" },
    ],
  },
];

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formCode, setFormCode] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDept, setFormDept] = useState("Front Office");
  const [formDesc, setFormDesc] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<PermissionKey[]>([]);

  const loadRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await staffFetch("/api/roles");
      const data = await res.json();
      if (data.success && Array.isArray(data.roles)) {
        setRoles(data.roles);
      }
    } catch (err) {
      console.error("Failed to load roles", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchInitialRoles() {
      try {
        const res = await staffFetch("/api/roles");
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.roles)) {
          setRoles(data.roles);
        }
      } catch (err) {
        console.error("Failed to load initial roles", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    fetchInitialRoles();
    return () => {
      ignore = true;
    };
  }, []);

  const openCreateModal = () => {
    setEditingRole(null);
    setFormCode("");
    setFormTitle("");
    setFormDept("Front Office");
    setFormDesc("");
    setSelectedPermissions(["reservations:read", "rooms:read"]);
    setShowCreateModal(true);
  };

  const openEditModal = (role: RoleDefinition) => {
    setEditingRole(role);
    setFormCode(role.roleCode);
    setFormTitle(role.title);
    setFormDept(role.department);
    setFormDesc(role.description);
    setSelectedPermissions(role.permissions || []);
    setShowCreateModal(true);
  };

  const togglePermission = (key: PermissionKey) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const toggleCategoryAll = (keys: PermissionKey[]) => {
    const allSelected = keys.every((k) => selectedPermissions.includes(k));
    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((k) => !keys.includes(k)));
    } else {
      const merged = Array.from(new Set([...selectedPermissions, ...keys]));
      setSelectedPermissions(merged);
    }
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingRole) {
        // PATCH
        const res = await staffFetch("/api/roles", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingRole.id,
            title: formTitle,
            department: formDept,
            description: formDesc,
            permissions: selectedPermissions,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setRoles((prev) =>
            prev.map((r) => (r.id === editingRole.id ? data.role : r))
          );
          setShowCreateModal(false);
        } else {
          alert(data.error || "Failed to update role.");
        }
      } else {
        // POST
        const cleanCode = formCode.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_");
        const res = await staffFetch("/api/roles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roleCode: cleanCode,
            title: formTitle.trim(),
            department: formDept.trim(),
            description: formDesc.trim(),
            permissions: selectedPermissions,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setRoles((prev) => [...prev, data.role]);
          setShowCreateModal(false);
        } else {
          alert(data.error || "Failed to create role.");
        }
      }
    } catch {
      alert("Network error processing role.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRole = async (role: RoleDefinition) => {
    const isSys = Boolean(role.isSystemRole || role.isSystem);
    if (isSys) {
      alert("System default roles are protected and cannot be deleted.");
      return;
    }
    if (!confirm(`Are you sure you want to delete the role '${role.title}'?`)) {
      return;
    }

    try {
      const res = await staffFetch(`/api/roles?id=${role.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setRoles((prev) => prev.filter((r) => r.id !== role.id));
      } else {
        alert(data.error || "Failed to delete role.");
      }
    } catch {
      alert("Network error deleting role.");
    }
  };

  const filteredRoles = roles.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.roleCode.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q)
    );
  });

  const systemRolesCount = roles.filter((r) => Boolean(r.isSystemRole || r.isSystem)).length;
  const customRolesCount = roles.filter((r) => !Boolean(r.isSystemRole || r.isSystem)).length;
  const totalSystemPermissions = PERMISSION_GROUPS.reduce((acc, g) => acc + g.permissions.length, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-brand-amber" />
            <span>Role-Based Access Control (RBAC)</span>
          </h1>
          <p className="text-xs text-gray-500">
            Define system roles, govern departmental access privileges, and manage granular staff permissions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadRoles}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white border border-gray-200 text-brand-maroon hover:bg-gray-50 shadow-sm transition-colors"
            title="Refresh Roles"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-dark transition-all shadow-md"
          >
            <Plus className="w-4 h-4 text-brand-amber" />
            <span>Create New Role</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Active Roles</span>
          <p className="text-3xl font-serif font-black text-brand-maroon">{roles.length}</p>
          <span className="text-[10px] text-gray-500">System &amp; Custom</span>
        </div>

        <div className="bg-emerald-50/70 p-5 rounded-3xl border border-emerald-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block">System Default Roles</span>
          <p className="text-3xl font-serif font-black text-emerald-900">{systemRolesCount}</p>
          <span className="text-[10px] text-emerald-700 font-semibold">Protected baseline</span>
        </div>

        <div className="bg-amber-50/70 p-5 rounded-3xl border border-amber-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-800 block">Admin Custom Roles</span>
          <p className="text-3xl font-serif font-black text-amber-900">{customRolesCount}</p>
          <span className="text-[10px] text-amber-700 font-semibold">Configured by Admin</span>
        </div>

        <div className="bg-blue-50/70 p-5 rounded-3xl border border-blue-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-blue-800 block">System Permissions</span>
          <p className="text-3xl font-serif font-black text-blue-900">{totalSystemPermissions}</p>
          <span className="text-[10px] text-blue-700 font-semibold">Granular flags across 6 areas</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles by title, code, department..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber"
          />
        </div>
        <span className="text-xs text-gray-500 font-medium hidden sm:inline">
          Showing <strong>{filteredRoles.length}</strong> of {roles.length} roles
        </span>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoles.map((role) => {
          const isSys = Boolean(role.isSystemRole || role.isSystem);

          return (
            <div
              key={role.id}
              className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-base text-brand-maroon">
                      {role.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {role.roleCode}
                      </span>
                      <span className="text-[10px] font-semibold text-brand-amber-dark">
                        • {role.department}
                      </span>
                    </div>
                  </div>

                  {isSys ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      System
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      Custom
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 line-clamp-2">
                  {role.description || "No description provided."}
                </p>

                {/* Permissions list */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-extrabold uppercase text-gray-400 block tracking-wider">
                    Granted Privileges ({role.permissions?.length || 0}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions && role.permissions.length > 0 ? (
                      role.permissions.map((p) => (
                        <span
                          key={p}
                          className="px-2 py-0.5 rounded-md bg-brand-cream border border-brand-maroon/15 text-brand-maroon font-mono text-[10px] font-semibold"
                        >
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-gray-400 italic">No permissions assigned</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(role)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs transition-colors"
                >
                  <Edit className="w-3.5 h-3.5 text-brand-maroon" />
                  <span>Edit Permissions</span>
                </button>

                {!isSys && (
                  <button
                    type="button"
                    onClick={() => handleDeleteRole(role)}
                    className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    title="Delete Custom Role"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-brand-maroon text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-brand-amber" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-maroon">
                    {editingRole ? `Edit Role: ${editingRole.title}` : "Create New Custom Role"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Configure role identity and assign granular system permissions
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-5 text-xs">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Role Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Night Auditor / Night Manager"
                    value={formTitle}
                    onChange={(e) => {
                      setFormTitle(e.target.value);
                      if (!editingRole && !formCode) {
                        setFormCode(
                          e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, "_")
                        );
                      }
                    }}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Role Code (Identifier) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingRole}
                    placeholder="e.g. NIGHT_AUDITOR"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber font-mono font-bold text-xs disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Front Office, Finance, Food & Beverage"
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Role Summary / Description
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of responsibilities..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber text-xs"
                  />
                </div>
              </div>

              {/* Granular Permission Matrix */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-brand-maroon flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-brand-amber" />
                      <span>Granular RBAC Permission Matrix</span>
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Select which capabilities this role is authorized to perform
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-brand-maroon">
                    {selectedPermissions.length} selected
                  </span>
                </div>

                <div className="space-y-4">
                  {PERMISSION_GROUPS.map((group) => {
                    const groupKeys = group.permissions.map((p) => p.key);
                    const allInGroupSelected = groupKeys.every((k) =>
                      selectedPermissions.includes(k)
                    );

                    return (
                      <div
                        key={group.category}
                        className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-xs text-gray-900 block">
                              {group.category}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {group.description}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleCategoryAll(groupKeys)}
                            className="text-[10px] font-bold text-brand-maroon hover:underline px-2 py-0.5"
                          >
                            {allInGroupSelected ? "Deselect Group" : "Select Group"}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {group.permissions.map((perm) => {
                            const isChecked = selectedPermissions.includes(perm.key);
                            return (
                              <label
                                key={perm.key}
                                className={`flex items-start gap-2.5 p-2 rounded-xl border cursor-pointer transition-all ${
                                  isChecked
                                    ? "bg-white border-brand-maroon shadow-xs"
                                    : "bg-white/60 border-gray-200 hover:bg-white"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(perm.key)}
                                  className="mt-0.5 rounded text-brand-maroon focus:ring-brand-amber"
                                />
                                <div>
                                  <span className="font-bold text-[11px] text-gray-800 block">
                                    {perm.label}
                                  </span>
                                  <span className="text-[10px] text-gray-500 block leading-tight">
                                    {perm.desc}
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 text-brand-amber" />
                  <span>
                    {submitting
                      ? "Saving Role..."
                      : editingRole
                      ? "Update Role Permissions"
                      : "Create Role"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
