import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Coffee,
  Wifi,
  Tv,
  ShieldCheck,
  ChevronRight,
  Phone,
  Home,
} from "lucide-react";
import { BRAND, IMAGES } from "@/lib/constants";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "AirBnB Short-Stays & Serviced Apartments in Kapenguria, West Pokot",
  description:
    "Self-contained serviced apartments and short-stay suites at Hotel Kalya in Kapenguria. Kitchenette, private lounge, balcony with hill views, Wi-Fi, and 24/7 gated security.",
  openGraph: {
    title: "AirBnB Short-Stays & Apartments | Hotel Kalya Kapenguria",
    description:
      "Your home away from home in Kapenguria. Fully furnished short and extended-stay apartments for professionals, families, and researchers.",
    images: [IMAGES.airbnbStay],
  },
};

const APARTMENT_AMENITIES = [
  { icon: Home, title: "Self-Contained Living", desc: "Private living room with sofa seating, dining nook, and independent entry." },
  { icon: Coffee, title: "Kitchenette Provisions", desc: "Refrigerator, microwave, electric kettle, and cookware for self-catering convenience." },
  { icon: Wifi, title: "High-Speed Internet", desc: "Dedicated high-speed Wi-Fi network ideal for remote work, video meetings, and research." },
  { icon: Tv, title: "Entertainment", desc: "Flat-screen Smart TV with satellite entertainment and sports channels." },
  { icon: ShieldCheck, title: "24/7 Gated Security", desc: "Perimeter CCTV cameras, trained security guards at the main gate, and secure compound parking." },
  { icon: Sparkles, title: "Housekeeping & Laundry", desc: "Regular linen changes, towel replenishment, and on-demand personal laundry services." },
];

const TARGET_GUESTS = [
  {
    title: "NGO & Development Teams",
    desc: "Visiting project managers, field evaluators, and aid workers needing a reliable, comfortable base for weeks or months.",
  },
  {
    title: "County Consultants & Contractors",
    desc: "Engineers, auditors, and advisors working on county government and infrastructure projects in West Pokot.",
  },
  {
    title: "Extended Family Stays",
    desc: "Families visiting Kapenguria for weddings, traditional ceremonies, or school events requiring multi-bed flexibility.",
  },
  {
    title: "Holidaymakers & Researchers",
    desc: "Anthropologists, nature enthusiasts, and tourists exploring Cherangani Hills, Saiwa Swamp, and Lake Turkana.",
  },
];

export default function AirbnbServicePage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-72 sm:h-96 bg-brand-maroon-dark">
        <Image
          src={IMAGES.airbnbStay}
          alt="Hotel Kalya AirBnB Serviced Apartments"
          fill
          className="object-cover opacity-50"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark via-brand-maroon-dark/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <span className="text-brand-amber text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Extended Stays & Independence
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            AirBnB & Serviced Stays
          </h1>
          <p className="text-white/80 text-sm mt-2 max-w-xl">
            Fully furnished, self-contained living suites with kitchenettes, private
            lounges, and picturesque mountain vistas in Kapenguria.
          </p>
        </div>
      </section>

      {/* Breadcrumbs Strip */}
      <section className="bg-brand-cream border-b border-brand-amber-light/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Services", href: "/services" },
              { label: "AirBnB Short-Stays" },
            ]}
          />
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
                Home Away from Home
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-maroon-dark leading-tight">
                Privacy, Freedom & Full Hotel Services
              </h2>
              <div className="w-16 h-1 bg-brand-amber rounded-full" />
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                When a standard hotel room is too compact for an extended stay, our AirBnB-style serviced apartments provide the ultimate compromise: the private space, home layout, and cooking freedom of an apartment, backed by the safety, room service, and cleanliness of Hotel Kalya.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Enjoy your own kitchenette, dedicated living and dining area, fast internet connection, and hot-water showers — with access to our restaurant and lush gardens whenever you desire.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/book?service=AirBnB"
                  className="bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow transition-all flex items-center gap-2"
                >
                  <span>Book Serviced Stay</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <a
                  href={`tel:${BRAND.phone}`}
                  className="border border-brand-maroon text-brand-maroon px-5 py-3 rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-brand-amber-light transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> Enquire for Weekly Rates
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-brand-amber-light h-96 sm:h-[440px]">
                <Image
                  src={IMAGES.standardRoom}
                  alt="Serviced Apartment Interior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-brand-amber text-xs uppercase tracking-wider font-bold block">
                    Scenic Hillside Views
                  </span>
                  <p className="font-serif text-lg font-bold mt-1">
                    Relax on your private balcony overlooking the evergreen hills of Kapenguria.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Grid */}
      <section className="py-16 sm:py-20 bg-brand-cream/60 border-t border-brand-amber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
              What&apos;s Included
            </span>
            <h3 className="font-serif text-3xl font-extrabold text-brand-maroon-dark mt-1">
              Apartment Features & Amenities
            </h3>
            <div className="w-16 h-1 bg-brand-amber mx-auto my-3 rounded-full" />
            <p className="text-sm text-gray-600">
              Everything needed to settle in comfortably for a weekend or several months.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {APARTMENT_AMENITIES.map((am) => {
              const Icon = am.icon;
              return (
                <div
                  key={am.title}
                  className="bg-white p-7 rounded-2xl border border-brand-amber-light/80 shadow-md space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-maroon text-brand-amber flex items-center justify-center shadow">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-brand-maroon-dark">
                    {am.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {am.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who Stays With Us */}
      <section className="py-20 bg-white border-t border-brand-amber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
              Tailored For You
            </span>
            <h3 className="font-serif text-3xl font-extrabold text-brand-maroon-dark mt-1">
              Who Chooses Our AirBnB Stays?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TARGET_GUESTS.map((guest) => (
              <div
                key={guest.title}
                className="bg-brand-cream/60 p-6 rounded-2xl border border-brand-amber-light/80 space-y-2"
              >
                <h4 className="font-serif font-bold text-base text-brand-maroon-dark">
                  {guest.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {guest.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/book?service=AirBnB"
              className="bg-brand-amber hover:bg-brand-amber-dark text-brand-maroon-dark px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg transition-all inline-flex items-center gap-2"
            >
              <span>Check AirBnB Availability</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
