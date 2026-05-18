import CTAButton from "@/components/ui/CTAButton";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0D0D0D]">
      {/* Background image placeholder — swap src for real video/image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0D0D0D]/60" />

      {/* Track stripe accent — bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20" />
      <div className="absolute bottom-[10px] left-0 right-0 h-px bg-[#CC1A1A]" />

      {/* Content */}
      <div className="relative z-10 max-w-site mx-auto px-4 md:px-8 flex flex-col items-center text-center gap-8">
        {/* Eyebrow */}
        <span
          className="font-montserrat font-bold text-xs uppercase tracking-[0.3em] text-[#CC1A1A]"
          style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
        >
          Bahrain&apos;s #1 Premium Fitness Center
        </span>

        {/* Main headline */}
        <h1
          className="font-montserrat font-black text-5xl md:text-7xl lg:text-8xl uppercase tracking-[0.08em] leading-none text-white max-w-4xl"
          style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
        >
          One Fit
          <br />
          <span className="text-[#CC1A1A]">For All</span>
        </h1>

        {/* Subheading */}
        <p className="text-white/70 text-lg md:text-xl max-w-xl leading-relaxed">
          All the equipment, trainers, classes, and facilities to help you meet your goals.
          Plus, pretty bangin&apos; views.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <CTAButton label="Find Your Branch" href="/branches" variant="primary" />
          <CTAButton label="View Memberships" href="/memberships" variant="secondary" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <span className="text-[10px] font-montserrat uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-8 bg-white/20 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-[#CC1A1A] animate-bounce" />
        </div>
      </div>
    </section>
  );
}
