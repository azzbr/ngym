import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms governing your use of the Al Nakheel Premium website.",
};

const sections = [
  {
    h: "1. Acceptance of Terms",
    p: [
      "By accessing and using the Al Nakheel Premium website, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use this website.",
    ],
  },
  {
    h: "2. Use of the Website",
    p: [
      "This website is provided for general informational purposes about our fitness facilities in the Kingdom of Bahrain. You agree to use it only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the site.",
    ],
  },
  {
    h: "3. Memberships & Pricing",
    p: [
      "Membership prices, packages, and operating hours shown on this website are for general guidance only and may change without notice. They do not constitute a binding offer. Please confirm current pricing, availability, and terms directly with the relevant branch before purchasing a membership.",
    ],
  },
  {
    h: "4. Intellectual Property",
    p: [
      "All content on this website — including the Al Nakheel Premium name, logo, text, graphics, and images — is the property of Al Nakheel Premium or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or use any content without our prior written permission.",
    ],
  },
  {
    h: "5. User Conduct",
    p: [
      "When submitting an enquiry or any information through this website, you agree to provide accurate information and not to submit unlawful, misleading, or harmful content.",
    ],
  },
  {
    h: "6. Third-Party Links & Services",
    p: [
      "This website may contain links to third-party services such as Instagram, WhatsApp, and Google Maps. We are not responsible for the content, policies, or practices of these third parties.",
    ],
  },
  {
    h: "7. Disclaimer",
    p: [
      "This website is provided on an \"as is\" and \"as available\" basis. While we strive to keep information accurate and up to date, we make no warranties regarding the completeness, accuracy, or reliability of any content, including branch hours, pricing, and availability.",
    ],
  },
  {
    h: "8. Limitation of Liability",
    p: [
      "To the fullest extent permitted by law, Al Nakheel Premium shall not be liable for any direct, indirect, or consequential loss arising from your use of, or inability to use, this website.",
    ],
  },
  {
    h: "9. Governing Law",
    p: [
      "These Terms & Conditions are governed by and construed in accordance with the laws of the Kingdom of Bahrain, and any disputes shall be subject to the exclusive jurisdiction of the courts of Bahrain.",
    ],
  },
  {
    h: "10. Changes to These Terms",
    p: [
      "We may revise these Terms & Conditions at any time. Changes will be posted on this page with an updated revision date, and your continued use of the website constitutes acceptance of the revised terms.",
    ],
  },
  {
    h: "11. Contact",
    p: [
      "For questions about these Terms & Conditions, contact us at +973 3883 3663 or via the contact form on this website. [Add official contact email and registered company details here.]",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen pt-36 pb-24">
      <div className="max-w-site mx-auto px-4 md:px-8 max-w-3xl">
        <span className="font-montserrat font-bold text-xs uppercase tracking-[0.2em] text-[#CC1A1A]">
          Legal
        </span>
        <h1
          className="font-montserrat font-black text-4xl md:text-5xl uppercase tracking-[0.03em] text-[#0D0D0D] mt-3 mb-2"
          style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
        >
          Terms &amp; Conditions
        </h1>
        <p className="text-[#6B6B6B] text-sm mb-12">Last updated: June 2026</p>

        <div className="flex flex-col gap-10">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-montserrat font-bold text-lg uppercase tracking-wider text-[#0D0D0D] mb-3">
                {s.h}
              </h2>
              <div className="flex flex-col gap-3">
                {s.p.map((para, i) => (
                  <p key={i} className="text-[#4A4A4A] text-sm leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-14 text-[#6B6B6B] text-xs leading-relaxed border-t border-[#E5E5E5] pt-6">
          This document is a general template provided for convenience and does not constitute
          legal advice. Please have it reviewed by a qualified legal professional and complete the
          bracketed details before publishing.
        </p>
      </div>
    </div>
  );
}
