"use client";

import { X } from "lucide-react";

interface Props {
  text: string;
  onDismiss: () => void;
}

/** "Using body fat 16.1% from the Body Fat calculator" — dismissible. */
export default function HandoffChip({ text, onDismiss }: Props) {
  return (
    <div className="flex items-center gap-3 bg-[#F5F4F2] border border-[#E5E5E5] border-l-4 border-l-[#1A7A3C] px-4 py-3">
      <p className="text-xs text-[#0D0D0D] flex-1">{text}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss prefilled value"
        className="text-[#6B6B6B] hover:text-[#0D0D0D] transition-colors"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
