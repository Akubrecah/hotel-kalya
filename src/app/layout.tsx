import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { TopBar, Navbar, Footer, WhatsAppFAB } from "@/components/layout";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hotel Kalya — Kapenguria's Premier Hospitality Destination",
    template: "%s | Hotel Kalya Kapenguria",
  },
  description:
    "Hotel Kalya, Kapenguria — Hospitality Redefined. Executive accommodation, fine dining, conference facilities, outside catering, AirBnB stays, and picturesque garden experiences in West Pokot County, Kenya.",
  keywords: [
    "Hotel Kalya",
    "Kapenguria hotel",
    "West Pokot accommodation",
    "Kapenguria conference hall",
    "outside catering Kapenguria",
    "AirBnB Kapenguria",
    "Kalya Gardens",
    "hotel in Kapenguria",
    "West Pokot County hotel",
    "Kenya hotel",
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "Hotel Kalya",
    title: "Hotel Kalya — Kapenguria's Premier Hospitality Destination",
    description:
      "Stay. Dine. Meet. Celebrate. Experience Kalya — Kapenguria's signature hospitality destination in West Pokot County, Kenya.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotel Kalya — Hospitality Redefined",
    description:
      "Executive accommodation, dining, conferences, catering & garden experiences in Kapenguria, West Pokot.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        {/* JSON-LD Structured Data — Hotel schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Hotel",
              name: "Hotel Kalya",
              description:
                "Kapenguria's premier hospitality destination offering executive accommodation, fine dining, conference facilities, outside catering, AirBnB stays, and garden experiences.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Kapenguria",
                addressRegion: "West Pokot County",
                addressCountry: "KE",
              },
              telephone: "+254719766649",
              email: "hotelkalya@gmail.com",
              priceRange: "$$",
              starRating: {
                "@type": "Rating",
                ratingValue: "4",
              },
              amenityFeature: [
                { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi" },
                { "@type": "LocationFeatureSpecification", name: "Restaurant" },
                { "@type": "LocationFeatureSpecification", name: "Conference Rooms" },
                { "@type": "LocationFeatureSpecification", name: "Garden" },
                { "@type": "LocationFeatureSpecification", name: "Parking" },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-brand-cream text-brand-dark font-sans antialiased">
        <TopBar />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFAB />
      </body>
    </html>
  );
}
