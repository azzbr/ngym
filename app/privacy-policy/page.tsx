import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Al Nakheel Premium collects, uses, and protects your personal information.",
};

const sections = [
  {
    h: "1. Introduction",
    p: [
      "Al Nakheel Premium (\"we\", \"us\", \"our\") operates this website to provide information about our fitness facilities across the Kingdom of Bahrain. This Privacy Policy explains what information we collect when you use our website, how we use it, and the choices you have.",
      "By using this website, you agree to the collection and use of information in accordance with this policy.",
    ],
  },
  {
    h: "2. Information We Collect",
    p: [
      "Information you provide: when you submit an enquiry or contact form, we may collect your name, phone number, email address, the branch you are interested in, and the contents of your message.",
      "Information collected automatically: like most websites, we may automatically collect technical data such as your IP address, browser type, device information, pages visited, and the date and time of your visit, through cookies and similar technologies.",
    ],
  },
  {
    h: "3. How We Use Your Information",
    p: [
      "We use the information we collect to respond to your enquiries, provide information about memberships and branches, improve our website and services, and understand how visitors use our site.",
      "We do not sell your personal information to third parties.",
    ],
  },
  {
    h: "4. Cookies & Analytics",
    p: [
      "We may use cookies and analytics tools (such as Google Analytics and our hosting provider's analytics) to understand site usage and improve performance. You can disable cookies in your browser settings, though some features of the site may not function as intended.",
    ],
  },
  {
    h: "5. Sharing Your Information",
    p: [
      "We may share information with trusted service providers who help us operate the website (such as hosting and analytics providers), strictly to the extent necessary to provide those services. We may also disclose information where required by law.",
    ],
  },
  {
    h: "6. Data Retention",
    p: [
      "We retain enquiry information only for as long as necessary to respond to and follow up on your request, or as required by applicable law.",
    ],
  },
  {
    h: "7. Data Security",
    p: [
      "We take reasonable measures to protect your information. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    h: "8. Your Rights",
    p: [
      "Subject to applicable law, you may request access to, correction of, or deletion of your personal information. To make a request, contact us using the details below.",
    ],
  },
  {
    h: "9. Third-Party Links",
    p: [
      "Our website may link to third-party services such as Instagram, WhatsApp, and Google Maps. We are not responsible for the privacy practices of these third parties, and we encourage you to review their privacy policies.",
    ],
  },
  {
    h: "10. Children's Privacy",
    p: [
      "Our website is not directed at children under the age of 13, and we do not knowingly collect personal information from children.",
    ],
  },
  {
    h: "11. Changes to This Policy",
    p: [
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.",
    ],
  },
  {
    h: "12. Contact Us",
    p: [
      "If you have any questions about this Privacy Policy, contact us at +973 3883 3663 or via the contact form on this website. [Add official contact email and registered address here.]",
    ],
  },
];

export default function PrivacyPage() {
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
          Privacy Policy
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
