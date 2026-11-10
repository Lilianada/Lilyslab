"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Search, X } from "lucide-react";
import type { HubItem } from "@/lib/resource-hub";

export interface HubTrack {
  slug: string;
  title: string;
  description?: string;
  href: string;
  lessons: { title: string; description?: string; href: string }[];
}

/** One searchable row: a lesson on this site, or a link elsewhere. */
interface Entry {
  id: string;
  title: string;
  description: string;
  topic: string;
  href: string;
  tags: string[];
  isLesson: boolean;
}

function matchesSearch(entry: Entry, query: string) {
  const words = query.toLowerCase().replace(/#/g, " ").split(/\s+/).filter(Boolean);
  const address = entry.href.replace(/^https?:\/\/(www\.)?/, "");
  const searchable = `${entry.title} ${entry.description} ${entry.topic} ${entry.tags.join(" ")} ${address}`.toLowerCase();
  return words.every((word) => searchable.includes(word));
}

function EntryRow({ entry }: { entry: Entry }) {
  const where = entry.isLesson ? `Lesson · ${entry.topic}` : entry.href.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
  const Arrow = entry.isLesson ? ArrowRight : ArrowUpRight;
  const body = (
    <>
      <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
        <span className="block text-sm">{entry.title}</span>
        {entry.description && <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">{entry.description}</span>}
        <span className="mt-1 block font-mono text-xs text-muted-foreground">{where}</span>
      </span>
      <Arrow
        size={14}
        className="mt-1 shrink-0 text-muted-foreground transition-transform motion-safe:group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </>
  );
  const className = "group flex items-start gap-3 border-b border-dashed border-border py-3 transition-colors hover:bg-muted/50";

  return (
    <li>
      {entry.isLesson ? (
        <Link href={entry.href} className={className}>
          {body}
        </Link>
      ) : (
        <a href={entry.href} target="_blank" rel="noopener noreferrer" className={className}>
          {body}
        </a>
      )}
    </li>
  );
}

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">{children}</h2>
);

const lessonCount = (count: number) => (count === 0 ? "coming soon" : `${count} ${count === 1 ? "lesson" : "lessons"}`);

export function ResourceHub({ items, tracks, courseTitle, courseHref }: { items: HubItem[]; tracks: HubTrack[]; courseTitle: string; courseHref: string }) {
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const entries: Entry[] = [
    ...tracks.flatMap((track) =>
      track.lessons.map((lesson) => ({
        id: lesson.href,
        title: lesson.title,
        description: lesson.description ?? "",
        topic: track.title,
        href: lesson.href,
        tags: [],
        isLesson: true,
      }))
    ),
    ...items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      topic: item.category || "Everything else",
      href: item.url,
      tags: item.tags,
      isLesson: false,
    })),
  ];

  // Tracks first, in course order, then the topics my links are filed under.
  const linkTopics = Array.from(new Set(items.map((item) => item.category || "Everything else"))).sort();
  const topics = [...tracks.map((track) => track.title), ...linkTopics.filter((topic) => !tracks.some((track) => track.title === topic))];

  const isBrowsing = !query.trim() && !activeTopic;
  const results = entries.filter((entry) => (!activeTopic || entry.topic === activeTopic) && matchesSearch(entry, query));
  const activeTrack = tracks.find((track) => track.title === activeTopic);

  const pillClass = (isActive: boolean) =>
    `rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
      isActive ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground hover:bg-accent"
    }`;

  return (
    <>
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setQuery("");
          }}
          placeholder="Search lessons and links"
          aria-label="Search lessons and links"
          enterKeyHint="search"
          className="h-11 w-full rounded-lg border border-border bg-card pl-9 pr-10 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary sm:text-sm [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => setActiveTopic(null)} className={pillClass(activeTopic === null)}>
          All
        </button>
        {topics.map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => setActiveTopic(activeTopic === topic ? null : topic)}
            aria-pressed={activeTopic === topic}
            className={pillClass(activeTopic === topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      {isBrowsing ? (
        <div className="mt-10 space-y-10">
          <section>
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <SectionHeading>{courseTitle}</SectionHeading>
              <Link href={courseHref} className="shrink-0 font-mono text-xs text-muted-foreground hover:text-foreground">
                About the course →
              </Link>
            </div>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map((track) => (
                <li key={track.slug}>
                  <Link href={track.href} className="flex h-full flex-col rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted">
                    <span className="block text-sm font-medium">{track.title}</span>
                    {track.description && <span className="mt-0.5 block text-xs text-muted-foreground">{track.description}</span>}
                    <span className="mt-auto block pt-2 font-mono text-[11px] text-muted-foreground">{lessonCount(track.lessons.length)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {linkTopics.map((topic) => (
            <section key={topic}>
              <SectionHeading>{topic}</SectionHeading>
              <ul>
                {entries
                  .filter((entry) => !entry.isLesson && entry.topic === topic)
                  .map((entry) => (
                    <EntryRow key={entry.id} entry={entry} />
                  ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <section className="mt-8">
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="font-mono text-xs text-muted-foreground" aria-live="polite">
              {results.length} {results.length === 1 ? "result" : "results"}
            </p>
            {activeTrack && (
              <Link href={activeTrack.href} className="font-mono text-xs text-muted-foreground hover:text-foreground">
                Open the {activeTrack.title} track →
              </Link>
            )}
          </div>
          {results.length > 0 ? (
            <ul>
              {results.map((entry) => (
                <EntryRow key={entry.id} entry={entry} />
              ))}
            </ul>
          ) : (
            <p className="py-6 text-sm text-muted-foreground">
              {activeTrack && !query.trim() ? "The lessons for this track are on their way." : "Nothing here yet. Try a different word."}
            </p>
          )}
        </section>
      )}
    </>
  );
}
