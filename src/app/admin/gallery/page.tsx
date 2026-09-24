"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ImageIcon,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit3,
  X,
  RefreshCw,
  Globe,
  Tag,
  Star,
  Layers,
} from "lucide-react";
import { GalleryItem } from "@/types/hospitality";
import { useMounted } from "@/lib/useMounted";

const CATEGORIES = [
  { id: "all", label: "All Media" },
  { id: "rooms", label: "Rooms & Suites" },
  { id: "restaurant", label: "Dining & Bar" },
  { id: "gardens", label: "Gardens & Grounds" },
  { id: "conferences", label: "Conferences & Events" },
  { id: "hotel", label: "Hotel & Scenery" },
];

export default function AdminGalleryPage() {
  const mounted = useMounted();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedCat, setSelectedCat] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<GalleryItem> | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem({
      title: "",
      caption: "",
      category: "hotel",
      imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200",
      altText: "Hotel Kalya Kapenguria",
      isFeatured: false,
      publishStatus: "published",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title || !editingItem.imageUrl) {
      alert("Title and image URL are required");
      return;
    }

    setSaving(true);
    try {
      const isNew = !editingItem.id;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch("/api/gallery", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        showToast(isNew ? "Media item added & published!" : "Media item updated!");
        loadGallery();
      } else {
        alert("Failed to save: " + data.error);
      }
    } catch (err) {
      alert("Error: " + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm(`Delete image "${item.title}"?`)) return;
    try {
      const res = await fetch(`/api/gallery?id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`Image deleted.`);
        loadGallery();
      }
    } catch (err) {
      alert("Error: " + String(err));
    }
  };

  const handleTogglePublish = async (item: GalleryItem) => {
    const next = item.publishStatus === "published" ? "draft" : "published";
    try {
      const res = await fetch("/api/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, publishStatus: next }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Image state: ${next.toUpperCase()}`);
        loadGallery();
      }
    } catch (err) {
      alert("Error: " + String(err));
    }
  };

  const filtered = items.filter((i) => {
    const matchCat = selectedCat === "all" || i.category === selectedCat;
    const matchSearch =
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.caption || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

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
              CMS Module 08
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Globe className="w-3 h-3" /> Live Public Gallery Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon mt-1">
            Media Library &amp; Photo Gallery CMS
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Upload, categorize, tag, and publish official high-resolution photographs shown across the website.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media Photo</span>
        </button>
      </div>

      {/* Categories & Search */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((c) => {
            const count = c.id === "all" ? items.length : items.filter((i) => i.category === c.id).length;
            const active = selectedCat === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCat(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  active
                    ? "bg-brand-maroon text-brand-amber shadow"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {c.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search gallery by title, caption, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-brand-maroon bg-white"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-12 text-center text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-maroon" />
          <p className="text-xs">Loading media assets...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-sm font-bold text-gray-700">No media found in this category</p>
          <button onClick={handleOpenAdd} className="text-xs text-brand-maroon font-bold underline">
            Add an image now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => {
            const isLive = item.publishStatus === "published";
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all group"
              >
                <div className="relative h-48 w-full bg-gray-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.altText || item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2.5 right-2.5">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(item)}
                      className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold backdrop-blur-sm shadow ${
                        isLive ? "bg-emerald-600 text-white" : "bg-black/60 text-gray-300"
                      }`}
                    >
                      {isLive ? "Published" : "Draft"}
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-brand-amber-dark tracking-wider block">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-1">
                      {item.title}
                    </h4>
                    {item.caption && (
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                        {item.caption}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-brand-maroon hover:text-white text-gray-600 transition-colors"
                      title="Edit Image"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-red-500 hover:text-white text-gray-400 transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-gray-900">
                {editingItem.id ? "Edit Media Details" : "Add Photo to Media Library"}
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
                <label className="font-bold text-gray-700 block mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={editingItem.imageUrl || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Image Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunset over the Kapenguria Hills"
                  value={editingItem.title || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <select
                    value={editingItem.category || "hotel"}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="rooms">Rooms & Suites</option>
                    <option value="restaurant">Dining & Bar</option>
                    <option value="gardens">Gardens & Grounds</option>
                    <option value="conferences">Conferences & Events</option>
                    <option value="hotel">Hotel & Scenery</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Alt Text (Accessibility)</label>
                  <input
                    type="text"
                    placeholder="Short description for screen readers"
                    value={editingItem.altText || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, altText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Caption</label>
                <textarea
                  rows={2}
                  placeholder="Optional display caption shown when enlarged"
                  value={editingItem.caption || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="font-bold text-gray-700">Publish State</span>
                <select
                  value={editingItem.publishStatus || "published"}
                  onChange={(e) => setEditingItem({ ...editingItem, publishStatus: e.target.value as any })}
                  className="px-3 py-1.5 rounded-xl border border-gray-300 bg-white font-bold text-brand-maroon"
                >
                  <option value="published">Published (Live)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
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
                  {saving ? "Saving..." : "Save Image"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
