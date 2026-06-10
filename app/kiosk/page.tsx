import { Metadata } from "next";
import KioskSetup from "@/components/kiosk/KioskSetup";
import { getAllBranches } from "@/lib/branches";

export const metadata: Metadata = {
  title: "Kiosk Setup",
};

export default function KioskSetupPage() {
  const branches = getAllBranches().map((b) => ({
    slug: b.slug,
    shortName: b.shortName,
    type: b.type,
  }));
  return <KioskSetup branches={branches} />;
}
