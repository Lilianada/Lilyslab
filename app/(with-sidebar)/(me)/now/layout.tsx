import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Now",
  description: "What Lilian Ada is focused on right now.",
  alternates: { canonical: "/now" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
