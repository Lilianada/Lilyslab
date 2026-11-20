import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "365 Days Challenge",
  description: "A year-long challenge, one day at a time.",
  alternates: { canonical: "/365days" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
