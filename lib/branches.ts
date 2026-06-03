import alLiwan from "@/data/branches/al-liwan.json";
import alLiwanLadies from "@/data/branches/al-liwan-ladies.json";
import bahrainBay from "@/data/branches/bahrain-bay.json";
import samaBay from "@/data/branches/sama-bay.json";
import riffaLadies from "@/data/branches/riffa-ladies.json";
import budaiya from "@/data/branches/budaiya.json";
import budaiyaLadies from "@/data/branches/budaiya-ladies.json";
import muharraqLadies from "@/data/branches/muharraq-ladies.json";

export type TimingDay = {
  day: string;
  open: string;
  close: string;
};

export type TimingSection = {
  section: string;
  label: string;
  days: TimingDay[];
};

export type Membership = {
  tier: string;
  priceFrom: number;
  currency: string;
  duration: string;
  highlighted: boolean;
  note?: string;
};

export type Amenity = {
  icon: string;
  label: string;
};

export type GalleryImage = {
  url: string;
  tag: string;
  alt: string;
};

export type Branch = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  type: "mixed" | "ladies";
  locationLabel: string;
  tagline: string;
  heroImage: string;
  mapQuery: string;
  pendingData: boolean;
  contact: {
    phone: string;
    whatsapp: string;
    instagram: string;
    instagramHandle: string;
    address: string;
  };
  googleMapsEmbedUrl: string;
  timings: TimingSection[];
  memberships: Membership[];
  amenities: Amenity[];
  gallery: GalleryImage[];
  isNew: boolean;
  comingSoon: boolean;
};

const branches: Branch[] = [
  alLiwan as Branch,
  alLiwanLadies as Branch,
  bahrainBay as Branch,
  samaBay as Branch,
  riffaLadies as Branch,
  budaiya as Branch,
  budaiyaLadies as Branch,
  muharraqLadies as Branch,
];

export function getAllBranches(): Branch[] {
  return branches;
}

export function getBranchBySlug(slug: string): Branch | undefined {
  return branches.find((b) => b.slug === slug);
}

export function getAllBranchSlugs(): string[] {
  return branches.map((b) => b.slug);
}

export function getBranchesByType(type: "mixed" | "ladies"): Branch[] {
  return branches.filter((b) => b.type === type);
}

export function getMapEmbedUrl(branch: Branch): string {
  if (branch.googleMapsEmbedUrl) return branch.googleMapsEmbedUrl;
  const query = branch.mapQuery || branch.contact.address;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}
