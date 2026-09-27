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
  Users,
  Bed,
  Bath,
  Clock,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { IMAGES } from "@/lib/constants";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getAirbnbApartments, getHotelSettings } from "@/lib/cms-db";
import { getStandardWhatsAppUrl } from "@/lib/whatsapp";


export const dynamic = "force-dynamic";

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

export default async function AirbnbServicePage() {
  const [apartments, settings] = await Promise.all([
    getAirbnbApartments(true),
    getHotelSettings(),
  ]);

  const cleanPhone = (settings.officialWhatsApp || settings.phone || "254719766649").replace(/\D/g, "");
  const officialPhone = settings.phone || "+254 719 766649";

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
            <Sparkles className="w-4 h-4" /> Extended Stays &amp; Independence
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            AirBnB &amp; Serviced Suites
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
                Privacy, Freedom &amp; Full Hotel Services
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
                  href={`tel:${cleanPhone}`}
                  className="border border-brand-maroon text-brand-maroon px-5 py-3 rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-brand-amber-light transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> Call for Monthly Rates: {officialPhone}
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

      {/* DYNAMIC AIRBNB APARTMENTS SHOWCASE FROM CMS */}
      <section className="py-20 bg-brand-cream/40 border-t border-brand-amber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
              Available Units &amp; Suites
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-maroon-dark mt-1">
              Serviced Apartments Registry
            </h2>
            <div className="w-16 h-1 bg-brand-amber mx-auto my-3 rounded-full" />
            <p className="text-sm text-gray-600">
              Each unit features dedicated living space, complete kitchen amenities, continuous power backup, and 24/7 security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apartments.map((apt) => {
              const aptName = apt.name || "Serviced Apartment";
              const waUrl = getStandardWhatsAppUrl(
                `Hello Hotel Kalya, I would like to enquire about renting the "${aptName}" serviced apartment.`,
                cleanPhone
              );


              return (
                <div
                  key={apt.id}
                  className="bg-white rounded-3xl overflow-hidden border border-brand-amber-light/90 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Image */}
                    <div className="relative h-60 w-full overflow-hidden bg-brand-cream">
                      <Image
                        src={apt.featuredImage || apt.images?.[0] || IMAGES.standardRoom}
                        alt={aptName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                      <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                        <span className="bg-brand-maroon text-brand-amber text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
                          {apt.propertyType || "Apartment Suite"}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="font-serif text-xl font-bold text-white drop-shadow">
                          {aptName}
                        </h3>
                        <p className="text-xs text-white/80 mt-0.5">
                          {apt.location || "Hotel Kalya Compound, Kapenguria"}
                        </p>
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between text-xs text-gray-600 bg-brand-cream/50 p-2.5 rounded-xl border border-brand-amber/20">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-brand-maroon" />
                          <span>{apt.bedrooms} Bed{apt.bedrooms > 1 ? "s" : ""}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-brand-maroon" />
                          <span>{apt.bathrooms} Bath{apt.bathrooms > 1 ? "s" : ""}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-brand-maroon" />
                          <span>Max {typeof apt.capacity === "number" ? apt.capacity : apt.capacity?.maxGuests || 4} Guests</span>
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                        {apt.description}
                      </p>

                      {/* Amenities */}
                      {apt.amenities && apt.amenities.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-bold text-gray-400 block">
                            Key Apartment Amenities:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {apt.amenities.slice(0, 5).map((am, i) => (
                              <span
                                key={i}
                                className="bg-brand-cream text-brand-maroon-dark text-[10px] font-semibold px-2 py-0.5 rounded-md border border-brand-amber/20"
                              >
                                {am}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Check-in Policies */}
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand-amber" />
                          <span>Check-in: {apt.checkInTime || "2:00 PM"}</span>
                        </span>
                        <span>Check-out: {apt.checkOutTime || "10:00 AM"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Pricing */}
                  <div className="p-6 pt-0 border-t border-gray-100 mt-2">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-gray-400 block">Nightly Rate</span>
                        <span className="font-serif text-lg font-bold text-brand-maroon">
                          KES {(apt.pricePerNight || apt.pricing?.perNight || 4500).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-500"> / night</span>
                      </div>
                      {apt.pricing?.perMonth && (
                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase text-gray-400 block">Monthly Rate</span>
                          <span className="text-xs font-bold text-gray-700">
                            KES {apt.pricing.perMonth.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Link
                        href={`/book?service=${encodeURIComponent(aptName)}`}
                        className="flex-1 text-center bg-brand-maroon hover:bg-brand-maroon-dark text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                      >
                        Reserve Suite
                      </Link>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm flex items-center justify-center"
                        title="Enquire on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Amenities Grid */}
      <section className="py-16 sm:py-20 bg-white border-t border-brand-amber-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
              What&apos;s Included
            </span>
            <h3 className="font-serif text-3xl font-extrabold text-brand-maroon-dark mt-1">
              Apartment Features &amp; Amenities
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
                  className="bg-brand-cream/40 p-7 rounded-2xl border border-brand-amber-light/80 shadow-sm space-y-3"
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
    </>
  );
}
