import type { Metadata } from "next";
import "./shinetools.css";

export const metadata: Metadata = {
  title: {
    default: "ShineTools Energy Management Handbook",
    template: "%s | ShineTools Energy",
  },
  description:
    "Protected product handbook and evidence base for ShineTools energy-management settings.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function ShineToolsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
