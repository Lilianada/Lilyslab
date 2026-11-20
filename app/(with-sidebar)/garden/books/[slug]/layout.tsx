import type { Metadata } from "next";

const humanize = (slug: string) => decodeURIComponent(slug).replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** Each book gets its own title and address (not the books list's). */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    // The list page above sets a plain title, so the site name is added here.
    title: { absolute: `${humanize(slug)} | Lily's Lab` },
    description: `Lilian Ada's notes on ${humanize(slug)}.`,
    alternates: { canonical: `/garden/books/${slug}` },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
