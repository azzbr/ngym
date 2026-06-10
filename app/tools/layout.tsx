import ToolsProvider from "@/components/providers/ToolsProvider";
import BadgeToast from "@/components/tools/progress/BadgeToast";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToolsProvider>
      {children}
      <BadgeToast />
    </ToolsProvider>
  );
}
