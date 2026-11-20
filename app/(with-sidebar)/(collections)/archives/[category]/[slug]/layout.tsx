import type { Metadata } from "next";

const humanize = (slug: string) => decodeURIComponent(slug).replace(/[-_]+/g, " ").replace(/^\w/, (c) => c.toUpperCase());

/** Each archived post gets its own title and address (not the archive list's). */
export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  return {
    // The list page above sets a plain title, so the site name is added here.
    title: { absolute: `${humanize(slug)} | Lily's Lab` },
    description: `An archived post by Lilian Ada, from ${humanize(category).toLowerCase()}.`,
    alternates: { canonical: `/archives/${category}/${slug}` },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
