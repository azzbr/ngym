"use client";

import { useMemo } from "react";
import { generate } from "lean-qr";
import { toSvgDataURL } from "lean-qr/extras/svg";
import type { QrCodeProps } from "./contracts";

/**
 * Thin wrapper around lean-qr. Renders the code as an <img> backed by an
 * SVG data URL — crisp at any size, scales with the supplied className.
 * Black modules on white; the parent supplies the surrounding white panel.
 */
export default function QrCode({ value, className }: QrCodeProps) {
  const src = useMemo(() => {
    try {
      return toSvgDataURL(generate(value), {
        on: "#0D0D0D",
        off: "#FFFFFF",
        pad: 2,
      });
    } catch {
      return null;
    }
  }, [value]);

  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- inline SVG data URL; next/image adds nothing here
    <img
      src={src}
      alt=""
      role="img"
      aria-label={`QR code linking to ${value}`}
      className={className}
      draggable={false}
    />
  );
}
