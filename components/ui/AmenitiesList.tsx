import type { Amenity } from "@/lib/branches";
import * as Icons from "lucide-react";

interface Props {
  amenities: Amenity[];
  light?: boolean;
}

type IconName = keyof typeof Icons;

export default function AmenitiesList({ amenities, light = false }: Props) {
  const textColor = light ? "text-[#0D0D0D]" : "text-white";
  const bg = light ? "bg-[#F5F4F2]" : "bg-[#2A2A2A]";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {amenities.map((a) => {
        const IconComponent = Icons[a.icon as IconName] as React.ComponentType<{ size?: number; className?: string }>;
        return (
          <div key={a.label} className={`flex items-center gap-3 p-4 ${bg}`}>
            {IconComponent ? (
              <IconComponent size={20} className="text-[#CC1A1A] shrink-0" />
            ) : (
              <Icons.CheckCircle size={20} className="text-[#CC1A1A] shrink-0" />
            )}
            <span className={`text-sm font-inter ${textColor}`}>{a.label}</span>
          </div>
        );
      })}
    </div>
  );
}
