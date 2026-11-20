import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hello",
  description: "How to get in touch with Lilian Ada: email, work enquiries and saying hello.",
  alternates: { canonical: "/hello" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
