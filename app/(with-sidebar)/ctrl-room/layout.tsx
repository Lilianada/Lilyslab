import type { Metadata } from "next";

/** The admin room stays out of search results. */
export const metadata: Metadata = {
  title: "Control room",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
