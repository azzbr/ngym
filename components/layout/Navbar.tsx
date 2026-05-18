"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "Branches", href: "/branches" },
  { label: "Memberships", href: "/memberships" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#0D0D0D] shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-site mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <span
              className="font-montserrat font-black text-white uppercase tracking-[0.15em] text-lg leading-none"
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              ALNAKHEEL
              <span className="block font-light text-xs tracking-[0.35em] mt-0.5">
                PREMIUM
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-inter text-xs font-semibold uppercase tracking-[0.1em] text-white/80 hover:text-white transition-colors relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#CC1A1A] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/memberships"
              className="bg-[#CC1A1A] hover:bg-[#AA1414] text-white font-montserrat font-bold text-xs uppercase tracking-[0.1em] px-6 py-3 transition-colors duration-200"
            >
              Join Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] bg-[#0D0D0D] flex flex-col p-8">
          <div className="flex justify-between items-center mb-16">
            <span
              className="font-montserrat font-black text-white uppercase tracking-[0.15em] text-lg"
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              ALNAKHEEL
              <span className="block font-light text-xs tracking-[0.35em] mt-0.5">
                PREMIUM
              </span>
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-white p-2"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
          </div>

          <nav className="flex flex-col gap-6 flex-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-5xl font-bebas text-white tracking-wider hover:text-[#CC1A1A] transition-colors"
                style={{ fontFamily: "var(--font-bebas, cursive)" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/memberships"
            onClick={() => setOpen(false)}
            className="bg-[#CC1A1A] hover:bg-[#AA1414] text-white font-montserrat font-bold text-sm uppercase tracking-[0.1em] px-8 py-4 text-center transition-colors"
          >
            Join Now
          </Link>
        </div>
      )}
    </>
  );
}
