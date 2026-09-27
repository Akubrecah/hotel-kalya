"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Bed,
  Utensils,
  Presentation,
  Coffee,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Copy,
  Check,
  Download,
  ArrowRight,
  ChevronRight,
  Star,
  Camera,
  Layers,
  FileText,
  Sliders,
  Eye,
  Code2,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { BRAND } from "@/lib/constants";
import { getStandardWhatsAppUrl } from "@/lib/whatsapp";

// Client Fillable JSON Schema Representation
const CLIENT_SCHEMA_TEMPLATE = {
  business: {
    name: "[BUSINESS NAME]",
    tagline: "[TAGLINE / VALUE PROPOSITION]",
    industry: "[HOSPITALITY / RESORT / BOUTIQUE HOTEL]",
    location: "[TOWN, COUNTY / STATE, COUNTRY]",
    physicalAddress: "[BUILDING NAME, STREET / HIGHWAY, POSTAL CODE]",
    phone: "[+254 700 000 000]",
    whatsappNumber: "[+254 700 000 000]",
    email: "[info@yourbusiness.com]",
    operatingHours: {
      reception: "[24/7 or 6:00 AM – 11:00 PM]",
      restaurant: "[6:30 AM – 10:00 PM]",
    },
    socials: {
      facebook: "[https://facebook.com/yourbrand]",
      instagram: "[https://instagram.com/yourbrand]",
      twitter: "[https://twitter.com/yourbrand]",
    },
    googleMapsUrl: "[https://maps.google.com/?q=Your+Location]",
  },
  hero: {
    headline: "[STAY. DINE. MEET. CELEBRATE.]",
    subheadline: "[Welcome to our premier destination where modern luxury meets genuine hospitality.]",
    badgeText: "[SIGNATURE HOSPITALITY DESTINATION]",
    ctaPrimary: { label: "[BOOK YOUR STAY]", href: "#rooms" },
    ctaSecondary: { label: "[WHATSAPP ENQUIRIES]", href: "#contact" },
  },
  rooms: [
    {
      title: "[EXECUTIVE DELUXE SUITE]",
      capacity: "[2 Adults, 1 Child]",
      bedType: "[King Size Bed with Orthopedic Mattress]",
      nightlyRateKes: "[KES 8,500]",
      features: ["[High-Speed Free Wi-Fi]", "[En-Suite Hot Shower & Tub]", "[Balcony with Scenic Views]", "[Complimentary Breakfast]"],
    },
    {
      title: "[STANDARD COMFORT ROOM]",
      capacity: "[1 - 2 Adults]",
      bedType: "[Queen Size Double Bed]",
      nightlyRateKes: "[KES 4,500]",
      features: ["[High-Speed Free Wi-Fi]", "[Private En-Suite Shower]", "[Work Desk & Reading Lamp]", "[Smart TV & Local Channels]"],
    },
    {
      title: "[SERVICED RESIDENCE / APARTMENT]",
      capacity: "[Up to 4 Guests (Family / Extended Stay)]",
      bedType: "[2 Master Bedrooms + Living Lounge]",
      nightlyRateKes: "[KES 12,000]",
      features: ["[Full Self-Catering Kitchenette]", "[Private Lounge & Dining Area]", "[Dedicated Housekeeping]", "[Secure Reserved Parking]"],
    },
  ],
  services: [
    {
      title: "[RESTAURANT & CULINARY EXPERIENCES]",
      description: "[Farm-to-table cuisine prepared with fresh regional produce, grilled specialties, and refreshing drinks.]",
    },
    {
      title: "[EXECUTIVE CONFERENCES & WORKSHOPS]",
      description: "[Fully air-conditioned seminar halls equipped with modern PA systems, HD projection, and high-speed Wi-Fi.]",
    },
    {
      title: "[PROFESSIONAL OUTSIDE CATERING]",
      description: "[Full-service mobile catering for corporate banquets, government summits, family weddings, and private events.]",
    },
  ],
  testimonials: [
    {
      guestName: "[DR. JOHN K. - NGO FIELD DIRECTOR]",
      review: "[\"Exceptional hospitality, peaceful rooms, and flawless conference coordination during our county workshops.\"]",
      rating: 5,
    },
    {
      guestName: "[SARAH M. - FAMILY TRAVELER]",
      review: "[\"The food was fresh and delicious, the gardens were immaculate, and the staff treated us like royalty.\"]",
      rating: 5,
    },
  ],
};

export default function BlackTemplatePage() {
  const [activeTab, setActiveTab] = useState<"preview" | "schema" | "guide">("preview");
  const [copied, setCopied] = useState(false);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(CLIENT_SCHEMA_TEMPLATE, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTemplate = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(CLIENT_SCHEMA_TEMPLATE, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "client-data-template.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white selection:bg-brand-amber selection:text-black">
      {/* Top Banner: Client Handover Notification */}
      <div className="bg-[#121215] border-b border-[#27272A] px-4 py-3 sticky top-20 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-amber animate-pulse" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-amber block">
                Black Template Pack & Handover System
              </span>
              <p className="text-[11px] text-neutral-400">
                Client-ready customizable foundation. Fill in placeholders tagged with <code className="text-brand-amber bg-black/60 px-1 py-0.5 rounded">[FIELD]</code>.
              </p>
            </div>
          </div>

          {/* Action Tabs & Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === "preview"
                  ? "bg-brand-amber text-brand-maroon-dark shadow-sm"
                  : "bg-[#18181D] hover:bg-[#22222A] text-neutral-300"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Interactive View</span>
            </button>

            <button
              onClick={() => setActiveTab("schema")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === "schema"
                  ? "bg-brand-amber text-brand-maroon-dark shadow-sm"
                  : "bg-[#18181D] hover:bg-[#22222A] text-neutral-300"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>JSON Schema</span>
            </button>

            <button
              onClick={() => setActiveTab("guide")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === "guide"
                  ? "bg-brand-amber text-brand-maroon-dark shadow-sm"
                  : "bg-[#18181D] hover:bg-[#22222A] text-neutral-300"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Handover Guide</span>
            </button>

            <button
              onClick={handleCopySchema}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#18181D] hover:bg-[#22222A] text-neutral-200 border border-[#27272A] transition-colors"
              title="Copy JSON Schema"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-brand-amber" />}
              <span>{copied ? "Copied" : "Copy Schema"}</span>
            </button>

            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-amber/20 hover:bg-brand-amber/30 text-brand-amber border border-brand-amber/40 transition-colors"
              title="Download client-data-template.json"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>

      <Breadcrumbs items={[{ label: "Client Black Template Pack" }]} dark />

      {/* View Mode 1: JSON Schema View */}
      {activeTab === "schema" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Card variant="black" className="p-6">
            <div className="flex items-center justify-between mb-4 border-b border-[#27272A] pb-3">
              <div>
                <h3 className="text-lg font-bold text-white font-serif">Client Data Collection Schema</h3>
                <p className="text-xs text-neutral-400">
                  This structured JSON matches every component on the website. The client can edit values and return this file to the development team.
                </p>
              </div>
              <button
                onClick={handleCopySchema}
                className="px-4 py-2 rounded-xl bg-brand-amber text-brand-maroon-dark text-xs font-bold flex items-center gap-2 hover:bg-brand-amber-dark"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied to Clipboard!" : "Copy Full JSON"}</span>
              </button>
            </div>
            <pre className="bg-[#09090B] p-4 rounded-xl overflow-x-auto text-xs font-mono text-brand-amber-light border border-[#22222A] leading-relaxed max-h-[600px]">
              {JSON.stringify(CLIENT_SCHEMA_TEMPLATE, null, 2)}
            </pre>
          </Card>
        </section>
      )}

      {/* View Mode 2: Client Handover Guide View */}
      {activeTab === "guide" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <Card variant="black" className="p-8">
            <h2 className="text-2xl font-serif font-extrabold text-brand-amber mb-3">
              Standard Client Content Collection & Handover Guide
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed mb-6">
              Welcome to your new website template pack. To customize this design into your live production platform, please follow these standardized steps.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#18181D] p-5 rounded-xl border border-[#2A2A32] space-y-2">
                <span className="text-brand-amber font-mono font-bold text-xs">STEP 01</span>
                <h4 className="text-base font-bold text-white">Brand Assets & Logos</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Provide your logo in vector format (SVG) or high-resolution PNG with transparent background (min 600px width), along with preferred hex brand colors.
                </p>
              </div>

              <div className="bg-[#18181D] p-5 rounded-xl border border-[#2A2A32] space-y-2">
                <span className="text-brand-amber font-mono font-bold text-xs">STEP 02</span>
                <h4 className="text-base font-bold text-white">Fill Content Placeholders</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Fill in all fields marked <code className="text-brand-amber">[PLACEHOLDER]</code> across rooms, dining menus, conference capacities, contact phones, and staff names.
                </p>
              </div>

              <div className="bg-[#18181D] p-5 rounded-xl border border-[#2A2A32] space-y-2">
                <span className="text-brand-amber font-mono font-bold text-xs">STEP 03</span>
                <h4 className="text-base font-bold text-white">High-Res Photography</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Upload photos organized by folder: <code>01-Exterior/</code>, <code>02-Rooms/</code>, <code>03-Dining/</code>, <code>04-Conferences/</code>, <code>05-Gardens/</code>. Minimum 1920x1080 for hero banners.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#2A2A32] flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                Documentation pack location: <code className="text-brand-amber">WEBSITE-PROJECT-DOCUMENTATION-PACK/BLACK-TEMPLATE-PACK/</code>
              </span>
              <button
                onClick={() => setActiveTab("preview")}
                className="px-5 py-2.5 rounded-xl bg-brand-amber text-brand-maroon-dark text-xs font-bold hover:bg-brand-amber-dark transition-all"
              >
                Inspect Live Black Template →
              </button>
            </div>
          </Card>
        </section>
      )}

      {/* View Mode 3: Interactive Black Template Live Preview */}
      {activeTab === "preview" && (
        <div className="space-y-20 pb-24">
          {/* Section 1: Hero Section Placeholder */}
          <section className="relative overflow-hidden bg-[#0B0B0C] border-b border-[#27272A] py-20 lg:py-28">
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <div className="w-[140%] h-[500px] -rotate-6 -translate-y-24 bg-gradient-to-r from-brand-amber via-brand-sage to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-amber/15 border border-brand-amber/30 text-brand-amber text-xs font-semibold uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>[CLIENT DESTINATION BADGE: E.G. SIGNATURE HOSPITALITY DESTINATION]</span>
                  </div>

                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                    [STAY. DINE. MEET. CELEBRATE.] <br />
                    <span className="text-brand-amber">[EXPERIENCE YOUR BUSINESS NAME]</span>
                  </h1>

                  <p className="text-neutral-300 text-base sm:text-lg max-w-xl font-light leading-relaxed">
                    [INSERT 2-3 SENTENCES INTRODUCING YOUR HOSPITALITY DESTINATION, EXECUTIVE ACCOMMODATION, FARM-TO-TABLE DINING, AND TRANQUIL GROUNDS].
                  </p>

                  {/* Service Badges */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {["[ACCOMMODATION]", "[FINE DINING]", "[CONFERENCES]", "[OUTSIDE CATERING]", "[SERVICED APARTMENTS]", "[GARDEN EVENTS]"].map((badge, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-[#18181D] border border-[#2A2A32] text-brand-amber px-3 py-1 rounded-md font-mono"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap items-center gap-4 pt-3">
                    <button className="bg-brand-amber hover:bg-brand-amber-dark text-brand-maroon-dark px-7 py-3.5 rounded-full font-bold text-sm tracking-wider uppercase shadow-lg transition-transform hover:-translate-y-0.5 flex items-center gap-2">
                      <span>[BOOK YOUR STAY]</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="bg-[#18181D] hover:bg-[#22222A] border border-[#2A2A32] text-white px-6 py-3.5 rounded-full font-semibold text-sm transition-colors flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>[WHATSAPP ENQUIRIES: +254 7XX XXX XXX]</span>
                    </button>
                  </div>
                </div>

                {/* Hero Right: Upload Image Graphic */}
                <div className="lg:col-span-5 flex items-center justify-center">
                  <div className="w-full max-w-md h-80 sm:h-96 rounded-3xl bg-[#141417] border-2 border-dashed border-brand-amber/40 flex flex-col items-center justify-center text-center p-8 space-y-4 shadow-2xl relative overflow-hidden group">
                    <div className="w-16 h-16 rounded-full bg-brand-amber/10 border border-brand-amber/30 text-brand-amber flex items-center justify-center">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-widest text-brand-amber font-mono font-bold block mb-1">
                        [UPLOAD HERO IMAGE]
                      </span>
                      <h4 className="text-base font-bold text-white">Recommended Size: 1920 × 1080 px</h4>
                      <p className="text-xs text-neutral-400 mt-1">
                        Showcase main exterior complex, front entrance, or panoramic garden view.
                      </p>
                    </div>
                    <span className="text-[11px] text-neutral-500 bg-black/60 px-3 py-1 rounded-full font-mono">
                      File format: JPEG, WebP (under 500KB)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: About / Heritage Placeholder */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Image slot */}
              <div className="lg:col-span-5">
                <div className="h-96 rounded-3xl bg-[#121215] border-2 border-dashed border-[#2A2A32] flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <Camera className="w-10 h-10 text-neutral-500" />
                  <span className="text-xs font-mono font-bold text-brand-amber">[UPLOAD BUILDING FACADE IMAGE]</span>
                  <p className="text-xs text-neutral-400">Dimensions: 800 × 600 px (Landscape orientation)</p>
                </div>
              </div>

              {/* Text Column */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 text-brand-amber font-mono text-xs uppercase tracking-widest">
                  <span className="w-8 h-0.5 bg-brand-amber" />
                  <span>[ABOUT YOUR BUSINESS NAME]</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white leading-snug">
                  [WHERE WARM HOSPITALITY MEETS MODERN LUXURY]
                </h2>

                <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
                  [PROVIDE 1-2 PARAGRAPHS DETAILING THE STORY, MISSION, AND HOSPITALITY TRADITIONS OF YOUR BUSINESS. MENTION CONVENIENT LOCATION NEAR MAJOR HIGHWAYS, PEACEFUL LANDSCAPES, AND DEDICATED TEAM].
                </p>

                {/* Key Metrics / Stats */}
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#141417] border border-[#27272A] text-center">
                    <span className="block font-serif text-2xl font-bold text-brand-amber">[24/7]</span>
                    <span className="text-[11px] text-neutral-400 uppercase font-semibold">[FRONT DESK &amp; SECURITY]</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#141417] border border-[#27272A] text-center">
                    <span className="block font-serif text-2xl font-bold text-brand-amber">[X+]</span>
                    <span className="text-[11px] text-neutral-400 uppercase font-semibold">[EXECUTIVE ROOMS]</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#141417] border border-[#27272A] text-center">
                    <span className="block font-serif text-2xl font-bold text-brand-amber">[150+]</span>
                    <span className="text-[11px] text-neutral-400 uppercase font-semibold">[CONFERENCE CAPACITY]</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Accommodation / Rooms Placeholder */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#27272A] pb-6">
              <div>
                <span className="text-xs uppercase tracking-widest font-mono font-bold text-brand-amber block mb-1">
                  [ACCOMMODATION &amp; SHORT-STAYS]
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                  [ROOMS, SUITES &amp; SERVICED APARTMENTS]
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
                  [RESTFUL NIGHTS WITH EN-SUITE HOT SHOWERS, COMFORTABLE MATTRESSES, WORK DESKS, AND COMPLIMENTARY BREAKFAST].
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="dark" size="sm">
                  <span>[BROWSE ALL ROOMS]</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Room Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { type: "[EXECUTIVE DELUXE SUITE]", price: "[KES 8,500 / NIGHT]", desc: "[SPACIOUS KING BED, BALCONY VIEW, MINI-BAR & HOT TUB]" },
                { type: "[STANDARD SUPERIOR ROOM]", price: "[KES 4,500 / NIGHT]", desc: "[QUEEN BED, EN-SUITE SHOWER, HIGH-SPEED WI-FI & DESK]" },
                { type: "[SERVICED AIRBNB APARTMENT]", price: "[KES 12,000 / NIGHT]", desc: "[2-BEDROOM FURNISHED LIVING QUARTERS & KITCHENETTE]" },
              ].map((card, idx) => (
                <Card key={idx} variant="black" className="flex flex-col justify-between group">
                  <div>
                    {/* Image slot */}
                    <div className="h-52 bg-[#18181D] border-b border-[#27272A] flex flex-col items-center justify-center text-center p-4">
                      <Camera className="w-8 h-8 text-neutral-500 mb-2" />
                      <span className="text-xs font-mono font-bold text-brand-amber">[UPLOAD ROOM PHOTO]</span>
                      <span className="text-[10px] text-neutral-500 mt-1">Recommended: 800 × 500 px</span>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="blackGold" size="sm">{card.type}</Badge>
                        <span className="text-xs font-mono text-neutral-400">[ROOM 10{idx + 1}]</span>
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed">{card.desc}</p>

                      <div className="space-y-1.5 border-t border-[#27272A] pt-3">
                        {["[EN-SUITE HOT SHOWER]", "[HIGH-SPEED WI-FI]", "[COMPLIMENTARY BREAKFAST]"].map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 text-xs text-neutral-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-amber flex-shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-[#22222A] flex items-center justify-between mt-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Rate / Night</span>
                      <span className="text-sm sm:text-base font-black text-brand-amber">{card.price}</span>
                    </div>
                    <Button variant="primary" size="sm">
                      <span>[RESERVE]</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Section 4: Dining & Menu Placeholder */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="border-b border-[#27272A] pb-6">
              <span className="text-xs uppercase tracking-widest font-mono font-bold text-brand-amber block mb-1">
                [RESTAURANT &amp; DIGITAL MENU]
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                [FARM-FRESH CULINARY DINING]
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
                [PROVIDE PRICING, INGREDIENT HIGHLIGHTS, BREAKFAST SPECIALS, AND POPULAR DISHES].
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "[SIGNATURE FREE-RANGE CHICKEN (KIENYEJI)]", cat: "[CHEF SPECIAL]", price: "[KES 1,400]", desc: "[SLOW-SIMMERED TRADITIONAL CHICKEN WITH GREENS & UGALI]" },
                { name: "[PRIME GRILLED BEEF STEAK (NYAMA CHOMA)]", cat: "[GRILL SPECIAL]", price: "[KES 1,200]", desc: "[TENDER MARINATED CUT SERVED WITH KACHUMBARI & FRIES]" },
                { name: "[FARMER'S CONTINENTAL BREAKFAST]", cat: "[BREAKFAST]", price: "[KES 850]", desc: "[EGGS TO ORDER, SAUSAGE, TOAST, FRUIT PLATTER & SPICED TEA]" },
                { name: "[FRESH TROPICAL SMOOTHIE / KALYA TEA]", cat: "[BEVERAGE]", price: "[KES 350]", desc: "[LOCALLY BREWED SPICED GINGER TEA OR FRESH MANGO JUICE]" },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#121215] border border-[#27272A] flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-brand-amber">{item.cat}</span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base text-white">{item.name}</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-mono font-bold text-sm sm:text-base text-brand-amber block">{item.price}</span>
                    <Button variant="outline" size="sm" className="mt-2 text-[11px] h-7 px-2 border-neutral-700 text-neutral-200">
                      [ADD TO CART]
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Facilities, Conferences & Outside Catering */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="border-b border-[#27272A] pb-6">
              <span className="text-xs uppercase tracking-widest font-mono font-bold text-brand-amber block mb-1">
                [CONFERENCES, CATERING &amp; EVENTS]
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                [EXECUTIVE VENUES &amp; MOBILE CATERING]
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card variant="black" className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-brand-amber/15 text-brand-amber">
                    <Presentation className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-serif">[CONFERENCE &amp; SEMINAR HALLS]</h3>
                    <p className="text-xs text-neutral-400">[CAPACITY: 50 TO 150+ DELEGATES]</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  [PROVIDE DETAILS ON PROJECTORS, PA SYSTEMS, FLIP CHARTS, PENS, WRITING PADS, MORNING &amp; AFTERNOON COFFEE TEAS WITH SNACKS, AND EXECUTIVE BUFFET LUNCH].
                </p>
                <div className="pt-2">
                  <Button variant="primary" size="sm">
                    <span>[REQUEST CONFERENCE QUOTATION]</span>
                  </Button>
                </div>
              </Card>

              <Card variant="black" className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-brand-amber/15 text-brand-amber">
                    <Coffee className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-serif">[MOBILE OUTSIDE EVENT CATERING]</h3>
                    <p className="text-xs text-neutral-400">[CAPACITY: 50 TO 1,000+ GUESTS]</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  [PROFESSIONAL CHEFS, SERVING STAFF, BUFFET CHAFFING DISHES, CUTLERY, CROCKERY, AND TRANSPORT TO YOUR VENUE IN THE REGION].
                </p>
                <div className="pt-2">
                  <Button variant="primary" size="sm">
                    <span>[DISCUSS CATERING MENU]</span>
                  </Button>
                </div>
              </Card>
            </div>
          </section>

          {/* Section 6: Testimonials & Reviews Placeholder */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="border-b border-[#27272A] pb-6">
              <span className="text-xs uppercase tracking-widest font-mono font-bold text-brand-amber block mb-1">
                [GUEST FEEDBACK &amp; REPUTATION]
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                [WHAT OUR CLIENTS SAY]
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: "[DR. JOHN K. - NGO FIELD DIRECTOR]", text: "[\"Exceptional hospitality, peaceful rooms, and flawless conference coordination during our county workshops in Kapenguria.\"]" },
                { name: "[SARAH M. - FAMILY TRAVELER]", text: "[\"The food was fresh and delicious, the gardens were immaculate, and the staff treated us like royalty. We will definitely return!\"]" },
              ].map((rev, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#141417] border border-[#27272A] space-y-3">
                  <div className="flex items-center gap-1 text-brand-amber">
                    {[...Array(5)].map((_, sIdx) => (
                      <Star key={sIdx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed">{rev.text}</p>
                  <span className="text-xs font-bold text-white block pt-2">{rev.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 7: Contact & WhatsApp Direct Placeholder */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card variant="black" className="p-8 sm:p-12 border-2 border-brand-amber/30">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-6 space-y-6">
                  <span className="text-xs font-mono font-bold text-brand-amber uppercase tracking-widest">
                    [CONTACT &amp; RESERVATIONS DESK]
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                    [GET IN TOUCH WITH OUR TEAM]
                  </h2>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    [WE ARE AVAILABLE 24 HOURS DAILY TO ASSIST WITH ROOM BOOKINGS, EVENT QUOTATIONS, AND CUSTOM INQUIRIES].
                  </p>

                  <div className="space-y-3 text-xs sm:text-sm text-neutral-300">
                    <p className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-brand-amber flex-shrink-0" />
                      <span><strong>[TELEPHONE / DESK]:</strong> [+254 700 000 000]</span>
                    </p>
                    <p className="flex items-center gap-3">
                      <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span><strong>[WHATSAPP OFFICIAL]:</strong> [+254 700 000 000]</span>
                    </p>
                    <p className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-brand-amber flex-shrink-0" />
                      <span><strong>[EMAIL ADDRESS]:</strong> [reservations@yourbusiness.com]</span>
                    </p>
                    <p className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-brand-amber flex-shrink-0" />
                      <span><strong>[PHYSICAL LOCATION]:</strong> [TOWN NAME, OFF HIGHWAY, COUNTY / REGION]</span>
                    </p>
                    <p className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-brand-amber flex-shrink-0" />
                      <span><strong>[SERVICE HOURS]:</strong> [OPEN DAILY 24/7]</span>
                    </p>
                  </div>
                </div>

                {/* Form Placeholder */}
                <div className="lg:col-span-6 bg-[#09090B] p-6 rounded-2xl border border-[#27272A] space-y-4">
                  <h4 className="font-serif text-lg font-bold text-white">[DIRECT INQUIRY FORM]</h4>
                  <div className="space-y-3">
                    <Input dark placeholder="[YOUR FULL NAME]" readOnly value="[YOUR FULL NAME]" />
                    <Input dark placeholder="[YOUR PHONE NUMBER / WHATSAPP]" readOnly value="[YOUR PHONE NUMBER]" />
                    <Input dark placeholder="[YOUR EMAIL ADDRESS]" readOnly value="[YOUR EMAIL ADDRESS]" />
                    <Select dark disabled>
                      <option>[SELECT SERVICE: ACCOMMODATION / CONFERENCES / CATERING]</option>
                    </Select>
                    <Textarea dark rows={3} placeholder="[ENTER YOUR DATES, NUMBER OF GUESTS & REQUIREMENTS]" readOnly value="[ENTER YOUR DATES & SPECIAL REQUESTS]" />
                    <Button variant="primary" className="w-full">
                      <span>[SUBMIT INQUIRY / SEND TO WHATSAPP]</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        </div>
      )}
    </div>
  );
}
