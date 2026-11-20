import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Things I Want to Do",
  description: "A list of things I want to do in my lifetime, ticked off as they happen.",
  alternates: { canonical: "/wants-to-do" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
