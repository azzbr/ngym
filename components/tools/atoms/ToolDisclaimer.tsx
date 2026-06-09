import { DISCLAIMER_TEXT } from "@/lib/tools";

export default function ToolDisclaimer() {
  return (
    <p className="text-xs text-[#6B6B6B] leading-relaxed border-t border-[#E5E5E5] pt-5">
      {DISCLAIMER_TEXT}
    </p>
  );
}
