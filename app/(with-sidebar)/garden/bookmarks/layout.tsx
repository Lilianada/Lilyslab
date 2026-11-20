import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Favourite articles, tools and websites, saved and tagged by Lilian Ada.",
  alternates: { canonical: "/garden/bookmarks" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
