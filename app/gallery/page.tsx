import { Metadata } from "next";
import { getAllBranches } from "@/lib/branches";
import SectionHeading from "@/components/ui/SectionHeading";
import GalleryGrid from "@/components/ui/GalleryGrid";
import BranchGalleryShowcase from "@/components/sections/BranchGalleryShowcase";
import type { GalleryImage } from "@/lib/branches";

// Premium brand & cinematic renders (not tied to a single branch)
const SHOWCASE: GalleryImage[] = [
  { url: "/images/showcase/bb-fresh-sharp-straight-2-2560.webp",        tag: "showcase", alt: "Bahrain Bay branch glowing at night" },
  { url: "/images/showcase/bb-higgsfield-2-goldenhour-notext-2560.webp", tag: "showcase", alt: "Bahrain Bay branch at golden hour" },
  { url: "/images/showcase/bb-higgsfield-3-bluehour-notext-2560.webp",   tag: "showcase", alt: "Bahrain Bay branch at blue hour" },
  { url: "/images/showcase/bb-higgsfield-4-mono-2560.webp",              tag: "showcase", alt: "Bahrain Bay branch in dramatic black and white" },
  { url: "/images/showcase/bb-higgsfield-1-poster-2560.webp",            tag: "showcase", alt: "Al Nakheel Premium Bahrain Bay brand poster" },
  { url: "/images/showcase/bb-magnific-3-camera-2560.webp",              tag: "showcase", alt: "Bahrain Bay branch, alternate angle" },
  { url: "/images/showcase/magnific-1-upscale4x-2560.webp",              tag: "showcase", alt: "Al Liwan entrance illuminated at night" },
  { url: "/images/showcase/magnific-2-relight-2560.webp",                tag: "showcase", alt: "Al Liwan exterior, dramatic relight" },
  { url: "/images/showcase/higgsfield-2-goldenhour-notext-2560.webp",    tag: "showcase", alt: "Al Liwan branch at golden hour" },
  { url: "/images/showcase/higgsfield-1-poster-2560.webp",              tag: "showcase", alt: "Al Nakheel Premium Al Liwan brand poster" },
];

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from Al Nakheel Premium branches across Bahrain.",
};

export default function GalleryPage() {
  const branches = getAllBranches();
  const hasImages = branches.some((b) => b.gallery.length > 0);

  return (
    <div className="bg-[#0D0D0D] min-h-screen">
      {/* Hero */}
      <section className="pt-36 pb-16">
        <div className="max-w-site mx-auto px-4 md:px-8">
          <SectionHeading
            as="h1"
            eyebrow="Gallery"
            title="Inside"
            redWord="Al Nakheel"
            subtitle="A look inside our premium facilities across Bahrain."
            alignment="center"
          />
        </div>
      </section>

      {/* Showcase — premium brand & cinematic renders */}
      <section className="pb-8">
        <div className="max-w-site mx-auto px-4 md:px-8">
          <h2
            className="font-montserrat font-black text-2xl uppercase tracking-wider text-white mb-8 border-l-4 border-[#CC1A1A] pl-4"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            Showcase
            <span className="block font-light text-sm tracking-widest text-white/40 mt-1">
              Premium brand &amp; cinematic shots
            </span>
          </h2>
          <GalleryGrid images={SHOWCASE} branchName="Al Nakheel Premium" />
        </div>
      </section>

      {hasImages ? (
        <>
          {/* Full-width Swiper showcase */}
          <BranchGalleryShowcase branches={branches} />

          {/* Per-branch grids with lightbox */}
          {branches.map((branch) =>
            branch.gallery.length > 0 ? (
              <section key={branch.id} className="py-16">
                <div className="max-w-site mx-auto px-4 md:px-8">
                  <h2
                    className="font-montserrat font-black text-2xl uppercase tracking-wider text-white mb-8 border-l-4 border-[#CC1A1A] pl-4"
                    style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                  >
                    {branch.shortName}
                    <span className="block font-light text-sm tracking-widest text-white/40 mt-1">
                      {branch.locationLabel}
                    </span>
                  </h2>
                  <GalleryGrid images={branch.gallery} branchName={branch.shortName} />
                </div>
              </section>
            ) : null
          )}
        </>
      ) : (
        /* Coming soon state */
        <section className="pb-32 overflow-x-hidden">
          <div className="max-w-site mx-auto px-4 md:px-8 flex flex-col items-center gap-8 text-center">
            <span
              className="font-bebas text-[3.5rem] sm:text-[6rem] md:text-[10rem] text-white/5 leading-none select-none whitespace-nowrap"
              style={{ fontFamily: "var(--font-bebas, cursive)" }}
            >
              COMING SOON
            </span>

            <div className="-mt-16 relative z-10">
              <p className="text-white/40 text-base max-w-md leading-relaxed mb-6">
                Branch photo galleries are being uploaded. In the meantime, follow each branch on Instagram for the latest.
              </p>
              <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
                {branches.map((b) => (
                  <a
                    key={b.id}
                    href={b.contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-montserrat font-bold text-[11px] uppercase tracking-wider text-white border border-white/20 px-4 py-2.5 hover:border-[#CC1A1A] hover:text-[#CC1A1A] transition-colors"
                    style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                  >
                    {b.contact.instagramHandle}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
