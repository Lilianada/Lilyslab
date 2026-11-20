import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uses",
  description: "The apps, tools and gear Lilian Ada uses every day.",
  alternates: { canonical: "/uses" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
