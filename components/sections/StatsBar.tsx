"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const stats = [
  { value: "8",    numeric: 8,    suffix: "",    label: "Branches Island-Wide",   isNumeric: true  },
  { value: "5AM",  numeric: null, suffix: "",    label: "Opens Early Every Day",  isNumeric: false },
  { value: "60",   numeric: 60,   suffix: " BD", label: "Starting Membership",    isNumeric: true  },
  { value: "#1",   numeric: null, suffix: "",    label: "Premium Gym in Bahrain", isNumeric: false },
];

export default function StatsBar() {
  const sectionRef = useRef<HTMLElement>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Stagger the whole cards up
      gsap.fromTo(
        itemRefs.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Count up numeric values
      stats.forEach((s, i) => {
        if (!s.isNumeric || s.numeric === null) return;
        const el = valueRefs.current[i];
        if (!el) return;

        const counter = { val: 0 };
        gsap.fromTo(
          counter,
          { val: 0 },
          {
            val: s.numeric,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.round(counter.val) + s.suffix;
            },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none reset",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#CC1A1A] py-14">
      <div className="max-w-site mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div
            key={s.label}
            ref={(el) => { itemRefs.current[i] = el; }}
            className="flex flex-col items-center text-center gap-1"
          >
            <span
              ref={(el) => { valueRefs.current[i] = el; }}
              className="font-bebas text-5xl md:text-6xl text-white leading-none"
              style={{ fontFamily: "var(--font-bebas, cursive)" }}
            >
              {s.value}
            </span>
            <span className="font-montserrat font-bold text-[10px] uppercase tracking-[0.2em] text-white/70">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
