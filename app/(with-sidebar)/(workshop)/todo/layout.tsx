import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "To-do",
  description: "What's next for this website.",
  alternates: { canonical: "/todo" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
