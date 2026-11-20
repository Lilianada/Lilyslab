import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Someday",
  description: "Things I'd like to do someday.",
  alternates: { canonical: "/someday" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
