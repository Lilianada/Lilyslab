import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things Lilian Ada has built and shipped: web apps, tools and experiments, with notes on each.",
  alternates: { canonical: "/projects" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
