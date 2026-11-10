import fs from "fs";
import path from "path";
import matter from "gray-matter";

/** "Build Your Own Website": free lessons for people who've never built a site. */
export const COURSE = {
  title: "Build Your Own Website",
  href: "/resources/build-your-own-website",
};

export interface LessonSummary {
  slug: string;
  title: string;
  description?: string;
  track: string;
  trackTitle: string;
  /** Position within its track, starting at 1. */
  number: number;
  href: string;
}

export interface Lesson extends LessonSummary {
  content: string;
  updated?: string;
}

export interface Track {
  slug: string;
  title: string;
  description?: string;
  intro: string;
  order: number;
  href: string;
  lessons: LessonSummary[];
}

const LEARN_DIR = path.join(process.cwd(), "Content", "learn");
const TRACK_FILE = "index.md";

const text = (value: unknown) => (value == null || value === "" ? undefined : String(value));

/** Frontmatter dates arrive as Date objects; keep them as YYYY-MM-DD. */
const dateText = (value: unknown) => (value instanceof Date ? value.toISOString().slice(0, 10) : text(value));

/** "01-what-is-html.md" becomes "what-is-html", ordered by its number. */
const lessonSlug = (file: string) => file.replace(/\.md$/, "").replace(/^\d+[-_]/, "");

function readLessons(trackSlug: string, trackTitle: string) {
  const directory = path.join(LEARN_DIR, trackSlug);
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md") && file !== TRACK_FILE && file.toLowerCase() !== "readme.md")
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
    .map((file) => ({ file, ...matter(fs.readFileSync(path.join(directory, file), "utf8")) }))
    // Lessons stay hidden until they say "published: true".
    .filter(({ data }) => data.published === true)
    .map(({ file, data, content }, index): Lesson => {
      const slug = lessonSlug(file);
      return {
        slug,
        title: text(data.title) ?? slug,
        description: text(data.description),
        track: trackSlug,
        trackTitle,
        number: index + 1,
        href: `${COURSE.href}/${trackSlug}/${slug}`,
        content,
        updated: dateText(data.lastUpdated ?? data.createdAt),
      };
    });
}

/** Every track in course order, each with its published lessons. */
export function getTracks(): Track[] {
  if (!fs.existsSync(LEARN_DIR)) return [];

  return fs
    .readdirSync(LEARN_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(LEARN_DIR, entry.name, TRACK_FILE)))
    .map((entry): Track => {
      const { data, content } = matter(fs.readFileSync(path.join(LEARN_DIR, entry.name, TRACK_FILE), "utf8"));
      const title = text(data.title) ?? entry.name;
      return {
        slug: entry.name,
        title,
        description: text(data.description),
        intro: content.trim(),
        order: Number(data.order) || 99,
        href: `${COURSE.href}/${entry.name}`,
        lessons: readLessons(entry.name, title).map(({ content: _content, updated: _updated, ...summary }) => summary),
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function getLesson(trackSlug: string, slug: string): Lesson | undefined {
  const track = getTracks().find((candidate) => candidate.slug === trackSlug);
  if (!track) return undefined;
  return readLessons(track.slug, track.title).find((lesson) => lesson.slug === slug);
}

/** Every published lesson across the course, in reading order. */
export const getAllLessons = () => getTracks().flatMap((track) => track.lessons);

/** A plain-text version of a lesson's Markdown, for the .txt download. */
export function toPlainText(markdown: string) {
  return markdown
    .replace(/^```[^\n]*\n?/gm, "")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "[Image: $1]")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(^|[^*\w])\*(?!\s)([^*\n]+?)\*/g, "$1$2")
    .replace(/`([^`\n]+)`/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
