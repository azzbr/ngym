import alLiwan from "@/data/branches/al-liwan.json";
import bahrainBay from "@/data/branches/bahrain-bay.json";

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
  locationLabel: string;
  tagline: string;
  heroImage: string;
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

const branches: Branch[] = [alLiwan as Branch, bahrainBay as Branch];

export function getAllBranches(): Branch[] {
  return branches;
}

export function getBranchBySlug(slug: string): Branch | undefined {
  return branches.find((b) => b.slug === slug);
}

export function getAllBranchSlugs(): string[] {
  return branches.map((b) => b.slug);
}
