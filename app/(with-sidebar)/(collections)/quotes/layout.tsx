import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quotes",
  description: "Quotes I've collected from books, films and the web.",
  alternates: { canonical: "/quotes" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
