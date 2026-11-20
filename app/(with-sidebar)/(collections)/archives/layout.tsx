import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archives",
  description: "Older writing by Lilian Ada, archived from previous blogs.",
  alternates: { canonical: "/archives" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
