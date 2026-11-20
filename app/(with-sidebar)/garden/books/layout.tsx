import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books",
  description: "Books Lilian Ada has read, with notes.",
  alternates: { canonical: "/garden/books" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
