"use client";

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string | null;
}

export default function SelectField({ id, label, value, onChange, options, error }: Props) {
  const errId = `${id}-error`;
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-montserrat font-semibold text-xs uppercase tracking-[0.1em] text-[#0D0D0D] mb-2"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={`w-full border bg-white px-4 py-3 text-[#0D0D0D] text-sm focus:outline-none transition-colors appearance-none ${
          error ? "border-[#CC1A1A]" : "border-[#E5E5E5] focus:border-[#CC1A1A]"
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errId} className="mt-1.5 text-xs text-[#CC1A1A]">
          {error}
        </p>
      )}
    </div>
  );
}
