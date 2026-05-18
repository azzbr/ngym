interface Props {
  light?: boolean;
}

export default function QuoteBanner({ light = false }: Props) {
  const bg = light ? "bg-[#F5F4F2]" : "bg-[#0D0D0D]";
  const textColor = light ? "text-[#0D0D0D]" : "text-white";

  return (
    <section className={`${bg} py-16 md:py-24 overflow-hidden`}>
      <div className="max-w-site mx-auto px-4 md:px-8">
        <p
          className={`font-bebas text-6xl sm:text-8xl md:text-[10rem] leading-none uppercase tracking-wide ${textColor}`}
          style={{ fontFamily: "var(--font-bebas, cursive)" }}
        >
          WHAT DOESN&apos;T KILL{" "}
          <span className="text-[#CC1A1A]">YOU</span>
          <br />
          MAKES YOU{" "}
          <span className="text-[#CC1A1A]">STRONGER</span>
        </p>
      </div>
    </section>
  );
}
