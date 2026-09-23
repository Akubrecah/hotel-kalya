import Image from "next/image";
import Link from "next/link";
import { Wifi, Tv, Coffee, Car, Presentation } from "lucide-react";
import { IMAGES } from "@/lib/constants";

const CONFERENCE_FEATURES = [
  {
    icon: Wifi,
    title: "Reliable Connectivity",
    desc: "High-speed wireless internet for virtual conferencing and presentations.",
  },
  {
    icon: Tv,
    title: "Audiovisual Gear",
    desc: "Projectors, screens, wireless microphones, and flip charts provided.",
  },
  {
    icon: Coffee,
    title: "Delegate Catering",
    desc: "Mid-morning teas, assorted snacks, and 3-course buffet lunch packages.",
  },
  {
    icon: Car,
    title: "Ample Secure Parking",
    desc: "Gated, monitored parking area for all attending delegates and convoys.",
  },
];

export function ConferencePreview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image Column */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-brand-amber">
                <Image
                  src={IMAGES.conferenceRoom}
                  alt="Hotel Kalya Conference Facility in Kapenguria"
                  width={700}
                  height={480}
                  className="w-full h-80 sm:h-96 object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -left-4 bg-white border border-brand-amber-light rounded-xl p-4 shadow-xl hidden sm:flex items-center gap-3">
                <Presentation className="w-8 h-8 text-brand-maroon" />
                <div>
                  <h5 className="font-bold text-xs text-brand-maroon-dark">
                    Flexible Hall Layouts
                  </h5>
                  <p className="text-[11px] text-gray-500">
                    Boardroom, U-Shape, Classroom & Theater
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <span className="text-xs font-bold text-brand-maroon uppercase tracking-widest bg-brand-amber-light px-3 py-1 rounded-full">
              Corporate & NGO Hub
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-maroon-dark">
              Modern Conference Facilities & Seminar Rooms
            </h2>

            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Hosting government workshops, NGO training, strategic corporate
              retreats, or organizational seminars in Kapenguria? Hotel Kalya
              provides quiet, high-productivity environments with dedicated
              conference support.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CONFERENCE_FEATURES.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="border border-brand-amber-light rounded-xl p-3.5 bg-brand-amber-light/30"
                  >
                    <h4 className="font-bold text-xs text-brand-maroon-dark flex items-center gap-2 mb-1">
                      <Icon className="w-3.5 h-3.5 text-brand-amber" />
                      {feat.title}
                    </h4>
                    <p className="text-[11px] text-gray-600">{feat.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                href="/book"
                className="bg-brand-maroon hover:bg-brand-maroon-dark text-brand-amber px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow"
              >
                Request Conference Quotation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
