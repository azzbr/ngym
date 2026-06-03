interface Props {
  eyebrow?: string;
  title: string;
  redWord?: string;
  subtitle?: string;
  alignment?: "left" | "center";
  light?: boolean;
  /** Render the title as <h1> for page-level headings (default <h2>). */
  as?: "h1" | "h2";
}

export default function SectionHeading({
  eyebrow,
  title,
  redWord,
  subtitle,
  alignment = "left",
  light = false,
  as: Heading = "h2",
}: Props) {
  const align = alignment === "center" ? "text-center items-center" : "text-left items-start";
  const textColor = light ? "text-[#0D0D0D]" : "text-white";
  const mutedColor = light ? "text-[#6B6B6B]" : "text-white/50";

  return (
    <div className={`flex flex-col gap-3 ${align}`}>
      {eyebrow && (
        <span
          className="font-montserrat font-bold text-xs uppercase tracking-[0.2em] text-[#CC1A1A]"
          style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
        >
          {eyebrow}
        </span>
      )}
      <Heading
        className={`font-montserrat font-black text-4xl md:text-5xl uppercase tracking-[0.05em] leading-none ${textColor}`}
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        {title}{" "}
        {redWord && <span className="text-[#CC1A1A]">{redWord}</span>}
      </Heading>
      {subtitle && (
        <p className={`text-base leading-relaxed max-w-xl ${mutedColor}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
