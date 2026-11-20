import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Bucket List",
  description: "What Lilian Ada wants to do in her career, as a writer, engineer and product person.",
  alternates: { canonical: "/bucket-list" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
