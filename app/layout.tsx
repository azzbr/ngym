import type { Metadata } from "next";
import { Montserrat, Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "600", "700", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Al Nakheel Premium",
    default: "Al Nakheel Premium — Bahrain's Leading Premium Gym",
  },
  description:
    "Bahrain's leading premium fitness center. Elite equipment, personal trainers, group classes, and premium facilities across multiple locations. One Fit For All.",
  keywords: [
    "gym bahrain",
    "premium gym bahrain",
    "fitness center bahrain",
    "alnakheel premium",
    "best gym bahrain",
  ],
  openGraph: {
    type: "website",
    locale: "en_BH",
    siteName: "Al Nakheel Premium",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${inter.variable} ${bebasNeue.variable}`}
    >
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
