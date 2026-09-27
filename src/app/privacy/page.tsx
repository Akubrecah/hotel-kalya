import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy — Guest Data Protection | Hotel Kalya Kapenguria",
  description:
    "Privacy Policy for Hotel Kalya in Kapenguria, West Pokot County. How we collect, store, and safeguard guest personal data in accordance with the Kenya Data Protection Act 2019.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: "Privacy Policy" },
        ]}
      />


      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/20 text-brand-maroon text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-amber-dark" />
              <span>Kenya Data Protection Act Compliant</span>
            </div>
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-brand-maroon">
              Privacy Policy &amp; Data Safeguards
            </h1>
            <p className="text-xs sm:text-sm text-brand-dark/70 mt-2">
              Effective Date: 1 January 2026 • Last Reviewed: September 2026
            </p>
          </div>

          <div className="prose prose-sm max-w-none text-brand-dark/80 space-y-6 text-xs sm:text-sm leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-brand-maroon">
                1. Overview &amp; Commitment to Guest Privacy
              </h2>
              <p>
                At <strong>{BRAND.name}</strong>, we respect your privacy and are committed to protecting the personal data of our hotel guests, conference delegates, restaurant patrons, and website visitors. This policy outlines how information is collected, utilized, and secured in strict compliance with the <strong>Kenya Data Protection Act, 2019</strong>.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-brand-maroon">
                2. Information We Collect
              </h2>
              <p>When you book accommodation, place food orders, or request catering services, we collect:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Identity &amp; Contact Information:</strong> Full name, national identity/passport number (required for statutory hotel registration in Kenya), email address, and telephone number.</li>
                <li><strong>Reservation &amp; Dining Details:</strong> Dates of stay, room tier preferences, conference delegates count, special dietary requirements, and room service delivery notes.</li>
                <li><strong>Payment Information:</strong> Mobile payment verification records (e.g. M-Pesa transaction reference codes) and payment receipts. We do not store raw card CVV numbers.</li>
                <li><strong>Digital Usage Data:</strong> IP address, device type, and shopping cart tokens necessary to deliver digital menu ordering.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-brand-maroon">
                3. Purpose of Processing
              </h2>
              <p>Your data is processed strictly for legitimate hospitality purposes:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Confirming room reservations, conference hall bookings, and outside catering timelines.</li>
                <li>Preparing dining orders and executing kitchen delivery to guest suites or restaurant tables.</li>
                <li>Complying with statutory guest registration obligations under Kenyan law.</li>
                <li>Communicating direct reservation confirmations and customer service updates.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-brand-maroon">
                4. Data Sharing &amp; Third Parties
              </h2>
              <p>
                We do not sell, rent, or trade your personal data. Data is shared exclusively with verified service partners strictly necessary to complete your stay (e.g., Safaricom Daraja for M-Pesa verification and secure SMS dispatch providers).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-brand-maroon">
                5. Guest Data Rights
              </h2>
              <p>
                Under Kenyan law, you have the right to request access to your stored personal records, request corrections of inaccurate details, or request deletion of discretionary marketing data by contacting our management desk at <a href={`mailto:${BRAND.email}`} className="text-brand-maroon font-bold hover:underline">{BRAND.email}</a>.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-brand-maroon">
                6. Contact Our Data Desk
              </h2>
              <p>
                For data protection inquiries or formal requests:
                <br />
                <strong>Hotel Kalya Management</strong>
                <br />
                Kitale–Lodwar Highway, Kapenguria, West Pokot County, Kenya
                <br />
                Phone: {BRAND.phone} • Email: {BRAND.email}
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
