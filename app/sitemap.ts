import { MetadataRoute } from "next";
import { getAllBranchSlugs } from "@/lib/branches";
import { getAllToolSlugs } from "@/lib/tools";

const base = "https://alnakheelpremium.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const branchUrls = getAllBranchSlugs().map((slug) => ({
    url: `${base}/branches/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const toolUrls = getAllToolSlugs().map((slug) => ({
    url: `${base}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/branches`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...branchUrls,
    { url: `${base}/memberships`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools/progress`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ...toolUrls,
    { url: `${base}/gallery`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
