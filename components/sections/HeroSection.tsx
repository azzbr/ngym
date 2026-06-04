"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import CTAButton from "@/components/ui/CTAButton";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Parallax: bg moves at 40% of scroll speed
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  // Text moves slightly slower than scroll for depth
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0D0D0D]"
    >
      {/* Video background — place /public/videos/hero.mp4 to activate */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <Image
          src="/images/branches/bahrain-bay/optimized/10-extnight-2560.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[28%_center] md:object-center"
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Gradient overlay — lighter in the middle so the building reads, heavier top/bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/60 via-[#0D0D0D]/20 to-[#0D0D0D]/75" />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-site mx-auto px-4 md:px-8 flex flex-col items-center text-center gap-8"
        style={{ y: contentY }}
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Eyebrow */}
        <motion.span
          variants={fadeUp}
          className="font-montserrat font-bold text-xs uppercase tracking-[0.3em] text-[#CC1A1A]"
          style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
        >
          Bahrain&apos;s #1 Premium Fitness Center
        </motion.span>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="font-montserrat font-black text-5xl md:text-7xl lg:text-[7rem] uppercase tracking-[0.06em] leading-none text-white max-w-4xl"
          style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
        >
          One Fit
          <br />
          <span className="text-[#CC1A1A]">For All</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p variants={fadeUp} className="text-white/70 text-lg md:text-xl max-w-xl leading-relaxed">
          All the equipment, trainers, classes, and facilities to help you meet your goals.
          Plus, pretty bangin&apos; views.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
          <CTAButton label="Find Your Branch" href="/branches" variant="primary" />
          <CTAButton label="View Memberships" href="/memberships" variant="secondary" />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="text-[10px] font-montserrat uppercase tracking-[0.25em] text-white/30">
          Scroll
        </span>
        <div className="relative w-px h-10 bg-white/15 overflow-hidden">
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-[#CC1A1A]"
            animate={{ y: ["0%", "200%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
