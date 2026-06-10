"use client";

import Image from "next/image";
import type { GallerySlideProps } from "../contracts";

/**
 * Full-bleed branch photo with a bottom caption gradient.
 * Pure display — the IdleLoop owns positioning, transitions and taps.
 */
export default function GallerySlide({ src, alt }: GallerySlideProps) {
  return (
    <div className="relative h-full w-full">
      <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent pt-32">
        <div className="p-10 md:p-16">
          <p
            className="font-montserrat text-lg font-bold uppercase tracking-[0.35em] text-[#CC1A1A]"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            Al Nakheel Premium
          </p>
          {/* The image alt already announces this text — hide the visual caption from AT. */}
          <p className="mt-3 text-2xl text-white/80" aria-hidden="true">
            {alt}
          </p>
        </div>
      </div>
    </div>
  );
}
