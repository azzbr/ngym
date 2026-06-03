import { Metadata } from "next";
import MembershipsClient from "@/components/sections/MembershipsClient";

export const metadata: Metadata = {
  title: "Memberships & Pricing",
  description:
    "Al Nakheel Premium membership plans across all Bahrain branches. Monthly, quarterly, 6-month, annual and couples options. From BD 60/month.",
};

export default function MembershipsPage() {
  return <MembershipsClient />;
}
