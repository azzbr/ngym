"use client";

import { useProfile, useUnits } from "@/components/providers/ToolsProvider";
import { validateField } from "@/lib/fitness/profile";
import { ACTIVITY_OPTIONS, type ActivityLevel, type Sex, type Units } from "@/lib/fitness/types";
import HeightField from "./atoms/HeightField";
import NumberField from "./atoms/NumberField";
import SegmentedControl from "./atoms/SegmentedControl";
import SelectField from "./atoms/SelectField";

/**
 * Shared profile bar — sex, age, height, weight, activity + unit toggle.
 * Persists via ToolsProvider/localStorage; every calculator pre-fills from it.
 */
export default function ProfileBar() {
  const { profile, setProfile } = useProfile();
  const { units, setUnits } = useUnits();

  return (
    <section aria-label="Your profile" className="bg-white border border-[#E5E5E5] p-5 md:p-6">
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <h2
          className="font-montserrat font-black text-sm uppercase tracking-[0.15em] text-[#0D0D0D]"
          style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
        >
          Your <span className="text-[#CC1A1A]">Profile</span>
        </h2>
        <SegmentedControl<Units>
          value={units}
          onChange={setUnits}
          compact
          options={[
            { value: "metric", label: "kg / cm" },
            { value: "imperial", label: "lb / ft" },
          ]}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <SegmentedControl<Sex>
          label="Sex"
          value={profile.sex}
          onChange={(sex) => setProfile({ sex })}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
        />
        <NumberField
          id="profile-age"
          label="Age"
          value={profile.age}
          onChange={(age) => setProfile({ age })}
          suffix="yrs"
          placeholder="30"
          error={validateField("age", profile.age)}
        />
        <HeightField
          id="profile-height"
          value={profile.heightCm}
          onChange={(heightCm) => setProfile({ heightCm })}
          error={validateField("heightCm", profile.heightCm)}
        />
        <NumberField
          id="profile-weight"
          label="Weight"
          value={profile.weightKg}
          onChange={(weightKg) => setProfile({ weightKg })}
          kind="weightKg"
          placeholder="80"
          error={validateField("weightKg", profile.weightKg)}
        />
        <div className="col-span-2 md:col-span-1">
          <SelectField
            id="profile-activity"
            label="Activity"
            value={profile.activity ?? ""}
            onChange={(v) => setProfile({ activity: (v || null) as ActivityLevel | null })}
            options={[{ value: "", label: "Select…" }, ...ACTIVITY_OPTIONS]}
          />
        </div>
      </div>
      <p className="mt-4 text-xs text-[#6B6B6B]">
        Saved on this device only — every tool below fills in automatically.
      </p>
    </section>
  );
}
