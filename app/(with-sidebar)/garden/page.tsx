import Link from "next/link";
import { ArrowRight, Smile } from "lucide-react";
import {
  byLastTended,
  getGardenPosts,
  type GardenPost,
} from "@/lib/garden/posts";
import { TOPICS, type Stage } from "@/lib/garden/topics";
import { GardenPostRow, StageLegend } from "@/components/garden/GardenPostRow";
import { MusicPlayerWidget } from "@/components/audio/music-player-widget";
import { WanderButton } from "@/components/fun/WanderButton";

export const metadata = {
  title: "Digital Garden | Lilyslab",
  description:
    "Essays and notes arranged by topic and connection, not by date.",
};

/** How many posts each topic shows on the map before "more". */
const PREVIEW = 4;

const STAGE_ORDER: Stage[] = ["evergreen", "budding", "seedling"];
/** Most finished first, then most recently tended. */
const gardenOrder = (a: GardenPost, b: GardenPost) =>
  STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage) ||
  byLastTended(a, b);

const ELSEWHERE = [
  {
    title: "All essays",
    href: "/garden/essays",
    description: "Longer, more finished pieces",
  },
  {
    title: "All notes",
    href: "/garden/notes",
    description: "Short, loose thoughts",
  },
  {
    title: "Bookshelf",
    href: "/garden/bookshelf",
    description: "Books I've read, am reading, or plan to",
  },
  {
    title: "Bookmarks",
    href: "/garden/bookmarks",
    description: "Favourite reads, tools and finds",
  },
  {
    title: "Media digest",
    href: "/garden/media-digest",
    description: "What I watched, heard and read each month",
  },
  {
    title: "Microblog",
    href: "/garden/micro-blog",
    description: "Short updates and musings",
  },
];

const count = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function GardenPage() {
  const posts = getGardenPosts();
  const recent = [...posts].sort(byLastTended).slice(0, 5);
  const beds = TOPICS.map((topic) => ({
    topic,
    posts: posts.filter((post) => post.topicId === topic.id).sort(gardenOrder),
  })).filter((bed) => bed.posts.length > 0);

  return (
    <div className="mx-auto max-w-3xl animate-fade-in pb-8 pt-16 sm:px-4">
      <header className="mb-10">
        <span className="text-2xl animate-spin">✳︎</span>
        <h1 className="mb-2 text-xl font-medium">The Garden</h1>
        <p className="max-w-prose text-sm text-muted-foreground">
          A growing collection of thoughts and ideas, arranged by topic rather than by date. Some are finished, most are still
          growing. Pick a topic and wander; every post links to its neighbours.{" "}
          <Link href="/garden/essays/digital-garden" className="text-steelBlue underline underline-offset-4 hover:text-peach">
            What is a digital garden?
          </Link>
        </p>
        <div className="mt-4">
          <StageLegend />
        </div>
      </header>

      <section aria-labelledby="recent" className="mb-12">
        <h2
          id="recent"
          className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground"
        >
          Recently tended
        </h2>
        <ul className="divide-y divide-border/60">
          {recent.map((post) => (
            <GardenPostRow key={post.href} post={post} truncate />
          ))}
        </ul>
      </section>

      <section aria-labelledby="topics" className="mb-12">
        <h2
          id="topics"
          className="mb-4 font-mono text-xs uppercase tracking-wide text-muted-foreground"
        >
          Topics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {beds.map(({ topic, posts: bed }) => {
            const essays = bed.filter((post) => post.kind === "essay").length;
            return (
              <article
                key={topic.id}
                className="flex flex-col rounded-lg border border-dashed border-border p-4"
              >
                <h3 className="text-base font-medium">
                  <Link
                    href={`/garden/topics/${topic.id}`}
                    className="hover:text-primary hover:underline hover:underline-offset-4"
                  >
                    {topic.title}
                  </Link>
                </h3>
                <p className="mt-1 truncate text-xs text-muted-foreground" title={topic.blurb}>
                  {topic.blurb}
                </p>
                <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                  {count(essays, "essay")} ·{" "}
                  {count(bed.length - essays, "note")}
                </p>
                <ul className="mt-2 flex-1">
                  {bed.slice(0, PREVIEW).map((post) => (
                    <GardenPostRow
                      key={post.href}
                      post={post}
                      showDate={false}
                      truncate
                    />
                  ))}
                </ul>
                <Link
                  href={`/garden/topics/${topic.id}`}
                  className="mt-3 inline-flex items-center gap-1 self-start font-mono text-xs text-muted-foreground hover:text-foreground"
                >
                  {bed.length > PREVIEW
                    ? `${bed.length - PREVIEW} more in ${topic.title}`
                    : `Visit ${topic.title}`}
                  <ArrowRight size={12} aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="elsewhere">
        <h2
          id="elsewhere"
          className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground"
        >
          Elsewhere in the garden
        </h2>
        <ul className="grid gap-x-6 sm:grid-cols-2">
          {ELSEWHERE.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex items-baseline justify-between gap-3 border-b border-border/60 py-2 text-sm"
              >
                <span className="group-hover:text-primary group-hover:underline group-hover:underline-offset-4">
                  {item.title}
                </span>
                <span className="truncate text-right text-xs text-muted-foreground">
                  {item.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
