import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { stageOf, topicFor, type Stage } from "./topics";

/** An essay or note, with what the garden needs to place and connect it. */
export type GardenPost = {
  kind: "essay" | "note";
  slug: string;
  title: string;
  href: string;
  tags: string[];
  stage: Stage;
  topicId: string;
  /** YYYY-MM-DD */
  createdAt: string;
  /** YYYY-MM-DD; the created date when the post was never updated. */
  lastUpdated: string;
  /** Addresses of the other posts this one links to with [[double brackets]]. */
  linksTo: string[];
};

function isoDay(value: unknown): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(String(value));
  return isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

type Raw = Omit<GardenPost, "linksTo"> & { linkTexts: string[] };

function readFolder(kind: GardenPost["kind"]): Raw[] {
  const dir = path.join(process.cwd(), "Content", kind === "essay" ? "essays" : "notes");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .flatMap((file) => {
      try {
        const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
        // Only published posts are part of the garden; locked drafts stay out of it.
        if (data.published !== true) return [];
        const slug = file.replace(/\.md$/, "");
        const tags: string[] = Array.isArray(data.tags) ? data.tags.map(String) : [];
        const createdAt = isoDay(data.createdAt || data.date);
        return [
          {
            kind,
            slug,
            title: String(data.title || slug),
            href: `/garden/${kind === "essay" ? "essays" : "notes"}/${slug}`,
            tags,
            stage: stageOf(data.type),
            topicId: topicFor(tags).id,
            createdAt,
            lastUpdated: isoDay(data.lastUpdated) || createdAt,
            linkTexts: [...content.matchAll(/\[\[(.*?)\]\]/g)].map((match) => match[1]),
          },
        ];
      } catch {
        return [];
      }
    });
}

const normalize = (text: string) => text.toLowerCase().trim();
const slugify = (text: string) => normalize(text).replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

/**
 * Finds the post a [[link]] points to, the same way clicking it does: an exact
 * title or slug anywhere wins over a partial match, and notes win ties.
 */
export function resolveLink<T extends { kind: string; slug: string; title: string }>(text: string, posts: T[]): T | undefined {
  const wanted = normalize(text);
  const slug = slugify(text);
  const ordered = [...posts.filter((p) => p.kind === "note"), ...posts.filter((p) => p.kind !== "note")];
  return (
    ordered.find((post) => normalize(post.title) === wanted) ||
    ordered.find((post) => post.slug === slug || slugify(post.title) === slug) ||
    ordered.find((post) => normalize(post.title).includes(wanted)) ||
    ordered.find((post) => wanted.includes(normalize(post.title)))
  );
}
const resolve = resolveLink;

let cache: { at: number; posts: GardenPost[] } | null = null;

/** Every published essay and note. Read once per build (and every few seconds in dev). */
export function getGardenPosts(): GardenPost[] {
  if (cache && (process.env.NODE_ENV === "production" || Date.now() - cache.at < 5000)) return cache.posts;
  const raw = [...readFolder("essay"), ...readFolder("note")];
  const posts = raw.map(({ linkTexts, ...post }) => ({
    ...post,
    linksTo: [...new Set(linkTexts.map((text) => resolve(text, raw)?.href).filter((href): href is string => !!href && href !== post.href))],
  }));
  cache = { at: Date.now(), posts };
  return posts;
}

/** Posts that link to this one. */
export function getBacklinks(href: string): GardenPost[] {
  return getGardenPosts().filter((post) => post.linksTo.includes(href));
}

const BROAD_TAGS = new Set(["self-expression", "personal", "self"]);

/**
 * A few posts close to this one: sharing tags counts most, then sharing a topic.
 * Posts it already links to, or that link to it, are left for the backlinks list.
 */
export function getRelated(href: string, limit = 4): GardenPost[] {
  const posts = getGardenPosts();
  const post = posts.find((p) => p.href === href);
  if (!post) return [];
  const tags = new Set(post.tags.map(normalize).filter((tag) => !BROAD_TAGS.has(tag)));
  const linked = new Set([...post.linksTo, ...getBacklinks(href).map((p) => p.href)]);
  return posts
    .filter((other) => other.href !== href && !linked.has(other.href))
    .map((other) => ({
      other,
      score: other.tags.filter((tag) => tags.has(normalize(tag))).length * 2 + (other.topicId === post.topicId ? 1 : 0),
    }))
    .filter(({ score }) => score >= 2)
    .sort((a, b) => b.score - a.score || b.other.lastUpdated.localeCompare(a.other.lastUpdated))
    .slice(0, limit)
    .map(({ other }) => other);
}

/** Most recently tended first. */
export const byLastTended = (a: GardenPost, b: GardenPost) => b.lastUpdated.localeCompare(a.lastUpdated);
