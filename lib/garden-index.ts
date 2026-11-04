import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllEssays } from "@/lib/garden/essays";
import { getAllPoems } from "@/lib/garden/poems";
import { getBookmarks } from "@/lib/garden/bookmarks";
import { getAllNotesData } from "@/lib/notes";
import { safeFormatDate } from "@/lib/utils";

export interface FeedItem {
  id: string;
  title: string;
  path: string;
  date: string;
}

export interface MicroBlogItem {
  id: string;
  content: string;
  date: string;
}

export interface SearchItem {
  id: string;
  title: string;
  path: string;
  type: string;
  snippet: string;
  tags: string[];
  text: string;
  external?: boolean;
}

// Pages worth landing on at random. Personal or admin-only routes stay out.
const WANDER_PAGES = [
  "/hello",
  "/about",
  "/now",
  "/someday",
  "/wants-to-do",
  "/bucket-list",
  "/guestbook",
  "/ask-me-anything",
  "/uses",
  "/resources",
  "/garden/bookshelf",
  "/garden/poems",
  "/garden/micro-blog",
  "/garden/word-of-the-day",
  "/projects",
  "/tools",
  "/playground",
  "/playground/petal-catch",
  "/playground/doodle",
  "/playground/color-theory",
  "/playground/animation-lab",
  "/manifesto",
  "/webroll",
  "/webrings",
  "/commonplace-book",
  "/quotes",
  "/archives",
  "/then",
];

function getMicroBlogs(): MicroBlogItem[] {
  const directory = path.join(process.cwd(), "Content/microBlog");
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(directory, file), "utf-8"));
      if (data.published === false) return null;
      return {
        id: file.replace(/\.mdx?$/, ""),
        content,
        date: safeFormatDate(data.createdAt || data.date),
      };
    })
    .filter((item): item is MicroBlogItem => item !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** The newest few of everything, for the homepage. */
export async function getHomeFeed(limit = 5) {
  const bookmarks = await getBookmarks();

  return {
    essays: getAllEssays()
      .slice(0, limit)
      .map<FeedItem>((essay) => ({
        id: essay.slug,
        title: essay.title,
        path: `/garden/essays/${essay.slug}`,
        date: essay.createdAt,
      })),
    notes: getAllNotesData()
      .slice(0, limit)
      .map<FeedItem>((note) => ({
        id: note.slug,
        title: note.frontmatter.title,
        path: `/garden/notes/${note.slug}`,
        date: note.frontmatter.createdAt,
      })),
    bookmarks: bookmarks
      .filter((bookmark) => bookmark.title && bookmark.link)
      .slice(0, limit)
      .map<FeedItem>((bookmark) => ({
        id: bookmark.link,
        title: bookmark.title,
        path: bookmark.link,
        date: bookmark.created,
      })),
    microBlogs: getMicroBlogs().slice(0, limit),
  };
}

/** Everything searchable. Only fetched when a visitor actually starts a search. */
export async function getSearchIndex(): Promise<SearchItem[]> {
  const bookmarks = await getBookmarks();

  return [
    ...getAllEssays().map((essay) => ({
      id: `essay-${essay.slug}`,
      title: essay.title,
      path: `/garden/essays/${essay.slug}`,
      type: "Essay",
      snippet: essay.excerpt || essay.content.slice(0, 120),
      tags: essay.tags ?? [],
      text: essay.content,
    })),
    ...getAllNotesData().map((note) => ({
      id: `note-${note.slug}`,
      title: note.frontmatter.title,
      path: `/garden/notes/${note.slug}`,
      type: "Note",
      snippet: note.content.slice(0, 120),
      tags: ((note.frontmatter as { tags?: string[] }).tags ?? []) as string[],
      text: note.content,
    })),
    ...getAllPoems().map((poem) => ({
      id: `poem-${poem.slug}`,
      title: poem.title,
      path: "/garden/poems",
      type: "Poem",
      snippet: poem.content.slice(0, 120),
      tags: [],
      text: poem.content,
    })),
    ...bookmarks
      .filter((bookmark) => bookmark.title && bookmark.link)
      .map((bookmark) => ({
        id: `bookmark-${bookmark.link}`,
        title: bookmark.title,
        path: bookmark.link,
        type: "Bookmark",
        snippet: bookmark.link,
        tags: bookmark.tags ?? [],
        text: "",
        external: true,
      })),
    ...getMicroBlogs().map((blog) => ({
      id: `microblog-${blog.id}`,
      title: blog.content.slice(0, 60) || "MicroBlog post",
      path: "/garden/micro-blog",
      type: "MicroBlog",
      snippet: blog.content.slice(0, 120),
      tags: [],
      text: blog.content,
    })),
  ];
}

/** Every place the Wander button can send someone. */
export function getWanderPaths(): string[] {
  return [
    ...WANDER_PAGES,
    ...getAllEssays().map((essay) => `/garden/essays/${essay.slug}`),
    ...getAllNotesData().map((note) => `/garden/notes/${note.slug}`),
  ];
}
