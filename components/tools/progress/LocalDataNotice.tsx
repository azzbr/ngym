"use client";

import { STORAGE_KEY } from "@/lib/fitness/profile";

/** Small print about device-local storage + a JSON export escape hatch. */
export default function LocalDataNotice() {
  const onDownload = () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const blob = new Blob([raw], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "alnakheel-progress.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      /* private mode / blocked storage — degrade silently */
    }
  };

  return (
    <div className="border-t border-[#E5E5E5] pt-5">
      <p className="text-xs text-[#6B6B6B] leading-relaxed">
        Your progress is stored in this browser, on this device only. Clearing browser data
        erases it. When member accounts launch you&apos;ll be able to claim this history into
        your account.
      </p>
      <button
        type="button"
        onClick={onDownload}
        className="mt-3 font-montserrat font-bold text-[11px] uppercase tracking-[0.12em] text-[#0D0D0D] hover:text-[#CC1A1A] hover:underline underline-offset-4 transition-colors"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        Download my data
      </button>
    </div>
  );
}
