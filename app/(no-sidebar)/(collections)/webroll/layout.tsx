import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webroll",
  description: "Personal websites, blogs and digital gardens I like, collected by Lilian Ada.",
  alternates: { canonical: "/webroll" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
