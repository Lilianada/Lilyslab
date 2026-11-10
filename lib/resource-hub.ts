import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface HubItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
}

const RESOURCES_DIR = path.join(process.cwd(), "Content", "resources");

/** Links I recommend, from Content/resources. Hidden ones say "publish: false". */
export function getHubItems(): HubItem[] {
  return fs
    .readdirSync(RESOURCES_DIR)
    .filter((file) => file.endsWith(".md") && file.toLowerCase() !== "readme.md")
    .map((file) => ({ file, data: matter(fs.readFileSync(path.join(RESOURCES_DIR, file), "utf8")).data }))
    .filter(({ data }) => data.publish !== false)
    .map(({ file, data }) => ({
      id: file,
      title: String(data.title ?? ""),
      url: String(data.url ?? ""),
      description: String(data.description ?? ""),
      category: String(data.category ?? ""),
      tags: Array.isArray(data.tags) ? data.tags.filter(Boolean).map(String) : [],
    }))
    .filter((item) => item.title && /^https?:\/\//i.test(item.url));
}
