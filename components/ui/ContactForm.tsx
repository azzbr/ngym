"use client";

import { useState } from "react";

interface BranchOption {
  slug: string;
  shortName: string;
  locationLabel: string;
}

export default function ContactForm({ branches }: { branches: BranchOption[] }) {
  const [submitted, setSubmitted] = useState(false);

  // No backend yet — prevent the broken reload and guide the user to call/WhatsApp.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mt-10 bg-white border-l-4 border-[#CC1A1A] p-8">
        <p className="font-montserrat font-bold text-sm uppercase tracking-wider text-[#0D0D0D] mb-2">
          Thanks for reaching out
        </p>
        <p className="text-[#6B6B6B] text-sm mb-5">
          For the fastest response, call or message us directly — our team replies
          quickest on WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://wa.me/97338833663"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#CC1A1A] hover:bg-[#AA1414] text-white font-montserrat font-bold text-xs uppercase tracking-[0.12em] px-6 py-3 text-center transition-colors"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            Message on WhatsApp
          </a>
          <a
            href="tel:+97338833663"
            className="border-2 border-[#0D0D0D] text-[#0D0D0D] hover:bg-[#0D0D0D] hover:text-white font-montserrat font-bold text-xs uppercase tracking-[0.12em] px-6 py-3 text-center transition-colors"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            Call +973 3883 3663
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="mt-10 flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-montserrat font-bold text-xs uppercase tracking-wider text-[#0D0D0D] mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full border border-[#E5E5E5] bg-white px-4 py-3 text-[#0D0D0D] text-sm focus:border-[#CC1A1A] focus:outline-none transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block font-montserrat font-bold text-xs uppercase tracking-wider text-[#0D0D0D] mb-2">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            className="w-full border border-[#E5E5E5] bg-white px-4 py-3 text-[#0D0D0D] text-sm focus:border-[#CC1A1A] focus:outline-none transition-colors"
            placeholder="+973 XXXX XXXX"
          />
        </div>
      </div>

      <div>
        <label className="block font-montserrat font-bold text-xs uppercase tracking-wider text-[#0D0D0D] mb-2">
          Branch Interest
        </label>
        <select
          name="branch"
          className="w-full border border-[#E5E5E5] bg-white px-4 py-3 text-[#0D0D0D] text-sm focus:border-[#CC1A1A] focus:outline-none transition-colors"
        >
          <option value="">Select a branch</option>
          {branches.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.shortName} — {b.locationLabel}
            </option>
          ))}
          <option value="general">General / Not sure</option>
        </select>
      </div>

      <div>
        <label className="block font-montserrat font-bold text-xs uppercase tracking-wider text-[#0D0D0D] mb-2">
          Message
        </label>
        <textarea
          name="message"
          rows={5}
          className="w-full border border-[#E5E5E5] bg-white px-4 py-3 text-[#0D0D0D] text-sm focus:border-[#CC1A1A] focus:outline-none transition-colors resize-none"
          placeholder="How can we help you?"
        />
      </div>

      <button
        type="submit"
        className="bg-[#CC1A1A] hover:bg-[#AA1414] text-white font-montserrat font-bold text-xs uppercase tracking-[0.12em] px-8 py-4 transition-colors self-start"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        Send Message
      </button>
    </form>
  );
}
