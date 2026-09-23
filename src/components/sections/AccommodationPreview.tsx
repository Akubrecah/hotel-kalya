import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { BRAND, ACCOMMODATION_ROOMS } from "@/lib/constants";

export function AccommodationPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest">
              Rest & Rejuvenate
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-maroon-dark mt-1">
              Accommodation & Short-Stays
            </h2>
            <p className="text-gray-600 text-sm mt-1 max-w-xl">
              Peaceful, sanitized rooms with comfortable bedding, hot showers,
              private balconies, and seamless guest assistance.
            </p>
          </div>
          <a
            href={`tel:${BRAND.phone}`}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-maroon bg-brand-amber-light/50 border border-brand-amber-light px-4 py-2.5 rounded-lg hover:bg-brand-amber-light transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-brand-amber" />
            Call Desk: {BRAND.phone}
          </a>
        </div>

        {/* Room Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ACCOMMODATION_ROOMS.map((room) => (
            <div
              key={room.id}
              className="bg-brand-cream rounded-2xl overflow-hidden border border-brand-amber-light/90 shadow-sm hover:shadow-lg transition-all flex flex-col"
            >
              <div className="relative h-56">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-3 left-3 bg-brand-maroon-dark text-brand-amber px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow">
                  {room.tag}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{room.type}</span>
                    <span>{room.capacity}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-brand-maroon-dark mb-2">
                    {room.name}
                  </h3>

                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                    {room.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {room.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-white border border-brand-amber-light text-gray-700 px-2.5 py-1 rounded-md"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-amber-light/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">
                      Inquire For Rates
                    </span>
                    <span className="text-xs font-bold text-brand-maroon-dark">
                      Special Daily / Weekly Rates
                    </span>
                  </div>
                  <Link
                    href="/book"
                    className="bg-brand-maroon hover:bg-brand-maroon-dark text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Book Room
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AirBnB Feature Banner */}
        <div className="mt-12 bg-gradient-to-r from-brand-maroon-dark to-brand-maroon text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-brand-amber">
          <div className="space-y-2">
            <span className="bg-brand-amber text-brand-maroon-dark text-[10px] font-extrabold uppercase px-2.5 py-1 rounded">
              Flexible Long & Short Stays
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">
              Looking for an AirBnB Experience in Kapenguria?
            </h3>
            <p className="text-brand-amber-light text-xs sm:text-sm max-w-xl">
              Stay comfortably with full privacy, furnished living quarters,
              kitchenette options, and complete hotel security for business trips,
              NGO projects, or peaceful getaways.
            </p>
          </div>
          <Link
            href="/book"
            className="bg-brand-amber hover:bg-brand-amber-dark text-brand-maroon-dark px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider shadow whitespace-nowrap"
          >
            Enquire AirBnB Availability
          </Link>
        </div>
      </div>
    </section>
  );
}
