import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { MetadataRoute } from "next";
import { getAllEssays } from "@/lib/garden/essays";
import { getAllNotesData } from "@/lib/notes";
import { PLAYGROUND_TOYS } from "@/lib/playground-toys";

const SITE_URL = (process.env.SITE_URL || "https://lilyslab.xyz").replace(/\/$/, "");

const PAGES = [
  "/",
  "/hello",
  "/about",
  "/now",
  "/someday",
  "/daily-logs",
  "/wants-to-do",
  "/bucket-list",
  "/guestbook",
  "/ask-me-anything",
  "/uses",
  "/resources",
  "/garden",
  "/garden/essays",
  "/garden/notes",
  "/garden/bookmarks",
  "/garden/bookshelf",
  "/garden/micro-blog",
  "/garden/poems",
  "/garden/word-of-the-day",
  "/projects",
  "/tools",
  "/todo",
  "/logs",
  "/playground",
  "/manifesto",
  "/webroll",
  "/webrings",
  "/commonplace-book",
  "/quotes",
  "/archives",
  "/then",
  "/100pics",
  "/changelog",
  "/colophon",
  "/sitemap",
];

function getThenPaths() {
  const directory = path.join(process.cwd(), "Content/then");
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .filter((file) => matter(fs.readFileSync(path.join(directory, file), "utf8")).data.published !== false)
    .map((file) => `/then/${file.replace(/\.md$/, "")}`);
}

/** Published pieces with no text yet stay out until there's something to read. */
export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (route: string, lastModified?: string) => ({
    url: `${SITE_URL}${route === "/" ? "" : route}`,
    ...(lastModified ? { lastModified } : {}),
  });

  return [
    ...PAGES.map((route) => entry(route)),
    ...PLAYGROUND_TOYS.map((toy) => entry(toy.href)),
    ...getThenPaths().map((route) => entry(route)),
    ...getAllEssays()
      .filter((essay) => essay.content.trim())
      .map((essay) => entry(`/garden/essays/${essay.slug}`, essay.lastUpdated)),
    ...getAllNotesData()
      .filter((note) => note.content.trim())
      .map((note) => entry(`/garden/notes/${note.slug}`, note.frontmatter.lastUpdated)),
  ];
}
