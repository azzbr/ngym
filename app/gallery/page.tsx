import { Metadata } from "next";
import { getAllBranches } from "@/lib/branches";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from Al Nakheel Premium branches across Bahrain.",
};

export default function GalleryPage() {
  const branches = getAllBranches();
  const hasImages = branches.some((b) => b.gallery.length > 0);

  return (
    <div className="bg-[#0D0D0D] min-h-screen pt-36 pb-24">
      <div className="max-w-site mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="Gallery"
          title="Inside"
          redWord="Al Nakheel"
          subtitle="A look inside our premium facilities across Bahrain."
          alignment="center"
        />

        {hasImages ? (
          branches.map((branch) =>
            branch.gallery.length > 0 ? (
              <div key={branch.id} className="mt-16">
                <h2
                  className="font-montserrat font-black text-2xl uppercase tracking-wider text-white mb-6"
                  style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                >
                  {branch.shortName}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {branch.gallery.map((img) => (
                    <div key={img.url} className="aspect-[4/3] overflow-hidden bg-[#2A2A2A]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )
        ) : (
          <div className="mt-24 flex flex-col items-center gap-6 text-center">
            <span
              className="font-bebas text-[8rem] text-white/10 leading-none"
              style={{ fontFamily: "var(--font-bebas, cursive)" }}
            >
              COMING SOON
            </span>
            <p className="text-white/40 text-sm max-w-md">
              Branch photo galleries are being uploaded. Check back soon or follow us on Instagram for the latest shots.
            </p>
            <a
              href="https://instagram.com/alnakheelpremium"
              target="_blank"
              rel="noopener noreferrer"
              className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#CC1A1A] hover:underline"
            >
              Follow @alnakheelpremium
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
