"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  CheckCircle2,
  Utensils,
  Bed,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { BRAND } from "@/lib/constants";
import { OrderType } from "@/types";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, serviceFee, total } = useCart();
  const { user } = useAuth();

  const [orderType, setOrderType] = useState<OrderType>("room_delivery");
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [locationDetail, setLocationDetail] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<{
    orderId: string;
    itemsSummary: string;
    totalAmount: number;
  } | null>(null);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    // Format order text for kitchen dispatch
    const itemsText = items
      .map(
        (i) =>
          `• ${i.quantity}x ${i.menuItem.name} (KES ${(i.menuItem.price * i.quantity).toLocaleString()})${
            i.specialInstructions ? ` [Note: ${i.specialInstructions}]` : ""
          }`
      )
      .join("\n");

    const orderTypeLabel =
      orderType === "room_delivery"
        ? "Hotel Room Delivery"
        : orderType === "dine_in"
        ? "Restaurant Table Dine-In"
        : "Takeaway / Pickup";

    const message = `*NEW FOOD ORDER — HOTEL KALYA* 🍽️
*Order ID:* ${orderId}
*Customer Name:* ${customerName}
*Phone / M-Pesa:* ${customerPhone}
*Order Type:* ${orderTypeLabel}
*Room / Table / Notes:* ${locationDetail || "N/A"}

*ITEMS:*
${itemsText}

*Subtotal:* KES ${subtotal.toLocaleString()}
*Service/Packaging:* KES ${serviceFee.toLocaleString()}
*TOTAL AMOUNT:* KES ${total.toLocaleString()}

*Special Instructions:* ${specialNotes || "None"}
_Submitted via Hotel Kalya Digital Menu_`;

    const whatsappUrl = `https://wa.me/${BRAND.phoneClean}?text=${encodeURIComponent(message)}`;

    // Save active order locally
    try {
      const storedOrders = JSON.parse(localStorage.getItem("hotel_kalya_user_orders") || "[]");
      storedOrders.unshift({
        id: orderId,
        date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        type: orderTypeLabel,
        itemsCount: items.reduce((s, i) => s + i.quantity, 0),
        total: total,
        status: "Received at Kitchen Desk",
      });
      localStorage.setItem("hotel_kalya_user_orders", JSON.stringify(storedOrders));
    } catch {
      // Ignore storage errors
    }

    setOrderConfirmed({
      orderId,
      itemsSummary: `${items.length} dishes (${items.reduce((s, i) => s + i.quantity, 0)} total servings)`,
      totalAmount: total,
    });

    clearCart();
    setIsSubmitting(false);

    // Open WhatsApp kitchen hotline in a new window/tab
    if (typeof window !== "undefined") {
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Digital Menu", href: "/menu" },
          { label: "Your Order Cart" },
        ]}
      />

      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-brand-maroon text-brand-amber">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif font-black text-2xl sm:text-3xl text-brand-maroon">
                Your Dining Order
              </h1>
              <p className="text-xs sm:text-sm text-brand-dark/70">
                Review your selections, specify your dining location, and send directly to the kitchen desk.
              </p>
            </div>
          </div>

          {orderConfirmed ? (
            /* Confirmation Screen */
            <div className="max-w-2xl mx-auto bg-brand-cream/40 rounded-2xl border border-brand-maroon/15 p-8 sm:p-10 text-center space-y-5 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-amber-dark">
                  Order Dispatched Successfully
                </span>
                <h2 className="font-serif font-black text-2xl sm:text-3xl text-brand-maroon mt-1">
                  Kitchen Has Received Your Request!
                </h2>
                <p className="text-xs sm:text-sm text-brand-dark/75 mt-2 max-w-md mx-auto leading-relaxed">
                  Your order <strong>#{orderConfirmed.orderId}</strong> was transmitted to the Hotel Kalya kitchen dispatch hotline. Our culinary team is reviewing your preparation notes.
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-brand-maroon/10 text-left space-y-2 text-xs text-brand-dark/80 max-w-md mx-auto">
                <div className="flex justify-between border-b border-brand-cream pb-2">
                  <span className="text-brand-dark/60">Reference ID:</span>
                  <span className="font-mono font-bold text-brand-maroon">#{orderConfirmed.orderId}</span>
                </div>
                <div className="flex justify-between border-b border-brand-cream pb-2">
                  <span className="text-brand-dark/60">Items Summary:</span>
                  <span className="font-bold">{orderConfirmed.itemsSummary}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-bold text-brand-maroon">Total Due:</span>
                  <span className="font-serif font-black text-brand-maroon text-sm">
                    KES {orderConfirmed.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-brand-dark/60 max-w-sm mx-auto">
                Payment is accepted upon delivery via M-Pesa Till or cash, or charged directly to your hotel room folio.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-colors"
                >
                  Order More Dishes
                </Link>
                <Link
                  href="/account/orders"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-brand-maroon/20 text-brand-maroon font-bold text-xs uppercase tracking-wider hover:bg-brand-cream transition-colors"
                >
                  View Order History
                </Link>
              </div>
            </div>
          ) : items.length === 0 ? (
            /* Empty Cart State */
            <div className="text-center py-20 bg-brand-cream/30 rounded-2xl border border-brand-maroon/10 p-8 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-brand-cream text-brand-dark/40 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-brand-maroon">Your cart is currently empty</h3>
              <p className="text-xs text-brand-dark/60 mt-1 max-w-sm mx-auto leading-relaxed">
                Explore our digital menu to select farm-fresh breakfasts, authentic Kenyan kienyeji stews, roasted nyama choma, and refreshing drinks.
              </p>
              <div className="pt-6">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-all shadow-md active:scale-95"
                >
                  <Utensils className="w-4 h-4 text-brand-amber" />
                  <span>Browse Digital Menu</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Active Cart & Checkout Form */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              {/* Items List (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-brand-cream">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-maroon">
                    Selected Dishes ({items.length})
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-[11px] font-semibold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear Cart</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map(({ menuItem, quantity, specialInstructions }) => (
                    <div
                      key={menuItem.id}
                      className="bg-white p-4 rounded-xl border border-brand-maroon/10 shadow-sm flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-brand-cream">
                          <Image
                            src={menuItem.image}
                            alt={menuItem.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif font-bold text-sm text-brand-maroon truncate">
                            {menuItem.name}
                          </h4>
                          <span className="text-xs font-serif font-bold text-brand-dark/80 block">
                            KES {menuItem.price.toLocaleString()}
                          </span>
                          {specialInstructions && (
                            <p className="text-[10px] text-brand-dark/60 italic truncate mt-0.5">
                              Note: {specialInstructions}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center border border-brand-maroon/20 rounded-lg overflow-hidden bg-brand-cream/30">
                          <button
                            type="button"
                            onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                            className="p-1.5 hover:bg-brand-cream text-brand-maroon"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-brand-dark">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                            className="p-1.5 hover:bg-brand-cream text-brand-maroon"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(menuItem.id)}
                          className="p-1.5 text-brand-dark/40 hover:text-red-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    href="/menu"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-maroon hover:text-brand-amber-dark transition-colors"
                  >
                    <span>+ Add More Dishes from Menu</span>
                  </Link>
                </div>
              </div>

              {/* Order Checkout Summary Form (5 cols) */}
              <div className="lg:col-span-5">
                <div className="bg-brand-cream/40 rounded-2xl border border-brand-maroon/15 p-6 sm:p-7 space-y-6">
                  <h3 className="font-serif font-bold text-lg text-brand-maroon border-b border-brand-cream pb-3">
                    Order Delivery &amp; Details
                  </h3>

                  <form onSubmit={handleCheckout} className="space-y-4">
                    {/* Order Type Radio */}
                    <div>
                      <label className="block text-xs font-bold text-brand-maroon mb-2">
                        How would you like to receive your food? *
                      </label>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {[
                          { id: "room_delivery", label: "Room Service", icon: Bed },
                          { id: "dine_in", label: "Table Dine-in", icon: Utensils },
                          { id: "takeaway", label: "Takeaway", icon: ShoppingBag },
                        ].map((t) => {
                          const IconComp = t.icon;
                          const selected = orderType === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setOrderType(t.id as OrderType)}
                              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                                selected
                                  ? "border-brand-maroon bg-brand-maroon text-white shadow-sm font-bold"
                                  : "border-brand-maroon/20 bg-white text-brand-dark/80 hover:bg-brand-cream"
                              }`}
                            >
                              <IconComp className={`w-4 h-4 ${selected ? "text-brand-amber" : "text-brand-dark/60"}`} />
                              <span className="text-[11px]">{t.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Customer Name */}
                    <div>
                      <label className="block text-xs font-bold text-brand-maroon mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Samuel Rotich"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-brand-maroon/20 text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber bg-white"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-brand-maroon mb-1">
                        M-Pesa / Contact Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="e.g. 0712 345 678"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-brand-maroon/20 text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber bg-white"
                      />
                    </div>

                    {/* Location Detail (Room Number or Table Number) */}
                    <div>
                      <label className="block text-xs font-bold text-brand-maroon mb-1">
                        {orderType === "room_delivery"
                          ? "Hotel Room / Cottage Number *"
                          : orderType === "dine_in"
                          ? "Table / Garden Location *"
                          : "Pickup Time / Instructions"}
                      </label>
                      <input
                        type="text"
                        required={orderType !== "takeaway"}
                        value={locationDetail}
                        onChange={(e) => setLocationDetail(e.target.value)}
                        placeholder={
                          orderType === "room_delivery"
                            ? "e.g. Suite 204 or Cottage A"
                            : orderType === "dine_in"
                            ? "e.g. Table 8 or Garden Gazebo"
                            : "e.g. Ready by 1:30 PM"
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg border border-brand-maroon/20 text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber bg-white"
                      />
                    </div>

                    {/* Special Instructions */}
                    <div>
                      <label className="block text-xs font-bold text-brand-maroon mb-1">
                        Kitchen Special Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        placeholder="e.g. Mild chili, separate sauce, extra napkins"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-brand-maroon/20 text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber bg-white"
                      />
                    </div>

                    {/* Bill Breakdown */}
                    <div className="pt-4 border-t border-brand-cream/80 space-y-2 text-xs">
                      <div className="flex justify-between text-brand-dark/70">
                        <span>Dishes Subtotal:</span>
                        <span>KES {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-brand-dark/70">
                        <span>Service &amp; Packaging:</span>
                        <span>KES {serviceFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-brand-maroon pt-2 border-t border-brand-cream">
                        <span>Total Due:</span>
                        <span className="font-serif font-black text-lg">
                          KES {total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Order Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-4 bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:bg-brand-maroon-dark transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                      >
                        <Utensils className="w-4 h-4 text-brand-amber" />
                        <span>Send Order to Kitchen Desk</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[10px] text-brand-dark/60 text-center leading-snug">
                      Orders are received directly at the Hotel Kalya kitchen hotline. Pay via M-Pesa or room charge upon delivery.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
