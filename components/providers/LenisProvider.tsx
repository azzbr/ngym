"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

function GSAPLenisBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    gsap.registerPlugin(ScrollTrigger);

    // Keep ScrollTrigger in sync with Lenis scroll position
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    // Drive Lenis from GSAP's single ticker (autoRaf is disabled below so
    // Lenis is advanced exactly ONCE per frame — no double RAF loop).
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf); // critical: prevents the ticker from stacking
    };
  }, [lenis]);

  return null;
}

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
      root
      autoRaf={false}
      options={{ lerp: 0.1, smoothWheel: true }}
    >
      <GSAPLenisBridge />
      {children}
    </ReactLenis>
  );
}
