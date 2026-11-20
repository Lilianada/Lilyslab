import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { describe } from "@/lib/seo";
import { getTopic, topicFor } from "./topics";

/**
 * What search engines need to know about an essay or note, read from its file.
 * The description is the post's `excerpt` (or `description`) if it has one,
 * otherwise its opening sentences.
 */
export function postSeo(kind: "essay" | "note", slug: string) {
  const folder = kind === "essay" ? "essays" : "notes";
  const file = path.join(process.cwd(), "Content", folder, `${slug}.md`);
  if (!/^[\w.-]+$/.test(slug) || !fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const title = String(data.title || slug);
  const tags: string[] = Array.isArray(data.tags) ? data.tags.map(String) : [];
  return {
    title,
    description: String(data.excerpt || data.description || "") || describe(content, `${title}, a ${kind} by Lilian Ada.`),
    path: `/garden/${folder}/${slug}`,
    createdAt: data.createdAt || data.date,
    lastUpdated: data.lastUpdated,
    tags,
    section: getTopic(topicFor(tags).id)?.title,
  };
}
