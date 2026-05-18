import Link from "next/link";

interface Props {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}

export default function CTAButton({ label, href, variant = "primary", className = "" }: Props) {
  const base =
    "inline-block font-montserrat font-bold text-xs uppercase tracking-[0.12em] px-8 py-4 transition-all duration-200";

  const styles = {
    primary: "bg-[#CC1A1A] text-white hover:bg-[#AA1414]",
    secondary:
      "border-2 border-[#CC1A1A] text-[#CC1A1A] hover:bg-[#CC1A1A] hover:text-white",
    ghost:
      "text-white underline underline-offset-4 decoration-transparent hover:decoration-white transition-all",
  };

  return (
    <Link
      href={href}
      className={`${base} ${styles[variant]} ${className}`}
      style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
    >
      {label}
    </Link>
  );
}
