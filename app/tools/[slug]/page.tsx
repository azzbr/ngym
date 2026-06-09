import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import ToolPageClient from "@/components/tools/ToolPageClient";
import { CATEGORY_LABELS, getAllToolSlugs, getToolBySlug } from "@/lib/tools";

export async function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://alnakheelpremium.com" },
      { "@type": "ListItem", position: 2, name: "Fitness Tools", item: "https://alnakheelpremium.com/tools" },
      { "@type": "ListItem", position: 3, name: tool.name, item: `https://alnakheelpremium.com/tools/${tool.slug}` },
    ],
  };

  // Split the name so the last word gets the brand-red treatment.
  const words = tool.name.split(" ");
  const redWord = words.length > 1 ? words[words.length - 1] : undefined;
  const title = redWord ? words.slice(0, -1).join(" ") : tool.name;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="bg-[#0D0D0D] pt-36 pb-16">
        <div className="max-w-site mx-auto px-4 md:px-8">
          <SectionHeading
            as="h1"
            eyebrow={CATEGORY_LABELS[tool.category]}
            title={title}
            redWord={redWord}
            subtitle={tool.blurb}
            alignment="center"
          />
        </div>
      </section>
      <section className="bg-[#F5F4F2]">
        <Suspense fallback={null}>
          <ToolPageClient slug={tool.slug} />
        </Suspense>
      </section>
    </>
  );
}
