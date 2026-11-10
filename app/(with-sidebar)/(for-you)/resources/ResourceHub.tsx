"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Search, X } from "lucide-react";
import type { HubItem } from "@/lib/resource-hub";
import { LIST_CLASS, NUMBER_CLASS, ROW_CLASS, TrackList, number } from "@/components/learn/TrackList";

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

function EntryRow({ entry, position }: { entry: Entry; position: number }) {
  const where = entry.isLesson ? `Lesson · ${entry.topic}` : entry.href.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
  const Arrow = entry.isLesson ? ArrowRight : ArrowUpRight;
  const body = (
    <>
      <span className={NUMBER_CLASS}>{number(position)}</span>
      <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
        <span className="block text-sm font-medium">{entry.title}</span>
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
  return (
    <li>
      {entry.isLesson ? (
        <Link href={entry.href} className={ROW_CLASS}>
          {body}
        </Link>
      ) : (
        <a href={entry.href} target="_blank" rel="noopener noreferrer" className={ROW_CLASS}>
          {body}
        </a>
      )}
    </li>
  );
}

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">{children}</h2>
);

export function ResourceHub({ items, tracks, courseTitle }: { items: HubItem[]; tracks: HubTrack[]; courseTitle: string }) {
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
            <SectionHeading>{courseTitle}</SectionHeading>
            <TrackList tracks={tracks} />
          </section>

          {linkTopics.map((topic) => (
            <section key={topic}>
              <SectionHeading>{topic}</SectionHeading>
              <ol className={LIST_CLASS}>
                {entries
                  .filter((entry) => !entry.isLesson && entry.topic === topic)
                  .map((entry, index) => (
                    <EntryRow key={entry.id} entry={entry} position={index + 1} />
                  ))}
              </ol>
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
            <ol className={LIST_CLASS}>
              {results.map((entry, index) => (
                <EntryRow key={entry.id} entry={entry} position={index + 1} />
              ))}
            </ol>
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
