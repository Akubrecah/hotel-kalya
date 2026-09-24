"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { TopBar } from "./TopBar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppFAB } from "./WhatsAppFAB";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  // Dedicated back-office and operations portals render their own workstation layouts
  const isOperationalPortal =
    pathname.startsWith("/staff") ||
    pathname.startsWith("/admin");

  if (isOperationalPortal) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <TopBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
