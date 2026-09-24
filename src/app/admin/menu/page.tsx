"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  UtensilsCrossed,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit3,
  X,
  RefreshCw,
  Globe,
  Tag,
  Clock,
  Sparkles,
  Flame,
  Leaf,
  Layers,
} from "lucide-react";
import { MenuItemEntity, MenuCategoryEntity } from "@/types/hospitality";
import { useMounted } from "@/lib/useMounted";

export default function AdminMenuPage() {
  const mounted = useMounted();
  const [items, setItems] = useState<MenuItemEntity[]>([]);
  const [categories, setCategories] = useState<MenuCategoryEntity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItemEntity> | null>(null);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [itemsRes, catsRes] = await Promise.all([
        fetch("/api/menu"),
        fetch("/api/menu/categories"),
      ]);
      const itemsData = await itemsRes.json();
      const catsData = await catsRes.json();

      if (itemsData.success) setItems(itemsData.items || []);
      if (catsData.success) setCategories(catsData.categories || []);
    } catch (err) {
      console.error("Failed to load menu data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddItem = () => {
    setEditingItem({
      name: "",
      description: "",
      category: categories[0]?.slug || "lunch-dinner",
      price: 950,
      discountPrice: undefined,
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000",
      ingredients: ["Fresh local beef", "Chef spices", "Steamed ugali"],
      allergens: [],
      portionSize: "Serves 1-2 Persons",
      preparationTimeMinutes: 20,
      isVegetarian: false,
      isVegan: false,
      isSpicy: false,
      isFeatured: false,
      isAvailable: true,
      publishStatus: "published",
    });
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: MenuItemEntity) => {
    setEditingItem({ ...item });
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name || !editingItem.price) {
      alert("Please provide dish name and price.");
      return;
    }

    setSaving(true);
    try {
      const isNew = !editingItem.id;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch("/api/menu", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
      const data = await res.json();

      if (data.success) {
        setIsItemModalOpen(false);
        setEditingItem(null);
        showToast(isNew ? "Dish added to restaurant menu!" : "Dish details updated successfully!");
        loadData();
      } else {
        alert("Failed to save: " + data.error);
      }
    } catch (err) {
      alert("Error: " + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (item: MenuItemEntity) => {
    if (!confirm(`Are you sure you want to delete "${item.name}" from the menu?`)) return;

    try {
      const res = await fetch(`/api/menu?id=${encodeURIComponent(item.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast(`"${item.name}" removed from menu.`);
        loadData();
      }
    } catch (err) {
      alert("Failed to delete item: " + String(err));
    }
  };

  const handleToggleAvailable = async (item: MenuItemEntity) => {
    try {
      const res = await fetch("/api/menu", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, isAvailable: !item.isAvailable }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`${item.name} is now ${!item.isAvailable ? "Available" : "Marked Sold Out"}`);
        loadData();
      }
    } catch (err) {
      alert("Error toggling stock: " + String(err));
    }
  };

  const handleTogglePublish = async (item: MenuItemEntity) => {
    const next = item.publishStatus === "published" ? "draft" : "published";
    try {
      const res = await fetch("/api/menu", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, publishStatus: next }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`${item.name} publish state: ${next.toUpperCase()}`);
        loadData();
      }
    } catch (err) {
      alert("Error toggling publish state: " + String(err));
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    try {
      const slug = newCatName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const res = await fetch("/api/menu/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName,
          slug,
          description: newCatDesc,
          displayOrder: categories.length + 1,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsCatModalOpen(false);
        setNewCatName("");
        setNewCatDesc("");
        showToast(`Category "${newCatName}" created!`);
        loadData();
      }
    } catch (err) {
      alert("Error creating category: " + String(err));
    }
  };

  const filteredItems = items.filter((item) => {
    const matchCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
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
      {/* Toast Notification */}
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
              CMS Module 02
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Globe className="w-3 h-3" /> Live Restaurant Menu Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon mt-1">
            Restaurant &amp; Dining Menu CMS
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Build categories, add specialties, adjust prices, tag allergens, and control dish availability in real time.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsCatModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-xs"
          >
            <Layers className="w-4 h-4 text-brand-maroon" />
            <span>Manage Categories</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddItem}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber font-bold text-xs sm:text-sm shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === "all"
                ? "bg-brand-maroon text-brand-amber shadow"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            All Items ({items.length})
          </button>
          {categories.map((c) => {
            const count = items.filter((i) => i.category === c.slug).length;
            const active = selectedCategory === c.slug;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  active
                    ? "bg-brand-maroon text-brand-amber shadow"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {c.name || c.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search menu items by name, description, ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-brand-maroon bg-white"
          />
        </div>
      </div>

      {/* Dishes Grid */}
      {loading ? (
        <div className="p-12 text-center text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-maroon" />
          <p className="text-xs">Loading kitchen menu inventory...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
          <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-sm font-bold text-gray-700">No menu items found in this section</p>
          <button
            onClick={handleOpenAddItem}
            className="text-xs text-brand-maroon font-bold underline"
          >
            Add a new dish now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((dish) => {
            const isLive = dish.publishStatus === "published";
            return (
              <div
                key={dish.id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all group"
              >
                {/* Image & Badges */}
                <div className="relative h-44 w-full bg-gray-100">
                  <Image
                    src={dish.imageUrl || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800"}
                    alt={dish.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-brand-amber font-mono font-bold text-[10px]">
                      {categories.find((c) => c.slug === dish.category)?.label || categories.find((c) => c.slug === dish.category)?.name || dish.category}
                    </span>
                    {dish.isVegetarian && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1">
                        <Leaf className="w-2.5 h-2.5" /> Veg
                      </span>
                    )}
                    {dish.isSpicy && (
                      <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5" /> Spicy
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div className="font-mono">
                      <span className="text-lg font-black text-brand-amber">KES {dish.price.toLocaleString()}</span>
                      {dish.discountPrice && (
                        <span className="text-xs text-white/60 line-through ml-2">KES {dish.discountPrice.toLocaleString()}</span>
                      )}
                    </div>
                    {dish.preparationTimeMinutes && (
                      <span className="text-[10px] bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" /> {dish.preparationTimeMinutes} min
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base leading-snug">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                      {dish.description}
                    </p>
                    {dish.portionSize && (
                      <span className="inline-block mt-2 text-[10px] text-gray-400 font-medium">
                        Portion: {dish.portionSize}
                      </span>
                    )}
                  </div>

                  {/* Actions & Switches */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleAvailable(dish)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-colors ${
                          dish.isAvailable
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {dish.isAvailable ? "In Stock" : "Sold Out"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(dish)}
                        className={`px-2 py-1 rounded-full text-[10px] font-extrabold ${
                          isLive ? "bg-teal-50 text-teal-700 border border-teal-200" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {isLive ? "Live" : "Draft"}
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditItem(dish)}
                        className="p-1.5 rounded-lg border border-gray-200 hover:bg-brand-maroon hover:text-white text-gray-600 transition-colors"
                        title="Edit Dish"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(dish)}
                        className="p-1.5 rounded-lg border border-gray-200 hover:bg-red-500 hover:text-white text-gray-400 transition-colors"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT DISH MODAL */}
      {isItemModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-maroon">
                  {editingItem.id ? "Edit Dish" : "Create Restaurant Offering"}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
                  {editingItem.name || "New Menu Item"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">Dish Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Traditional Kapenguria Kienyeji Chicken"
                    value={editingItem.name || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-maroon"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category *</label>
                  <select
                    value={editingItem.category || categories[0]?.slug}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.label || c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Regular Price (KES) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingItem.price || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono font-bold text-brand-maroon focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Discount Price (KES)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingItem.discountPrice || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, discountPrice: Number(e.target.value) || undefined })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Preparation Time (Mins)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingItem.preparationTimeMinutes || 20}
                    onChange={(e) => setEditingItem({ ...editingItem, preparationTimeMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Dish Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe cuts, flavor notes, cooking style, side accompaniments..."
                  value={editingItem.description || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Food Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={editingItem.imageUrl || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-xs focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isVegetarian || false}
                    onChange={(e) => setEditingItem({ ...editingItem, isVegetarian: e.target.checked })}
                    className="rounded text-brand-maroon"
                  />
                  <span className="font-medium text-xs">Vegetarian</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isSpicy || false}
                    onChange={(e) => setEditingItem({ ...editingItem, isSpicy: e.target.checked })}
                    className="rounded text-brand-maroon"
                  />
                  <span className="font-medium text-xs">Spicy</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isAvailable !== false}
                    onChange={(e) => setEditingItem({ ...editingItem, isAvailable: e.target.checked })}
                    className="rounded text-brand-maroon"
                  />
                  <span className="font-medium text-xs">In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.publishStatus === "published"}
                    onChange={(e) => setEditingItem({ ...editingItem, publishStatus: e.target.checked ? "published" : "draft" })}
                    className="rounded text-brand-maroon"
                  />
                  <span className="font-medium text-xs text-brand-maroon font-bold">Publish Live</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber font-bold shadow-md transition-all flex items-center gap-2"
                >
                  {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{editingItem.id ? "Save Dish Changes" : "Add Dish"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CATEGORY MODAL */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-gray-900">
                Add Menu Category
              </h3>
              <button
                type="button"
                onClick={() => setIsCatModalOpen(false)}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Category Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Traditional Soups & Broths"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="Brief note shown in the menu header"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-maroon text-brand-amber font-bold"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
