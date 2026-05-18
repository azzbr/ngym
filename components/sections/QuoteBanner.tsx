"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

interface Props {
  light?: boolean;
}

// Each word: text + whether it should be red
const words = [
  { text: "WHAT",     red: false },
  { text: "DOESN'T",  red: false },
  { text: "KILL",     red: false },
  { text: "YOU",      red: true  },
  { text: "MAKES",    red: false },
  { text: "YOU",      red: false },
  { text: "STRONGER", red: true  },
];

export default function QuoteBanner({ light = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const bg = light ? "bg-[#F5F4F2]" : "bg-[#0D0D0D]";
  const baseColor = light ? "#0D0D0D" : "#FFFFFF";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordRefs.current,
        {
          opacity: 0,
          y: 60,
          clipPath: "inset(0 100% 0 0)",
        },
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0% 0 0)",
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={`${bg} py-16 md:py-24 overflow-hidden`} ref={containerRef}>
      <div className="max-w-site mx-auto px-4 md:px-8">
        <p
          className="font-bebas text-6xl sm:text-8xl md:text-[9rem] leading-[1.05] uppercase tracking-wide"
          style={{ fontFamily: "var(--font-bebas, cursive)" }}
        >
          {words.map((w, i) => (
            <span key={i} className="inline-block mr-[0.25em] last:mr-0">
              <span
                ref={(el) => { wordRefs.current[i] = el; }}
                className="inline-block"
                style={{ color: w.red ? "#CC1A1A" : baseColor }}
              >
                {w.text}
              </span>
              {/* Line break after "YOU" (index 3) */}
              {i === 3 && <br />}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
