import Link from "next/link";
import { Phone, AtSign } from "lucide-react";
import { getAllBranches } from "@/lib/branches";

const navLinks = [
  { label: "About Us", href: "/about" },
  { label: "Memberships", href: "/memberships" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const branches = getAllBranches();

  return (
    <footer className="bg-[#0D0D0D] border-t border-white/10">
      <div className="max-w-site mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <span
            className="font-montserrat font-black text-white uppercase tracking-[0.15em] text-lg leading-none block mb-4"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            ALNAKHEEL
            <span className="block font-light text-xs tracking-[0.35em] mt-1">
              PREMIUM
            </span>
          </span>
          <p className="text-white/50 text-sm leading-relaxed">
            Bahrain&apos;s leading premium fitness center. One Fit For All.
          </p>
          <div className="mt-6 flex gap-4">
            <a
              href="tel:+97338833663"
              className="text-white/60 hover:text-[#CC1A1A] transition-colors"
              aria-label="Call us"
            >
              <Phone size={18} />
            </a>
            <a
              href="https://instagram.com/alnakheelpremium"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-[#CC1A1A] transition-colors"
              aria-label="Instagram"
            >
              <AtSign size={18} />
            </a>
          </div>
        </div>

        {/* Branches — split into Mixed and Ladies columns on large screens */}
        <div className="md:col-span-2 grid grid-cols-2 gap-8">
          <div>
            <h4 className="font-montserrat font-bold text-xs uppercase tracking-[0.15em] text-white mb-4">
              Mixed Branches
            </h4>
            <ul className="flex flex-col gap-2.5">
              {branches
                .filter((b) => b.type === "mixed")
                .map((b) => (
                  <li key={b.slug}>
                    <Link
                      href={`/branches/${b.slug}`}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {b.shortName}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="font-montserrat font-bold text-xs uppercase tracking-[0.15em] text-white mb-4">
              Ladies Branches
            </h4>
            <ul className="flex flex-col gap-2.5">
              {branches
                .filter((b) => b.type === "ladies")
                .map((b) => (
                  <li key={b.slug}>
                    <Link
                      href={`/branches/${b.slug}`}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {b.shortName}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Right column: quick links + contact */}
        <div className="flex flex-col gap-8">
          <div>
            <h4 className="font-montserrat font-bold text-xs uppercase tracking-[0.15em] text-white mb-4">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-montserrat font-bold text-xs uppercase tracking-[0.15em] text-white mb-4">
              Contact
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-white/60">
              <li>
                <a href="tel:+97338833663" className="hover:text-white transition-colors">
                  +973 3883 3663
                </a>
              </li>
              <li>
                <a href="tel:+97338833990" className="hover:text-white transition-colors">
                  +973 3883 3990
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="max-w-site mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-white/30">
          <span>© {new Date().getFullYear()} Al Nakheel Premium. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
