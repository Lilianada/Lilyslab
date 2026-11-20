import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word of the Day",
  description: "New words I've collected, with meanings, examples and where I found them.",
  alternates: { canonical: "/garden/word-of-the-day" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
