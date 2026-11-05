import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getBookmarks } from "@/lib/garden/bookmarks";
import { getWebrollLinks } from "@/lib/garden/webroll";

export type HubSource = "Resource" | "Bookmark" | "Tool" | "Webroll";

export interface HubItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  source: HubSource;
}

const RESOURCES_DIR = path.join(process.cwd(), "Content", "resources");
const TOOLS_DIR = path.join(process.cwd(), "Content", "tools");

function readFrontmatter(directory: string) {
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md") && !["readme.md", "tools.md"].includes(file.toLowerCase()))
    .map((file) => matter(fs.readFileSync(path.join(directory, file), "utf8")).data);
}

function toItem(source: HubSource, index: number, fields: Record<string, unknown>): HubItem {
  return {
    id: `${source}-${index}`,
    title: String(fields.title ?? ""),
    url: String(fields.url ?? ""),
    description: String(fields.description ?? ""),
    category: String(fields.category ?? ""),
    tags: Array.isArray(fields.tags) ? fields.tags.filter(Boolean).map(String) : [],
    source,
  };
}

/** Everything saved around the garden. Bookmarks stay newest first. */
export async function getHubItems(): Promise<HubItem[]> {
  const [bookmarks, webroll] = await Promise.all([getBookmarks(), getWebrollLinks()]);

  const items = [
    ...readFrontmatter(RESOURCES_DIR)
      .filter((data) => data.publish !== false)
      .map((data, i) => toItem("Resource", i, data)),
    ...bookmarks.map((bookmark, i) =>
      toItem("Bookmark", i, { title: bookmark.title, url: bookmark.link, category: bookmark.type, tags: bookmark.tags })
    ),
    ...readFrontmatter(TOOLS_DIR)
      .filter((data) => data.publish === true)
      .map((data, i) => toItem("Tool", i, { ...data, title: data.name })),
    ...webroll.map((link, i) =>
      toItem("Webroll", i, { title: link.title, url: link.url, description: link.notes, category: link.category, tags: link.tags })
    ),
  ];

  return items.filter((item) => item.title && /^https?:\/\//i.test(item.url));
}
