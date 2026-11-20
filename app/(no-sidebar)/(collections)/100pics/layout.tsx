import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "100 Pics in 100 Days",
  description: "A photo a day for 100 days.",
  alternates: { canonical: "/100pics" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
