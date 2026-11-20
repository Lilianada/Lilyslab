import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Misc",
  description: "Odds and ends from Lily's Lab that don't fit anywhere else.",
  alternates: { canonical: "/misc" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
