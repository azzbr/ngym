import { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen pt-36 pb-24">
      <div className="max-w-site mx-auto px-4 md:px-8 max-w-3xl">
        <h1 className="font-montserrat font-black text-4xl uppercase tracking-wider text-[#0D0D0D] mb-8">
          Terms &amp; Conditions
        </h1>
        <p className="text-[#6B6B6B] text-sm leading-relaxed">
          This page is a placeholder. Terms and conditions will be added before launch.
        </p>
      </div>
    </div>
  );
}
