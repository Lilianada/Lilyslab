import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webrings",
  description: "The webrings Lily's Lab belongs to, and how to wander through them.",
  alternates: { canonical: "/webrings" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
