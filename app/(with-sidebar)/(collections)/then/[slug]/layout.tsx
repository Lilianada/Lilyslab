import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Metadata } from "next";

/** Each old /now page gets its own title and address (not the /then list's). */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const file = path.join(process.cwd(), "Content/then", `${slug}.md`);
  let title = `Then: ${slug}`;
  let date = "";
  if (/^[\w-]+$/.test(slug) && fs.existsSync(file)) {
    const { data } = matter(fs.readFileSync(file, "utf8"));
    date = data.createdAt ? String(data.createdAt) : "";
    if (data.title && data.title !== "Now") title = String(data.title);
    else if (date) title = `Now, as of ${date}`;
  }
  // The list page above sets a plain title, so the site name is added here.
  return {
    title: { absolute: `${title} | Lily's Lab` },
    description: `What Lilian Ada was focused on${date ? ` in ${date.slice(0, 7)}` : " back then"}: an archived /now page.`,
    alternates: { canonical: `/then/${slug}` },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
