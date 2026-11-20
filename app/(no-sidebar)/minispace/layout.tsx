import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minispace",
  description: "Lilian Ada's minispace: a tiny corner of the web with links to everything else.",
  alternates: { canonical: "/minispace" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
