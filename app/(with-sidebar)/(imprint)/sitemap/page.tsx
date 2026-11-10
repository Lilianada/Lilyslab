import type { Metadata } from "next";
import Link from "next/link";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { getAllEssays } from "@/lib/garden/essays";
import { getAllNotesData } from "@/lib/notes";
import { COURSE, getTracks } from "@/lib/learn";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Every page in Lily's Garden, laid out as a map.",
};

interface SiteNode {
  name: string;
  /** Sections without a page of their own have no link. */
  href?: string;
  description?: string;
  children?: SiteNode[];
  /** Long lists, like every essay, start folded away. */
  folded?: { label: string; pages: SiteNode[] };
}

function buildMap(): SiteNode {
  const essays = getAllEssays().map(({ title, slug }) => ({ name: title, href: `/garden/essays/${slug}` }));
  const notes = getAllNotesData().map(({ frontmatter, slug }) => ({ name: frontmatter.title, href: `/garden/notes/${slug}` }));
  const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

  return {
    name: "Home",
    href: "/",
    description: "Where it all starts",
    children: [
      { name: "Hello", href: "/hello", description: "How to reach me" },
      {
        name: "Me",
        children: [
          { name: "About", href: "/about", description: "Who I am" },
          { name: "Now", href: "/now", description: "What I'm doing now" },
          { name: "Someday", href: "/someday", description: "Things I plan to do someday" },
          { name: "Daily Logs", href: "/daily-logs", description: "Little notes from my days" },
          { name: "100 Wants", href: "/wants-to-do", description: "A hundred things I want to do" },
          { name: "Career Bucket List", href: "/bucket-list", description: "Where I'd love my work to take me" },
        ],
      },
      {
        name: "For You",
        children: [
          { name: "Guestbook", href: "/guestbook", description: "Sign it so I know you stopped by" },
          { name: "Ask Me Anything", href: "/ask-me-anything", description: "Ask me a question" },
          { name: "Uses", href: "/uses", description: "Hardware and software I use" },
          {
            name: "Resources",
            href: "/resources",
            description: "My free course and the links I recommend",
            children: [
              {
                name: COURSE.title,
                href: COURSE.href,
                description: "Free lessons for non-tech people",
                children: getTracks().map((track) => ({
                  name: track.title,
                  href: track.href,
                  folded: track.lessons.length
                    ? { label: plural(track.lessons.length, "lesson"), pages: track.lessons.map(({ title, href }) => ({ name: title, href })) }
                    : undefined,
                })),
              },
            ],
          },
        ],
      },
      {
        name: "Garden",
        href: "/garden",
        description: "Everything I write and collect",
        children: [
          {
            name: "Essays",
            href: "/garden/essays",
            description: "My longer writing",
            folded: { label: plural(essays.length, "essay"), pages: essays },
          },
          {
            name: "Notes",
            href: "/garden/notes",
            description: "Shorter notes and thoughts",
            folded: { label: plural(notes.length, "note"), pages: notes },
          },
          { name: "Poems", href: "/garden/poems", description: "My poetry" },
          { name: "Bookshelf", href: "/garden/bookshelf", description: "Books I've read, am reading or want to read" },
          { name: "Media Digest", href: "/garden/media-digest", description: "What I watched, heard and read each month" },
          { name: "Micro-blog", href: "/garden/micro-blog", description: "Short thoughts" },
          { name: "Word of the Day", href: "/garden/word-of-the-day", description: "One new word at a time" },
          { name: "Bookmarks", href: "/garden/bookmarks", description: "Things I found on the web" },
        ],
      },
      {
        name: "Workshop",
        children: [
          { name: "Projects", href: "/projects", description: "Things I've built" },
          { name: "Logs", href: "/logs", description: "Project logs" },
          { name: "Tools", href: "/tools", description: "Tools I use or want to try" },
          { name: "Todo", href: "/todo", description: "My messy website todo list" },
        ],
      },
      {
        name: "Playground",
        href: "/playground",
        description: "Small toys and experiments",
        children: [
          { name: "Petal Catch", href: "/playground/petal-catch", description: "Catch petals, dodge bees" },
          { name: "Doodle Pad", href: "/playground/doodle", description: "Draw something for the fridge" },
          { name: "Color Theory", href: "/playground/color-theory", description: "Color harmonies and contrast" },
          { name: "Animation Lab", href: "/playground/animation-lab", description: "Play with easing curves" },
          { name: "Digital Clock", href: "/playground/digital-clock" },
          { name: "Calculator", href: "/playground/calculator" },
          { name: "Terminal", href: "/playground/terminal" },
        ],
      },
      {
        name: "Collections",
        children: [
          { name: "Commonplace Book", href: "/commonplace-book", description: "Ideas, quotes and things worth keeping" },
          { name: "Quotes", href: "/quotes", description: "Quotes I've collected" },
          { name: "Archives", href: "/archives", description: "Older writing and notes" },
          { name: "Then", href: "/then", description: "My past Now pages" },
        ],
      },
      {
        name: "IndieWeb",
        children: [
          { name: "Manifesto", href: "/manifesto", description: "What I believe about the web" },
          { name: "Webroll", href: "/webroll", description: "Websites I love" },
          { name: "Webrings", href: "/webrings", description: "Webrings I'm part of" },
        ],
      },
      {
        name: "About this site",
        children: [
          { name: "Colophon", href: "/colophon", description: "How this site is made" },
          { name: "Changelog", href: "/changelog", description: "What's changed lately" },
          { name: "Sitemap", href: "/sitemap", description: "You are here" },
        ],
      },
    ],
  };
}

function countPages(node: SiteNode): number {
  return (
    (node.href ? 1 : 0) +
    (node.folded?.pages.length ?? 0) +
    (node.children ?? []).reduce((sum, child) => sum + countPages(child), 0)
  );
}

/** One branch of the tree, with the line that joins it to its parent. */
const BRANCH =
  "relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:border-l before:border-border last:before:h-[1.05rem] after:absolute after:left-0 after:top-[1.05rem] after:w-4 after:border-t after:border-border";

function Label({ node }: { node: SiteNode }) {
  if (!node.href) {
    return (
      <span className="inline-block rounded-md border border-primary/60 bg-primary/10 px-2 py-0.5 font-mono text-xs uppercase tracking-wide">
        {node.name}
      </span>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2">
      <Link href={node.href} className="text-sm font-medium underline decoration-primary/60 decoration-2 underline-offset-2 hover:decoration-primary">
        {node.name}
      </Link>
      <span className="font-mono text-[11px] text-muted-foreground">{node.href}</span>
      {node.description && <span className="w-full text-xs text-muted-foreground sm:w-auto">{node.description}</span>}
    </span>
  );
}

function Branches({ nodes }: { nodes: SiteNode[] }) {
  return (
    <ul className="ml-2">
      {nodes.map((node) => (
        <li key={node.href ?? node.name} className={`${BRANCH} py-1.5`}>
          <Label node={node} />
          {node.folded && node.folded.pages.length > 0 && (
            <details className="group mt-1">
              <summary className="w-fit cursor-pointer list-none font-mono text-[11px] text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
                <span className="inline-block transition-transform group-open:rotate-90">▸</span> {node.folded.label}
              </summary>
              <ul className="ml-2 mt-1">
                {node.folded.pages.map((page) => (
                  <li key={page.href} className={`${BRANCH} py-0.5 [overflow-wrap:anywhere]`}>
                    <Link href={page.href!} className="text-xs hover:underline hover:decoration-primary">
                      {page.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          )}
          {node.children && <Branches nodes={node.children} />}
        </li>
      ))}
    </ul>
  );
}

export default function SitemapPage() {
  const map = buildMap();

  return (
    <>
      <ScrollProgress color="bg-steelBlue" height={3} glow={true} glowColor="rgba(var(--steelBlue), 0.6)" glowIntensity="12px" />

      <div className="mx-auto w-full max-w-2xl animate-fade-in pb-8 pt-16">
        <header className="mb-8">
          <span className="text-2xl animate-spin">✳︎</span>
          <h1 className="mb-2 text-xl font-medium">Sitemap</h1>
          <div className="flex flex-col font-mono text-xs text-muted-foreground">
            <div>Created: June 10, 2025</div>
            <div>Last updated: November 10, 2026</div>
            <div>Pages on the map: {countPages(map)}</div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Every page in the garden, laid out like a map. Follow a branch to find what you&apos;re looking for. If you have a question, you can{" "}
            <Link href="/ask-me-anything" className="text-foreground underline decoration-primary decoration-2 underline-offset-2">
              ask me anything
            </Link>
            , and you can leave a footprint in my{" "}
            <Link href="/guestbook" className="text-foreground underline decoration-primary decoration-2 underline-offset-2">
              guestbook
            </Link>{" "}
            so I know you were here.
          </p>
        </header>

        <div className="rounded-lg border border-dashed p-4 sm:p-6">
          <div className="inline-flex items-baseline gap-2 rounded-md border-2 border-primary px-3 py-1.5">
            <Link href="/" className="text-sm font-semibold">
              lilyslab.xyz
            </Link>
            <span className="font-mono text-[11px] text-muted-foreground">/</span>
          </div>
          <div className="ml-4">
            <Branches nodes={map.children ?? []} />
          </div>
        </div>
      </div>
    </>
  );
}
