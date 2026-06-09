import ToolsProvider from "@/components/providers/ToolsProvider";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <ToolsProvider>{children}</ToolsProvider>;
}
