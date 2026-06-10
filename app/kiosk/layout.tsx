import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Kiosk",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, statusBarStyle: "black", title: "Al Nakheel Kiosk" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0D0D0D",
};

/**
 * Kiosk routes run chrome-less (SiteChrome skips /kiosk*) on in-gym screens.
 * No ToolsProvider here on purpose — a kiosk is a shared device and must
 * never read/write the member tools document.
 */
export default function KioskLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="kiosk-root fixed inset-0 overflow-hidden bg-[#0D0D0D] text-white select-none overscroll-none touch-manipulation">
      {children}
    </div>
  );
}
