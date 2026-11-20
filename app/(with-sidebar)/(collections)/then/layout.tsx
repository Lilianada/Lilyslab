import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Then",
  description: "Old /now pages: what I was focused on before.",
  alternates: { canonical: "/then" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
