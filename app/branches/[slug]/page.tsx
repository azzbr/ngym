import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getBranchBySlug, getAllBranchSlugs, getMapEmbedUrl } from "@/lib/branches";
import SectionHeading from "@/components/ui/SectionHeading";
import TimingsTable from "@/components/ui/TimingsTable";
import PricingTable from "@/components/ui/PricingTable";
import AmenitiesList from "@/components/ui/AmenitiesList";
import CTAButton from "@/components/ui/CTAButton";
import { MapPin, Phone, AtSign, Clock, CreditCard } from "lucide-react";

export async function generateStaticParams() {
  return getAllBranchSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const branch = getBranchBySlug(slug);
  if (!branch) return {};
  const minPrice = branch.memberships.length
    ? `Memberships from BD ${Math.min(...branch.memberships.map((m) => m.priceFrom))}.`
    : "";
  return {
    title: branch.shortName,
    description: `${branch.name} — ${branch.tagline}. ${minPrice} ${branch.locationLabel}, Bahrain.`,
  };
}

export default async function BranchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const branch = getBranchBySlug(slug);
  if (!branch) notFound();

  const hasPrice = branch.memberships.length > 0;
  const minPrice = hasPrice ? Math.min(...branch.memberships.map((m) => m.priceFrom)) : null;
  const isLadies = branch.type === "ladies";
  const mapSrc = getMapEmbedUrl(branch);

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HealthClub",
            name: branch.name,
            url: `https://alnakheelpremium.com/branches/${branch.slug}`,
            telephone: branch.contact.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: branch.contact.address,
              addressCountry: "BH",
            },
            ...(minPrice ? { priceRange: `BHD ${minPrice}+` } : {}),
          }),
        }}
      />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end bg-[#0D0D0D] overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={branch.heroImage ? { backgroundImage: `url('${branch.heroImage}')` } : {}}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/60 to-transparent" />

        <div className="relative z-10 max-w-site mx-auto px-4 md:px-8 pb-16 w-full">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="font-montserrat font-bold text-xs uppercase tracking-[0.25em] text-[#CC1A1A]"
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              Al Nakheel Premium
            </span>
            {/* Mixed / Ladies badge */}
            <span
              className={`font-montserrat font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 ${
                isLadies
                  ? "bg-[#CC1A1A]/20 text-[#CC1A1A] border border-[#CC1A1A]/40"
                  : "bg-white/10 text-white/70 border border-white/20"
              }`}
            >
              {isLadies ? "Ladies" : "Mixed"}
            </span>
          </div>
          <h1
            className="font-montserrat font-black text-5xl md:text-7xl uppercase tracking-[0.05em] text-white leading-none mb-4"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            {branch.shortName}
          </h1>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <MapPin size={14} className="text-[#CC1A1A]" />
            <span>{branch.locationLabel}</span>
          </div>
        </div>
      </section>

      {/* Quick info bar */}
      <section className="bg-[#CC1A1A] py-5">
        <div className="max-w-site mx-auto px-4 md:px-8 flex flex-wrap gap-6 items-center justify-between">
          <p className="font-montserrat font-bold text-white text-sm uppercase tracking-wider">
            {branch.tagline}
          </p>
          <div className="flex gap-4 flex-wrap">
            <a
              href={`tel:${branch.contact.phone}`}
              className="flex items-center gap-2 text-white text-sm font-semibold hover:text-white/80 transition-colors"
            >
              <Phone size={14} /> {branch.contact.phone}
            </a>
            <a
              href={branch.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white text-sm font-semibold hover:text-white/80 transition-colors"
            >
              <AtSign size={14} /> {branch.contact.instagramHandle}
            </a>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="bg-white py-20">
        <div className="max-w-site mx-auto px-4 md:px-8">
          <SectionHeading eyebrow="Facilities" title="What's" redWord="Inside" light />
          <div className="mt-10">
            <AmenitiesList amenities={branch.amenities} light />
          </div>
        </div>
      </section>

      {/* Timings */}
      <section className="bg-[#F5F4F2] py-20">
        <div className="max-w-site mx-auto px-4 md:px-8">
          <SectionHeading eyebrow="Hours" title="Opening" redWord="Times" light />
          <div className="mt-10 max-w-lg">
            {branch.timings.length > 0 ? (
              <TimingsTable timings={branch.timings} light />
            ) : (
              <div className="flex items-start gap-4 bg-white border-l-4 border-[#CC1A1A] p-6">
                <Clock size={20} className="text-[#CC1A1A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-montserrat font-bold text-sm uppercase tracking-wider text-[#0D0D0D] mb-1">
                    Open During Regular Working Hours
                  </p>
                  <p className="text-[#6B6B6B] text-sm">
                    Call <a href={`tel:${branch.contact.phone}`} className="text-[#CC1A1A] font-semibold">{branch.contact.phone}</a> or
                    DM <a href={branch.contact.instagram} target="_blank" rel="noopener noreferrer" className="text-[#CC1A1A] font-semibold">{branch.contact.instagramHandle}</a> to confirm current hours.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-20">
        <div className="max-w-site mx-auto px-4 md:px-8">
          {hasPrice ? (
            <>
              <SectionHeading
                eyebrow="Memberships"
                title="Join"
                redWord={branch.shortName}
                subtitle={`Starting from BD ${minPrice} per month. Flexible plans available.`}
                light
              />
              <div className="mt-10">
                <PricingTable memberships={branch.memberships} light />
              </div>
            </>
          ) : (
            <>
              <SectionHeading
                eyebrow="Memberships"
                title="Join"
                redWord={branch.shortName}
                light
              />
              <div className="mt-10 flex items-start gap-4 bg-[#F5F4F2] border-l-4 border-[#CC1A1A] p-6 max-w-lg">
                <CreditCard size={20} className="text-[#CC1A1A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-montserrat font-bold text-sm uppercase tracking-wider text-[#0D0D0D] mb-1">
                    Membership Rates Available on Request
                  </p>
                  <p className="text-[#6B6B6B] text-sm mb-4">
                    Contact this branch directly for the latest membership pricing and current promotions.
                  </p>
                  <CTAButton label="Get in Touch" href="/contact" variant="primary" />
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Map — always shows, keyless embed from address */}
      <section className="h-96">
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`${branch.name} location map`}
        />
      </section>

      {/* CTA */}
      <section className="bg-[#0D0D0D] py-24">
        <div className="max-w-site mx-auto px-4 md:px-8 flex flex-col items-center text-center gap-6">
          <h2
            className="font-montserrat font-black text-4xl md:text-6xl uppercase tracking-[0.05em] text-white"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            Ready to <span className="text-[#CC1A1A]">Start?</span>
          </h2>
          <p className="text-white/60 max-w-md">
            Contact {branch.shortName} directly or reach out online. We&apos;ll get you started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <CTAButton label="Contact Us" href="/contact" variant="primary" />
            <CTAButton label="All Branches" href="/branches" variant="secondary" />
          </div>
        </div>
      </section>
    </>
  );
}
