import type { Metadata } from "next";
import { Cookie } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Cookie Policy & Web Storage Notice | Hotel Kalya Kapenguria",
  description:
    "Information regarding the essential cookies and local browser storage used on the Hotel Kalya web platform for digital menu ordering and customer authentication.",
};

export default function CookiesPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Cookie Notice" },
        ]}
      />

      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/20 text-brand-maroon text-xs font-bold uppercase tracking-wider mb-2">
              <Cookie className="w-3.5 h-3.5 text-brand-amber-dark" />
              <span>Browser Storage Transparency</span>
            </div>
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-brand-maroon">
              Cookie &amp; Storage Notice
            </h1>
            <p className="text-xs sm:text-sm text-brand-dark/70 mt-2">
              Last updated: September 2026
            </p>
          </div>

          <div className="prose prose-sm max-w-none text-brand-dark/80 space-y-6 text-xs sm:text-sm leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-brand-maroon">
                1. What We Store in Your Browser
              </h2>
              <p>
                The <strong>{BRAND.name}</strong> website uses minimal, functional storage mechanisms (cookies and HTML5 local storage) to provide an interactive hospitality experience:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Digital Ordering Cart (`hotel_kalya_cart`):</strong> Enables you to add dishes from our digital menu, customize items, and retain your selected food items while browsing between pages.
                </li>
                <li>
                  <strong>Guest Session Security (`hotel_kalya_auth_user`):</strong> Maintains your active guest portal login across page refreshes so you can view your reservations and past food orders.
                </li>
                <li>
                  <strong>Recent Orders History (`hotel_kalya_user_orders`):</strong> Locally logs your dispatched kitchen orders so you can track order references on your device.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-brand-maroon">
                2. No Third-Party Advertising Trackers
              </h2>
              <p>
                Hotel Kalya does not utilize intrusive third-party cross-site advertising tracking networks. Our website storage is strictly functional and hospitality-focused.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-brand-maroon">
                3. Managing Browser Storage
              </h2>
              <p>
                You can clear your stored cookies and local data at any time via your browser settings. Please note that clearing storage will empty your current digital menu cart and sign you out of your guest session.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
