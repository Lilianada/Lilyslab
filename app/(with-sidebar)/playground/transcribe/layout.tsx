import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transcriber",
  description: "Turn a video link into text.",
  alternates: { canonical: "/playground/transcribe" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
