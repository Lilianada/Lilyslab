import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools",
  description: "Tools and resources I recommend for writing, building and the web.",
  alternates: { canonical: "/tools" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
