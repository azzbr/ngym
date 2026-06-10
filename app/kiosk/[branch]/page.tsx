import { Metadata } from "next";
import { notFound } from "next/navigation";
import KioskShell from "@/components/kiosk/KioskShell";
import { getAllBranchSlugs, getBranchBySlug } from "@/lib/branches";

export async function generateStaticParams() {
  return getAllBranchSlugs().map((branch) => ({ branch }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ branch: string }>;
}): Promise<Metadata> {
  const { branch } = await params;
  const b = getBranchBySlug(branch);
  return { title: b ? `Kiosk — ${b.shortName}` : "Kiosk" };
}

export default async function KioskBranchPage({
  params,
}: {
  params: Promise<{ branch: string }>;
}) {
  const { branch } = await params;
  const b = getBranchBySlug(branch);
  if (!b) notFound();
  return <KioskShell branch={b} />;
}
