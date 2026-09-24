"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit3,
  X,
  RefreshCw,
  Globe,
  Bell,
  Calendar,
  ExternalLink,
  AlertTriangle,
  Info,
  Gift,
} from "lucide-react";
import { Announcement } from "@/types/hospitality";
import { useMounted } from "@/lib/useMounted";

export default function AdminAnnouncementsPage() {
  const mounted = useMounted();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Partial<Announcement> | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.announcements || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleOpenAdd = () => {
    setEditingAnn({
      title: "",
      message: "",
      bannerType: "promo",
      targetAudience: "all",
      ctaText: "Discover Offer",
      ctaLink: "/offers",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-12-31",
      isActive: true,
      publishStatus: "published",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingAnn({ ...ann });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnn || !editingAnn.title || !editingAnn.message) {
      alert("Title and message are required");
      return;
    }

    setSaving(true);
    try {
      const isNew = !editingAnn.id;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch("/api/announcements", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAnn),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        showToast(isNew ? "Announcement published to website banner!" : "Announcement updated!");
        loadAnnouncements();
      } else {
        alert("Failed to save: " + data.error);
      }
    } catch (err) {
      alert("Error: " + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ann: Announcement) => {
    if (!confirm(`Delete announcement "${ann.title}"?`)) return;
    try {
      const res = await fetch(`/api/announcements?id=${encodeURIComponent(ann.id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`Announcement deleted.`);
        loadAnnouncements();
      }
    } catch (err) {
      alert("Error: " + String(err));
    }
  };

  const handleToggleActive = async (ann: Announcement) => {
    try {
      const res = await fetch("/api/announcements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ann.id, isActive: !ann.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Announcement ${!ann.isActive ? "Activated" : "Deactivated"}`);
        loadAnnouncements();
      }
    } catch (err) {
      alert("Error: " + String(err));
    }
  };

  const filtered = announcements.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!mounted) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-brand-maroon/20 border-t-brand-maroon rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-brand-maroon text-brand-amber px-5 py-3 rounded-2xl shadow-2xl border border-brand-amber/30 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-brand-amber" />
          <span className="text-sm font-bold text-white">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-brand-maroon/10 text-brand-maroon text-[11px] font-extrabold uppercase tracking-wider">
              CMS Module 09
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Globe className="w-3 h-3" /> Live Public Top Banners Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon mt-1">
            Announcements &amp; Promotional Banners CMS
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Publish notices, urgent weather or road alerts, holiday discount promotions, and top-bar website announcements.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search announcements by headline, message text..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-brand-maroon bg-white"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-12 text-center text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-maroon" />
          <p className="text-xs">Loading announcements...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
          <Megaphone className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-sm font-bold text-gray-700">No announcements found</p>
          <button onClick={handleOpenAdd} className="text-xs text-brand-maroon font-bold underline">
            Broadcast an announcement now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((ann) => {
            const isLive = ann.isActive;
            return (
              <div
                key={ann.id}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase flex items-center gap-1 ${
                        ann.bannerType === "warning"
                          ? "bg-red-100 text-red-800"
                          : ann.bannerType === "promo"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {ann.bannerType === "warning" ? <AlertTriangle className="w-3 h-3" /> : <Gift className="w-3 h-3" />}
                      <span>{ann.bannerType}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(ann)}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-colors ${
                        isLive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {isLive ? "Active on Website" : "Inactive / Paused"}
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 text-base leading-snug">{ann.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed mt-1">{ann.message}</p>
                  </div>

                  {ann.ctaText && ann.ctaLink && (
                    <div className="flex items-center gap-1.5 text-xs text-brand-maroon font-bold">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{ann.ctaText} → ({ann.ctaLink})</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span className="font-mono text-[10px]">Active window: {ann.startDate} to {ann.endDate}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(ann)}
                      className="p-2 rounded-xl border border-gray-200 hover:bg-brand-maroon hover:text-white text-gray-600 transition-colors"
                      title="Edit Announcement"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(ann)}
                      className="p-2 rounded-xl border border-gray-200 hover:bg-red-500 hover:text-white text-gray-400 transition-colors"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && editingAnn && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-gray-900">
                {editingAnn.id ? "Edit Announcement" : "Create Website Broadcast"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Headline / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End of Month Highland Nyama Choma Carnival"
                  value={editingAnn.title || ""}
                  onChange={(e) => setEditingAnn({ ...editingAnn, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Announcement Message *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Details displayed on top of the website or banner..."
                  value={editingAnn.message || ""}
                  onChange={(e) => setEditingAnn({ ...editingAnn, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Banner Type</label>
                  <select
                    value={editingAnn.bannerType || "promo"}
                    onChange={(e) => setEditingAnn({ ...editingAnn, bannerType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="promo">Special Promotion</option>
                    <option value="info">General Information</option>
                    <option value="event">Upcoming Event</option>
                    <option value="warning">Notice / Alert</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Reserve Table, Book Now"
                    value={editingAnn.ctaText || ""}
                    onChange={(e) => setEditingAnn({ ...editingAnn, ctaText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Action Destination Link</label>
                <input
                  type="text"
                  placeholder="e.g. /offers, /rooms, https://..."
                  value={editingAnn.ctaLink || ""}
                  onChange={(e) => setEditingAnn({ ...editingAnn, ctaLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editingAnn.startDate || ""}
                    onChange={(e) => setEditingAnn({ ...editingAnn, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={editingAnn.endDate || ""}
                    onChange={(e) => setEditingAnn({ ...editingAnn, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="font-bold text-gray-700">Display Immediately on Website</span>
                <input
                  type="checkbox"
                  checked={editingAnn.isActive || false}
                  onChange={(e) => setEditingAnn({ ...editingAnn, isActive: e.target.checked })}
                  className="w-5 h-5 rounded text-brand-maroon"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-brand-maroon text-brand-amber font-bold shadow-md"
                >
                  {saving ? "Saving..." : "Save Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
