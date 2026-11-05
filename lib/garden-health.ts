import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getMicroBlogs } from "@/lib/garden-index";
import { getAllEssays } from "@/lib/garden/essays";
import { getAllNotesData } from "@/lib/notes";

export interface GardenHealth {
  latest: { label: string; date: string | null }[];
  empty: { title: string; href: string }[];
  drafts: { title: string; section: string }[];
}

// These paths are written out in full so only these folders get packaged with the
// server. A variable here makes Next.js package the whole project.
const SECTIONS = [
  { label: "Essays", root: path.join(process.cwd(), "Content/essays"), route: "/garden/essays" },
  { label: "Notes", root: path.join(process.cwd(), "Content/notes"), route: "/garden/notes" },
];

/** What in the garden needs tending. Reads drafts, so it must stay behind the admin check. */
export function getGardenHealth(): GardenHealth {
  const health: GardenHealth = {
    latest: [
      { label: "Essay", date: getAllEssays()[0]?.createdAt ?? null },
      { label: "Note", date: getAllNotesData()[0]?.frontmatter.createdAt ?? null },
      { label: "Micro-blog", date: getMicroBlogs()[0]?.date ?? null },
    ],
    empty: [],
    drafts: [],
  };

  for (const { label, root, route } of SECTIONS) {
    for (const file of fs.readdirSync(root)) {
      if (!/\.mdx?$/.test(file) || file === "README.md") continue;

      const { data, content } = matter(fs.readFileSync(path.join(root, file), "utf8"));
      const slug = file.replace(/\.mdx?$/, "");
      const title = data.title || slug;

      if (data.published !== true) health.drafts.push({ title, section: label });
      else if (!content.trim()) health.empty.push({ title, href: `${route}/${slug}` });
    }
  }

  return health;
}
