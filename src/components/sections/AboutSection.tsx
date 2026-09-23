import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { IMAGES } from "@/lib/constants";

export function AboutSection() {
  return (
    <section className="py-20 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-brand-amber-light">
              <Image
                src={IMAGES.buildingFacade}
                alt="Hotel Kalya Kapenguria Exterior Facade"
                width={600}
                height={420}
                className="w-full h-[420px] object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-brand-maroon-dark text-white p-5 rounded-xl border-2 border-brand-amber shadow-2xl max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-amber text-brand-maroon-dark flex items-center justify-center font-bold font-serif text-lg">
                  HK
                </div>
                <div>
                  <h4 className="font-bold text-sm text-brand-amber-light">
                    Kapenguria Landmark
                  </h4>
                  <p className="text-xs text-white/80">
                    West Pokot County&apos;s premier hospitality & events address.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-brand-maroon font-bold text-xs tracking-widest uppercase">
              <span className="gold-line" />
              About Hotel Kalya
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-maroon-dark leading-snug">
              Where Warm Pokot Hospitality Meets Modern Elegance
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Situated in the serene county capital of{" "}
              <strong>Kapenguria, West Pokot</strong>, Hotel Kalya offers a
              tranquil oasis for travelers, business professionals,
              non-governmental delegations, and families alike.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Whether you need a restful night&apos;s sleep after exploring the
              scenic Cherangani Hills, a modern conference hall with uninterrupted
              services, exquisite outside catering for a high-profile banquet, or
              a picturesque garden celebration, Kalya is crafted to redefine your
              expectations.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="border border-brand-amber-light/90 rounded-lg p-3.5 bg-white text-center">
                <span className="block font-serif text-2xl font-bold text-brand-maroon">
                  100%
                </span>
                <span className="text-xs text-gray-600 font-medium">
                  Guest Satisfaction
                </span>
              </div>
              <div className="border border-brand-amber-light/90 rounded-lg p-3.5 bg-white text-center">
                <span className="block font-serif text-2xl font-bold text-brand-maroon">
                  7+
                </span>
                <span className="text-xs text-gray-600 font-medium">
                  Integrated Services
                </span>
              </div>
              <div className="border border-brand-amber-light/90 rounded-lg p-3.5 bg-white text-center col-span-2 sm:col-span-1">
                <span className="block font-serif text-2xl font-bold text-brand-maroon">
                  24/7
                </span>
                <span className="text-xs text-gray-600 font-medium">
                  Warm Reception
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-brand-maroon font-bold text-sm group hover:text-brand-amber-dark transition-colors"
              >
                <span>Connect with our reception desk</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
