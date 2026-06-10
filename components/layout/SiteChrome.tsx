"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import LenisProvider from "@/components/providers/LenisProvider";
import CustomCursor from "@/components/ui/CustomCursor";

/**
 * Gates the global site chrome. Kiosk routes (/kiosk*) render bare —
 * no navbar/footer/cursor/smooth-scroll/WhatsApp button — because they run
 * fullscreen on in-gym machine screens.
 *
 * NOTE: when ROADMAP P2 introduces the /admin route group, fold this into a
 * proper (site)/(kiosk) route-group split.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isKiosk = pathname === "/kiosk" || pathname.startsWith("/kiosk/");

  if (isKiosk) {
    return <main>{children}</main>;
  }

  return (
    <LenisProvider>
      <CustomCursor />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </LenisProvider>
  );
}
