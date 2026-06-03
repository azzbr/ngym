import { Metadata } from "next";
import { getAllBranches } from "@/lib/branches";
import { formatPhone } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "@/components/ui/ContactForm";
import { Phone, AtSign, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Al Nakheel Premium. Find your nearest branch in Bahrain.",
};

export default function ContactPage() {
  const branches = getAllBranches();

  return (
    <>
      {/* Header */}
      <section className="bg-[#0D0D0D] pt-36 pb-20">
        <div className="max-w-site mx-auto px-4 md:px-8">
          <SectionHeading
            eyebrow="Get In Touch"
            title="Contact"
            redWord="Us"
            subtitle="Reach out to your nearest branch directly, or use the form below and we'll get back to you."
          />
        </div>
      </section>

      {/* Branch contacts */}
      <section className="bg-white py-20">
        <div className="max-w-site mx-auto px-4 md:px-8">
          <SectionHeading eyebrow="Branches" title="Branch" redWord="Contacts" light />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {branches.map((branch) => (
              <div key={branch.id} className="border border-[#E5E5E5] p-8 border-l-4 border-l-[#CC1A1A]">
                <h3
                  className="font-montserrat font-black text-xl uppercase tracking-wider text-[#0D0D0D] mb-1"
                  style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                >
                  {branch.shortName}
                </h3>
                <div className="flex items-center gap-2 text-[#6B6B6B] text-sm mb-6">
                  <MapPin size={13} className="text-[#CC1A1A]" />
                  <span>{branch.locationLabel}</span>
                </div>

                <div className="flex flex-col gap-3">
                  <a
                    href={`tel:${branch.contact.phone}`}
                    className="flex items-center gap-3 text-[#0D0D0D] hover:text-[#CC1A1A] transition-colors text-sm font-semibold"
                  >
                    <Phone size={16} className="text-[#CC1A1A]" />
                    {formatPhone(branch.contact.phone)}
                  </a>
                  <a
                    href={branch.contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[#0D0D0D] hover:text-[#CC1A1A] transition-colors text-sm font-semibold"
                  >
                    <AtSign size={16} className="text-[#CC1A1A]" />
                    {branch.contact.instagramHandle}
                  </a>
                </div>

                <div className="mt-6">
                  <a
                    href={`/branches/${branch.slug}`}
                    className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#CC1A1A] hover:underline"
                  >
                    View Branch →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General contact form */}
      <section className="bg-[#F5F4F2] py-20">
        <div className="max-w-site mx-auto px-4 md:px-8 max-w-2xl">
          <SectionHeading eyebrow="Enquiry" title="Send Us a" redWord="Message" light />
          <ContactForm
            branches={branches.map((b) => ({
              slug: b.slug,
              shortName: b.shortName,
              locationLabel: b.locationLabel,
            }))}
          />
        </div>
      </section>

      {/* General numbers */}
      <section className="bg-[#0D0D0D] py-16">
        <div className="max-w-site mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p
              className="font-montserrat font-black text-white uppercase tracking-wider text-lg mb-1"
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              General Enquiries
            </p>
            <p className="text-white/50 text-sm">Our team is ready to help</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:+97338833663"
              className="flex items-center gap-2 text-white font-bold hover:text-[#CC1A1A] transition-colors"
            >
              <Phone size={16} /> +973 3883 3663
            </a>
            <a
              href="tel:+97338833990"
              className="flex items-center gap-2 text-white font-bold hover:text-[#CC1A1A] transition-colors"
            >
              <Phone size={16} /> +973 3883 3990
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
