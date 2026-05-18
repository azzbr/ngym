const stats = [
  { value: "2+", label: "Premium Branches" },
  { value: "5AM", label: "Opens Early Every Day" },
  { value: "BD 60", label: "Starting Membership" },
  { value: "#1", label: "Premium Gym in Bahrain" },
];

export default function StatsBar() {
  return (
    <section className="bg-[#CC1A1A] py-12">
      <div className="max-w-site mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center text-center gap-1">
            <span
              className="font-bebas text-5xl text-white leading-none"
              style={{ fontFamily: "var(--font-bebas, cursive)" }}
            >
              {s.value}
            </span>
            <span className="font-montserrat font-bold text-[10px] uppercase tracking-[0.2em] text-white/70">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
