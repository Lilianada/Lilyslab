import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask Me Anything",
  description: "Ask Lilian Ada a question and read past answers.",
  alternates: { canonical: "/ask-me-anything" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
