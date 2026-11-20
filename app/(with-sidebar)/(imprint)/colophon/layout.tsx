import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colophon",
  description: "The tools, technologies and inspirations behind Lily's Lab.",
  alternates: { canonical: "/colophon" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
