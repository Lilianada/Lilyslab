import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Lilian Ada (Lily): writer, software engineer and keeper of this digital garden.",
  alternates: { canonical: "/about" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
