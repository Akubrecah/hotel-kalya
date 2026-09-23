import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Direct Bookings & Reservations — Rooms, Conferences & Events",
  description:
    "Make direct online booking enquiries for rooms, suites, conference spaces, outside catering, and garden functions at Hotel Kalya, Kapenguria.",
  openGraph: {
    title: "Book Your Stay or Event | Hotel Kalya Kapenguria",
    description:
      "Direct reservations and booking enquiries for Hotel Kalya in Kapenguria, West Pokot County. Instant WhatsApp assistance.",
  },
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
