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

type Raw = Omit<GardenPost, "linksTo"> & { linkTexts: string[]; pinned: string[]; text: string };

/** The body as plain lowercase prose: no front matter, code, [[links]] or markdown symbols. */
function plainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\[\[[^\]]*\]\]/g, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_>#~|]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

const list = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(String) : typeof value === "string" && value.trim() ? [value] : [];

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
            // `related:` in the front matter pins posts to the Related list, by title or file name.
            pinned: list(data.related),
            text: plainText(content),
          },
        ];
      } catch {
        return [];
      }
    });
}

/** A word from Word of the Day, so [[portmanteau]] can link to it too. */
export type WordEntry = { kind: "word"; slug: string; title: string; href: string };

function readWords(): WordEntry[] {
  const dir = path.join(process.cwd(), "Content", "wordOfTheDay");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") && file !== "index.md")
    .flatMap((file) => {
      try {
        const { data } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
        if (!data.word) return [];
        const slug = file.replace(/\.md$/, "");
        return [{ kind: "word" as const, slug, title: String(data.word), href: `/garden/word-of-the-day#${slug}` }];
      } catch {
        return [];
      }
    });
}

// ---------------------------------------------------------------------------
// Matching [[links]] leniently
// ---------------------------------------------------------------------------

/** Letters and numbers only: "Indie Web", "indie-web" and "IndieWeb" all become "indieweb". */
const compact = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "");

/** A rough singular, so [[digital gardens]] finds "Digital Garden". */
const singular = (word: string) => word.replace(/ies$/, "y").replace(/(?<![su])s$/, "");

const STOP = new Set(["a", "an", "the", "of", "to", "and", "or", "for", "in", "on", "my", "i", "is", "it", "as", "at", "by", "with", "your", "you"]);
const words = (text: string) =>
  text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map(singular);
const contentWords = (text: string) => words(text).filter((word) => !STOP.has(word));

function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 3) return 99;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = row;
  }
  return prev[b.length];
}

const KIND_ORDER: Record<string, number> = { note: 0, essay: 1, word: 2 };

/**
 * Finds what a [[link]] points to, being forgiving about how it's written.
 * Tries, in order, and stops at the first tier that finds something:
 *  1. the same title or file name, ignoring case, spaces, hyphens and punctuation
 *     ([[indie web]] → indieweb.md)
 *  2. the same, ignoring plurals ([[digital gardens]] → "Digital Garden")
 *  3. a title that contains the link, or that the link contains
 *  4. a title with all the link's main words, in any order
 *  5. a small typo ([[fedivers]] → "Fediverse")
 * Ties go to notes, then essays, then Word of the Day.
 * `[[target|label]]` links to `target`; a `#section` on the end is ignored.
 */
export function resolveLink<T extends { kind: string; slug: string; title: string }>(text: string, items: T[]): T | undefined {
  const target = text.split("|")[0].split("#")[0].trim();
  const want = compact(target);
  if (!want) return undefined;
  const wantSingular = words(target).join("");
  const wantWords = contentWords(target);
  const ordered = [...items].sort((a, b) => (KIND_ORDER[a.kind] ?? 9) - (KIND_ORDER[b.kind] ?? 9));
  const names = (item: T) => [item.title, item.slug];
  const best = (scored: { item: T; score: number }[]) => scored.sort((a, b) => a.score - b.score)[0]?.item;

  const tiers: ((item: T) => number | null)[] = [
    (item) => (names(item).some((name) => compact(name) === want) ? 0 : null),
    (item) => (names(item).some((name) => words(name).join("") === wantSingular) ? 0 : null),
    (item) => {
      if (want.length < 4) return null;
      const title = compact(item.title);
      if (title.includes(want)) return title.length - want.length;
      if (title.length >= 4 && want.includes(title)) return 100 + want.length - title.length;
      return null;
    },
    (item) => {
      if (wantWords.length < 2) return null;
      const have = new Set([...contentWords(item.title), ...contentWords(item.slug)]);
      return wantWords.every((word) => have.has(word)) ? have.size - wantWords.length : null;
    },
    (item) => {
      if (want.length < 5) return null;
      const allowed = want.length >= 10 ? 2 : 1;
      const distance = Math.min(...names(item).map((name) => editDistance(compact(name), want)));
      return distance <= allowed ? distance : null;
    },
  ];

  for (const tier of tiers) {
    const found = best(
      ordered.flatMap((item) => {
        const score = tier(item);
        return score === null ? [] : [{ item, score }];
      }),
    );
    if (found) return found;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Mentions: posts that name this one in their text without a [[link]]
// ---------------------------------------------------------------------------

/**
 * A pattern for a title as people actually write it: "Indieweb" also matches
 * "indie web" and "indie-web", and "Micro.blog" matches "micro blog".
 * Returns null for titles too short or vague to search for safely.
 */
function mentionPattern(title: string): RegExp | null {
  const parts = title
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  if (parts.length === 0) return null;
  const letters = parts.join("").length;
  // One short word ("Chi", "Love") would match too much ordinary text.
  if (parts.length === 1 ? letters < 7 : letters < 8) return null;
  const escape = (part: string) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // A one-word title may be written as two words ("Indieweb" as "indie web"), so
  // allow a space, hyphen or dot between any of its letters. Longer titles allow
  // any of those between their words.
  const spaced =
    parts.length === 1
      ? [...parts[0]].map(escape).join("[\\s\\-.]?")
      : parts.map(escape).join("[\\s\\-._]*");
  return new RegExp(`(?<![a-z0-9])${spaced}s?(?![a-z0-9])`, "i");
}

let cache: { at: number; posts: GardenPost[]; raw: Raw[]; words: WordEntry[] } | null = null;

function load() {
  if (cache && (process.env.NODE_ENV === "production" || Date.now() - cache.at < 5000)) return cache;
  const raw = [...readFolder("essay"), ...readFolder("note")];
  const wordList = readWords();
  const targets = [...raw, ...wordList];
  const posts: GardenPost[] = raw.map(({ linkTexts, pinned: _pinned, text: _text, ...post }) => ({
    ...post,
    linksTo: [
      ...new Set(
        linkTexts
          .map((text) => resolveLink(text, targets))
          .filter((item): item is Raw => !!item && item.kind !== "word" && item.href !== post.href)
          .map((item) => item.href),
      ),
    ],
  }));
  cache = { at: Date.now(), posts, raw, words: wordList };
  return cache;
}

/** Every published essay and note. Read once per build (and every few seconds in dev). */
export function getGardenPosts(): GardenPost[] {
  return load().posts;
}

/** Everything a [[link]] can point to: essays, notes and Word of the Day. */
export function getLinkTargets(): (GardenPost | WordEntry)[] {
  const { posts, words: wordList } = load();
  return [...posts, ...wordList];
}

/** Posts that link to this one with [[double brackets]]. */
export function getBacklinks(href: string): GardenPost[] {
  return getGardenPosts()
    .filter((post) => post.linksTo.includes(href))
    .sort(byLastTended);
}

/** Posts that mention this one by name without linking to it. */
export function getMentions(href: string): GardenPost[] {
  const { posts, raw } = load();
  const post = posts.find((p) => p.href === href);
  if (!post) return [];
  const patterns = [post.title, post.slug.replace(/-/g, " ")]
    .map(mentionPattern)
    .filter((pattern): pattern is RegExp => !!pattern);
  if (patterns.length === 0) return [];
  const linked = new Set(getBacklinks(href).map((p) => p.href));
  const textOf = new Map(raw.map((r) => [r.href, r.text]));
  return posts
    .filter((other) => other.href !== href && !linked.has(other.href))
    .filter((other) => patterns.some((pattern) => pattern.test(textOf.get(other.href) ?? "")))
    .sort(byLastTended);
}

const BROAD_TAGS = new Set(["self-expression", "personal", "self"]);

/**
 * A few posts close to this one. Posts named under `related:` in the front matter
 * come first; the rest are picked automatically: sharing tags counts most, then
 * sharing a topic. Posts already in the backlinks or mentions are left out.
 */
export function getRelated(href: string, limit = 4): GardenPost[] {
  const { posts, raw } = load();
  const post = posts.find((p) => p.href === href);
  if (!post) return [];
  const pinned = (raw.find((r) => r.href === href)?.pinned ?? [])
    .map((text) => resolveLink(text, posts))
    .filter((p): p is GardenPost => !!p && p.href !== href);
  const tags = new Set(post.tags.map((tag) => tag.toLowerCase()).filter((tag) => !BROAD_TAGS.has(tag)));
  const taken = new Set([
    href,
    ...pinned.map((p) => p.href),
    ...post.linksTo,
    ...getBacklinks(href).map((p) => p.href),
    ...getMentions(href).map((p) => p.href),
  ]);
  const automatic = posts
    .filter((other) => !taken.has(other.href))
    .map((other) => ({
      other,
      score: other.tags.filter((tag) => tags.has(tag.toLowerCase())).length * 2 + (other.topicId === post.topicId ? 1 : 0),
    }))
    .filter(({ score }) => score >= 2)
    .sort((a, b) => b.score - a.score || b.other.lastUpdated.localeCompare(a.other.lastUpdated))
    .map(({ other }) => other);
  return [...new Map([...pinned, ...automatic].map((p) => [p.href, p])).values()].slice(0, Math.max(limit, pinned.length));
}

/** Most recently tended first. */
export const byLastTended = (a: GardenPost, b: GardenPost) => b.lastUpdated.localeCompare(a.lastUpdated);
