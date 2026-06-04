"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import type { Branch } from "@/lib/branches";

// Swiper CSS
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Props {
  branches: Branch[];
}

export default function BranchGalleryShowcase({ branches }: Props) {
  // Flatten all gallery images with branch context
  const allImages = branches.flatMap((b) =>
    b.gallery.map((img) => ({ ...img, branchName: b.shortName }))
  );

  if (allImages.length === 0) return null;

  return (
    <div className="w-full h-[60vh] relative mb-8">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        navigation
        pagination={{ clickable: true }}
        className="w-full h-full"
      >
        {allImages.map((img, i) => (
          <SwiperSlide key={i} className="relative overflow-hidden">
            {/* Blurred backdrop — fills the wide band so the photo is never cropped */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl"
            />
            <div className="absolute inset-0 bg-[#0D0D0D]/30" />
            {/* Full photo, centered, never cropped */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.alt}
              className="relative w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/70 to-transparent" />
            <div className="absolute bottom-10 left-8">
              <span
                className="font-montserrat font-bold text-xs uppercase tracking-[0.2em] text-[#CC1A1A] block mb-1"
                style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
              >
                {img.branchName}
              </span>
              <p className="text-white text-lg font-semibold">{img.alt}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
