import { MetadataRoute } from "next";
import { getAllBranchSlugs } from "@/lib/branches";

const base = "https://alnakheelpremium.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const branchUrls = getAllBranchSlugs().map((slug) => ({
    url: `${base}/branches/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/branches`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...branchUrls,
    { url: `${base}/memberships`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/gallery`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
