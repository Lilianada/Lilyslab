import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookshelf",
  description: "Books Lilian Ada has read, is reading, or plans to read, with ratings and notes.",
  alternates: { canonical: "/garden/bookshelf" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
