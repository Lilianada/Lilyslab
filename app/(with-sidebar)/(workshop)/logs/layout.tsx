import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Logs",
  description: "Build notes and progress logs from Lilian Ada's projects.",
  alternates: { canonical: "/logs" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
