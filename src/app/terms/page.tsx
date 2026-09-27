import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service & Reservation Policies | Hotel Kalya Kapenguria",
  description:
    "Terms of Service, room check-in policies, booking cancellation conditions, and garden conduct guidelines for Hotel Kalya in Kapenguria, West Pokot County.",
};

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: "Terms of Service" },
        ]}
      />


      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/20 text-brand-maroon text-xs font-bold uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5 text-brand-amber-dark" />
              <span>Hospitality Agreement</span>
            </div>
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-brand-maroon">
              Terms of Service &amp; Hotel Policies
            </h1>
            <p className="text-xs sm:text-sm text-brand-dark/70 mt-2">
              Applicable to all guest stays, conference bookings, garden venues, and dining orders at Hotel Kalya.
            </p>
          </div>

          <div className="prose prose-sm max-w-none text-brand-dark/80 space-y-6 text-xs sm:text-sm leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-brand-maroon">
                1. Reservation Guarantee &amp; Check-In
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Check-in Time:</strong> From <strong>12:00 PM</strong> daily. Valid national identification or passport is mandatory upon arrival for all adult occupants.</li>
                <li><strong>Check-out Time:</strong> By <strong>10:00 AM</strong> on the day of departure. Late departures are subject to availability and prior desk arrangement.</li>
                <li><strong>Early Check-in:</strong> Complimentary where available, or guaranteed with prior day night reservation.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-brand-maroon">
                2. Payments &amp; Invoicing
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>All room rates and dining prices are quoted in <strong>Kenya Shillings (KES)</strong> and are inclusive of statutory government taxes.</li>
                <li>Settlement is accepted via official M-Pesa Till / Paybill, major debit/credit cards, certified bank wire, or approved corporate LPO for established organizations.</li>
                <li>Full settlement or corporate purchase order guarantee is required prior to room key release or banquet meal serving.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-brand-maroon">
                3. Cancellation &amp; Rescheduling Policy
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Individual Room Bookings:</strong> Free cancellation up to <strong>24 hours prior</strong> to check-in. Cancellations within 24 hours incur a one-night room charge.</li>
                <li><strong>Conference &amp; Group Banquets:</strong> Requires notice at least <strong>7 days prior</strong> for complete refund of venue deposit.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-brand-maroon">
                4. Conduct &amp; Property Guidelines
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Quiet Hours:</strong> Respecting the peace of all hotel guests, outdoor amplified sound in Kalya Gardens ceases at <strong>10:00 PM</strong>.</li>
                <li><strong>Smoking Policy:</strong> All indoor suites and conference rooms are strictly non-smoking. Designated outdoor smoking spaces are provided in the gardens.</li>
                <li><strong>Security &amp; Parking:</strong> Complimentary guest parking is provided inside our gated, guarded perimeter. Guests are advised not to leave valuables visibly unattended in parked vehicles.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-brand-maroon">
                5. Contact &amp; Questions
              </h2>
              <p>
                Questions regarding our terms or custom corporate arrangements should be directed to:
                <br />
                <strong>Hotel Kalya Front Desk</strong>
                <br />
                Telephone: {BRAND.phone} • Email: {BRAND.email}
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
