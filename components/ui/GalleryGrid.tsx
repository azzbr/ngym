"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import { motion, type Variants } from "framer-motion";
import type { GalleryImage } from "@/lib/branches";

interface Props {
  images: GalleryImage[];
  branchName?: string;
}

const FILTERS = ["All", "interior", "equipment", "classes"];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function GalleryGrid({ images, branchName }: Props) {
  const [filter, setFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const filtered =
    filter === "All" ? images : images.filter((img) => img.tag === filter);

  const slides = filtered.map((img) => ({
    src: img.url,
    title: branchName,
    description: img.alt,
  }));

  const availableTags = ["All", ...Array.from(new Set(images.map((i) => i.tag)))];
  const filtersToShow = FILTERS.filter((f) => availableTags.includes(f));

  return (
    <>
      {/* Filter tabs */}
      {filtersToShow.length > 1 && (
        <div className="flex gap-2 flex-wrap mb-8">
          {filtersToShow.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-montserrat font-bold text-xs uppercase tracking-wider px-5 py-2 transition-colors ${
                filter === f
                  ? "bg-[#CC1A1A] text-white"
                  : "bg-white/10 text-white/60 hover:bg-[#CC1A1A] hover:text-white"
              }`}
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <motion.div
        key={filter}
        className="grid grid-cols-2 md:grid-cols-3 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {filtered.map((img, i) => (
          <motion.button
            key={img.url}
            variants={itemVariants}
            onClick={() => setLightboxIndex(i)}
            className="group aspect-[4/3] overflow-hidden bg-[#2A2A2A] block relative w-full"
            aria-label={`Open ${img.alt}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#0D0D0D]/0 group-hover:bg-[#0D0D0D]/40 transition-all duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-montserrat font-bold uppercase tracking-wider">
                View
              </span>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Zoom, Captions]}
        styles={{
          container: { backgroundColor: "rgba(13,13,13,0.97)" },
        }}
      />
    </>
  );
}
